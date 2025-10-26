"use client";
import useInitNexus from "@/hooks/useInitNexus";
import {
  NexusSDK,
  type OnAllowanceHookData,
  type OnIntentHookData,
} from "@avail-project/nexus-core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useAccount } from "wagmi";

interface NexusContextType {
  nexusSDK: NexusSDK | null;
  intentRefCallback: React.RefObject<OnIntentHookData | null>;
  allowanceRefCallback: React.RefObject<OnAllowanceHookData | null>;
  handleInit: () => Promise<void>;
  isInitError: boolean;
}

const NexusContext = createContext<NexusContextType | null>(null);

const NexusProvider = ({ children }: { children: React.ReactNode }) => {
  const sdk = useMemo(
    () =>
      new NexusSDK({
        network: "mainnet",
        debug: true,
      }),
    []
  );
  const { status } = useAccount();
  const {
    nexusSDK,
    initializeNexus,
    deinitializeNexus,
    attachEventHooks,
    intentRefCallback,
    allowanceRefCallback,
    isInitError,
  } = useInitNexus(sdk);

  const handleInit = useCallback(async () => {
    if (sdk.isInitialized()) {
      console.log("Nexus already initialized");
      return;
    }
    await initializeNexus();
    attachEventHooks();
  }, [sdk, attachEventHooks, initializeNexus]);

  useEffect(() => {
    /**
     * Uncomment to initialize Nexus SDK as soon as wallet is connected
     */
    if (status === "connected") {
      handleInit();
    }
    if (status === "disconnected") {
      deinitializeNexus();
    }
  }, [status, deinitializeNexus, handleInit]);

  const value = useMemo(
    () => ({
      nexusSDK,
      intentRefCallback,
      allowanceRefCallback,
      handleInit,
      isInitError,
    }),
    [nexusSDK, intentRefCallback, allowanceRefCallback, handleInit, isInitError]
  );

  return (
    <NexusContext.Provider value={value}>{children}</NexusContext.Provider>
  );
};

export function useNexus() {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error("useNexus must be used within a NexusProvider");
  }
  return context;
}

export default NexusProvider;
