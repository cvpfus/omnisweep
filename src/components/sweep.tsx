/* eslint-disable @next/next/no-img-element */
import { useNexus } from "@/providers/NexusProvider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  CHAIN_METADATA,
  SUPPORTED_CHAINS,
  SUPPORTED_CHAINS_IDS,
} from "@avail-project/nexus-core";
import { useState } from "react";
import useFetchUnifiedBalanceByTokenSymbol from "@/hooks/useFetchUnifiedBalanceByChain";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import ChainSelect from "./blocks/chain-select";
import { Button } from "./ui/button";
import IntentModal from "./blocks/intent-modal";
import useListenBridgeTransaction from "@/hooks/useListenBridgeTransactions";
import { ArrowBigRight } from "lucide-react";
import { useNotification } from "@blockscout/app-sdk";
import { useAccount } from "wagmi";
import { SweepInput } from "@/types/sweep";
import InputAmount from "./blocks/input-amount";

const NexusSweep = () => {
  const [input, setInput] = useState<SweepInput>({
    token: "ETH",
    destinationChain: SUPPORTED_CHAINS.ETHEREUM,
    sourceChains: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const { nexusSDK, intentRefCallback } = useNexus();

  const { processing, explorerURL } = useListenBridgeTransaction();

  const { data: unifiedBalance } = useFetchUnifiedBalanceByTokenSymbol(
    input.token
  );

  const account = useAccount();

  const { openTxToast } = useNotification();

  const tokenBreakdowns = unifiedBalance?.breakdown
    ?.filter((token) => parseFloat(token.balance) > 0)
    ?.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

  const totalSelectedBalance = tokenBreakdowns
    ?.filter((token) =>
      input.sourceChains.includes(token.chain.id as SUPPORTED_CHAINS_IDS)
    )
    ?.reduce((acc, token) => acc + parseFloat(token.balance), 0);

  const handleSweep = async () => {
    if (
      !input.token ||
      !input.destinationChain ||
      input.sourceChains.length === 0
    )
      return;

    setIsLoading(true);

    try {
      const amount = tokenBreakdowns
        ?.filter((token) =>
          input.sourceChains.includes(token.chain.id as SUPPORTED_CHAINS_IDS)
        )
        .reduce((acc, token) => acc + parseFloat(token.balance), 0);

      const sweepResult = await nexusSDK?.bridge({
        token: input.token,
        sourceChains: input.sourceChains,
        amount: (amount ?? 0) * 0.5,
        chainId: input.destinationChain,
      });

      console.log("sweep result", sweepResult);

      if (
        sweepResult?.success &&
        account.chainId &&
        sweepResult.transactionHash
      ) {
        console.log(sweepResult.transactionHash);

        openTxToast(account.chainId?.toString(), sweepResult.transactionHash);
      }
    } catch (error) {
      console.error("Error while sweeping:", error);
    } finally {
      setIsLoading(false);
      intentRefCallback.current = null;
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sweep</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-y-1">
            <InputAmount
              selectedToken={input.token}
              handleTokenSelect={(token) => setInput({ ...input, token })}
            />
            {!!totalSelectedBalance && totalSelectedBalance > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  Unified Balance: {totalSelectedBalance?.toFixed(6)}
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {tokenBreakdowns?.map((token) => {
              return (
                <Label
                  key={token.chain.id}
                  className="cursor-pointer hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10"
                >
                  <Checkbox
                    checked={input.sourceChains.includes(
                      token.chain.id as SUPPORTED_CHAINS_IDS
                    )}
                    onCheckedChange={(checked) => {
                      if (
                        checked &&
                        !input.sourceChains.includes(
                          token.chain.id as SUPPORTED_CHAINS_IDS
                        )
                      ) {
                        setInput({
                          ...input,
                          sourceChains: [
                            ...input.sourceChains,
                            token.chain.id as SUPPORTED_CHAINS_IDS,
                          ],
                        });
                      } else if (
                        !checked &&
                        input.sourceChains.includes(
                          token.chain.id as SUPPORTED_CHAINS_IDS
                        )
                      ) {
                        setInput({
                          ...input,
                          sourceChains: input.sourceChains.filter(
                            (chain) => chain !== token.chain.id
                          ),
                        });
                      }
                    }}
                    className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <div className="flex items-center gap-x-2">
                      <img
                        src={CHAIN_METADATA[token.chain.id]?.logo}
                        alt={token.chain.name}
                        width={14}
                        height={14}
                        className="rounded-full"
                      />
                      <p className="text-sm leading-none font-medium">
                        {token.chain.name}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {parseFloat(token.balance).toFixed(6)} {input.token}
                    </p>
                  </div>
                </Label>
              );
            })}
          </div>

          <div className="flex flex-col gap-y-2">
            <ChainSelect
              selectedChain={input.destinationChain}
              handleSelect={(chain) =>
                setInput({ ...input, destinationChain: chain })
              }
              chainLabel="Destination Chain"
            />
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
              isLoading
            }
          >
            Sweep
          </Button>

          <div className="flex items-center flex-col gap-y-3">
            {intentRefCallback?.current?.intent && (
              <>
                <p className="font-semibold text-lg">
                  Total Steps: {processing?.totalSteps}
                </p>
                <p className="font-semibold text-lg">
                  Status: {processing?.statusText}
                </p>
                <p className="font-semibold text-lg">
                  Progress: {processing?.currentStep}
                </p>
              </>
            )}

            {explorerURL && (
              <a
                href={explorerURL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold flex items-center gap-x-2"
              >
                <ArrowBigRight className="size-5" /> View on Explorer
              </a>
            )}
          </div>
        </CardFooter>
      </Card>

      {intentRefCallback?.current?.intent && (
        <IntentModal intent={intentRefCallback?.current} />
      )}
    </div>
  );
};

export default NexusSweep;
