"use client";

import Header from "@/components/blocks/header";
import Nexus from "@/components/nexus";
import useGetIntents from "@/hooks/useGetIntents";
import { useNexus } from "@/providers/NexusProvider";

export default function Home() {
  const { nexusSDK } = useNexus();

  const { data: intents } = useGetIntents();

  console.log("intents", intents);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-6 gap-y-6">
      <Header />
      {nexusSDK?.isInitialized() && <Nexus />}
    </div>
  );
}
