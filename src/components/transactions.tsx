/* eslint-disable @next/next/no-img-element */
import useGetIntents from "@/hooks/useGetIntents";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { useNexus } from "@/providers/NexusProvider";
import { CHAIN_METADATA, TOKEN_METADATA } from "@avail-project/nexus-core";
import { cn } from "@/lib/utils";

type IntentStatus = "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";

const getIntentStatus = (intent: {
  deposited: boolean;
  fulfilled: boolean;
  refunded: boolean;
}): IntentStatus => {
  if (intent.refunded) return "REFUNDED";
  if (intent.fulfilled) return "SUCCESS";
  if (!intent.deposited && !intent.fulfilled) return "FAILED";

  return "PENDING";
};

const StatusBadge = ({ status }: { status: IntentStatus }) => {
  const config = {
    SUCCESS: {
      icon: CheckCircle2,
      className: "bg-green-500/10 text-green-500 border-green-500/20",
      label: "Success",
    },
    PENDING: {
      icon: Clock,
      className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      label: "Pending",
    },
    FAILED: {
      icon: XCircle,
      className: "bg-red-500/10 text-red-500 border-red-500/20",
      label: "Failed",
    },
    REFUNDED: {
      icon: RefreshCcw,
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      label: "Refunded",
    },
  };

  const { icon: Icon, className, label } = config[status];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium",
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
};

const Transactions = () => {
  const { data: intents, isLoading, isError } = useGetIntents();
  const { nexusSDK } = useNexus();

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatValue = (value: bigint, decimals = 18) => {
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;
    const fractionalStr = fractionalPart
      .toString()
      .padStart(decimals, "0")
      .slice(0, 6);
    return `${integerPart}.${fractionalStr}`;
  };

  return (
    <div className="w-full max-w-2xl">
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-destructive">Error loading transactions</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && intents && intents.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No transactions found</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-y-3">
        {intents &&
          intents.length > 0 &&
          intents.map((intent) => {
            const status = getIntentStatus(intent);
            const firstSource = intent.sources?.[0];
            const tokenInfo = firstSource
              ? nexusSDK?.chainList.getTokenByAddress(
                  firstSource.chainID,
                  firstSource.tokenAddress
                )
              : null;

            const tokenMetadata = tokenInfo
              ? Object.entries(TOKEN_METADATA)?.find(
                  ([, token]) => token.symbol === tokenInfo.symbol
                )?.[1]
              : null;

            const totalSourceValue =
              intent.sources?.reduce(
                (sum, source) => sum + source.value,
                BigInt(0)
              ) || BigInt(0);

            return (
              <Card key={intent.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base font-medium">
                    Intent #{intent.id}
                  </CardTitle>
                  <StatusBadge status={status} />
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Token and Amount */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tokenMetadata?.icon && (
                        <img
                          src={tokenMetadata.icon}
                          alt={tokenInfo?.symbol}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <span className="font-medium">
                        {formatValue(totalSourceValue, tokenInfo?.decimals)}{" "}
                        {tokenInfo?.symbol}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expires: {formatTimestamp(intent.expiry)}
                    </div>
                  </div>

                  {/* Source and Destination Chains */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-muted-foreground">
                        From
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {intent.sources?.map((source, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 text-xs"
                          >
                            <img
                              src={CHAIN_METADATA[source.chainID]?.logo}
                              alt={CHAIN_METADATA[source.chainID]?.name}
                              width={16}
                              height={16}
                              className="rounded-full"
                            />
                            <span className="font-medium">
                              {CHAIN_METADATA[source.chainID]?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-muted-foreground">To</span>
                      <div className="flex items-center gap-1.5 text-xs">
                        <img
                          src={CHAIN_METADATA[intent.destinationChainID]?.logo}
                          alt={CHAIN_METADATA[intent.destinationChainID]?.name}
                          width={16}
                          height={16}
                          className="rounded-full"
                        />
                        <span className="font-medium">
                          {CHAIN_METADATA[intent.destinationChainID]?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default Transactions;
