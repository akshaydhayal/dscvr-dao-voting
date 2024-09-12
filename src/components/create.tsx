import React from 'react'

const create = () => {
  return (
    <div>create</div>
  )
}

export default create

// import { useEffect, useState } from "react";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { program, deriveProposalPDA } from "./anchor/setup";
// import { web3, BN } from "@coral-xyz/anchor";
// import { Buffer } from 'buffer';
// import Dashboard from "./Dashboard";
// import useCanvasWallet from '@/app/components/CanvasWalletProvider';
// import { PublicKey, Transaction } from "@solana/web3.js";

// if (typeof window !== 'undefined') {
//     window.Buffer = Buffer;
// }


// const CreateProposal = () => {
//     const { publicKey: walletPublicKey, sendTransaction } = useWallet();
//     const { connection } = useConnection();
//     const [proposal, setProposal] = useState<any>(null);
//     const [failed, setFailed] = useState<any>(null);
//     const { connectWallet, walletAddress, iframe, signTransaction } = useCanvasWallet();


//     let publicKey = walletPublicKey;

//     if (walletAddress) {
//         publicKey = new PublicKey(walletAddress);
//     }


//     const proposalId = new BN(Date.now());

//     const createProposal = async (title: string, description: string, point: number) => {
//         if (!publicKey) return;
//         // console.log(publicKey)
//         try {
//           const { proposalPDA } = await deriveProposalPDA(publicKey, proposalId);
//           setProposal(proposalPDA.toString());
//           console.log("Creating transaction...");
//           const trx = await program.methods
//             .createProposal(title, description, proposalId, point)
//             .accounts({
//               proposal: proposalPDA,
//               user: publicKey,
//               systemProgram: web3.SystemProgram.programId,
//             })
//             .transaction();

//           console.log("Transaction created:", trx);

//           console.log("Sending transaction...");
//           let trxSign;
//           if (walletAddress) {
//             trxSign = await signTransaction(trx);
//           } else {
//             trxSign = await sendTransaction(trx, connection, { signers: [] });
//             const confirmation = await connection.confirmTransaction(trxSign, "confirmed");
//             console.log("Transaction confirmed:", confirmation);
//           }

//           console.log(`View on explorer: https://solana.fm/tx/${trxSign}?cluster=devnet-alpha`);
//           // Save proposal data
//           const proposalData = {
//             title,
//             description,
//             address: proposalPDA.toString(),
//           };

//           const response = await fetch("/api/saveproposal", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(proposalData),
//           });

//           if (response.ok) {
//             console.log("Proposal saved successfully");
//           } else {
//             console.error("Failed to save proposal");
//           }
//         } catch (error) {
//             console.error('Error creating proposal:', error);
//             setFailed(error)
//         }
//     };





//     return (
//         <>
//             <Dashboard createProposal={createProposal} />
//             {proposal ? <p>Your poll link (the link will be valid if your transaction is success): {process.env.NEXT_PUBLIC_URL}/voting/{proposal}</p> : ""}
//             {failed && <p>Error: {failed.message}</p>}
//         </>
//     );
// }

// export default CreateProposal;
