import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { build } from "./app";
import { createContext } from "./routes/context";
import { env } from "./config/env";
import { config } from "./config/config";
import { appRouter } from "./routes";
import fastifyKafkaJS from "fastify-kafkajs";
import { v4 as uuidv4 } from "uuid";

const app = build({
  logger: config[env.NODE_ENV].logger,
  pluginTimeout: 0
});

app.register(fastifyKafkaJS, {
  clientConfig: {
    brokers: ['localhost:9094'],
    clientId: 'demo-app'
  },
  consumers: [
    {
      consumerConfig: {
        groupId: 'example-consumer-group'
      },
      subscription: {
        topics: ['test-topic'],
        fromBeginning: false
      },
      runConfig: {
        eachMessage: async ({ message }) => {
          console.log(`Consumed message: ${message.value}`);
        }
      }
    }
  ]
});

app.post('/produce', async (request, reply) => {
  return app.kafka.producer.send({
    topic: 'test-topic',
    messages: [{ key: 'key1', value: uuidv4() }]
  });
});

app.register(fastifyTRPCPlugin, {
  prefix: "/api",
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

app.register(cors, {
  origin: "*",
  credentials: true,
});

app.register(helmet);

if (env.HOST) {
  app.listen(
    {
      port: env.PORT,
      host: env.HOST,
    },
    (err, _address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
    }
  );
} else {
  app.listen(
    {
      port: env.PORT,
    },
    (err, _address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
    }
  );
}
