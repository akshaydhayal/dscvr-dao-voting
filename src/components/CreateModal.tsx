import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program, deriveProposalPDA } from "./anchor/setup";
import { web3, BN } from "@coral-xyz/anchor";
import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
import useCanvasWallet from "@/app/components/CanvasWalletProvider";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ isOpen, onClose, setProposall }) => {
  const { publicKey: walletPublicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState<number | "">("");
  const [proposal, setProposal] = useState<any>(null);
  const [failed, setFailed] = useState<any>(null);
  const { connectWallet, walletAddress, signTransaction } = useCanvasWallet();

  let publicKey = walletPublicKey;

  if (walletAddress) {
    publicKey = new PublicKey(walletAddress);
  }

  const proposalId = new BN(Date.now());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!publicKey) return;
    try {
      const { proposalPDA } = await deriveProposalPDA(publicKey, proposalId);
      setProposal(proposalPDA.toString());
      console.log("Creating transaction...");
      const trx = await program.methods
        .createProposal(title, description, proposalId, point)
        .accounts({
          proposal: proposalPDA,
          user: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();

      console.log("Transaction created:", trx);

      console.log("Sending transaction...");
      let trxSign;
      if (walletAddress) {
        trxSign = await signTransaction(trx);
      } else {
        trxSign = await sendTransaction(trx, connection, { signers: [] });
        const confirmation = await connection.confirmTransaction(trxSign, "confirmed");
        console.log("Transaction confirmed:", confirmation);
      }

      console.log(`View on explorer: https://solana.fm/tx/${trxSign}?cluster=devnet-alpha`);

      // Save proposal data
      const proposalData = {
        name:title,
        description,
        address: proposalPDA.toString(),
      };

      const response = await fetch("/api/saveproposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposalData),
      });

      if (response.ok) {
        console.log("Proposal saved successfully");
        setProposall(old=>[...old,proposalData]);
        onClose(); // Close the modal after success
      } else {
        console.error("Failed to save proposal");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      setFailed(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 border">
      <div className="p-8 rounded-lg shadow-md shadow-slate-400 w-1/2 bg-[#121212] mx-auto ">
        <h2 className="text-2xl font-semibold mb-4">Create New Proposal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input type="text" value={title} placeholder="Enter Proposal title" onChange={(e) => setTitle(e.target.value)} className="w-full text-slate-700 placeholder:text-slate-500 placeholder:text-sm border border-gray-300 p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea value={description} placeholder="Write about proposal" onChange={(e) => setDescription(e.target.value)} className="w-full text-slate-800 placeholder:text-slate-500 placeholder:text-sm border border-gray-300 p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Points</label>
            <input type="number" placeholder="Enter points" value={point} onChange={(e) => setPoint(e.target.value)} className="w-full border text-slate-800 placeholder:text-slate-500 placeholder:text-sm border-gray-300 p-2 rounded" required />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-medium  rounded-md">
              Create Proposal
            </button>
            <button type="button" onClick={onClose} className="bg-slate-600 px-5 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
        {proposal && (
          <p>
            Your proposal link (valid if transaction is successful): {process.env.NEXT_PUBLIC_URL}/voting/{proposal}
          </p>
        )}
        {failed && <p className="text-red-500">Error: {failed.message}</p>}
      </div>
    </div>
  );
};

export default CreateProposalModal;
