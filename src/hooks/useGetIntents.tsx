import { useNexus } from "@/providers/NexusProvider";
import { useQuery } from "@tanstack/react-query";

const useGetIntents = () => {
  const { nexusSDK } = useNexus();

  return useQuery({
    queryKey: ["intents"],
    queryFn: async () => {
      const intents = await nexusSDK?.getMyIntents(1);
      return intents;
    },
    enabled: !!nexusSDK,
  });
};

export default useGetIntents;
