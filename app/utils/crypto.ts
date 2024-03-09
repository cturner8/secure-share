import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import * as jose from "jose";

const generateMnemonicPhrase = () => bip39.generateMnemonic(wordlist, 256);

const generateSeed = async (mn: string, passphrase?: string) =>
  bip39.mnemonicToSeed(mn, passphrase);

const getKeyMaterial = async (seed: Uint8Array) =>
  crypto.subtle.importKey("raw", seed, "PBKDF2", false, ["deriveKey"]);

const generateJwk = async (seed: Uint8Array, salt: string = "") => {
  const keyMaterial = await getKeyMaterial(seed);
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000, // TODO: high enough?
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  return jose.importJWK<CryptoKey>({ ...cryptoKey }, "A256GCMKW");
};

export default {
  generateMnemonicPhrase,
  generateSeed,
  generateJwk,
};
