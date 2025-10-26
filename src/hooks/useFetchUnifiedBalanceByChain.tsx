import { useNexus } from "@/providers/NexusProvider";
import { SweepInput } from "@/types/sweep";
import { SUPPORTED_CHAINS_IDS } from "@avail-project/nexus-core";
import { useQuery } from "@tanstack/react-query";

const useFetchUnifiedBalanceByTokenSymbol = (
  input: SweepInput,
  setInput: (input: SweepInput) => void
) => {
  const { nexusSDK } = useNexus();

  return useQuery({
    queryKey: ["unified-balance", input.token],
    queryFn: async () => {
      const balance = await nexusSDK?.getUnifiedBalances();

      const filteredTokenAssets = balance?.filter(
        (token) => token.symbol === input.token
      )?.[0];

      const tokenBreakdowns = filteredTokenAssets?.breakdown?.filter(
        (token) => parseFloat(token.balance) > 0
      );

      if (!!tokenBreakdowns && tokenBreakdowns.length > 0) {
        setInput({
          ...input,
          sourceChains: tokenBreakdowns.map(
            (token) => token.chain.id as SUPPORTED_CHAINS_IDS
          ),
        });
      }

      return filteredTokenAssets;
    },
    enabled: !!nexusSDK && !!input.token,
  });
};

export default useFetchUnifiedBalanceByTokenSymbol;
