// src/models/Proposal.ts
import mongoose, { Schema, Document } from "mongoose";

interface Votes {
  for: number;
  against: number;
  abstain: number;
}

interface Proposal extends Document {
  name: string;
  description: string;
  address: string;
  votes: Votes;
  voters: string[];
}

const ProposalSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true, unique: false },
  votes: {
    for: { type: Number, default: 0 },
    against: { type: Number, default: 0 },
    abstain: { type: Number, default: 0 },
  },
  voters: { type: [String], default: [] },
});

const ProposalModel = mongoose.models.Proposal || mongoose.model<Proposal>("Proposal", ProposalSchema);
export default ProposalModel;
