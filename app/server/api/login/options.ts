import { userProfile } from "@/database/tables";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type {
  AuthenticatorTransportFuture,
  PublicKeyCredentialDescriptorFuture,
} from "@simplewebauthn/types";
import { eq } from "drizzle-orm";

type Query = {
  email: string;
};

export default defineEventHandler(async (event) => {
  try {
    const { rpID } = useRuntimeConfig(event);
    const { email } = getQuery<Query>(event);

    const emailHash = generateHash(email);
    const user = await db.query.userProfile.findFirst({
      with: { authenticators: true },
      where: eq(userProfile.emailHash, emailHash),
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: user.authenticators.map(
        (authenticator): PublicKeyCredentialDescriptorFuture => ({
          id: Buffer.from(authenticator.credentialId, "base64"),
          type: "public-key",
          transports: authenticator.transports?.split(
            ",",
          ) as AuthenticatorTransportFuture[],
        }),
      ),
      userVerification: "preferred",
    });

    await db
      .update(userProfile)
      .set({ currentAuthChallenge: options.challenge })
      .where(eq(userProfile.id, user.id));

    return Promise.resolve(options);
  } catch (e) {
    return Promise.reject(e);
  }
});
