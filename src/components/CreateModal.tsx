import { Dispatch, SetStateAction, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program, deriveProposalPDA } from "./anchor/setup";
import { web3, BN } from "@coral-xyz/anchor";
import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
// import useCanvasWallet from "@/app/components/CanvasWalletProvider";
import { Proposal } from "@/app/page";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  setProposall:Dispatch<SetStateAction<Proposal[]>>;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ isOpen, onClose, setProposall }) => {
  const { publicKey: walletPublicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState<number | "">("");
  const [proposal, setProposal] = useState<any>(null);
  const [failed, setFailed] = useState<any>(null);

  // const { connectWallet, walletAddress, signTransaction } = useCanvasWallet();
  const [proposalCreateLoading,setProposalCreateLoading]=useState(false);

  let publicKey = walletPublicKey;

  // if (walletAddress) {
  //   publicKey = new PublicKey(walletAddress);
  // }

  const proposalId = new BN(Date.now());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!publicKey) return;
    try {
      const { proposalPDA } = await deriveProposalPDA(publicKey, proposalId);
      setProposal(proposalPDA.toString());
      console.log("Creating transaction...");
      //@ts-ignore
      const trx = await program.methods.createProposal(title, description, proposalId, point)
        .accounts({
          proposal: proposalPDA,
          user: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();

      console.log("Transaction created:", trx);

      console.log("Sending transaction...");
      let trxSign=await sendTransaction(trx, connection, { signers: [] });
      const confirmation = await connection.confirmTransaction(trxSign, "confirmed");
      console.log("Transaction confirmed:", confirmation);
      // let trxSign;
      // if (walletAddress) {
      //   trxSign = await signTransaction(trx);
      // } else {
      //   trxSign = await sendTransaction(trx, connection, { signers: [] });
      //   const confirmation = await connection.confirmTransaction(trxSign, "confirmed");
      //   console.log("Transaction confirmed:", confirmation);
      // }

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
        setProposalCreateLoading(false);
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
        <form onSubmit={handleSubmit} className="space-y-0">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              placeholder="Proposal Title (20 chars limit)"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-slate-700 placeholder:text-slate-500 placeholder:text-sm border border-gray-300 p-2 rounded"
              required maxLength={20}
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
            {!proposalCreateLoading ? (
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
            )}

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
