/* eslint-disable @next/next/no-img-element */
import {
  type SUPPORTED_CHAINS_IDS,
  TESTNET_CHAINS,
  MAINNET_CHAINS,
  CHAIN_METADATA,
} from "@avail-project/nexus-core";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

const ChainSelect = ({
  selectedChain,
  handleSelect,
  disabled = false,
  chainLabel
}: {
  selectedChain: SUPPORTED_CHAINS_IDS;
  handleSelect: (chainId: SUPPORTED_CHAINS_IDS) => void;
  chainLabel: string;
  disabled?: boolean;
}) => {
  const chains = MAINNET_CHAINS;
  const chainData = CHAIN_METADATA;
  return (
    <Select
      value={selectedChain?.toString() ?? ""}
      onValueChange={(value) => {
        if (!disabled) {
          handleSelect(parseInt(value) as SUPPORTED_CHAINS_IDS);
        }
      }}
    >
      <div className="flex flex-col items-start gap-y-1">
        <Label className="text-sm font-semibold">{chainLabel}</Label>

        <SelectTrigger disabled={disabled}>
          <SelectValue>
            {!!selectedChain && (
              <div className="flex items-center gap-x-2">
                <img
                  src={CHAIN_METADATA[selectedChain]?.logo}
                  alt={CHAIN_METADATA[selectedChain]?.name ?? ""}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <p className="text-primary test-sm">
                  {CHAIN_METADATA[selectedChain]?.name}
                </p>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
      </div>

      <SelectContent>
        <SelectGroup>
          {chains.map((chainId) => {
            return (
              <SelectItem key={chainId} value={chainId.toString()}>
                <div className="flex items-center gap-x-2 my-1">
                  <img
                    src={CHAIN_METADATA[chainId]?.logo}
                    alt={chainData[chainId]?.name ?? ""}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <p className="text-primary test-sm">
                    {chainData[chainId]?.name}
                  </p>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ChainSelect;
