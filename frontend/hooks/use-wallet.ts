import { useState, useEffect } from "react";
import { ethers } from "ethers";

export function useWallet() {
    const [account, setAccount] = useState<string | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window as any;

            if (!ethereum) {
                return;
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                setAccount(account);
                
                const browserProvider = new ethers.BrowserProvider(ethereum);
                const browserSigner = await browserProvider.getSigner();
                setProvider(browserProvider);
                setSigner(browserSigner);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        try {
            setIsConnecting(true);
            setError(null);
            const { ethereum } = window as any;

            if (!ethereum) {
                setError("MetaMask is not installed. Please install it to use this feature.");
                setIsConnecting(false);
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            setAccount(accounts[0]);
            
            const browserProvider = new ethers.BrowserProvider(ethereum);
            const browserSigner = await browserProvider.getSigner();
            setProvider(browserProvider);
            setSigner(browserSigner);
        } catch (error: any) {
            console.error(error);
            if (error.code === 4001) {
                setError("User rejected the connection request.");
            } else {
                setError("Failed to connect to MetaMask.");
            }
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        // MetaMask doesn't have a true disconnect from the dapp side
        // but we can clear our local state
        setAccount(null);
        setSigner(null);
        setProvider(null);
    };

    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return {
        account,
        signer,
        provider,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
        formatAddress
    };
}
