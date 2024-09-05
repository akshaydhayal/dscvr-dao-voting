"use client";

import CreateProposalModal from "@/components/CreateModal";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Proposal {
  name: string;
  description: string;
}

interface HomepageProps {
  daoName: string;
  daoDescription: string;
  proposals: Proposal[];
}

const DarkRetroThemeHomepage: React.FC<HomepageProps> = () => {
  const [proposals, setProposal] = useState<Proposal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalsLoading,setProposalsLoading]=useState(true);
  console.log("propo loading : ",proposalsLoading);
  const router=useRouter();

  useEffect(() => {
    async function getProposals() {
      const response = await fetch("/api/saveproposal", {
        method: "GET",
      });
      const data = await response.json();
      if (data) {
        setProposal(data);
        setProposalsLoading(false);
      }
    }
    getProposals();
  }, []);

  const daoName = "Solana DAO";
  const daoDescription =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus odio non perferendis vitae et dolorem ipsam inventore distinctio atque eligendi.";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="w-full bg-[#121212] text-gray-100 min-h-screen">
      {isModalOpen && <CreateProposalModal isOpen={isModalOpen} onClose={closeModal} setProposall={setProposal} />}

      <Navbar />

      {/* Create Proposal Button */}

      {/* Banner Section */}
      <div className="relative w-full h-48 overflow-hidden rounded-b-lg shadow-lg">
        <img src="/meta.png" alt="DAO Banner" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-5xl font-serif tracking-wide font-bold text-blue-400 drop-shadow-lg transform transition duration-500 hover:scale-105">
            {daoName}
          </h1>
          {/* <h1 className="text-6xl font-mono tracking-wide font-bold text-blue-300">{daoName}</h1> */}
          <p className="text-lg mt-5 text-slate-300">{daoDescription}</p>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="container max-w-4xl mx-auto mt-12 px-4 ">
        <div className="flex items-center justify-between mb-4 pr-4">
          <h2 className="text-3xl font-semibold text-violet-400">Proposals</h2>
          <button
            className="bg-green-600 font-semibold text-lg text-slate-800 px-4 py-[6px] rounded-full shadow-lg hover:bg-teal-600 transition"
            onClick={openModal}
          >
            Create Proposal
          </button>
        </div>
        <div className="space-y-6">
          {/* {proposals.length > 0 && proposals.map((proposal, index) => ( */}
          {proposalsLoading? 
          <div className="flex items-center gap-8 justify-center mt-16">
            <h2 className="text-2xl font-bold text-slate-300 font-mono">Loading Proposals</h2>
            <div className="loader border-b-4 border-blue-500 border-solid rounded-full w-8 h-8 animate-spin"></div>
          </div>:(
          proposals.map((proposal, index) => (
          <div className="bg-gradient-to-b from-gray-700 to-gray-900 border border-slate-700 p-4 rounded-lg shadow-lg 
          cursor-pointer transform transition duration-500 hover:scale-[1.03] hover:shadow-xl"
            onClick={() => router.push(`/create/${proposal.address}`)}
            key={index}
          >
            <h3 className="text-2xl text-purple-400 font-semibold font-serif">{proposal.name}</h3>
            {/* <p className="text-4xl font-medium text-white mt-0 font-serif">{proposal.votesAgainst.toNumber()}</p> */}
            <p className="text-lg font-medium text-slate-100 mt-2 font-mono tracking-tighter">
              {proposal.description}
            </p>
          </div>
              // <div
              //   onClick={() => router.push(`/create/${proposal.address}`)}
              //   key={index}
              //   className="p-6 bg-gray-800 rounded-xl shadow-md shadow-slate-600 border hover:border-2 cursor-pointer border-gray-500 hover:bg-gray-700 transition-all duration-300"
              // >
              //   <h3 className="text-2xl font-semibold text-blue-300">{proposal.name}</h3>
              //   <p className="mt-2 text-slate-300">{proposal.description}</p>
              // </div>
            ))
            )}
        </div>
      </div>
    </section>
  );
};

export default DarkRetroThemeHomepage;

// "use client"
// import Dashboard from "@/components/Dashboard";
// import Proposals from "@/components/Proposals";
// import Image from "next/image";
// import { useWallet } from '@solana/wallet-adapter-react';
// import { Buffer } from 'buffer';
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import Navbar from "@/components/Navbar";
// import CreateProposal from "@/components/create";
// import useCanvasWallet from '@/app/components/CanvasWalletProvider';
// import { Button } from "@/components/ui/Button";
// import { PublicKey } from "@solana/web3.js";
// import Head from "next/head";
// // import { CanvasClient } from "@dscvr-one/canvas-client-sdk";

// if (typeof window !== 'undefined') {
//   window.Buffer = Buffer;
// }

// export default function Home() {
//   let { publicKey } = useWallet();
//   const { connectWallet, walletAddress, iframe } = useCanvasWallet();
//   // if (walletAddress) {
//   //   const pubKey = new PublicKey(walletAddress)
//   //   publicKey = pubKey
//   // }

//   return (

//       <>
//         {(publicKey || walletAddress) ?
//           (
//             <>
//               <Navbar />
// <CreateProposal />
//               {/* <Proposals /> */}
//             </>
//           ) : (
//             <div className="flex items-center justify-center min-h-screen">
//               <div className="border hover:border-slate-900 rounded">
//                 {iframe ? <Button onClick={connectWallet}>Connect Wallet</Button> : <WalletMultiButton style={{}} />}
//               </div>
//             </div>
//           )
//         }
//       </>
//   );
// }
