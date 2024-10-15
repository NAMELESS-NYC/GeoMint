import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  AccountSequenceNumber,
  Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";
import dotenv from "dotenv";

dotenv.config();

let aptosConfig;

const clientConfig = {
  API_KEY: process.env.APTOS_API_KEY,
};

const nodeApiUrl = "https://api.testnet.aptoslabs.com/v1";

aptosConfig = new AptosConfig({
  fullnode: nodeApiUrl,
  network: Network.TESTNET,
  clientConfig,
});

export const aptos = new Aptos(aptosConfig);
const privateKey = new Ed25519PrivateKey(process.env.APTOS_PRIVATE_KEY);
const aptosAccount = Account.fromPrivateKey({ privateKey });

const accountSequenceNumber = new AccountSequenceNumber(
  aptosConfig,
  aptosAccount,
  10,
  100,
  10
);

// Initialize the accountSequenceNumber object
async function initializeAccountSequenceNumber() {
  await accountSequenceNumber.initialize();
  console.log(
    "Account sequence number initialized",
    accountSequenceNumber.currentNumber
  );
}

// Initialize when the module is loaded
initializeAccountSequenceNumber().catch((error) => {
  console.error("Error initializing account sequence number:", error);
});

export function getAptosAccount() {
  return aptosAccount;
}

export async function getSequenceNumber() {
  await accountSequenceNumber.update();
  await accountSequenceNumber.synchronize();
  const nextSequenceNumber = await accountSequenceNumber.nextSequenceNumber();
  const nextSequenceNumberNumber = Number(nextSequenceNumber);
  console.log("Next Sequence Number", Number(nextSequenceNumber));
  return nextSequenceNumberNumber;
}
