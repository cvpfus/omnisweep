import { useNexus } from "@/providers/NexusProvider";
import { SUPPORTED_TOKENS } from "@avail-project/nexus-core";
import { useQuery } from "@tanstack/react-query";

const useFetchUnifiedBalanceByTokenSymbol = (tokenSymbol: SUPPORTED_TOKENS) => {
  const { nexusSDK } = useNexus();

  return useQuery({
    queryKey: ["unified-balance", tokenSymbol],
    queryFn: async () => {
      const balance = await nexusSDK?.getUnifiedBalances();
      return balance?.filter((token) => token.symbol === tokenSymbol)?.[0];
    },
    enabled: !!nexusSDK,
  });
};

export default useFetchUnifiedBalanceByTokenSymbol;
