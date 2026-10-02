import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

export async function POST(request: Request) {
    try {
        const { crateId, farmDetails, location } = await request.json();

        if (!crateId || !farmDetails || !location) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            return NextResponse.json({ error: 'Server configuration error: Missing Relayer admin key' }, { status: 500 });
        }

        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545';

        // Connect to network directly (gasless for the user, project pays gas)
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

        // Call the contract function
        const tx = await contract.registerCrate(crateId, farmDetails, location);

        // Wait for it to be mined
        const receipt = await tx.wait();

        return NextResponse.json({
            success: true,
            transactionHash: receipt.hash
        });
    } catch (error: any) {
        console.error('Relayer API error:', error);
        return NextResponse.json({ error: error.message || 'Transaction failed' }, { status: 500 });
    }
}
