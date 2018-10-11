import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { GraphQLServer, Options } from 'graphql-yoga';

import { UserResolver } from './modules/users/UserResolver';

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

  constructor() {}

  private async createConnection() {
    this.connection = await createConnection();
  }

  private async createSchema() {
    this.schema = await buildSchema({
      resolvers: [UserResolver]
    });
    console.log(this.schema);
  }

  private createServer() {
    this.server = new GraphQLServer({ schema: this.schema });
  }

  public async start() {
    try {
      await this.createConnection();
      await this.createSchema();
      await this.createServer();
    } catch (error) {
      console.error(error);
    }
    this.server.start(this.serverConfig, ({ port, playground, endpoint }) => {
      console.log('Server started successfully !');
      console.log(`Endpoint at http://localhost:${port}${endpoint}`);
      console.log(`Playground at http://localhost:${port}${playground}`);
    });
  }
}
