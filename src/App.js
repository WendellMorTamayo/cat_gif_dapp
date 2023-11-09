import React, { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import "./App.css";
import { Buffer } from "buffer";
import kp from './keypair.json'
import idl from "./cat_gif_contract.json";
import Navbar from "./Components/NavBar";
import Form from "./Components/Form";
import GifList from "./Components/GifList";


const solanaWeb3 = require('@solana/web3.js');

window.Buffer = Buffer;
const { SystemProgram, Keypair } = web3;
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret);
const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl('devnet');
const opts = {
  preflightCommitment: "processed"
}
const endpoint = 'https://prettiest-serene-general.solana-devnet.quiknode.pro/0cd0a04fca898bff3762c161da727b089ccc0064/';
const solanaConnection = new solanaWeb3.Connection(endpoint);

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const getProgram = async () => {
    console.log("IDL: ", idl)
    return new Program(idl, programID, getProvider());
  }

  const getGiftList = async() => {
    try {
      const program = await getProgram();
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log("Got the account!", account);
      setGifList(account.gifList);
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setGifList(null);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (window?.solana?.isPhantom) {
        console.log("Phantom wallet found!");
        const response = await window.solana.connect({ onlyIfTrusted: true });
        console.log(
          "Connected with Public Key:",
          response.publicKey.toString()
        );

        setWalletAddress(response.publicKey.toString());
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const parseWalletKey = (string) => {
    return `${string.slice(0, 5)}......${string.slice(-5)}`;
  };

  const connectWallet = async () => {
    const { solana } = window;
    try {
      if (solana) {
        const response = await solana.connect();
        console.log(
          "Connected with Public Key:",
          response.publicKey.toString()
        );
        setWalletAddress(response.publicKey.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendGif = async () => {
    if(inputValue.length === 0) {
      console.log("No gif link given!")
      return
    }
    setInputValue("");
    console.log("Gif link:", inputValue);
    try {
      const provider = getProvider()
      const program = await getProgram();

      let tx = await program.rpc.addGif(inputValue,  {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      })
      console.log("GIF successfully sent to program", inputValue);
      console.log("1. Transaction Account: ", tx);
      console.log("2. Transaction Account: ", gifList[0].transactionHash.toString());
      await  getGiftList()
    } catch (error) {
      console.log("Error in sending gif: ", error);
    }
  };

  const deleteGif = async (gifLink) => {
    try {
      const program = await getProgram();
      const transaction = await program.methods
          .deleteGif(gifLink, walletAddress.toString())
          .accounts({
            baseAccount: baseAccount.publicKey,
          })
          .rpc();
      console.log("Transaction: ", transaction);
      window.location.reload();
    } catch (error) {
      console.log("WalletAddress: ", walletAddress);
      console.log("GifLink: ", gifLink);
      console.log("Error in deleteGif: ", error);
    }
  }


  const getTransaction = async (transactionSignature) => {
    try {
      const connection = new Connection(network, opts.preflightCommitment);
      // Fetch the transaction details
      const transactionDetails = await connection.getParsedConfirmedTransaction(
          transactionSignature,
          'jsonParsed' // You can specify the encoding here
      );

      if (transactionDetails) {
        console.log('Transaction Slot:', transactionDetails.slot);
        console.log('Transaction Block Time:', transactionDetails.blockTime);
        console.log('Transaction:', transactionDetails.transaction);
        console.log('Transaction Meta:', transactionDetails.meta);
        // Access more transaction details as needed
      } else {
        console.log('Transaction not found or not confirmed.');
      }
    } catch (error) {
      console.error('Error while fetching transaction details:', error);
    }
  };


  const getTransactions = async (address, numTx) => {
    try {
      const pubKey = new solanaWeb3.PublicKey(address);
      const transactionList = await solanaConnection.getSignaturesForAddress(pubKey, {
        limit: numTx,
      });

      if (transactionList.length > 0) {
        const lastTransaction = transactionList[transactionList.length - 1];
        console.log("Last Transaction Signature: ", lastTransaction.signature);
      } else {
        console.log("No transactions found for this address.");
      }
    } catch (error) {
      console.error("Error while retrieving transactions: ", error);
    }
  };


  const onInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
        connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

  const createGifAccount = async() => {
    try {
      const provider = getProvider();
      const program = await getProgram();
      console.log("ping")
      await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      })
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString());
      await getGiftList()
    } catch (error) {
      console.log("Error in creating BaseAccount account: ", error);
    }
  }

  const renderNotConnectedContainer = () => (
    <>
      <button
        type="button"
        onClick={connectWallet}
        className="align-middle text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2">
        <img
          src={require("./Assets/Phantom-Icon_Transparent_Purple.png")} // Replace with the correct path to your icon
          alt="Phantom Icon"
          className="w-6 h-6 mr-2 -ml-1" // Adjust the size and spacing as needed
        />
        Connect with Phantom
      </button>
    </>
  );

  const renderConnectedContainer = () => {
    if (gifList === null) {
      return (
          <div className="connected-container">
            <button className="cta-button submit-gif-button" onClick={createGifAccount}>
              Do One-Time Initialization For GIF Program Account
            </button>
          </div>
      )
    } else {
     return (
         <>
          <div className="connected-container">
            <Navbar walletAddress={walletAddress} parseWalletKey={parseWalletKey} />
            <Form
                inputValue={inputValue}
                onInputChange={onInputChange}
                onSubmit={sendGif}
            />


            <GifList gifList={gifList} walletaddress={walletAddress} action={deleteGif} />
          </div>
         </>
    )
    }
  }

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");
      getGiftList();
    }
  }, [walletAddress]);

  return (
    <>
      <div className="App">
        {/* This was solely added for some styling fanciness */}
        <div className={walletAddress ? "authed-container" : "w-full h-screen flex items-center justify-center"}>
          <div className="header-container">
            {!walletAddress && <p className="header">🖼 GIF Portal</p> && (
              <p className="sub-text">
                View your GIF collection in the metaverse ✨
              </p>
            )}

            {/* Add the condition to show this only if we don't have a wallet address */}
            {!walletAddress && renderNotConnectedContainer()}
            {walletAddress && renderConnectedContainer()}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
