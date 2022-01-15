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
  Counters.Counter public mockTokenId;

  constructor() ERC721("CreateNFT", "CNFT") {}

  function mintToken(string memory metadataCID) public {
    mockTokenId.increment();
    _mint(msg.sender, mockTokenId.current());
    _setTokenURI(mockTokenId.current(), metadataCID);
  }

  function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(_tokenId);
  }

  function tokenURI(uint256 _tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(_tokenId);
  }
}
