//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

/**
This contract is for the NFTHack ETHGlobal hackathon.
Developed in this repo:
https://github.com/onionpeel/nft-hackathon-2022

It is a modification of MarketPlace.sol found here:
https://github.com/DanielMoralisSamples/25_NFT_MARKET_PLACE/blob/master/contracts/market_place.sol
*/

contract RecursiveExchange {
  using Counters for Counters.Counter;
  using Address for address;

  event OfferingPlaced(
    uint256 indexed offeringId,
    address indexed hostContract,
    address indexed seller,
    uint tokenId,
    uint price,
    string uri
  );

  event OfferingClosed(
    uint256 indexed offeringId,
    address indexed hostContract,
    address indexed buyer,
    address seller,
    uint tokenId,
    uint price
  );

  event BalanceWithdrawn (address indexed beneficiary, uint amount);

  Counters.Counter public offeringId;

  struct Offering {
    address seller;
    address buyer;
    address hostContract;
    uint tokenId;
    uint price;
    bool closed;
  }

  mapping (uint256 => Offering) public offeringRegistry;
  mapping (address => uint) public balances;

  function placeOffering (address _hostContract, uint _tokenId, uint _price) external {
    require(msg.sender == ERC721(_hostContract).ownerOf(_tokenId),
      "msg.sender does not own the token id, therefore cannot sell that token");

    offeringId.increment();

    offeringRegistry[offeringId.current()].seller = msg.sender;
    offeringRegistry[offeringId.current()].hostContract = _hostContract;
    offeringRegistry[offeringId.current()].tokenId = _tokenId;
    offeringRegistry[offeringId.current()].price = _price;

    string memory uri = ERC721(_hostContract).tokenURI(_tokenId);
    emit OfferingPlaced(
      offeringId.current(),
      _hostContract, msg.sender,
      _tokenId,
      _price,
      uri
    );
  }


  function closeOffering(uint256 _offeringId) external payable {
    require(msg.value >= offeringRegistry[_offeringId].price, "Not enough funds to buy");
    require(offeringRegistry[_offeringId].closed != true, "Offering is closed");

    offeringRegistry[_offeringId].buyer = msg.sender;
    offeringRegistry[_offeringId].closed = true;
    balances[offeringRegistry[_offeringId].seller] += msg.value;

    ERC721(offeringRegistry[_offeringId].hostContract).safeTransferFrom(
      offeringRegistry[_offeringId].seller,
      msg.sender,
      offeringRegistry[_offeringId].tokenId
    );

    emit OfferingClosed(
      _offeringId,
      offeringRegistry[_offeringId].hostContract,
      msg.sender,
      offeringRegistry[_offeringId].seller,
      offeringRegistry[_offeringId].tokenId,
      offeringRegistry[_offeringId].price
    );
  }


  function withdrawBalance() external {
    require(balances[msg.sender] > 0,"You don't have any balance to withdraw");
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0;

    Address.sendValue(payable(msg.sender), amount);
    emit BalanceWithdrawn(msg.sender, amount);
  }


  function revokeOffering(uint _offeringId) public {
    require(msg.sender == offeringRegistry[_offeringId].seller,
      "msg.sender is not the seller of this token");

    offeringRegistry[_offeringId].closed = true;
  }


  function viewOfferingNFT(uint256 _offeringId)
    external view returns (address, address, address, uint, uint, bool)
  {
    return (
      offeringRegistry[_offeringId].seller,
      offeringRegistry[_offeringId].buyer,
      offeringRegistry[_offeringId].hostContract,
      offeringRegistry[_offeringId].tokenId,
      offeringRegistry[_offeringId].price,
      offeringRegistry[_offeringId].closed
    );
  }


  function viewBalances(address _address) external view returns (uint) {
      return (balances[_address]);
  }
}
