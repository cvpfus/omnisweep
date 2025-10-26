import { useNexus } from "@/providers/NexusProvider";
import { BridgeParams } from "@avail-project/nexus-core";
import { useQuery } from "@tanstack/react-query";

const useSimulateBridge = (params: BridgeParams) => {
  const { nexusSDK } = useNexus();
  return useQuery({
    queryKey: ["simulate-bridge", params],
    queryFn: async () => {
      const result = await nexusSDK?.simulateBridge(params);

      return result;
    },
    refetchInterval: 5000,
    enabled:
      !!nexusSDK &&
      !!params.token &&
      !!params.sourceChains &&
      params.sourceChains.length > 0 &&
      !!params.chainId &&
      !!params.amount &&
      (typeof params.amount === "number"
        ? params.amount > 0
        : parseFloat(params.amount as string) > 0),
  });
};

export default useSimulateBridge;
