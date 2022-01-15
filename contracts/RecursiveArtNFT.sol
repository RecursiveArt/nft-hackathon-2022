//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./RecursiveExchange.sol";

import "hardhat/console.sol";

/**
This contract is for the NFTHack 2022 ETHGlobal hackathon.
Developed in this repo:
https://github.com/onionpeel/nft-hackathon-2022
*/

contract RecursiveArtNFT is ERC721, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter public recursiveTokenId;

  RecursiveExchange public recursiveExchange;

  constructor(RecursiveExchange _recursiveExchange) ERC721("RecursiveArtNFT", "RANFT") {
    recursiveExchange = _recursiveExchange;
  }

  function mintRecursiveNFT(
    uint256 _offeringId,
    string memory _recursiveArtCID
  ) public
  {
    (, address tokenBuyer, , , , ) =
      RecursiveExchange(recursiveExchange).offeringRegistry(_offeringId);
    require(tokenBuyer == msg.sender,
      "msg.sender does not own the metadata from the sale of this token ID");

    recursiveTokenId.increment();
    _mint(msg.sender, recursiveTokenId.current());
    _setTokenURI(recursiveTokenId.current(), _recursiveArtCID);
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
