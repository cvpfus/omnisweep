/* eslint-disable @next/next/no-img-element */
import { useNexus } from "@/providers/NexusProvider";
import { Card, CardContent, CardFooter } from "./ui/card";
import {
  CHAIN_METADATA,
  SUPPORTED_CHAINS_IDS,
} from "@avail-project/nexus-core";
import { useState } from "react";
import useFetchUnifiedBalanceByTokenSymbol from "@/hooks/useFetchUnifiedBalanceByChain";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";
import ChainSelect from "./blocks/chain-select";
import { Button } from "./ui/button";
import IntentModal from "./blocks/intent-modal";
import useListenBridgeTransaction from "@/hooks/useListenBridgeTransactions";
import { SweepInput } from "@/types/sweep";
import InputAmount from "./blocks/input-amount";
import { cn } from "@/lib/utils";
import useSimulateBridge from "@/hooks/useSimulateBridge";
import { Loader2 } from "lucide-react";

const NexusSweep = () => {
  const [input, setInput] = useState<SweepInput>({
    token: "ETH",
    destinationChain: null,
    sourceChains: [],
    amount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { nexusSDK, intentRefCallback } = useNexus();

  useListenBridgeTransaction();

  const { data: unifiedBalance, isLoading: isLoadingBalance } =
    useFetchUnifiedBalanceByTokenSymbol(input, setInput);

  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null
  );

  const { data: bridgeSimulationResult, isLoading: isLoadingSimulateBridge } =
    useSimulateBridge({
      token: input.token,
      sourceChains: input.sourceChains,
      amount: input.amount,
      chainId: input.destinationChain as SUPPORTED_CHAINS_IDS,
    });

  const tokenBreakdowns = unifiedBalance?.breakdown
    ?.filter((token) => parseFloat(token.balance) > 0)
    ?.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

  const totalSelectedBalance = tokenBreakdowns
    ?.filter((token) =>
      input.sourceChains.includes(token.chain.id as SUPPORTED_CHAINS_IDS)
    )
    ?.reduce((acc, token) => acc + parseFloat(token.balance), 0);

  const totalSelectedBalanceInFiat = tokenBreakdowns
    ?.filter((token) =>
      input.sourceChains.includes(token.chain.id as SUPPORTED_CHAINS_IDS)
    )
    ?.reduce((acc, token) => acc + token.balanceInFiat, 0);

  const handleSweep = async () => {
    if (
      !input.token ||
      !input.destinationChain ||
      input.sourceChains.length === 0
    )
      return;

    setIsLoading(true);

    try {
      await nexusSDK?.bridge({
        token: input.token,
        sourceChains: input.sourceChains,
        amount: input.amount,
        chainId: input.destinationChain,
      });
    } catch (error) {
      console.error("Error while sweeping:", error);
    } finally {
      setIsLoading(false);
      intentRefCallback.current = null;
    }
  };

  const handleSourceChainSelected = (
    checked: string | boolean,
    chainId: SUPPORTED_CHAINS_IDS
  ) => {
    {
      setSelectedPercentage(null);

      if (checked && !input.sourceChains.includes(chainId)) {
        setInput({
          ...input,
          sourceChains: [...input.sourceChains, chainId],
        });
      } else if (!checked && input.sourceChains.includes(chainId)) {
        setInput({
          ...input,
          sourceChains: input.sourceChains.filter((chain) => chain !== chainId),
        });
      }
    }
  };

  const handleSelectAllChains = () => {
    const allChainIds =
      tokenBreakdowns?.map((token) => token.chain.id as SUPPORTED_CHAINS_IDS) ||
      [];

    if (input.sourceChains.length === allChainIds.length) {
      // Deselect all
      setInput({ ...input, sourceChains: [] });
    } else {
      // Select all
      setInput({ ...input, sourceChains: allChainIds });
    }
    setSelectedPercentage(null);
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardContent className="space-y-2">
          <div className="flex flex-col gap-y-1">
            <InputAmount
              selectedToken={input.token}
              handleTokenSelect={(token) => setInput({ ...input, token })}
              value={input.amount}
              handleValueChange={(value) => {
                setInput({
                  ...input,
                  amount: parseFloat(value) || 0,
                });
                setSelectedPercentage(null);
              }}
            />
            <div
              className={cn(
                "flex items-center justify-between",
                !totalSelectedBalance || totalSelectedBalance === 0
                  ? "invisible"
                  : "visible"
              )}
            >
              <div className="flex items-center gap-1">
                {[25, 50, 75].map((percentage) => (
                  <Button
                    key={percentage}
                    size="xs"
                    variant={
                      selectedPercentage === percentage
                        ? "outlineSelected"
                        : "outline"
                    }
                    className="text-xs"
                    onClick={() => {
                      setSelectedPercentage(percentage);
                      setInput({
                        ...input,
                        amount:
                          (totalSelectedBalance ?? 0) * (percentage / 100),
                      });
                    }}
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>
              <p className="text-muted-foreground text-xs">
                Unified Balance: {totalSelectedBalance?.toFixed(6)} ($
                {totalSelectedBalanceInFiat?.toFixed(2)})
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Source Chains</Label>
              <Button
                size="xs"
                variant="ghost"
                className="text-xs h-6"
                onClick={handleSelectAllChains}
              >
                {input.sourceChains.length === tokenBreakdowns?.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {isLoadingBalance ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-md border p-2"
                    >
                      <Skeleton className="h-4 w-4 mt-0.5" />
                      <div className="grid gap-1 flex-1">
                        <div className="flex items-center gap-x-1.5">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                tokenBreakdowns?.map((token) => {
                  return (
                    <Label
                      key={token.chain.id}
                      className="cursor-pointer hover:bg-accent/50 flex items-start gap-2 rounded-md border p-2 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10"
                    >
                      <Checkbox
                        checked={input.sourceChains.includes(
                          token.chain.id as SUPPORTED_CHAINS_IDS
                        )}
                        onCheckedChange={(checked) =>
                          handleSourceChainSelected(
                            checked,
                            token.chain.id as SUPPORTED_CHAINS_IDS
                          )
                        }
                        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-0.5"
                      />
                      <div className="grid gap-1 font-normal">
                        <div className="flex items-center gap-x-1.5">
                          <img
                            src={CHAIN_METADATA[token.chain.id]?.logo}
                            alt={token.chain.name}
                            width={12}
                            height={12}
                            className="rounded-full"
                          />
                          <p className="text-xs leading-none font-medium">
                            {token.chain.name}
                          </p>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {parseFloat(token.balance).toFixed(6)} {input.token}{" "}
                          (${token.balanceInFiat?.toFixed(2)})
                        </p>
                      </div>
                    </Label>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <ChainSelect
              selectedChain={input.destinationChain}
              handleSelect={(chain) =>
                setInput({ ...input, destinationChain: chain })
              }
              chainLabel="Destination Chain"
            />

            {isLoadingSimulateBridge ? (
              <div className="flex flex-col gap-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <div
                className={cn(
                  "flex flex-col gap-y-1",
                  bridgeSimulationResult?.intent?.fees?.total
                    ? "visible"
                    : "invisible"
                )}
              >
                <p className="text-muted-foreground text-xs">Total Fees</p>
                <p className="text-xs font-bold">
                  {parseFloat(
                    bridgeSimulationResult?.intent?.fees?.total ?? "0"
                  ).toFixed(8)}{" "}
                  {bridgeSimulationResult?.token?.symbol}
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            size={"lg"}
            className="w-full"
            onClick={handleSweep}
            disabled={
              input.sourceChains.length === 0 ||
              input.destinationChain === null ||
              input.amount === 0 ||
              (!isLoadingSimulateBridge && !bridgeSimulationResult) ||
              isLoading ||
              isLoadingSimulateBridge
            }
          >
            {(isLoadingSimulateBridge || isLoading) && (
              <Loader2 className="size-4 animate-spin" />
            )}
            <span>
              {input.amount === 0 && input.destinationChain === null
                ? "Select Amount and Destination Chain"
                : input.amount === 0
                ? "Select Amount"
                : input.destinationChain === null
                ? "Select Destination Chain"
                : "Sweep"}
            </span>
          </Button>
        </CardFooter>
      </Card>

      {intentRefCallback?.current?.intent && (
        <IntentModal intent={intentRefCallback?.current} />
      )}
    </div>
  );
};

export default NexusSweep;
