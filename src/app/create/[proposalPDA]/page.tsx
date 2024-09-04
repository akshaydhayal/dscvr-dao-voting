"use client";
import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
import { program } from "@/components/anchor/setup";
import useCanvasWallet from "@/app/components/CanvasWalletProvider";
import Voting from "@/components/voting";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

interface ProposalType {
  title: string;
  description: string;
  votesFor: any;
  votesAgainst: any;
  votesAbstain: any;
}

const Proposals = () => {
  const { proposalPDA } = useParams();
  let { publicKey } = useWallet();
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ProposalType>();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasClientRef = useRef<CanvasClient | undefined>();
  const { connectWallet, walletAddress, iframe } = useCanvasWallet();

  if (iframe && walletAddress) {
    const pubKey = new PublicKey(walletAddress);
    publicKey = pubKey;
  }

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const proposal = await program.account.proposal.fetch(proposalPDA as string);
        setProposal(proposal);

        if (!publicKey) return;

        const voters = await program.account.voter.all();
        const userHasVoted = voters.some(
          (voter) => voter.account.user.equals(publicKey) && voter.account.proposal.equals(new PublicKey(proposalPDA as string))
        );
        setHasVoted(userHasVoted);
      } catch (error) {
        console.error("Error fetching proposal:", error);
      }
    };

    fetchProposal();
  }, [publicKey]);

  const refreshProposals = async () => {
    try {
      if (!publicKey) return;
      const voters = await program.account.voter.all();
      const userHasVoted = voters.some((voter) => voter.account.user.equals(publicKey) && voter.account.proposal.equals(new PublicKey(proposalPDA as string)));
      setHasVoted(userHasVoted);
    } catch (error) {
      console.error("Error refreshing proposals:", error);
    }
  };

  return (
    <>
      {publicKey || walletAddress ? (
        <>
          <Navbar />
          <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black bg-opacity-95 text-white animate-fadeIn">
            <div className="relative w-full max-w-4xl mx-auto p-4 bg-gradient-to-br from-gray-800 to-black border border-indigo-800 rounded-lg shadow-lg shadow-indigo-700 transform transition duration-500 hover:shadow-indigo-800">
              {proposal ? (
                <>
                  {/* Banner Section */}
                  <div className="relative w-full h-40 overflow-hidden rounded-lg shadow-lg">
                    <img src="/meta.png" alt="DAO Banner" className="object-cover w-full h-full opacity-80 transform transition duration-500 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                      <h1 className="text-5xl font-serif tracking-wide font-bold text-blue-400 drop-shadow-lg transform transition duration-500 hover:scale-105">
                        Solana DAO
                      </h1>
                    </div>
                  </div>

                  {/* Voting Section */}
                  <div className="mt-5 text-center">
                    <h2 className="text-3xl font-semibold text-yellow-200 mb-2 drop-shadow-md transform transition duration-500 font-mono">{proposal.title}</h2>
                    <p className="text-lg text-teal-100 mb-8 leading-relaxed transform transition duration-500">{proposal.description}</p>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 px-6 rounded-lg cursor-pointer shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
                        <h3 className="text-xl text-cyan-400 font-medium font-mono">Votes For:</h3>
                        <p className="text-4xl font-medium text-white mt-0 font-serif">{proposal.votesFor.toNumber()}</p>
                      </div>
                      <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-xl">
                        <h3 className="text-xl text-purple-400 font-medium font-mono">Votes Against:</h3>
                        <p className="text-4xl font-medium text-white mt-0 font-serif">{proposal.votesAgainst.toNumber()}</p>
                      </div>
                      <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-xl">
                        <h3 className="text-xl text-pink-400 font-medium font-mono">Votes Abstain:</h3>
                        <p className="text-4xl font-medium text-white mt-0 font-serif">{proposal.votesAbstain.toNumber()}</p>
                      </div>
                    </div>

                    <Voting proposalPDA={new PublicKey(proposalPDA as string)} voted={hasVoted} onVote={refreshProposals} />

                    {hasVoted && <p className="mt-6 text-red-500 font-semibold animate-bounce">You Have Voted</p>}
                  </div>
                </>
              ) : (
                <p className="text-center">Proposal not found</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="border hover:border-slate-900 rounded">
            {iframe ? <Button onClick={connectWallet}>Connect Wallet</Button> : <WalletMultiButton />}
          </div>
        </div>
      )}
    </>
  );
};

export default Proposals;






// "use client";
// import Navbar from "@/components/Navbar";
// import React from "react";

// interface VotingPollProps {
//   daoName: string;
//   bannerImage: string;
//   title: string;
//   description: string;
//   votesFor: number;
//   votesAgainst: number;
//   votesAbstain: number;
//   hasVoted: boolean;
//   onVote: (voteType: "for" | "against" | "abstain") => void;
// }

// const FullPageVotingPoll: React.FC<VotingPollProps> = ({
//   daoName = "Solana DAO",
//   bannerImage = "/meta.png",
//   title = "This is proposal title",
//   description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, quos.",
//   votesFor = 12,
//   votesAgainst = 11,
//   votesAbstain = 5,
//   hasVoted = false,
//   onVote,
// }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black bg-opacity-95 text-white animate-fadeIn">
//       <Navbar />
//       <div className="relative w-full mt-0 max-w-4xl mx-auto p-4 bg-gradient-to-br from-gray-800 to-black border border-indigo-800 rounded-lg shadow-lg shadow-indigo-700 transform transition duration-500  hover:shadow-indigo-800">
//         {/* Banner Section */}
//         <div className="relative w-full h-40 overflow-hidden rounded-lg shadow-lg">
//           <img src="/meta.png" alt="DAO Banner" className="object-cover w-full h-full opacity-80 transform transition duration-500 hover:scale-105" />
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
//           <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
//             <h1 className="text-5xl font-serif tracking-wide font-bold text-blue-400 drop-shadow-lg transform transition duration-500 hover:scale-105">
//               {daoName}
//             </h1>
//           </div>
//         </div>

//         {/* Voting Section */}
//         <div className="mt-5 text-center">
//           <h2 className="text-3xl font-semibold text-yellow-200 mb-2 drop-shadow-md transform transition duration-500 font-mono">{title}</h2>
//           <p className="text-lg text-teal-100 mb-8 leading-relaxed transform transition duration-500 ">{description}</p>

//           <div className="grid grid-cols-3 gap-6 mb-8">
//             <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 px-6 rounded-lg cursor-pointer shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
//               <h3 className="text-xl text-cyan-400 font-medium font-mono">Votes For:</h3>
//               <p className="text-4xl font-medium text-white mt-0 font-serif">{votesFor}</p>
//             </div>
//             <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-xl">
//               <h3 className="text-xl text-purple-400 font-medium font-mono">Votes Against:</h3>
//               <p className="text-4xl font-medium text-white mt-0 font-serif">{votesAgainst}</p>
//             </div>
//             <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-xl">
//               <h3 className=" text-pink-400 font-medium font-mono text-xl">Votes Abstain:</h3>
//               <p className="text-4xl text-white mt-0 font-medium font-serif">{votesAbstain}</p>
//             </div>
//           </div>

//           <div className="flex justify-center space-x-6">
//             <button
//               className={`px-6 py-3 rounded-full font-semibold text-white transition-transform transform ${
//                 hasVoted ? "bg-gray-600 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-500 hover:scale-105 shadow-lg hover:shadow-teal-400"
//               }`}
//               onClick={() => onVote("for")}
//               disabled={hasVoted}
//             >
//               Vote For
//             </button>
//             <button
//               className={`px-6 py-3 rounded-full font-semibold text-white transition-transform transform ${
//                 hasVoted ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500 hover:scale-105 shadow-lg hover:shadow-purple-400"
//               }`}
//               onClick={() => onVote("against")}
//               disabled={hasVoted}
//             >
//               Vote Against
//             </button>
//             <button
//               className={`px-6 py-3 rounded-full font-semibold text-white transition-transform transform ${
//                 hasVoted ? "bg-gray-600 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-500 hover:scale-105 shadow-lg hover:shadow-pink-400"
//               }`}
//               onClick={() => onVote("abstain")}
//               disabled={hasVoted}
//             >
//               Vote Abstain
//             </button>
//           </div>

//           {hasVoted && <p className="mt-6 text-red-500 font-semibold animate-bounce">You Have Voted</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FullPageVotingPoll;
