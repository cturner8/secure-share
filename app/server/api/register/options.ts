import { userRegistration } from "@/database/tables";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { count, eq } from "drizzle-orm";

type Query = {
  email: string;
};

export default defineEventHandler(async (event) => {
  try {
    const { rpName, rpID } = useRuntimeConfig(event);
    const { email } = getQuery<Query>(event);

    const [result] = await db
      .select({ count: count() })
      .from(userRegistration)
      .where(eq(userRegistration.email, email));

    // TODO: check if email exists in user profiles table as well
    if (result.count) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email is already in use",
      });
    }

    const userID = crypto.randomUUID();
    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID,
      userName: email,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "preferred",
      },
    });

    await db
      .insert(userRegistration)
      .values({ id: userID, email, challenge: options.challenge });

    return Promise.resolve(options);
  } catch (e) {
    return Promise.reject(e);
  }
});
