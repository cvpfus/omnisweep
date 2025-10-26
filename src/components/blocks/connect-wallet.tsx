import { client } from "@/client";
import { chains } from "@/providers/Web3Provider";
import { defineChain } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("com.trustwallet.app"),
  createWallet("com.okex.wallet"),
  createWallet("com.binance.wallet"),
  createWallet("com.bitget.web3"),
  createWallet("com.safepal"),
];

const ConnectWallet = () => {
  const thirdwebChains = chains.map((ch) => defineChain(ch.id));

  return (
    <ConnectButton
      client={client}
      connectModal={{ size: "compact" }}
      wallets={wallets}
      chains={thirdwebChains}
    />
  );
};

export default ConnectWallet;
