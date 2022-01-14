//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

/**
This contract is for the NFTHack ETHGlobal hackathon.

It is a modification of MarketPlace.sol found here:
https://github.com/DanielMoralisSamples/25_NFT_MARKET_PLACE/blob/master/contracts/market_place.sol
*/

contract RecursiveExchange {
  using Counters for Counters.Counter;
  using Address for address;

  event OfferingPlaced(bytes32 indexed offeringId, address indexed hostContract, address indexed seller,  uint tokenId, uint price, string uri);
  event OfferingClosed(bytes32 indexed offeringId, address indexed buyer);
  event BalanceWithdrawn (address indexed beneficiary, uint amount);

  Counters.Counter public offeringId;
  Counters.Counter public recursiveNFTNonce;

  struct offering {
      address seller;
      address hostContract;
      uint tokenId;
      uint price;
      bool closed;
  }

  mapping (bytes32 => offering) offeringRegistry;
  mapping (address => uint) balances;

  constructor () {}

  function placeOffering (address seller, address _hostContract, uint _tokenId, uint _price) external {
    require(msg.sender == IERC721(_hostContract).ownerOf(_tokenId),
      "msg.sender does not own the token id, therefore cannot sell that token");

    offeringRegistry[offeringId].seller = _seller;
    offeringRegistry[offeringId].hostContract = _hostContract;
    offeringRegistry[offeringId].tokenId = _tokenId;
    offeringRegistry[offeringId].price = _price;

    string memory uri = IERC721(_hostContract).tokenURI(_tokenId)

    offeringId.increment();
    emit  OfferingPlaced(offeringId.current(), _hostContract, _seller, _tokenId, _price, uri);
  }

  function closeOffering(bytes32 _offeringId) external payable {
      require(msg.value >= offeringRegistry[_offeringId].price, "Not enough funds to buy");
      require(offeringRegistry[_offeringId].closed != true, "Offering is closed");
      ERC721 hostContract = ERC721(offeringRegistry[_offeringId].hostContract);
      hostContract.safeTransferFrom(offeringRegistry[_offeringId].offerer, msg.sender, offeringRegistry[_offeringId].tokenId);
      offeringRegistry[_offeringId].closed = true;
      balances[offeringRegistry[_offeringId].offerer] += msg.value;
      emit OfferingClosed(_offeringId, msg.sender);
  }

  function withdrawBalance() external {
      require(balances[msg.sender] > 0,"You don't have any balance to withdraw");
      uint amount = balances[msg.sender];
      payable(msg.sender).transfer(amount);
      balances[msg.sender] = 0;
      emit BalanceWithdrawn(msg.sender, amount);
  }

  function revokeOffering(uint _offeringId) public {
    require(msg.sender == offeringRegistry[_offeringId].seller,
      "msg.sender is not the seller of this token");

    offeringRegistry[_offeringId].closed = true;
  }

  function viewOfferingNFT(bytes32 _offeringId) external view returns (address, uint, uint, bool){
      return (
        offeringRegistry[_offeringId].seller,
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
