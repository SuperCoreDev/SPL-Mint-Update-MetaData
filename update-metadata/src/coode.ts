import { PROGRAM_ID,CreateMetadataAccountV2Struct, DataV2, createCreateMetadataAccountV2Instruction, createCreateMetadataAccountV3Instruction, createUpdateMetadataAccountInstruction, createUpdateMetadataAccountV2Instruction } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey, findMetadataPda } from '@metaplex-foundation/js';
import { Keypair, Transaction } from '@solana/web3.js';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { sendTransaction } from '@metaplex/js/lib/actions/transactions';
import { web3 } from '@project-serum/anchor';
import { SequenceType, sendTransactions } from './helpers/sol/connection';
import { NodeWallet } from '@metaplex/js';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

const PRIVATE_KEY = '37ftUpSiC3SrWSKxTMDLbcpTRj2p3K6zaxygzDzgU8XyCe3uCqbMkGKj1bXhwtwkM1uXUhfYMFpQxgu1EakzJ3fP';
const USER_KEYPAIR = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
console.log('public key:' , USER_KEYPAIR.publicKey);
const mintPublicKey = new PublicKey('5BBfD3yZBBEvtrBo6ChqsHsV9b7Vs3vtjnpZAh9CH5e1');
const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
const tokenMetadata = {
  name: "TigerDefi", 
  symbol: "Tiger",
  uri: "https://gateway.pinata.cloud/ipfs/QmZj7pMyWZ9ebpsywbdvwSU9vWQDY91eYZJ8p18atgPMWd?pinataGatewayToken=Fi6Temnln7Um-MekYE_1bXdWVvhAzO1vydf0SG45F2eSj9lb5wP54v1SXGmXDcTz&_gl=1*fmdbz2*rs_ga*ODIwOTU4NDI2LjE2ODU0MTQzMjc.*rs_ga_5RMPXG14TE*MTY4NTQyMjkxNy4yLjEuMTY4NTQyMzk0Mi42MC4wLjA.",
  //uri: "tinyurl.com/2s38zzec",
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null
} as DataV2;
(async () => {
  let instructionSet = [], signerSet = [];
  let instructions: any[] = [], signers: any[] = [];
  instructions = [];
  signers = [USER_KEYPAIR];
  const metadataPDA = await findMetadataPda(mintPublicKey); // This is derived from the mint account's public key
  // const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  // await _sleep(5000);
  instructions.push(
    createCreateMetadataAccountV3Instruction({
        metadata: metadataPDA,
        // metadata: PublicKey.findProgramAddressSync(
        //   [
        //     Buffer.from("metadata"),
        //     PROGRAM_ID.toBuffer(),
        //     mintPublicKey.toBuffer(),
        //   ],
        //   PROGRAM_ID,
        // )[0],
        mint: mintPublicKey,
        mintAuthority:  USER_KEYPAIR.publicKey,
        payer: USER_KEYPAIR.publicKey,
        updateAuthority: USER_KEYPAIR.publicKey,
      },
      { createMetadataAccountArgsV3: 
        { 
          data: tokenMetadata, 
          isMutable: true ,
          collectionDetails: null
        } 
      }
    ));
    instructionSet.push(instructions);
    signerSet.push(signers);
    const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await _sleep(2000);
    await sendTransactions(connection, new NodeWallet(USER_KEYPAIR), instructionSet, signerSet, SequenceType.StopOnFailure);
})()
