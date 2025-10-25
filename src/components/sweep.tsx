import { useNexus } from "@/providers/NexusProvider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  SUPPORTED_TOKENS,
  SUPPORTED_CHAINS,
  SUPPORTED_CHAINS_IDS,
} from "@avail-project/nexus-core";
import { useState } from "react";
import TokenSelect from "./blocks/token-select";
import useFetchUnifiedBalanceByTokenSymbol from "@/hooks/useFetchUnifiedBalanceByChain";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import ChainSelect from "./blocks/chain-select";
import { Button } from "./ui/button";
import IntentModal from "./blocks/intent-modal";
import useListenTransaction from "@/hooks/useListenTransactions";
import { ArrowBigRight } from "lucide-react";
import { allowance } from "thirdweb/extensions/erc20";

interface SweepInput {
  token: SUPPORTED_TOKENS;
  destinationChain: SUPPORTED_CHAINS_IDS;
  sourceChains: SUPPORTED_CHAINS_IDS[];
}

const NexusSweep = () => {
  const [input, setInput] = useState<SweepInput>({
    token: "ETH",
    destinationChain: SUPPORTED_CHAINS.ETHEREUM,
    sourceChains: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const { nexusSDK, intentRefCallback, allowanceRefCallback } = useNexus();

  const { processing, explorerURL } = useListenTransaction({
    sdk: nexusSDK!,
    type: "bridge",
  });

  const { data: unifiedBalance } = useFetchUnifiedBalanceByTokenSymbol(
    input.token
  );

  const tokenBalances = unifiedBalance?.breakdown?.filter(
    (token) => parseFloat(token.balance) > 0
  );

  const handleSweep = async () => {
    if (
      !input.token ||
      !input.destinationChain ||
      input.sourceChains.length === 0
    )
      return;

    setIsLoading(true);

    try {
      const amount = tokenBalances
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
    } catch (error) {
      console.error("Error while sweeping:", error);
    } finally {
      setIsLoading(false);
      intentRefCallback.current = null;
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Sweep</CardTitle>
        </CardHeader>
        <CardContent>
          <TokenSelect
            selectedToken={input.token}
            tokenLabel="Token"
            handleTokenSelect={(token) => setInput({ ...input, token })}
          />

          <div className="flex flex-col gap-y-2">
            {tokenBalances?.map((token) => {
              return (
                <Label
                  key={token.chain.id}
                  className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
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
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      {token.chain.name}
                    </p>
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
        <IntentModal
          intent={intentRefCallback?.current}
        />
      )}
    </div>
  );
};

export default NexusSweep;
