"use client";

import ConnectWalletCard from "@/components/connect-wallet-card";
import Transactions from "@/components/transactions";
import { useAccount } from "wagmi";

export default function TransactionsPage() {
  const { isConnected } = useAccount();

  return (
    <>
      {!isConnected && <ConnectWalletCard />}
      {isConnected && <Transactions />}
    </>
  );
}
