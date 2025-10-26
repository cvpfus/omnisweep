import { SUPPORTED_CHAINS_IDS, SUPPORTED_TOKENS } from "@avail-project/nexus-core";

export interface SweepInput {
  token: SUPPORTED_TOKENS;
  destinationChain: SUPPORTED_CHAINS_IDS | null;
  sourceChains: SUPPORTED_CHAINS_IDS[];
  amount: number;
}