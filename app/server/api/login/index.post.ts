import { userAuthenticator, userProfile } from "@/database/tables";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type {
  AuthenticationResponseJSON,
  AuthenticatorDevice,
  AuthenticatorTransportFuture,
} from "@simplewebauthn/types";
import { eq } from "drizzle-orm";

type Query = {
  email: string;
};

export default defineEventHandler(async (event) => {
  try {
    const { origin, rpID } = useRuntimeConfig(event);
    const body = await readBody<AuthenticationResponseJSON>(event);
    const { email } = getQuery<Query>(event);

    const emailHash = generateHash(email);
    const user = await db.query.userProfile.findFirst({
      with: {
        authenticators: {
          columns: {
            counter: true,
            credentialId: true,
            credentialPublicKey: true,
            transports: true,
          },
          limit: 1,
        },
      },
      where: eq(userProfile.emailHash, emailHash),
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }
    if (!user.currentAuthChallenge) {
      throw createError({
        statusCode: 404,
        statusMessage: "No user challenge found",
      });
    }

    const [userAuthenticatorMatch] = user.authenticators;
    if (!userAuthenticatorMatch) {
      throw createError({
        statusCode: 404,
        statusMessage: `Could not find authenticator ${body.id} for user ${user.id}`,
      });
    }

    const authenticator: AuthenticatorDevice = {
      ...userAuthenticatorMatch,
      credentialID: Buffer.from(userAuthenticatorMatch.credentialId, "base64"),
      transports: userAuthenticatorMatch.transports?.split(
        ",",
      ) as AuthenticatorTransportFuture[],
    };

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: user.currentAuthChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator,
    });

    const { verified, authenticationInfo } = verification;

    if (!verified || !authenticationInfo) {
      throw createError({
        statusCode: 400,
        statusMessage: "Could not verify login",
      });
    }

    await db
      .update(userAuthenticator)
      .set({ counter: authenticationInfo.newCounter })
      .where(eq(userAuthenticator.userId, user.id));

    return Promise.resolve(verified);
  } catch (e) {
    return Promise.reject(e);
  }
});
