"use client";

import Navbar from "@/components/Navbar";
import React from "react";

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
  const daoName = "Solana DAO";
  const daoDescription =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus odio non perferendis vitae et dolorem ipsam inventore distinctio atque eligendi.";
  const proposals = [
    {
      name: "Increase Funding for Development",
      description: "Propose to increase the funding for the development team to accelerate project milestones and enhance product features.",
    },
    {
      name: "New Marketing Campaign",
      description: "Introduce a new marketing campaign to boost the DAO's visibility and attract more community members and stakeholders.",
    },
    {
      name: "Partnership with XYZ Corp",
      description: "Form a strategic partnership with XYZ Corp to leverage their technology and expand our DAO's influence in the industry.",
    },
    {
      name: "Upgrade Infrastructure",
      description: "Upgrade the DAO's infrastructure to improve performance and scalability, ensuring a smoother user experience and robust security.",
    },
    {
      name: "Community Outreach Program",
      description:
        "Launch a community outreach program to engage with local and global communities, fostering stronger relationships and support for the DAO's initiatives.",
    },
  ];

  return (

    // <section className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-gray-100">
    <section className="w-full bg-[#121212] text-gray-100">
        <Navbar/>
      {/* Banner Section */}
      <div className="relative w-full h-48 overflow-hidden rounded-b-lg shadow-lg">
        <img src="/meta.png" alt="DAO Banner" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"> */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl font-mono tracking-wide font-bold text-blue-300">{daoName}</h1>
          <p className="text-lg mt-5 text-slate-300">{daoDescription}</p>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="container max-w-4xl mx-auto mt-12 px-4">
        <h2 className="text-3xl font-semibold text-violet-400 mb-6">Proposals</h2>
        <div className="space-y-6">
          {proposals.map((proposal, index) => (
            <div key={index} className="p-6 bg-gray-800 rounded-xl shadow-md shadow-slate-600 border hover:border-2 cursor-pointer border-gray-500 hover:bg-gray-700 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-blue-300">{proposal.name}</h3>
              <p className="mt-2 text-slate-300">{proposal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DarkRetroThemeHomepage;



