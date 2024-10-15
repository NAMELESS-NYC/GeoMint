"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { useAutoConnect } from "./autoConnectProvider";

export const WalletProvider = ({ children }) => {
  const { autoConnect } = useAutoConnect();

  return (
    <AptosWalletAdapterProvider
      autoConnect={autoConnect}
      dappConfig={{
        network: Network.TESTNET,
        aptosApiKey: process.env.REACT_APP_PUBLIC_APTOS_API_KEY,
        aptosConnect: { dappId: process.env.REACT_PUBLIC_APTOS_DAPP_ID },
      }}
      onError={(error) => {
        console.error(error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
