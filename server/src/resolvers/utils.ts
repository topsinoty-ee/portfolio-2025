import { Types } from "mongoose";

type ObjectId = Types.ObjectId;

const isObjectId = (value: unknown): value is ObjectId =>
  value instanceof Types.ObjectId;

type TransformObjectId<T> = T extends ObjectId
  ? string
  : T extends Array<infer U>
    ? Array<TransformObjectId<U>>
    : T extends object
      ? T extends {
          _id: ObjectId;
        }
        ? Omit<{ [K in keyof T]: TransformObjectId<T[K]> }, "_id"> & {
            id: string;
          }
        : { [K in keyof T]: TransformObjectId<T[K]> }
      : T;

export const mapDocument = <T>(doc: T): TransformObjectId<T> => {
  if (doc === null || typeof doc !== "object") {
    return doc as TransformObjectId<T>;
  }

  if (isObjectId(doc)) {
    return doc.toString() as TransformObjectId<T>;
  }

  if (Array.isArray(doc)) {
    return doc.map(mapDocument) as TransformObjectId<T>;
  }

  const result: Record<string, unknown> = {};

  for (const key in doc) {
    if (Object.prototype.hasOwnProperty.call(doc, key)) {
      const value = doc[key];

      if (key === "_id" && isObjectId(value)) {
        result.id = value.toString();
      } else {
        result[key] = mapDocument(value);
      }
    }
  }

  return result as TransformObjectId<T>;
};
