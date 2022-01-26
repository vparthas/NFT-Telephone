const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Telephone", function () {
    const uris = [
        "https://ipfs.io/ipfs/QmW3FgNGeD46kHEryFUw1ftEUqRw254WkKxYeKaouz7DJA",
        "https://ipfs.io/ipfs/QmQdF6fzKQG7tDw4NyaLazK5zAf22gdBQuRteYQcCSfzrg"
    ]

    var Telephone, telephone;

    beforeEach(async function() {
        Telephone = await ethers.getContractFactory("Telephone");
        telephone = await Telephone.deploy(uris[0]);
        await telephone.deployed();
    });

    it("Should mint the initial token", async function () {
        expect(await telephone.getLatest()).to.equal(1);
        expect(await telephone.getHash(1)).to.equal(uris[0]);
        expect(await telephone.getLatestURI()).to.equal(uris[0])
    });

    it("Should mint a child token", async function () {
        const [owner, other] = await ethers.getSigners();
        expect(telephone.connect(other).transform(uris[1])).to.be.revertedWith("Unauthorized");
        await telephone.connect(owner).transform(uris[1]);
        await telephone.connect(other).mintToken();

        expect(await telephone.getLatest()).to.equal(2);
        expect(await telephone.getHash(2)).to.equal(uris[1]);
        expect(await telephone.getNext(1)).to.equal(2);
        expect(await telephone.getPrev(2)).to.equal(1);
    });

    it("Should fail to fetch elements that do not exist", async function () {
        expect(telephone.getPrev(1)).to.be.revertedWith("No parent token");
        expect(telephone.getNext(1)).to.be.revertedWith("No child token");
    });

    it("Should return true for valid tokens and false for invalid", async function () {
        expect(await telephone.isValidToken(1)).to.be.true;
        expect(await telephone.isValidToken(2)).to.be.false;
    });

    it("Should allow unauthorized transformation after 6500 blocks", async function () {
        const [owner, other] = await ethers.getSigners();
        expect(telephone.connect(other).transform(uris[1])).to.be.revertedWith("Unauthorized");

        for (let i = 0; i < 6501; i++) {
            await hre.network.provider.request({
                method: "evm_mine",
                params: [],
            });
        }
        await telephone.connect(other).transform(uris[1])
    });
});
