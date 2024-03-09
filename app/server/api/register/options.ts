import { userRegistration } from "@/database/tables";
import { generateRegistrationOptions } from "@simplewebauthn/server";

type Query = {
  email: string;
};

export default defineEventHandler(async (event) => {
  try {
    const { rpName, rpID } = useRuntimeConfig(event);
    const { email } = getQuery<Query>(event);

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
