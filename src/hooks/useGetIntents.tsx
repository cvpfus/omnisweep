import { useNexus } from "@/providers/NexusProvider";
import { useQuery } from "@tanstack/react-query";

const useGetIntents = (page = 1) => {
  const { nexusSDK } = useNexus();

  return useQuery({
    queryKey: ["intents", page],
    queryFn: async () => {
      const intents = await nexusSDK?.getMyIntents(page);
      return intents;
    },
    enabled: !!nexusSDK,
  });
};

export default useGetIntents;
