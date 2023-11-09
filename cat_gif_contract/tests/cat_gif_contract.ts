import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CatGifContract } from "../target/types/cat_gif_contract";
import { SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("CatGifContract", () => {
  console.log("🚀 Starting test...");

  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.CatGifContract as Program<CatGifContract>;
  const baseAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    let tx = await program.methods
      .initialize()
      .accounts({
        baseAccount: baseAccount.publicKey,
        user: provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([baseAccount])
      .rpc();
    console.log("📝 Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("👀 GIF Count", account.totalGifs.toString());

    // You'll need to now pass a GIF link to the function! You'll also need to pass in the user submitting the GIF!
    await program.rpc.addGif("insert_a_giphy_link_here", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.publicKey,
      },
    });

    // Call the account.
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("👀 GIF Count", account.totalGifs.toString());
    // Access gif_list on the account!
    console.log("👀 GIF List", account.gifList);
    console.log("PublicKey: ", account.gifList[0].userAddress.toString());
    console.log("Tx hash: ", baseAccount.publicKey.toBase58());

    let txt = await program.rpc.addReaction("0", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.publicKey,
      },
    });
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("Tx hash: ", baseAccount.publicKey.toBase58());
    console.log(
      "GIF reactor Count",
      account.gifList[0].reactorCount.toString()
    );
  });

  /*it("Should Delete!", async () => {
    // Add your test here.
    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("👀GIF List", account.gifList);
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);

    console.log("👀New GIF List", account.gifList);

    await program.methods
      .deleteGif("insert_a_giphy_link_here", provider.publicKey.toString())
      .accounts({
        baseAccount: baseAccount.publicKey,
      })
      .rpc();
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("👀New GIF List", account.gifList);
  });*/
});
