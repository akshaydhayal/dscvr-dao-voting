// src/app/api/proposals/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import ProposalModel from "@/models/Proposal";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const proposals = await ProposalModel.find({});
    return NextResponse.json(proposals, { status: 200 });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}




export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const proposalData = await req.json();
    const newProposal = new ProposalModel({ ...proposalData, votes: { for: 0, against: 0, abstain: 0 }, voters: [] });

    await newProposal.save();
    return NextResponse.json({ message: "Proposal saved successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving proposal:", error);
    return NextResponse.json({ message: "Internal Server Error",error:error }, { status: 500 });
  }
}



export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const { address, votes, voterAddress } = await req.json();
    const proposal = await ProposalModel.findOne({ address });

    if (!proposal) {
      return NextResponse.json({ message: "Proposal not found" }, { status: 404 });
    }

    proposal.votes = votes;
    proposal.voters.push(voterAddress);

    await proposal.save();
    return NextResponse.json({ message: "Votes and voter updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating votes:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from 'next/server';
// import { writeFile } from "fs/promises";
// import { readFile } from "fs/promises"; // Use fs/promises for async/await support
// import path from "path";
// import fs from "fs";
// import { error } from 'console';

// interface Proposal {
//   title: string;
//   description: string;
//   address: string;
// }

// export async function GET(req: NextRequest) {
//   try {
//     const dataFilePath = path.join(process.cwd(), "src/proposalsData.ts");
//     console.log("Data file path:", dataFilePath);

//     // Read the file contents
//     const data = await readFile(dataFilePath, "utf-8");

//     // Assuming the file is JSON formatted, parse it
//     const proposals = JSON.parse(data);

//     return NextResponse.json(proposals, { status: 200 });
//   } catch (error) {
//     console.error("Error reading file:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//     try {
//       const dataFilePath = path.join(process.cwd(), "src/proposalsData.ts");
//     //   console.log(await req.json());
//       console.log(dataFilePath);

//       const proposal = await req.json();
//       fs.readFile(dataFilePath,'utf-8',(err,data)=>{
//         if(err) {
//             console.log(err);
//         }else{
//             console.log(data);
//         }

//       })

//     //   Read the current data from data.ts
//       let data = "";
//       try {
//         data = await (await import("fs/promises")).readFile(dataFilePath, "utf8");
//         console.log('data : ',data);
//       } catch (err) {
//         // File may not exist yet, handle accordingly
//         data = "[]"; // Initialize with empty array
//       }

//       const proposals: Proposal[] = JSON.parse(data);
//       console.log("pp ; ",proposals);
//       proposals.push({...proposal,voters:[],votes:{for:0,against:0,abstain:0}});

//       // Write the updated data back to data.ts
//       const updatedData = JSON.stringify(proposals, null, 2);
//       await writeFile(dataFilePath, updatedData, "utf8");

//       return NextResponse.json({ message: "Proposal saved successfully!" },{status:200});
//     } catch (error) {
//       console.error("Error saving proposal:", error);
//       return NextResponse.json({ message: "Internal Server Error" },{status:500});
//     }

// }

// interface Proposal {
//   address: string;
//   title: string;
//   description: string;
//   votes: {
//     for: number;
//     against: number;
//     abstain: number;
//   };
// }

// // PUT: Update vote count for a specific proposal
// // export async function PUT(req: NextRequest) {
// //   try {
// //     const dataFilePath = path.join(process.cwd(), "src/proposalsData.ts");

// //     // Parse the incoming request body
// //     const { address, votes } = await req.json();
// //     console.log(address,votes);

// //     // Read the current proposals data from the file
// //     let data = await readFile(dataFilePath, "utf-8");
// //     console.log("current propsals: ",data);
// //     const proposals: Proposal[] = JSON.parse(data);

// //     // Find the proposal by ID and update the vote count
// //     const proposalIndex = proposals.findIndex((p) => p.address === address);
// //     if (proposalIndex === -1) {
// //       return NextResponse.json({ message: "Proposal not found" }, { status: 404 });
// //     }

// //     proposals[proposalIndex].votes = votes;

// //     // Write the updated proposals data back to the file
// //     const updatedData = JSON.stringify(proposals, null, 2);
// //     await writeFile(dataFilePath, updatedData, "utf8");

// //     return NextResponse.json({ message: "Votes updated successfully!" }, { status: 200 });
// //   } catch (error) {
// //     console.error("Error updating votes:", error);
// //     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
// //   }
// // }

// // Define the Proposal interface
// interface Proposal {
//   address: string;
//   title: string;
//   description: string;
//   votes: {
//     for: number;
//     against: number;
//     abstain: number;
//   };
//   voters: string[]; // Array of addresses that have voted
// }

// // PUT: Update vote count and voter addresses for a specific proposal
// export async function PUT(req: NextRequest) {
//   try {
//     const dataFilePath = path.join(process.cwd(), "src/proposalsData.ts");

//     // Parse the incoming request body
//     const { address, votes, voterAddress } = await req.json(); // Expecting a voterAddress field
//     console.log("from put api");
//     console.log("datafilePath",dataFilePath);
//     console.log("voterAddress: ", voterAddress);
//     console.log("votes: ", votes);
//     console.log("address: ", address);
//     // Read the current proposals data from the file
//     let data = await readFile(dataFilePath, "utf8");
//     const proposals: Proposal[] = JSON.parse(data);
//     console.log("proposas in api: ", proposals);

//     // Find the proposal by ID
//     const proposalIndex = proposals.findIndex((p) => p.address === address);
//     if (proposalIndex === -1) {
//       return NextResponse.json({ message: "Proposal not found" }, { status: 404 });
//     }

//     // Update the vote count
//     proposals[proposalIndex].votes = votes;

//     // Write the updated proposals data back to the file
//     const updatedData = JSON.stringify(proposals, null, 2);
//     await writeFile(dataFilePath, updatedData, "utf8");

//     return NextResponse.json({ message: "Votes and voter updated successfully!" }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating votes and voters:", error);
//     return NextResponse.json({ message: "Internal Server Error",error:error }, { status: 500 });
//   }
// }
