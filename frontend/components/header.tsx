"use client";

import { Bell, Search, UserCircle2, Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

export function Header() {
    const { account, isConnecting, connectWallet, disconnectWallet, formatAddress, error } = useWallet();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 pl-14 pr-6 md:px-6 backdrop-blur-md">
            {/* Search Bar */}
            <div className="flex items-center flex-1">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search shipments, batch IDs, or facilities..."
                        className="w-full rounded-full border border-input bg-muted/50 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-4">
                {error && (
                    <span className="text-xs text-destructive hidden md:block">{error}</span>
                )}

                <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border border-background"></span>
                </button>

                <div className="pl-4 border-l border-border flex items-center">
                    {account ? (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end leading-tight hidden md:flex">
                                <span className="text-sm font-medium text-success flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-success"></div>
                                    Connected
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">{formatAddress(account)}</span>
                            </div>

                            <div className="h-9 w-9 xl:h-10 xl:w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <UserCircle2 className="h-6 w-6 text-primary" />
                            </div>

                            <button
                                onClick={disconnectWallet}
                                className="p-2 ml-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                title="Disconnect Wallet"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            disabled={isConnecting}
                            className="flex items-center gap-2 h-9 px-4 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-70"
                        >
                            <Wallet className="h-4 w-4" />
                            {isConnecting ? "Connecting..." : "Connect Wallet"}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
