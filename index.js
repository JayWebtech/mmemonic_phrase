const express = require("express");
const app = express();
const path = require("path");
const port = 3030;
const WalletFunctions = require("./wallet_class_functions");
const fs = require("fs");

const walletManager = new WalletFunctions();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", { title: "BlockHeader Wallet" });
});

app.get("/generate-wallet", (req, res) => {
  let phrase = walletManager.generate_mnemonic();
  res.render("generate", {
    title: "Generate Wallet",
    phrase: phrase.split(" "),
  });
});

app.get("/fetch-wallets", (req, res) => {
  const walletIndex = walletManager.getWalletIndex();

  if (walletIndex === 0) {
    walletManager.generate_wallet_account();
    const wallets = walletManager.loadWallets();
    res.json(wallets);
  } else {
    const wallets = walletManager.loadWallets();
    res.json(wallets);
  }
});

app.get("/new-account", (req, res) => {
  const newWallet = walletManager.generate_wallet_account();
  res.json(newWallet);
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/import", (req, res) => {
  res.render("import");
});

app.post("/import-wallet", (req, res) => {
  const { mnemonic } = req.body;
  const wallet = walletManager.import_wallet(mnemonic);

  console.log(wallet);
  if (wallet) {
    fs.writeFileSync("mnemonic.txt", mnemonic, "utf-8");
    walletManager.saveWallet(wallet[0]);
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
