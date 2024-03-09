import {
  userAuthenticator,
  userProfile,
  userRegistration,
} from "@/database/tables";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import type { RegistrationResponseJSON } from "@simplewebauthn/types";
import { eq } from "drizzle-orm";

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
    if (!verified || !registrationInfo) {
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

    const emailHash = generateHash(userEmail);

    await db.insert(userProfile).values({
      id: userId,
      emailHash,
      email: {},
    });
    await db.insert(userAuthenticator).values({
      userId,
      credentialId: isoBase64URL.fromBuffer(credentialID),
      credentialPublicKey: isoBase64URL.fromBuffer(credentialPublicKey),
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
