import { useNexus } from "@/providers/NexusProvider";
import { useQuery } from "@tanstack/react-query";

const useRefreshIntent = () => {
  const { intentRefCallback } = useNexus();

  return useQuery({
    queryKey: ["intent", intentRefCallback.current?.intent],
    queryFn: async () => {
      await intentRefCallback.current?.refresh();
    },
    enabled: !!intentRefCallback.current?.intent,
    refetchInterval: 5000,
  });
};

export default useRefreshIntent;
