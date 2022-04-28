import { objectToKeyVal, parseObjectStrings } from "../";

// TODO: mock redis
describe("Redis", () => {
  it("store data in redis and parse it back to its original value", async () => {
    const redisRoomData = {
      src: '""',
      playing: "false",
      lastSeeking: "0",
      seeker: '"bVHF4JwVKHNnHu5NAAAB"',
    };

    const roomData = {
      src: "",
      playing: false,
      lastSeeking: 0,
      seeker: "bVHF4JwVKHNnHu5NAAAB",
    };

    const parsedRoomData = parseObjectStrings(redisRoomData);
    // Only returns the length the first time? :<
    expect(parsedRoomData).toEqual(roomData);
  });
});
