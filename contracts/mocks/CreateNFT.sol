//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

/**
This contract is for the NFTHack 2022 ETHGlobal hackathon.
Developed in this repo:
https://github.com/onionpeel/nft-hackathon-2022
*/

contract CreateNFT is ERC721, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter public tokenId;

  constructor() ERC721("CreateNFT", "CNFT") {}

  function mintToken(string memory metadataCID) public {
    tokenId.increment();
    _mint(msg.sender, tokenId.current());
    _setTokenURI(tokenId.current(), metadataCID);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }
}
