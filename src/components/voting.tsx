import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { deriveVoterPDA, program } from './anchor/setup';
import { web3 } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import { Button } from './ui/Button';
import { Dispatch, SetStateAction, useState } from 'react';
import useCanvasWallet from '@/app/components/CanvasWalletProvider';
import { PublicKey } from '@solana/web3.js';

if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
}

const Voting: React.FC<{
  proposalPDA: web3.PublicKey;
  setHasVoted: Dispatch<SetStateAction<boolean>>;
  setForVote: Dispatch<SetStateAction<number>>;
  setAgainstVote: Dispatch<SetStateAction<number>>;
  setAbstainVote: Dispatch<SetStateAction<number>>;
  setBtnClickedWithoutConnect: Dispatch<SetStateAction<boolean>>;
  voted: boolean;
  onVote: () => void;
}> = ({ proposalPDA, voted, setHasVoted, setForVote, setAgainstVote, setAbstainVote, setBtnClickedWithoutConnect }) => {
  const { connection } = useConnection();
  let { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const { walletAddress, signTransaction } = useCanvasWallet();
  if (walletAddress) {
    console.log(walletAddress);
    const pubKey = new PublicKey(walletAddress);
    publicKey = pubKey;
  }

  const vote = async (voteOption: "For" | "Against" | "Abstain") => {
    if (!publicKey) return;

    setLoading(true);
    const { voterPDA } = await deriveVoterPDA(publicKey, proposalPDA);
    try {
      let voteMethod;
      if (voteOption === "For") {
        voteMethod = program.methods.vote({ for: {} });
      } else if (voteOption === "Against") {
        voteMethod = program.methods.vote({ against: {} });
      } else {
        voteMethod = program.methods.vote({ abstain: {} });
      }
      if (!voteMethod) {
        console.log("ohh");
      }
      const trx = new web3.Transaction().add(
        await voteMethod
          .accounts({
            proposal: proposalPDA,
            voter: voterPDA,
            user: publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .instruction()
      );

      let trxSignature;
      if (walletAddress) {
        trxSignature = await signTransaction(trx);
      } else {
        trxSignature = await sendTransaction(trx, connection, { signers: [] });
        console.log(`Vote transaction sent: ${trxSignature}`);
      }
      const account = program.account.proposal.fetch(proposalPDA);
      console.log(account);

      voteOption == "For" ? setForVote((old) => old + 1) : voteOption == "Against" ? setAgainstVote((old) => old + 1) : setAbstainVote((old) => old + 1);
      setHasVoted(true);
      // onVote();
      // setVoteSuccess(true);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-[32px]">
      {loading ? (
        <div className="flex items-center gap-6 justify-center">
          <h2 className="text-2xl font-bold text-slate-300 font-mono">Voting</h2>
          <div className="loader border-b-4 border-blue-400 border-solid rounded-full w-7 h-7 animate-spin"></div>
        </div>
      ) : (
        // <Button className='bg-teal-200 p-4 px-8 text-xl font-semibold text-black' onClick={() => vote("For")} disabled={true} variant="primary">
        //   Voting...
        // </Button>
        <>
          <Button
            onClick={() => {
              vote("For");
              setBtnClickedWithoutConnect(true);
            }}
            disabled={voted}
            variant="primary"
          >
            Vote For
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              vote("Against");
              setBtnClickedWithoutConnect(true);
            }}
            disabled={voted}
          >
            Vote Against
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-400"
            variant="outline"
            onClick={() => {
              vote("Abstain");
              setBtnClickedWithoutConnect(true);
            }}
            disabled={voted}
          >
            Vote Abstain
          </Button>
        </>
      )}
    </div>
  );
};

export default Voting;
