import { customType } from "drizzle-orm/pg-core";

export const bytea = customType<{
  data: Uint8Array;
  notNull: false;
  default: false;
}>({
  dataType: () => "bytea",
  toDriver: (value) => Buffer.from(value),
  fromDriver: (value: unknown): Uint8Array => Uint8Array.from(value),
});
