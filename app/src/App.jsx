import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import { ethers } from 'ethers';
import Telephone from '../../contract/artifacts/contracts/Telephone.sol/Telephone.json';
// import IPFS from 'ipfs-core';

const chainID = 3; // ropsten
const contractAddr = "0xD1c5239047212bCEeB66e79399031ffC0c99D779";

async function connectToProvider(){
  const provider = new ethers.providers.Web3Provider(window.ethereum, ethers.providers.getNetwork(chainID));
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return [provider, signer];
}

async function init(setters) {
  const [provider, signer] = await connectToProvider();
  const contract = new ethers.Contract(contractAddr, Telephone.abi, signer);

  contract.on("Refresh", (URI) => {
    setters["image"](URI);
  });

  setters["image"](await contract.getLatestURI());
  setters["refreshText"]("Latest")
}

async function prev(getters, setters) {
  const [_, signer] = await connectToProvider();
  const contract = new ethers.Contract(contractAddr, Telephone.abi, signer);

  try {
    setters["index"](await contract.getPrev(getters["index"]));
    setters["image"](await contract.getHash(getters["index"]));
  } catch (e) {
    alert(e);
  }
}

async function next(getters, setters) {
  const [_, signer] = await connectToProvider();
  const contract = new ethers.Contract(contractAddr, Telephone.abi, signer);

  try {
    setters["index"](await contract.getNext(getters["index"]));
    setters["image"](await contract.getHash(getters["index"]));
  } catch (e) {
    alert(e);
  }
}

async function transform(getters, setters) {
  var CID = prompt('Please enter an IPFS CID','');
  if(!validateCID) {
    alert("File deos not exist.")
  }

  // TODO
}

async function validateCID(CID) {
  if (CID != null && CID != "") {
    return false
  }

  const node = await IPFS.create()
  const version = await node.version()
  // TODO
}

async function mint(getters, setters) {
  // TODO
}

function App() {
  const [index, setIndex] = useState(1);
  const [image, setImage] = useState(0);
  const [refreshText, setRefreshText] = useState("Connect Provider");

  const getters = {
    "index": index,
    "image": image,
    "refreshText": setRefreshText
  }

  const setters = {
    "index": setIndex,
    "image": setImage,
    "refreshText": setRefreshText
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>NFT Telephone</p>
        <img src={image} alt="Please connect provider" />
        <p>
          <button type="button" onClick={() => prev(getters, setters)}>&#60;</button>
          <button type="button" onClick={() => init(setters)}>{refreshText}</button>
          <button type="button" onClick={() => next(getters, setters)}>&#62;</button>
        </p>
        <p>
          <button type="button" onClick={() => transform(getters, setters)}>Transform</button>
          <button type="button" onClick={() => mint(getters, setters)}>Mint</button>
        </p>
      </header>
    </div>
  )
}

export default App
