import { MnemonicKey } from "@/lib/private/MnemonicKey";
import { hdkey } from "ethereumjs-wallet";

const PATH = "m/44'/60'/0'/0/0"; // TODO: ethereum based paths....
const TEMP_MNEMONIC_PHRASE = process.env.TEMP_MNEMONIC_PHRASE;
export class MyWallet {
  static async getWallet() {
    const { seed } = await MnemonicKey.import(TEMP_MNEMONIC_PHRASE);
    const hdwallet = hdkey.fromMasterSeed(seed);
    return hdwallet.derivePath(PATH).getWallet();
  }

  static async getAddress() {
    const wallet = await MyWallet.getWallet();
    return `0x${wallet.getAddress().toString("hex")}`;
  }

  static async getPrivateKey() {
    const wallet = await MyWallet.getWallet();
    return wallet.getPrivateKey().toString("hex");
  }
}
