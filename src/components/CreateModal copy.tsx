import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program, deriveProposalPDA } from "./anchor/setup";
import { web3, BN } from "@coral-xyz/anchor";
import { Buffer } from "buffer";
import { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";
// import useCanvasWallet from "@/app/components/CanvasWalletProvider";
import { Proposal } from "@/app/page";
import { useCanvasClient } from "@/lib/useCanvasClient";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";
import { registerCanvasWallet } from "@dscvr-one/canvas-wallet-adapter";
import { encode } from "bs58";


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


  const [canvasClient, setCanvasClient] = useState<CanvasClient | null>(null);

 useEffect(() => {
        // const isIframe = () => {
        //     try {
        //         return window.self !== window.top;
        //     } catch (e) {
        //         return true;
        //     }
        // };

        // setIframe(isIframe());

        // if (isIframe()) {
            const client = new CanvasClient();
            registerCanvasWallet(client);
            setCanvasClient(client);
            console.log(client);
            console.log("CanvasClient initialized");
        // }
    }, []);


  console.log("demo");
  // const canvasClient1 = useCanvasClient();
  // console.log("client : ", canvasClient1.client);
  // const [canvasClient, setCanvasClient] = useState<CanvasClient | null>(null);
  // console.log("client2 : ", canvasClient);
  // async function makeReady(){
  //   await canvasClient?.ready();
  //   console.log("client2 : ", canvasClient);
  // }
  // makeReady();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState<number | "">("");
  const [proposal, setProposal] = useState<any>(null);
  const [failed, setFailed] = useState<any>(null);

  // const { connectWallet, walletAddress, signTransaction } = useCanvasWallet();
  const [proposalCreateLoading, setProposalCreateLoading] = useState(false);

  let publicKey = walletPublicKey;

  // if (walletAddress) {
  //   publicKey = new PublicKey(walletAddress);
  // }

  const proposalId = new BN(Date.now());

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!publicKey) return;
    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      // const walletSecret = [
      //   12, 210, 152, 23, 3, 69, 14, 50, 194, 93, 159, 13, 6, 66, 248, 59, 238, 183, 241, 12, 201, 67, 59, 22, 127, 48, 105, 117, 50, 99, 79, 254, 9, 185, 177,
      //   0, 10, 80, 91, 30, 246, 240, 177, 125, 7, 83, 128, 174, 38, 220, 71, 231, 43, 130, 253, 182, 16, 29, 233, 250, 246, 117, 221, 153,
      // ];
      // const keypair = Keypair.fromSecretKey(Uint8Array.from(walletSecret));
      // const { proposalPDA } = await deriveProposalPDA(keypair.publicKey, proposalId);
      const { proposalPDA } = await deriveProposalPDA(publicKey, proposalId);
      setProposal(proposalPDA.toString());
      console.log("Creating transaction...");

      // const str = "5k8z2CULieyqz6fnHUtimgLMYFsu1sYfw4HAPz9eVCdzu3cgJJgGSESABer7scFCWM8iHpdcAfJXXsKWegbvDVPM";
      // const encoder = new TextEncoder();
      // const uint8Array = encoder.encode(str);
      // console.log("unint8 keypair : ",uint8Array);
      // const keypair = Keypair.fromSecretKey(uint8Array);

      //@ts-ignore
      const trx = await program.methods.createProposal(title, description, proposalId, point)
        .accounts({
          proposal: proposalPDA,
          // user: keypair.publicKey,
          user: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        // .signers([keypair])
        .transaction();

     
      //             // Fetch the latest blockhash
      // const { blockhash } = await connection.getLatestBlockhash({ commitment: "confirmed" });
      // trx.recentBlockhash = blockhash;
      // trx.feePayer = publicKey;

      // //             // Serialize the transaction
      // const serializedTx = trx.serialize({
      //   requireAllSignatures: false,
      //   verifySignatures: false,
      // });

      // const base58Tx = encode(serializedTx);

      // //             // Sign and send the transaction via canvasClient
      // const results = await canvasClient?.signAndSendTransaction({
      //   unsignedTx: base58Tx,
      //   awaitCommitment: "confirmed",
      //   chainId: "solana:103",
      // });
      
      //   trx.feePayer=publicKey;
      //   trx.recentBlockhash=(await connection.getLatestBlockhash("confirmed")).blockhash;
      //   trx.lastValidBlockHeight=(await connection.getLatestBlockhash("confirmed")).lastValidBlockHeight;
      // await signTransaction(trx);
      // const confiemedTx=await sendAndConfirmTransaction(connection,trx,[keypair])
      // console.log(confiemedTx);
      // console.log("Transaction created:", trx);
      // console.log("Sending transaction...");

      // @ts-ignore
      // const signed=await signTransaction(trx);
      // console.log(signed);

      // let trxSign=await sendTransaction(signed, connection,{signers:[]});

      // let trxSign=await sendTransaction(trx, connection,{signers:[]});
      // console.log("Transaction confirmed:", trxSign);

      // let trxSign=await sendTransaction(trx, connection, { signers: [] });
      // const confirmation = await connection.confirmTransaction(trxSign, "confirmed");
      // console.log("Transaction confirmed:", confirmation);
      // let trxSign;
      // if (walletAddress) {
      //   trxSign = await signTransaction(trx);
      // } else {
      //   trxSign = await sendTransaction(trx, connection, { signers: [] });
      //   const confirmation = await connection.confirmTransaction(trxSign, "confirmed");
      //   console.log("Transaction confirmed:", confirmation);
      // }

      // console.log(`View on explorer: https://solana.fm/tx/${trxSign}?cluster=devnet-alpha`);

      // Save proposal data

      const proposalData = {
        name: title,
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
