import { useNexus } from "@/providers/NexusProvider";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const InitializeNexusCard = () => {
  const { handleInit } = useNexus();

  const handleInitializeNexus = () => {
    handleInit();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-3">
        <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
        <CardDescription className="text-base">
          Please initialize Nexus to start sweeping tokens across chains.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button onClick={handleInitializeNexus}>Initialize Nexus</Button>
      </CardContent>
    </Card>
  );
};

export default InitializeNexusCard;
