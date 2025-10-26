# 🌐 OmniSweep

A powerful cross-chain token management application built with [Avail Nexus SDK](https://github.com/availproject/nexus-sdk) that enables users to consolidate and bridge tokens across multiple blockchain networks seamlessly.

## ✨ Features

- **🔄 Multi-Chain Token Sweeping**: Consolidate tokens from multiple chains into a single destination chain
- **💰 Unified Balance View**: See your token balances across all supported chains in one place
- **⚡ Real-time Transaction Tracking**: Monitor bridge transactions with live status updates
- **📊 Smart Amount Selection**: Quick percentage buttons (25%, 50%, 75%) for easy amount selection
- **💎 Multi-Token Support**: Bridge ETH, USDC, USDT, and other supported tokens
- **🎯 Intent-Based Bridging**: Powered by Avail Nexus for efficient cross-chain transfers
- **🔍 Transaction History**: View and track all your past bridge transactions
- **📱 Responsive Design**: Beautiful UI that works seamlessly across devices

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Web3**: [wagmi](https://wagmi.sh/), [viem](https://viem.sh/), [thirdweb](https://thirdweb.com/)
- **Bridge SDK**: [@avail-project/nexus-core](https://www.npmjs.com/package/@avail-project/nexus-core)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Type Safety**: TypeScript

## 📋 Prerequisites

- Node.js 20.x or higher
- pnpm (recommended) or npm
- A Web3 wallet (e.g., MetaMask)

## 🛠️ Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd omnisweep
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Run the development server**:

```bash
pnpm dev
```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
pnpm build
pnpm start
```

## 🔧 Configuration

The application uses Avail Nexus SDK for cross-chain bridging. Supported chains and tokens are configured through the `@avail-project/nexus-core` package.

### Environment Variables

No environment variables are required for basic functionality. The app uses client-side wallet connections.

## 🎮 How to Use

1. **Connect Wallet**: Click "Connect Wallet" to connect your Web3 wallet
2. **Initialize Nexus**: Initialize the Nexus SDK for your account
3. **Select Token**: Choose the token you want to sweep (ETH, USDC, etc.)
4. **Choose Source Chains**: Select which chains you want to consolidate tokens from
5. **Set Amount**: Enter the amount or use quick selection buttons (25%, 50%, 75%)
6. **Select Destination**: Choose the chain where you want to receive all tokens
7. **Review Fees**: Check the total bridge fees before proceeding
8. **Sweep**: Click "Sweep" to initiate the cross-chain transfer
9. **Track Progress**: Monitor your transaction in the intent modal and transactions page

## 📁 Project Structure

```
omnisweep/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Main sweep interface
│   │   └── transactions/      # Transaction history page
│   ├── components/
│   │   ├── blocks/            # Reusable component blocks
│   │   │   ├── chain-select.tsx
│   │   │   ├── token-select.tsx
│   │   │   ├── input-amount.tsx
│   │   │   └── intent-modal.tsx
│   │   ├── ui/                # Base UI components (Radix UI)
│   │   ├── sweep.tsx          # Main sweep component
│   │   ├── transactions.tsx   # Transaction list component
│   │   └── nexus.tsx          # Nexus initialization
│   ├── hooks/                 # Custom React hooks
│   │   ├── useInitNexus.tsx
│   │   ├── useGetIntents.tsx
│   │   ├── useSimulateBridge.tsx
│   │   └── useListenBridgeTransactions.tsx
│   ├── providers/             # React context providers
│   │   ├── NexusProvider.tsx  # Nexus SDK context
│   │   └── Web3Provider.tsx   # Web3 wallet context
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── package.json
```

## 🔗 Supported Chains

OmniSweep supports multiple blockchain networks through Avail Nexus, including:

- Ethereum
- Arbitrum
- Optimism
- Base
- Polygon
- And more...

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- [Avail Nexus Documentation](https://docs.availproject.org/nexus/introduction-to-nexus)
- [Next.js Documentation](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh/)

## ⚠️ Important Notes

- **Turbopack**: Be careful when using turbopack (`next dev --turbo`), you may need to add appropriate polyfills
- **Wallet Connection**: Ensure your wallet is connected to a supported network
- **Gas Fees**: Bridge transactions require gas fees on both source and destination chains
- **Security**: Never share your private keys or seed phrases

## 🐛 Troubleshooting

### Common Issues

**Wallet not connecting?**

- Make sure you have a Web3 wallet installed
- Check that you're on a supported network
- Try refreshing the page and reconnecting

**Transaction failing?**

- Ensure you have sufficient balance for both the transfer amount and gas fees
- Check that the destination chain is correctly selected
- Verify that the amount doesn't exceed your available balance

**Nexus initialization issues?**

- Make sure your wallet is connected
- Try disconnecting and reconnecting your wallet
- Clear browser cache and try again

## 💬 Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ using Avail Nexus
