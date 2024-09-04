import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from "fs/promises";
import { readFile } from "fs/promises"; // Use fs/promises for async/await support
import path from "path";
import fs from "fs";
import { error } from 'console';

interface Proposal {
  title: string;
  description: string;
  address: string;
}



export async function GET(req: NextRequest) {
  try {
    const dataFilePath = path.join(process.cwd(), "src/proposalsData.ts");
    console.log("Data file path:", dataFilePath);

    // Read the file contents
    const data = await readFile(dataFilePath, "utf-8");

    // Assuming the file is JSON formatted, parse it
    const proposals = JSON.parse(data);

    return NextResponse.json(proposals, { status: 200 });
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
      const dataFilePath = path.join(process.cwd(), "src/proposalsData.ts");
    //   console.log(await req.json());
      console.log(dataFilePath);
      
      const proposal = await req.json();
      fs.readFile(dataFilePath,'utf-8',(err,data)=>{
        if(err) {
            console.log(err);
        }else{
            console.log(data);
        }
        
      })

    //   Read the current data from data.ts
      let data = "";
      try {
        data = await (await import("fs/promises")).readFile(dataFilePath, "utf8");
        console.log('data : ',data);
      } catch (err) {
        // File may not exist yet, handle accordingly
        data = "[]"; // Initialize with empty array
      }

      const proposals: Proposal[] = JSON.parse(data);
      console.log("pp ; ",proposals);
      proposals.push(proposal);

      // Write the updated data back to data.ts
      const updatedData = JSON.stringify(proposals, null, 2);
      await writeFile(dataFilePath, updatedData, "utf8");

      return NextResponse.json({ message: "Proposal saved successfully!" },{status:200});
    } catch (error) {
      console.error("Error saving proposal:", error);
      return NextResponse.json({ message: "Internal Server Error" },{status:500});
    }
  
}
