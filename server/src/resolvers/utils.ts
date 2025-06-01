import { Types } from "mongoose";

export const mapDocument = <T extends { _id: Types.ObjectId }>(doc: T) => {
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
  };
};
