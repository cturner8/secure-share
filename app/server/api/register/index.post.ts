import {
  userAuthenticator,
  userProfile,
  userRegistration,
} from "@/database/tables";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/types";
import { eq } from "drizzle-orm";
import { createHash } from "node:crypto";

type Query = {
  email: string;
};

export default defineEventHandler(async (event) => {
  try {
    const { origin, rpID } = useRuntimeConfig(event);
    const body = await readBody<RegistrationResponseJSON>(event);
    const { email } = getQuery<Query>(event);

    const userRegistrationRecord = await db.query.userRegistration.findFirst({
      where: eq(userRegistration.email, email),
      columns: {
        id: true,
        challenge: true,
        email: true,
      },
    });

    if (!userRegistrationRecord) {
      throw createError({
        statusCode: 400,
        statusMessage: "User not found",
      });
    }

    const { id: userId, email: userEmail, challenge } = userRegistrationRecord;
    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
    if (!registrationInfo) {
      throw createError({
        statusCode: 400,
        statusMessage: "Could not verify registration",
      });
    }

    const {
      credentialPublicKey,
      credentialID,
      counter,
      credentialDeviceType,
      credentialBackedUp,
    } = registrationInfo;
    const { transports = [] } = body.response;

    const emailHash = createHash("sha256");
    emailHash.update(userEmail);

    const base64CredentialId = Buffer.from(credentialID).toString("base64");

    await db.insert(userProfile).values({
      id: userId,
      emailHash: emailHash.digest("base64"),
      email: {},
    });
    await db.insert(userAuthenticator).values({
      userId,
      credentialId: base64CredentialId,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
      transports: transports.join(),
    });

    await db.delete(userRegistration).where(eq(userRegistration.id, userId));

    return Promise.resolve(verified);
  } catch (e) {
    return Promise.reject(e);
  }
});
