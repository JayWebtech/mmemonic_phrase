const wallet = require("ethers").Wallet;
const hdwallet = require("ethers").HDNodeWallet;
const Mnemonic = require("ethers").Mnemonic;
const fs = require("fs");

const walletFile = "wallets.json";

class WalletFunctions {
  generate_mnemonic = () => {
    let mnemonic;

    if (fs.existsSync("mnemonic.txt")) {
      mnemonic = fs.readFileSync("mnemonic.txt", "utf-8").trim();
    }

    if (!mnemonic) {
      mnemonic = wallet.createRandom().mnemonic.phrase;
      fs.writeFileSync("mnemonic.txt", mnemonic, "utf-8");
    }

    return mnemonic;
  };

  getMnemonic = () => {
    if (fs.existsSync("mnemonic.txt")) {
      return fs.readFileSync("mnemonic.txt", "utf-8").trim();
    }
    return "";
  };

  getWalletIndex = () => {
    if (fs.existsSync(walletFile)) {
      try {
        const data = fs.readFileSync(walletFile, "utf-8");

        if (!data) {
          return 0;
        }

        const jsonData = JSON.parse(data);
        if (!Array.isArray(jsonData) || jsonData.length === 0) return 0;

        const lastIndex = Math.max(...jsonData.map((wallet) => wallet.index));

        return lastIndex + 1;
      } catch (error) {
        console.error("Error reading wallet index, resetting file:", error);
        saveWalletIndex(0);
        return 0;
      }
    }
    return 0;
  };

  saveWalletIndex = (index) => {
    fs.writeFileSync(walletFile, JSON.stringify({ lastIndex: index }, null, 2));
  };

  saveWallet = (wallet) => {
    if (fs.existsSync(walletFile)) {
      try {
        const data = fs.readFileSync(walletFile, "utf-8");
        if (data) {
          const wallets = JSON.parse(data);
          wallets.push(wallet);
          fs.writeFileSync(walletFile, JSON.stringify(wallets), "utf-8");
          return;
        } else {
          fs.writeFileSync(walletFile, JSON.stringify([wallet]), "utf-8");
        }
      } catch (error) {
        console.error("Error reading wallets file:", error);
      }
    }
  };

  loadWallets = () => {
    if (fs.existsSync(walletFile)) {
      try {
        const data = fs.readFileSync(walletFile, "utf-8");
        if (data) {
          const wallets = JSON.parse(data);
          return wallets;
        }
      } catch (error) {
        console.error("Error loading wallets file:", error);
      }
    }
  };

  generate_wallet_account = () => {
    let wallet_index = this.getWalletIndex();
    const path = `m/44'/60'/0'/0/${wallet_index}`;
    const wallet_account = hdwallet.fromPhrase(this.getMnemonic(), "", path);

    const walletData = {
      index: wallet_index,
      address: wallet_account.address,
      privateKey: wallet_account.privateKey,
    };
    this.saveWallet(walletData);

    return walletData;
  };

  import_wallet = (mnemonic) => {
    const walletData = [];

    const phrase = Mnemonic.fromPhrase(mnemonic);

    for (let index = 0; index < 10; index++) {
      const path = `m/44'/60'/0'/0/${index}`;
      const wallet_account = hdwallet.fromMnemonic(phrase, path);
      walletData.push({
        address: wallet_account.address,
        privateKey: wallet_account.privateKey,
      });
    }

    return walletData;
  };
}

module.exports = WalletFunctions;
