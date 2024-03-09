import { generateRegistrationOptions } from "@simplewebauthn/server";

type Query = {
  username: string;
};

export default defineEventHandler(async (event) => {
  try {
    const { rpName, rpID } = useRuntimeConfig(event);
    const { username } = getQuery<Query>(event);

    //   // (Pseudocode) Retrieve the user from the database
    // // after they've logged in
    // const user: UserModel = getUserFromDB(loggedInUserId);
    // // (Pseudocode) Retrieve any of the user's previously-
    // // registered authenticators
    // const userAuthenticators: Authenticator[] = getUserAuthenticators(user);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      // userID: user.id,
      // userName: user.username,
      userID: crypto.randomUUID(),
      userName: username,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "preferred",
      },
    });

    // (Pseudocode) Remember the challenge for this user
    //   setUserCurrentChallenge(user, options.challenge);

    return Promise.resolve(options);
  } catch (e) {
    return Promise.reject(e);
  }
});
