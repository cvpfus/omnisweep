import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ConnectWallet from "./blocks/connect-wallet";

const ConnectWalletCard = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-3">
        <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
        <CardDescription className="text-base">
          Please connect your wallet to start sweeping tokens across chains.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ConnectWallet />
      </CardContent>
    </Card>
  );
};

export default ConnectWalletCard;
