import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { GraphQLServer, Options } from 'graphql-yoga';

import authMiddleware from './middlewares/auth.middleware';
import { authChecker } from './modules/auth/authChecker';
import { Context } from './models/context.model';

export class App {
  private readonly port: any = process.env.port || 4000;
  private readonly serverConfig: Options = {
    port: this.port,
    endpoint: '/',
    playground: '/playground'
  };

  private connection: Connection;
  private schema: GraphQLSchema;
  private server: GraphQLServer;
  private express: GraphQLServer['express'];

  private async createConnection() {
    this.connection = await createConnection();
  }

  private async createSchema() {
    this.schema = await buildSchema({
      resolvers: [
        __dirname + '/resolvers/**/*.ts',
        __dirname + '/modules/**/*.resolver.ts'
      ],
      authChecker
    });
  }

  private createServer() {
    this.server = new GraphQLServer({
      schema: this.schema,
      context: ({ request }) => {
        return <Context>{
          request,
          user: request.user
        };
      }
    });
    this.express = this.server.express;
  }

  private addMiddlewares() {
    this.express.use(this.serverConfig.endpoint || '/', authMiddleware);
  }

  public async start() {
    try {
      await this.createConnection();
      await this.createSchema();
      await this.createServer();
      await this.addMiddlewares();

      await this.server.start(
        this.serverConfig,
        ({ port, playground, endpoint }) => {
          console.log('Server started successfully !');
          console.log(`Endpoint at http://localhost:${port}${endpoint}`);
          console.log(`Playground at http://localhost:${port}${playground}`);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
