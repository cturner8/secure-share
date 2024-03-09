import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import * as jose from "jose";

const AES_KEY_LENGTH = 256;
const AES_ALGORITHM = "A256GCMKW";
const AES_ENCODING = "A256GCM";

const generateMnemonicPhrase = () =>
  bip39.generateMnemonic(wordlist, AES_KEY_LENGTH);

const generateSeed = async (mn: string, passphrase?: string) =>
  bip39.mnemonicToSeed(mn, passphrase);

const generateCryptoKey = async (keyMaterial: Uint8Array): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    "raw",
    keyMaterial.slice(0, 32),
    { name: "AES-GCM", length: AES_KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  );

const encrypt = async (key: CryptoKey, plaintext: string) =>
  new jose.GeneralEncrypt(new TextEncoder().encode(plaintext))
    .setProtectedHeader({ enc: AES_ENCODING })
    .addRecipient(key)
    .setUnprotectedHeader({ alg: AES_ALGORITHM })
    .encrypt();

const decrypt = async (key: CryptoKey, jwe: jose.GeneralJWE) => {
  const decrypted = await jose.generalDecrypt(jwe, key);
  const decoder = new TextDecoder();
  return decoder.decode(decrypted.plaintext);
};

export default {
  generateMnemonicPhrase,
  generateSeed,
  generateCryptoKey,
  encrypt,
  decrypt,
};
