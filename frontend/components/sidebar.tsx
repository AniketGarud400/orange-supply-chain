"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    ClipboardList,
    MapPin,
    AlertTriangle,
    Settings,
    Menu,
    X,
    Leaf,
    SearchCode,
    Pickaxe
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const navigation = [
        { name: "Farm Registration", href: "/register", icon: Pickaxe },
        { name: "Logistics Check-in", href: "/logistics", icon: MapPin },
        { name: "Defect Escalation", href: "/qa-reports", icon: AlertTriangle },
        { name: "Consumer Tracking", href: "/track", icon: SearchCode },
        { name: "Tracker Manager", href: "/under-construction", icon: LayoutDashboard },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-3 left-4 z-50 p-2 rounded-md bg-card border border-border shadow-sm text-foreground hover:bg-muted transition-colors"
                aria-label="Open Menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-16 items-center px-6 border-b border-border justify-between md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-foreground tracking-tight hover:opacity-90 transition-opacity">
                        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span>OrangeTracker</span>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground p-1">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="flex flex-col gap-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${isActive
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-border mt-auto flex flex-col gap-2">
                    <Link
                        href="/under-construction"
                        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${pathname === "/under-construction"
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <Settings className={`h-[18px] w-[18px] ${pathname === "/under-construction" ? "text-primary" : "text-muted-foreground"}`} />
                        Settings
                    </Link>
                </div>
            </div>
        </>
    );
}
