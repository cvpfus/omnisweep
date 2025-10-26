"use client";

import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import ConnectWallet from "./connect-wallet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();

  const isSweepPage = pathname === "/";
  const isTransactionsPage = pathname === "/transactions";

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-x-6">
        <p className="text-2xl font-bold">OmniSweep</p>
        <Card className="py-2">
          <CardContent className="flex px-3 gap-x-6">
            <Link href="/">
              <p className={cn(isSweepPage ? "font-bold" : "")}>Sweep</p>
            </Link>
            <Link href="/transactions">
              <p className={cn(isTransactionsPage ? "font-bold" : "")}>
                Transactions
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
      <ConnectWallet />
    </div>
  );
};

export default Header;
