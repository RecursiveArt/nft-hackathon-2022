//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./RecursiveExchange.sol";

import "hardhat/console.sol";

/**
This contract is for the NFTHack ETHGlobal hackathon.
*/

contract RecursiveArtNFT is ERC721, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter public tokenId;

  RecursiveExchange public recursiveExchange;

  constructor(RecursiveExchange _recursiveExchange) ERC721("RecursiveArtNFT", "RANFT") {
    recursiveExchange = _recursiveExchange;
  }

  function mintRecursiveNFT(uint256 _purchasedTokenId, string memory _recursiveArtCID) public {
    address tokenBuyer =
      RecursiveExchange(recursiveExchange).offeringRegistry[_purchasedTokenId].buyer;
    require(tokenBuyer == msg.sender,
      "msg.sender does not own the metadata from the sale of this token ID");

    tokenId.increment();
    _mint(msg.sender, tokenId.current());
    _setTokenURI(tokenId.current(), _recursiveArtCID);
  }
}
