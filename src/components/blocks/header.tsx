import ConnectWallet from "./connect-wallet";

const Header = () => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-x-2">
        <p className="text-2xl font-bold">OmniSweep</p>
      </div>
      <ConnectWallet />
    </div>
  );
};

export default Header;
