import { FastifyPluginAsync } from "fastify";
import { Server, Socket } from "socket.io";

import redisClient from "../services/redis";
import { objectToKeyVal, pickRoomData } from "../utils";
import { RedisRoomData, RoomData } from "../types/io";

const socketP: FastifyPluginAsync = async (fastify): Promise<void> => {
  const io = new Server(fastify.server, {
    cors: {
      origin: process.env.FRONT_URL,
    },
  });

  type IoFunctions<T> = (socket: Socket, roomId: string) => Promise<T>;

  const synchronizeRoom: IoFunctions<RedisRoomData> = (socket, roomId) => {
    return redisClient.hGetAll(roomId).then((data) => {
      socket.to(roomId).emit("synchronize", data);
      return data;
    });
  };

  const getFirstSocketId = (roomId: string) => {
    return io
      .in(roomId)
      .fetchSockets()
      .then((d) => {
        console.log(
          "Connected sockets",
          d.map((e) => e.id)
        );

        if (d.length > 0) {
          return d[0].id;
        }
        return null;
      });
  };

  const getRedisSeeker = async (roomId: string) => {
    return JSON.parse((await redisClient.hGet(roomId, "seeker")) || '""');
  };

  // When someone connects
  io.on("connection", (socket) => {
    // When someone attempts to join the room, executed per user
    console.log("User", socket.id, "connected to io");

    // Chat events
    socket.on("store-name", (name) => {
      socket.data.name = name;
    });

    socket.on("join-room", (roomId: string, test) => {
      console.log("User", socket.id, "joined room", roomId, test);
      socket.join(roomId); // Join the room
      redisClient.hGetAll(roomId).then((data) => {
        socket.emit("synchronize", data);
      });

      (async () => {
        const seeker = await getRedisSeeker(roomId);
        if (!seeker) {
          // Set this user as seeker
          await redisClient.hSet(roomId, "seeker", JSON.stringify(socket.id));
          synchronizeRoom(socket, roomId);
        } else {
          // Verify current seeker still exists
          const connectedSockets = await io.in(roomId).fetchSockets();
          const currentSeekerSocket = connectedSockets.find(
            (s) => s.id === seeker
          );

          if (!currentSeekerSocket) {
            console.error("Seeker doesn't exists when it should");
            await redisClient.hSet(roomId, "seeker", JSON.stringify(socket.id));
            synchronizeRoom(socket, roomId);
          }
        }
      })();

      socket.on("disconnecting", async () => {
        console.log(
          "User",
          socket.id,
          "disconnected room",
          roomId,
          socket.rooms
        );
        const oldSeeker = await getRedisSeeker(roomId);

        if (oldSeeker !== socket.id) {
          return;
        }

        const newSeekerId = await getFirstSocketId(roomId);
        if (newSeekerId) {
          await redisClient.hSet(roomId, "seeker", JSON.stringify(newSeekerId));
          synchronizeRoom(socket, roomId);
        } else {
          await redisClient.hDel(roomId, "seeker");
        }
      });

      socket.on("update-data", async (data) => {
        console.log("update-data", data);
        await redisClient.hSet(roomId, objectToKeyVal(pickRoomData(data)));
        const newData = await redisClient.hGetAll(roomId);
        socket.to(roomId).emit("synchronize", newData);
      });

      socket.on("timeupdate", async (time: number) => {
        // TODO: Maybe validate seeker?
        // console.log("timeupdate", time);
        await redisClient.hSet(roomId, "lastSeeking", JSON.stringify(time));
      });

      socket.on("changesrc", async (src) => {
        const roomData: RoomData = {
          src,
          playing: false,
          lastSeeking: 0,
        };

        await redisClient.hSet(roomId, objectToKeyVal(roomData));
        synchronizeRoom(socket, roomId);
      });

      socket.on("synchronize", () => {
        console.log("synchronize");
        redisClient.hGetAll(roomId).then((data) => {
          socket.emit("synchronize", data);
        });
      });

      socket.on("send-message", (message) => {
        socket.to(roomId).emit("new-message", {
          ...message,
          name: socket.data.name,
          id: socket.id,
        });
      });
    }); // end of join room
  }); // end of connection

  io.on("error", (err) => {
    console.error("Io error", err);
  });
};

export default socketP;
