import 'reflect-metadata';
import { buildSchema, useContainer as graphqlUseContainer } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { GraphQLServer } from 'graphql-yoga';
import {
  Connection,
  createConnection,
  useContainer as typeOrmUseContainer
} from 'typeorm';
import { Container } from 'typedi';

import * as jwtMiddleware from 'express-jwt';

import { authChecker } from './modules/auth/authChecker';
import { Context } from './models/context.model';
import { variables } from './environments/environment';
import { AuthService } from './modules/auth/auth.service';

export class App {
  private connection: Connection;
  private schema: GraphQLSchema;
  private server: GraphQLServer;
  private express: GraphQLServer['express'];

  private async initDependencyInjection() {
    graphqlUseContainer(Container);
    typeOrmUseContainer(Container);
  }

  private async createDatabaseConnection() {
    this.connection = await createConnection(variables.typeorm);
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
    const authService = Container.get(AuthService);
    this.express.use(
      variables.server.endpoint || '/',
      jwtMiddleware({
        secret: variables.app.secret,
        credentialsRequired: false
      })
    );
  }

  public async start() {
    try {
      await this.initDependencyInjection();
      await this.createDatabaseConnection();
      await this.createSchema();
      await this.createServer();
      await this.addMiddlewares();

      await this.server.start(
        variables.server,
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
