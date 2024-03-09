import { createHash, type BinaryLike } from "node:crypto";

export const generateHash = (data: BinaryLike) => {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest("base64");
};
