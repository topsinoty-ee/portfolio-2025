export const mapDocument = <T extends { _id: unknown }>(doc: T) => {
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
  };
};
