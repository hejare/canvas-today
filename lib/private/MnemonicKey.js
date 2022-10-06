import { generateMnemonic, mnemonicToSeed } from "bip39";

export class MnemonicKey {
  // static async fromEntropy(entropy) {
  //   const mnemonic = await bip39.entropyToMnemonic(entropy);
  //   return mnemonic;
  // }

  static async generate() {
    return MnemonicKey.import(generateMnemonic());
  }

  static async import(mnemonic) {
    return {
      seed: await mnemonicToSeed(mnemonic),
      mnemonic: mnemonic,
    };
  }
}
