import 'reflect-metadata';
import { buildSchema, useContainer as graphqlUseContainer } from 'type-graphql';
import * as express from 'express';
import { GraphQLSchema } from 'graphql';
import { ApolloServer } from "apollo-server-express";
import {
  Connection,
  createConnection,
  useContainer as typeOrmUseContainer
} from 'typeorm';
import { Container } from 'typedi';

import { authChecker } from './modules/auth/authChecker';
import { Context } from './models/context.model';
import { variables } from './environments/environment';
import { AuthService, getUserFromHeader } from './modules/auth/auth.service';

export class App {
  private connection: Connection;
  private schema: GraphQLSchema;
  private apollo: ApolloServer;
  private server: express.Application;

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
    this.server = express();
    this.apollo = new ApolloServer({
      schema: this.schema,
      context: ({ req }: any) => {
        return <Context>{
          request: req,
          user: req.headers.authorization ? getUserFromHeader(req.headers.authorization) : null
        };
      }
    });
    this.apollo.applyMiddleware({ app: this.server, path: '/' });
  }

  public async start() {
    try {
      await this.initDependencyInjection();
      await this.createDatabaseConnection();
      await this.createSchema();
      await this.createServer();

      await this.server.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at http://localhost:4000`);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
