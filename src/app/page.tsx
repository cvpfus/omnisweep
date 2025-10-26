"use client";

import Header from "@/components/blocks/header";
import Nexus from "@/components/nexus";
import { useNexus } from "@/providers/NexusProvider";

export default function Home() {
  const { nexusSDK } = useNexus();

  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8 gap-y-6">
      <Header />
      {nexusSDK?.isInitialized() && <Nexus />}
    </div>
  );
}
