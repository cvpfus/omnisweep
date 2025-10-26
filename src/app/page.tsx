"use client";

import Nexus from "@/components/nexus";
import ConnectWalletCard from "@/components/connect-wallet-card";
import { useNexus } from "@/providers/NexusProvider";
import { useAccount } from "wagmi";
import InitializeNexusCard from "@/components/initialize-nexus-card";

export default function Home() {
  const { nexusSDK, isInitError } = useNexus();

  const { isConnected } = useAccount();

  return (
    <>
      {!isConnected && <ConnectWalletCard />}
      {isConnected && nexusSDK?.isInitialized() && <Nexus />}
      {isInitError && <InitializeNexusCard />}
    </>
  );
}
