const wallet = require("ethers").Wallet;
const readline = require("readline");
const hdwallet = require("ethers").HDNodeWallet;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let user_mmemonic;
let user_wallets = [];

const start = () => {
  rl.question("Press Enter to generate Mnemonic Phrase...", () => {
    generate_mnemonic();
  });
};

const generate_mnemonic = () => {
  const mnemonic = wallet.createRandom().mnemonic;
  user_mmemonic = mnemonic.phrase;
  console.log(`\nGenerated Mnemonic Phrase: \n${mnemonic.phrase}\n`);
  ask_wallet_count();
};

const ask_wallet_count = () => {
  rl.question("Enter the number of wallets you need: ", (input) => {
    const count = parseInt(input);
    if (!isNaN(count) && count > 0) {
      generate_wallet_account(count);
    } else {
      console.log("Please enter a valid number.");
      ask_wallet_count();
    }
  });
};

const generate_wallet_account = (no_of_wallets) => {
  for (let i = 0; i < no_of_wallets; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    const wallet_account = hdwallet.fromPhrase(user_mmemonic, "@Jaykosai", path);
    user_wallets.push(wallet_account);
  }
  console.log("\nGenerated Wallet Addresses:");
  console.log(user_wallets);
  user_wallets.forEach((wallet, index) => {
    console.log(`${index + 1}: ${wallet.privateKey}`);
  });
  rl.close();
};

console.log("Welcome to the Wallet Generator");
start();
