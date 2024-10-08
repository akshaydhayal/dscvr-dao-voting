import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program, deriveProposalPDA } from "./anchor/setup";
import { web3, BN } from "@coral-xyz/anchor";
import { Buffer } from "buffer";
import { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";
// import useCanvasWallet from "@/app/components/CanvasWalletProvider";
import { Proposal } from "@/app/page";
// import { useCanvasClient } from "@/lib/useCanvasClient";
// import { CanvasClient } from "@dscvr-one/canvas-client-sdk";
// import { registerCanvasWallet } from "@dscvr-one/canvas-wallet-adapter";
import { encode } from "bs58";
import { createProposalAsset } from "./createProposalAsset";
import { useCanvasClient } from "@/lib/useCanvasClient";


if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  setProposall:Dispatch<SetStateAction<Proposal[]>>;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ isOpen, onClose, setProposall }) => {
  const { publicKey: walletPublicKey, sendTransaction, signTransaction } = useWallet();
  // const { connection } = useConnection();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");


  // const [canvasClient, setCanvasClient] = useState<CanvasClient | null>(null);



  console.log("demo");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState<number | "">("");
  const [proposal, setProposal] = useState<any>(null);
  const [failed, setFailed] = useState<any>(null);

  // const { connectWallet, walletAddress, signTransaction } = useCanvasWallet();
  const [proposalCreateLoading, setProposalCreateLoading] = useState(false);

  let publicKey = walletPublicKey;

  
  const proposalId = new BN(Date.now());

   const { client } = useCanvasClient();
   // client.co
   const wallet = useWallet();
  //  const { publicKey } = useWallet();
   if (!wallet) {
     console.log("Wallet not connected");
     // wallet.connect()
   }
   console.log("wallet : ", wallet);

   async function handleClick() {
     await client?.connectWallet("solana:103");
   }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!publicKey) return;
    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      handleClick();
      const nftTx=await createProposalAsset(wallet, setNftMintStatus);
      // Save proposal data
      if(!nftTx) return;
      const proposalData = {
        name: title,
        description,
        address: publicKey.toBase58(),
      };

      const response = await fetch("/api/saveproposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposalData),
      });

      if (response) {
        console.log("Proposal saved successfully");
        setProposalCreateLoading(false);
        setProposall((old) => [...old, proposalData]);
        onClose(); // Close the modal after success
      } else {
        console.error("Failed to save proposal");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      setFailed(error);
    }
  };

  const [nftMintStatus, setNftMintStatus] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 border">
      <div className="p-8 rounded-lg shadow-md shadow-slate-400 w-1/2 bg-[#121212] mx-auto ">
        <h2 className="text-2xl font-semibold mb-4">Create New Proposal</h2>
        <form onSubmit={handleSubmit} className="space-y-0">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              placeholder="Proposal Title (20 chars limit)"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-slate-700 placeholder:text-slate-500 placeholder:text-sm border border-gray-300 p-2 rounded"
              required
              maxLength={20}
            />
            <div className="text-right text-xs text-slate-200 mt-0">{title.length}/20 characters</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              placeholder="Description (120 characters limit)"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-slate-800 placeholder:text-slate-500 placeholder:text-sm border border-gray-300 p-2 rounded"
              required
              maxLength={100}
            />
            <div className="text-right text-xs text-slate-200 mt-0">{description.length}/100 characters</div>
          </div>
          <div className="">
            <label className="block text-sm font-medium mb-2">Points</label>
            <input
              type="number"
              placeholder="Enter points"
              value={point}
              onChange={(e) => setPoint(Number(e.target.value))}
              className="w-full border text-slate-800 placeholder:text-slate-500 placeholder:text-sm border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="flex justify-between mt-4">
            {/* {!proposalCreateLoading ? (
              <button
                type="submit"
                className="px-4 py-2 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium  rounded-md"
                onClick={(e) => {
                  setProposalCreateLoading(true);
                  //@ts-ignore
                  handleSubmit(e);
                }}
              >
                Create Proposal
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-blue-600 py-2 mt-4 px-2 justify-center rounded-md">
                <h2 className="text-lg font-medium text-white ">Creating Proposal</h2>
                <div className="loader border-b-4  border-slate-100 rounded-full w-6 h-6 animate-spin"></div>
              </div>
            )} */}

            <button type="submit"
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 
        px-4 rounded"
            >
              Create Proposal+Mint
            </button>

            <button type="button" onClick={onClose} className="bg-slate-600 mt-4 px-5 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
        {failed && <p className="text-red-500">Error: {failed.message}</p>}
      </div>
    </div>
  );
};

export default CreateProposalModal;
