const hre = require("hardhat");

async function main() {
    console.log("Contract deployed to:", telephone.address);

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    const Telephone = await ethers.getContractFactory("Telephone");
    const telephone = await Telephone.deploy("https://ipfs.io/ipfs/QmW3FgNGeD46kHEryFUw1ftEUqRw254WkKxYeKaouz7DJA"); //random cid
    await telephone.deployed();

    console.log("contract address:", token.address);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  