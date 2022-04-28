import redisClient from "../services/redis";
import { objectToKeyVal, parseObjectStrings } from "../utils";

// TODO: mock redis
describe("Redis", () => {
  const roomId = "1234abc";

  beforeEach(async () => await redisClient.del(roomId));
  afterAll(async () => await redisClient.disconnect());

  it("store data in redis and parse it back to its original value", async () => {
    const roomData = {
      src: "",
      playing: false,
      lastSeeking: 0,
      seeker: undefined,
    };

    const parsedRoomData = objectToKeyVal(roomData);
    // Only returns the length the first time? :<
    const hsetData = await redisClient.hSet(roomId, parsedRoomData);
    expect(hsetData).toEqual(Object.keys(roomData).length);

    const hgetAllData = await redisClient.hGetAll(roomId);
    expect(parseObjectStrings(hgetAllData)).toEqual(roomData);

    let hgetData = (await redisClient.hGet(roomId, "lastSeeking")) as string;
    expect(JSON.parse(hgetData)).toBe(roomData.lastSeeking);

    hgetData = (await redisClient.hGet(roomId, "src")) as string;
    expect(JSON.parse(hgetData)).toBe(roomData.src);
  });

  it("partial update a key", async () => {
    const roomData = {
      src: "http://1234.com/room",
      playing: false,
      lastSeeking: 0,
      seeker: undefined,
    };

    await redisClient.hSet(roomId, objectToKeyVal(roomData));

    let hgetAllData = await redisClient.hGetAll(roomId);
    expect(parseObjectStrings(hgetAllData)).toEqual(roomData);

    const newData = { seeker: "1234a" };
    await redisClient.hSet(roomId, objectToKeyVal(newData));

    hgetAllData = await redisClient.hGetAll(roomId);
    expect(parseObjectStrings(hgetAllData)).toEqual({
      ...roomData,
      ...newData,
    });
  });

  it("get empty value", async () => {
    const hgetData = await redisClient.hGet(roomId, "emptyvalue");
    expect(hgetData).toBe(null);
  });
});
