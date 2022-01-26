# NFT Telephone
*This project is a work in progress.*
- Ropsten address (latest version): 0xd7d73bD9ef35911eB713e768BcfB79a19F905093

A solidity smart contract to allow for a decentralized game of telephone using NFTs linking to IPFS CIDs. The rules are as follows:
- The owner of the latest token has exclusive transformation privileges (the right to specify the source of the next token) for 6500 blocks.
- If 6500 blocks have been mined since the last transformation occured, the transformation rights become global.
- The current holder of the latest token is not allowed to mint their own transformation.

## TODO
- IPFS integration code
- UI

## Hardhat stuff

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
