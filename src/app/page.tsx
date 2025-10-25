"use client";

import ConnectWallet from "@/components/blocks/connect-wallet";
import Nexus from "@/components/nexus";
import { Button } from "@/components/ui/button";
import useGetIntents from "@/hooks/useGetIntents";
import { useNexus } from "@/providers/NexusProvider";
import { useTransactionPopup } from "@blockscout/app-sdk";
import { useAccount } from "wagmi";

export default function Home() {
  const { nexusSDK } = useNexus();
  const account = useAccount();
  const { data: intents } = useGetIntents();

  const { openPopup } = useTransactionPopup();

  console.log("intents", intents);

  const handleShowHistory = () => {
    openPopup({
      chainId: account.chainId?.toString() ?? "1",
      address: account.address,
    });
  };

  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-y-6 sm:p-20">
      <h1 className="text-3xl font-semibold z-10">
        Avail Nexus Next.js template
      </h1>
      <h2 className="text-lg font-semibold z-10">
        Do you first transaction in seconds
      </h2>
      <div className="flex gap-x-4 items-center justify-center z-10">
        <ConnectWallet />
        <Button onClick={handleShowHistory}>Show History</Button>
      </div>
      {nexusSDK?.isInitialized() && <Nexus />}
    </div>
  );
}
