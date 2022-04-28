import { GenericObject } from "../types";
import { RoomData } from "../types/io";

export function objectToKeyVal<T extends GenericObject>(obj: T) {
  type Keys = keyof T;
  type Values = typeof obj[Keys];
  const finalArray: Array<Keys | Values> = [];
  return finalArray.concat
    .apply([], Object.entries(obj))
    .map((value, i) => (i % 2 !== 0 ? JSON.stringify(value) : `${value}`));
}

export function parseObjectStrings<
  T extends GenericObject,
  Cast extends GenericObject
>(obj: T): Cast {
  // @ts-expect-error not supported by typescript https://github.com/microsoft/TypeScript/issues/35745
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (value === "") {
        value = undefined;
      }
      return [key, value ? JSON.parse(value) : undefined];
    })
  );
}
export function pickRoomData(data: RoomData) {
  const pickedData: RoomData = {};
  const keys: Array<keyof RoomData> = [
    "src",
    "playing",
    "lastSeeking",
    "seeker",
    "time",
  ];
  keys.forEach((k) => {
    if (data[k] !== undefined) {
      // @ts-expect-error not feeling like debugging this now, they have the same type so the same key should be valid
      // as far as typescript is concerned
      pickedData[k] = data[k];
    }
  });
  return pickedData;
}

export const backUrl = `${process.env.PROTOCOL}${process.env.HOST}`;

export const frontUrl = `${process.env.FRONT_URL}`;
