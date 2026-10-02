import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Orange Provenance Tracker",
    description: "Web3 Supply Chain tracker for Nagpur Oranges",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="max-w-md mx-auto min-h-screen relative overflow-hidden">
                    {/* Decorative background blobs */}
                    <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-orange-600/30 rounded-full mix-blend-screen filter blur-[80px] opacity-70 animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[80px] opacity-70" />

                    <main className="relative z-10 flex flex-col min-h-screen p-6">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
