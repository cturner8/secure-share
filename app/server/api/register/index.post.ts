import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/types";

export default defineEventHandler(async (event) => {
  try {
    const { origin, rpID } = useRuntimeConfig(event);
    const body = await readBody<RegistrationResponseJSON>(event);

    // // (Pseudocode) Retrieve the logged-in user
    // const user: UserModel = getUserFromDB(loggedInUserId);
    // // (Pseudocode) Get `options.challenge` that was saved above
    // const expectedChallenge: string = getUserCurrentChallenge(user);

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    const { verified } = verification;

    return Promise.resolve(verified);
  } catch (e) {
    return Promise.reject(e);
  }
});
