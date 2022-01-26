//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Telephone is ERC721URIStorage {
    using Counters for Counters.Counter; 
    Counters.Counter private _tokenIds;

    mapping(uint => string) private _hashes;
    uint[] private _tokens;
    uint private _size = 0;

    string private _nextHash;
    uint private _mintedAt;

    constructor(string memory baseHash) ERC721("Telephone", "TLFN") {
        _addChild(baseHash);
    }

    event Refresh(string URI);

    function getLatest() public view returns (uint) {
        return _tokens[_size - 1];
    }

    function getLatestURI() public view returns (string memory) {
        return getHash(getLatest());
    }

    function isValidToken(uint token) public view returns (bool) {
        return (keccak256(bytes(_hashes[token])) != keccak256("")); 
    }

    function getNext(uint token) public view returns (uint) {
        require(isValidToken(token), "Invalid token");
        require(token != getLatest(), "No child token");
        return _tokens[token];
    }

    function getPrev(uint token) public view returns (uint) {
        require(isValidToken(token), "Invalid token");
        require(token != _tokens[0], "No parent token");
        return _tokens[token - 2];
    }

    function getHash(uint token) public view returns (string memory) {
        require(isValidToken(token), "Invalid token");
        return _hashes[token];
    }

    function _addChild(string memory newHash) private returns (uint) {
        uint tokenID = _mintToken(newHash);
        _tokens.push(tokenID);
        _hashes[tokenID] = newHash;
        _size++;
        _mintedAt = block.number;

        return tokenID;
    }

    function _mintToken(string memory newHash) private returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, newHash);

        return newItemId;
    }

    function mintToken() public returns (uint) {
        require(msg.sender != ownerOf(this.getLatest()), "Parent owner cannot mint child");
        require(bytes(_nextHash).length != 0, "Transformation does not exist");
        
        uint result = _addChild(_nextHash);
        emit Refresh(_nextHash);
        _nextHash = "";
        return result;
    }

    function transform(string memory newHash) public {
        require(bytes(_nextHash).length == 0, "Unminted child exists");
        if (msg.sender != ownerOf(this.getLatest())) {
            require(block.number - _mintedAt > 6500, "Unauthorized");
        }
        _nextHash = newHash;
    }
}   
