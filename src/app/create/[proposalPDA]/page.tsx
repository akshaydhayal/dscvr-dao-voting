"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createVoteAsset } from "@/components/createVoteAsset";
import { useCanvasClient } from "@/lib/useCanvasClient";

interface ProposalType {
  title: string;
  description: string;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  voters: string[];
}

const Proposals = () => {
  const { proposalPDA } = useParams();
  const { publicKey } = useWallet();
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ProposalType | null>(null);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [nftMintStatus, setNftMintStatus] = useState(false);

  const [forVote, setForVote] = useState(0);
  const [againstVote, setAgainstVote] = useState(0);
  const [abstainVote, setAbstainVote] = useState(0);
  
  const { client } = useCanvasClient();
  const wallet = useWallet();

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch("/api/saveproposal");
        const proposals = await res.json();

        const proposal = proposals.find((p: any) => p.address === proposalPDA);
        if (!proposal) {
          console.error("Proposal not found");
          return;
        }

        setProposal(proposal);
        setForVote(proposal.votes.for);
        setAgainstVote(proposal.votes.against);
        setAbstainVote(proposal.votes.abstain);

        if (!publicKey) return;

        setHasVoted(proposal.voters.includes(publicKey.toBase58()));
      } catch (error) {
        console.error("Error fetching proposal:", error);
      }
    };
    fetchProposal();
  }, [publicKey, voteSuccess, proposalPDA]);

  const vote = async (voteType: "for" | "against" | "abstain") => {
    if (hasVoted) return alert("You have already voted!");

    try {
      if (!publicKey) {
        alert("Connect your wallet to vote");
        return;
      }

      const voteCount = { for: forVote, against: againstVote, abstain: abstainVote };
      if (voteType === "for") voteCount.for += 1;
      else if (voteType === "against") voteCount.against += 1;
      else if (voteType === "abstain") voteCount.abstain += 1;

      const nftTx = await createVoteAsset(wallet, setNftMintStatus);
      if (!nftTx) return;

      const putReqBody = {
        address: proposalPDA,
        votes: voteCount,
        voterAddress: publicKey.toBase58(),
      };

      const response = await fetch("/api/saveproposal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(putReqBody),
      });
      const data = await response.json();
      console.log("Response data:", data);

      // Update local state after successful vote
      if (data.message === "Votes and voter updated successfully!") {
        if (voteType === "for") setForVote((prev) => prev + 1);
        else if (voteType === "against") setAgainstVote((prev) => prev + 1);
        else if (voteType === "abstain") setAbstainVote((prev) => prev + 1);

        setHasVoted(true);
        setVoteSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-black via-gray-900 to-black bg-opacity-95">
      <div className="min-h-screen text-white animate-fadeIn">
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
                    <p className="text-4xl font-medium text-white mt-0 font-serif">{forVote}</p>
                  </div>
                  <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-xl">
                    <h3 className="text-xl text-purple-400 font-medium font-mono">Votes Against:</h3>
                    <p className="text-4xl font-medium text-white mt-0 font-serif">{againstVote}</p>
                  </div>
                  <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-xl">
                    <h3 className="text-xl text-pink-400 font-medium font-mono">Votes Abstain:</h3>
                    <p className="text-4xl font-medium text-white mt-0 font-serif">{abstainVote}</p>
                  </div>
                </div>

                {!hasVoted ? (
                  <>
                    <Button onClick={() => vote("for")}>Vote For</Button>
                    <Button onClick={() => vote("against")}>Vote Against</Button>
                    <Button onClick={() => vote("abstain")}>Vote Abstain</Button>
                  </>
                ) : (
                  <p className="mt-6 text-red-500 font-semibold animate-bounce">You Have Voted</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-center">Proposal Loading</p>
          )}
        </div>
      </div>

      {!publicKey && (
        <div className="w-screen h-screen absolute top-0 backdrop-blur-md flex justify-center items-center">
          <div className="flex gap-2 items-center bg-[#121212] justify-center border w-80 h-24 border-slate-600">
            <div className="hover:border-slate-900 rounded">
              <p className="text-lg text-slate-300 p-1 px-2">Connect Wallet to Vote</p>
            </div>
            {/* @ts-ignore */}
            {/* <button className="bg-white text-black p-1 px-4" onClick={() => setBtnClickedWithoutConnect(false)}>
              Close
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Proposals;

// "use client";
// import React, { useState, useEffect } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { useParams } from "next/navigation";
// import Navbar from "@/components/Navbar";
// import { Button } from "@/components/ui/Button";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import { createVoteAsset } from "@/components/createVoteAsset";
// import { useCanvasClient } from "@/lib/useCanvasClient";

// interface ProposalType {
//   title: string;
//   description: string;
//   votesFor: number;
//   votesAgainst: number;
//   votesAbstain: number;
// }

// const Proposals = () => {
//   const { proposalPDA } = useParams();
//   let { publicKey } = useWallet();
//   const [hasVoted, setHasVoted] = useState<boolean>(false);
//   const [proposal, setProposal] = useState<ProposalType>();

//   const [voteSuccess, setVoteSuccess] = useState(false);
//   const [forVote, setForVote] = useState(0);
//   const [againstVote, setAgainstVote] = useState(0);
//   const [abstainVote, setAbstainVote] = useState(0);
//   const [nftMintStatus, setNftMintStatus] = useState(false);

//   console.log("public key: ", publicKey);
//   console.log("hasVoted : ",hasVoted);

//   const { client } = useCanvasClient();
//   const wallet = useWallet();
//   if (!wallet) {
//     console.log("Wallet not connected");
//   }
//   console.log("wallet : ", wallet);

//   async function handleClick() {
//     await client?.connectWallet("solana:103");
//   }

//   useEffect(() => {
//     const fetchProposal = async () => {
//       try {
//         const res = await fetch("/api/saveproposal");
//         const proposals = await res.json();

//         const proposal = proposals.find((p: any) => p.address === proposalPDA); // Assuming proposals have an `id` field
//         console.log("proposal found : ",proposal);
//         if (!proposal) {
//           console.error("Proposal Loading");
//           return;
//         }

//         setForVote(proposal.votes.for);
//         setAgainstVote(proposal.votes.against);
//         setAbstainVote(proposal.votes.abstain);
//         setProposal(proposal);

//         if (!publicKey) return;

//         // Assuming you are managing voted users in the backend as well
//         console.log("voters address : ",proposal.voters)
//         proposal.voters.forEach((add:string)=>{
//           console.log("proposal voters address : ",add," self address : ",publicKey.toBase58());
//           if(add==publicKey.toBase58()){
//             setHasVoted(true);
//           }
//         })
//       } catch (error) {
//         console.error("Error fetching proposal:", error);
//       }
//     };
//     setHasVoted(false);
//     fetchProposal();
//   }, [publicKey, voteSuccess]);

//   const vote = async (voteType: "for" | "against" | "abstain") => {
//     if (hasVoted) return alert("You have already voted!");

//     try {
//       if (!publicKey) {
//         alert("Connect your wallet to vote");
//         return;
//       }
//       let voteCount;
//       if(voteType=="for"){
//         voteCount={for:forVote+1,against:againstVote,abstain:abstainVote};
//       }else if(voteType=="against"){
//         voteCount={for:forVote,against:againstVote+1,abstain:abstainVote};
//       }else if(voteType=="abstain"){
//         voteCount={for:forVote,against:againstVote,abstain:abstainVote+1};
//       }

//       const nftTx=await createVoteAsset(wallet, setNftMintStatus);
//       console.log("nftTx : ",nftTx);
//       if(!nftTx) return;
//       const putReqBody = {
//         address: proposalPDA,
//         votes: voteCount,
//         voterAddress: publicKey.toBase58(),
//       };
//       console.log("putReqBody : ",putReqBody);
//       // You can now handle the vote logic by making a POST request to update the votes in your backend
//       const response=await fetch("/api/saveproposal", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(putReqBody),
//       });
//       const data=await response.json();
//       // console.log("response : ",response);
//       console.log("response : ",data);
//       voteType=="for"?setForVote(old=>old+1):(voteType=="against"?setAgainstVote(old=>old+1):setAbstainVote(old=>old+1));
//       setHasVoted(true);
//       setVoteSuccess(true);
//     } catch (error) {
//       console.error("Error submitting vote:", error);
//     }
//   };

//   const [btnClickedWithoutConnect, setBtnClickedWithoutConnect] = useState(false);

//   return (
//     <div className="relative bg-gradient-to-b from-black via-gray-900 to-black bg-opacity-95">
//       <div className="min-h-screen text-white animate-fadeIn">
//         <div className="relative w-full max-w-4xl mx-auto p-4 bg-gradient-to-br from-gray-800 to-black border border-indigo-800 rounded-lg shadow-lg shadow-indigo-700 transform transition duration-500 hover:shadow-indigo-800">
//           {proposal ? (
//             <>
//               {/* Banner Section */}
//               <div className="relative w-full h-40 overflow-hidden rounded-lg shadow-lg">
//                 <img src="/meta.png" alt="DAO Banner" className="object-cover w-full h-full opacity-80 transform transition duration-500 hover:scale-105" />
//                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
//                 <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
//                   <h1 className="text-5xl font-serif tracking-wide font-bold text-blue-400 drop-shadow-lg transform transition duration-500 hover:scale-105">
//                     Solana DAO
//                   </h1>
//                 </div>
//               </div>

//               {/* Voting Section */}
//               <div className="mt-5 text-center">
//                 <h2 className="text-3xl font-semibold text-yellow-200 mb-2 drop-shadow-md transform transition duration-500 font-mono">{proposal.title}</h2>
//                 <p className="text-lg text-teal-100 mb-8 leading-relaxed transform transition duration-500">{proposal.description}</p>

//                 <div className="grid grid-cols-3 gap-6 mb-8">
//                   <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 px-6 rounded-lg cursor-pointer shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
//                     <h3 className="text-xl text-cyan-400 font-medium font-mono">Votes For:</h3>
//                     <p className="text-4xl font-medium text-white mt-0 font-serif">{forVote}</p>
//                   </div>
//                   <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-xl">
//                     <h3 className="text-xl text-purple-400 font-medium font-mono">Votes Against:</h3>
//                     <p className="text-4xl font-medium text-white mt-0 font-serif">{againstVote}</p>
//                   </div>
//                   <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-xl">
//                     <h3 className="text-xl text-pink-400 font-medium font-mono">Votes Abstain:</h3>
//                     <p className="text-4xl font-medium text-white mt-0 font-serif">{abstainVote}</p>
//                   </div>
//                 </div>

//                 {!hasVoted ? (
//                   <>
//                     <Button onClick={() => vote("for")}>Vote For</Button>
//                     <Button onClick={() => vote("against")}>Vote Against</Button>
//                     <Button onClick={() => vote("abstain")}>Vote Abstain</Button>
//                   </>
//                 ) : (
//                   <p className="mt-6 text-red-500 font-semibold animate-bounce">You Have Voted</p>
//                 )}
//               </div>
//             </>
//           ) : (
//             <p className="text-center">Proposal Loading</p>
//           )}
//         </div>
//       </div>

//       {!publicKey && btnClickedWithoutConnect && (
//         <div className="w-screen h-screen absolute top-0 backdrop-blur-md flex justify-center items-center">
//           <div className="flex gap-2 items-center bg-[#121212] justify-center border w-80 h-24 border-slate-600">
//             <div className="hover:border-slate-900 rounded">
//               <p className="text-lg text-slate-300 p-1 px-2">Connect Wallet to Vote</p>
//             </div>
//             <button className="bg-white text-black p-1 px-4" onClick={() => setBtnClickedWithoutConnect(false)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Proposals;
