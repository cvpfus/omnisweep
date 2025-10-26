"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
  scroll,
  avalanche,
  bsc,
  Chain,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NexusProvider from "./NexusProvider";
import { ThirdwebProvider } from "thirdweb/react";
import {
  NotificationProvider,
  TransactionPopupProvider,
} from "@blockscout/app-sdk";

export const chains: readonly [Chain, ...Chain[]] = [
  mainnet,
  base,
  polygon,
  arbitrum,
  optimism,
  scroll,
  avalanche,
  bsc,
];

const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
    [arbitrum.id]: http(arbitrum.rpcUrls.default.http[0]),
    [base.id]: http(base.rpcUrls.default.http[0]),
    [optimism.id]: http(optimism.rpcUrls.default.http[0]),
    [polygon.id]: http(polygon.rpcUrls.default.http[0]),
    [avalanche.id]: http(avalanche.rpcUrls.default.http[0]),
    [scroll.id]: http(scroll.rpcUrls.default.http[0]),
    [bsc.id]: http(bsc.rpcUrls.default.http[0]),
  },
});
const queryClient = new QueryClient();

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <TransactionPopupProvider>
              <NexusProvider>{children}</NexusProvider>
            </TransactionPopupProvider>
          </NotificationProvider>
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
