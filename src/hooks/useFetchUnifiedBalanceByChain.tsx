import { useNexus } from "@/providers/NexusProvider";
import { SweepInput } from "@/types/sweep";
import { SUPPORTED_CHAINS_IDS } from "@avail-project/nexus-core";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

const useFetchUnifiedBalanceByTokenSymbol = (
  input: SweepInput,
  setInput: Dispatch<SetStateAction<SweepInput>>
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
        setInput((prevInput) => ({
          ...prevInput,
          sourceChains: tokenBreakdowns.map(
            (token) => token.chain.id as SUPPORTED_CHAINS_IDS
          ),
        }));
      }

      if (!tokenBreakdowns || tokenBreakdowns?.length === 0) {
        setInput((prevInput) => ({
          ...prevInput,
          sourceChains: [],
        }));
      }

      return filteredTokenAssets;
    },
    enabled: !!nexusSDK && !!input.token,
  });
};

export default useFetchUnifiedBalanceByTokenSymbol;
