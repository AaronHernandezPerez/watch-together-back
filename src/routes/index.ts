import { FastifyPluginAsync } from "fastify";
import { v4 as uuid4 } from "uuid";
import { CreateRoomBody, NewRoomQuerystring } from "../types/api";
import { AbortError } from "redis";
import redisClient from "../services/redis";
import { frontUrl, objectToKeyVal, parseObjectStrings } from "../utils";

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", function (request, reply) {
    reply.send({ id: `/${uuid4()}` });
  });

  const createRoomOptions = {
    schema: {
      body: {
        type: "object",
        properties: {
          src: { type: "string" },
        },
      },
    },
  };

  fastify.post<{ Body: CreateRoomBody }>(
    "/create-room/",
    createRoomOptions,
    async function (request, reply) {
      const { id: bodyId, src } = request.body;
      const roomId = bodyId || uuid4();

      const roomData = {
        src: src,
        playing: false,
        lastSeeking: 0,
      };

      return redisClient
        .hSet(roomId, objectToKeyVal(roomData))
        .then(() => {
          reply.send({ id: roomId });
        })
        .catch((err: AbortError) => {
          fastify.log.error(err);
          return reply.code(500).send({ error: err.toString() });
        });
    }
  );

  fastify.get<{ Querystring: NewRoomQuerystring }>(
    "/new-room",
    async function (request, reply) {
      const data = await fastify.inject({
        method: "POST",
        url: "/create-room/",
        payload: {
          ...request.query,
        },
      });

      if (data.statusCode !== 200) {
        fastify.log.error(data.statusCode);
        return reply.send(data.json()).status(500);
      }

      const { id } = data.json();

      return reply.redirect(`${frontUrl}/room/${id}`);
    }
  );

  if (process.env.NODE_ENV === "development") {
    fastify.get<{ Params: { id: string } }>(
      "/clear-room/:id",
      async function (request, reply) {
        const { id } = request.params;

        const roomData = {
          src: "",
          playing: false,
          lastSeeking: 0,
          seeker: undefined,
        };

        return redisClient
          .hSet(id, objectToKeyVal(roomData))
          .then(() => {
            return reply.send({ id: id });
          })
          .catch((err: AbortError) => {
            fastify.log.error(err);
            return reply.code(500).send({ error: err.toString() });
          });
      }
    );

    fastify.get<{ Params: { id: string } }>(
      "/get-room/:id",
      async function (request, reply) {
        const { id } = request.params;

        return redisClient
          .hGetAll(id)
          .then((data) => {
            console.log("data", data);
            const parsedData = parseObjectStrings(data);

            return reply.send(parsedData);
          })
          .catch((err: AbortError) => {
            fastify.log.error(err);
            return reply.code(500).send({ error: err.toString() });
          });
      }
    );
  }
};

export default routes;
