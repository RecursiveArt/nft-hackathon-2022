import {expect} from "./chai-setup";
import hre, {ethers, deployments, getNamedAccounts} from 'hardhat';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Deployment } from "hardhat-deploy/dist/types";
import type { RecursiveExchange, RecursiveArtNFT, CreateNFT } from '../typechain-types';

describe("RecursiveExchange", () => {
  let recursiveExchange: RecursiveExchange;
  let recursiveArtNFT: RecursiveArtNFT;
  let createNFT: CreateNFT;
  let deployer: string;
  let buyer: string;
  let seller: string;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    ({deployer, buyer, seller} = await getNamedAccounts());
    accounts = await ethers.getSigners();

    await deployments.fixture(['recursiveExchange', 'recursiveArtNFT', 'createNFT']);

    const RecursiveExchangeDevelopmnet: Deployment = await deployments.get('RecursiveExchange');
    recursiveExchange = await Promise.resolve(ethers.getContractAt('RecursiveExchange', RecursiveExchangeDevelopmnet.address) as Promise<RecursiveExchange>);

    const RecursiveArtNFTDevelopmnet: Deployment = await deployments.get('RecursiveArtNFT');
    recursiveArtNFT = await Promise.resolve(ethers.getContractAt('RecursiveArtNFT', RecursiveArtNFTDevelopmnet.address) as Promise<RecursiveArtNFT>);

    const CreateNFTDevelopmnet: Deployment = await deployments.get('CreateNFT');
    createNFT = await Promise.resolve(ethers.getContractAt('CreateNFT', CreateNFTDevelopmnet.address) as Promise<CreateNFT>);
  });

  it('offeringRegistry(), revokeOffering()', async () => {
    await createNFT.connect(accounts[2]).mintToken("someRandomCID");
    expect(await createNFT.ownerOf(ethers.BigNumber.from('1'))).to.equal(seller);


    await recursiveExchange.connect(accounts[2]).placeOffering(
      createNFT.address,
      ethers.BigNumber.from('1'), //token id
      ethers.utils.parseEther('1') // price in ETH
    );


    let offering = await recursiveExchange.viewOfferingNFT(ethers.BigNumber.from('1'));
    // console.log(offering)
    expect(offering[0]).to.equal(seller);
    expect(offering[1]).to.equal(ethers.constants.AddressZero);
    expect(offering[2]).to.equal(createNFT.address);
    expect(offering[3]).to.equal(ethers.BigNumber.from('1'));
    expect(offering[4]).to.equal(ethers.utils.parseEther('1'));
    expect(offering[5]).to.equal(false);

    await recursiveExchange.connect(accounts[2]).revokeOffering(ethers.BigNumber.from('1'));

    await expect(recursiveExchange.connect(accounts[1]).closeOffering(
        ethers.BigNumber.from('1'),
        {value: ethers.utils.parseEther('1')}
      )).to.be.revertedWith('Offering is closed');
  });

  it('closeOffering()', async () => {
    await createNFT.connect(accounts[2]).mintToken("someRandomCID");
    expect(await createNFT.ownerOf(ethers.BigNumber.from('1'))).to.equal(seller);

    await recursiveExchange.connect(accounts[2]).placeOffering(
      createNFT.address,
      ethers.BigNumber.from('1'), //token id
      ethers.utils.parseEther('1') // price in ETH
    );

    await createNFT.connect(accounts[2]).approve(
      recursiveExchange.address,
      ethers.BigNumber.from('1')
    );

    await recursiveExchange.connect(accounts[1]).closeOffering(
      ethers.BigNumber.from('1'),
      {value: ethers.utils.parseEther('1')}
    );
  });

  it('balances', async () => {
    await createNFT.connect(accounts[2]).mintToken("someRandomCID");
    expect(await createNFT.ownerOf(ethers.BigNumber.from('1'))).to.equal(seller);

    await recursiveExchange.connect(accounts[2]).placeOffering(
      createNFT.address,
      ethers.BigNumber.from('1'), //token id
      ethers.utils.parseEther('1') // price in ETH
    );

    await createNFT.connect(accounts[2]).approve(
      recursiveExchange.address,
      ethers.BigNumber.from('1')
    );

    await recursiveExchange.connect(accounts[1]).closeOffering(
      ethers.BigNumber.from('1'),
      {value: ethers.utils.parseEther('1')}
    );

    expect(await recursiveExchange.viewBalances(seller)).to.equal(ethers.utils.parseEther('1'));

    let bal = await ethers.provider.getBalance(seller)
    // console.log(bal.toString())

    expect(await createNFT.ownerOf(ethers.BigNumber.from('1'))).to.equal(buyer);
  });

  it('Mints a recursive NFT', async () => {
    await createNFT.connect(accounts[2]).mintToken("someRandomCID");
    expect(await createNFT.ownerOf(ethers.BigNumber.from('1'))).to.equal(seller);

    await recursiveExchange.connect(accounts[2]).placeOffering(
      createNFT.address,
      ethers.BigNumber.from('1'), //token id
      ethers.utils.parseEther('1') // price in ETH
    );

    await createNFT.connect(accounts[2]).approve(
      recursiveExchange.address,
      ethers.BigNumber.from('1')
    );

    await recursiveExchange.connect(accounts[1]).closeOffering(
      ethers.BigNumber.from('1'),
      {value: ethers.utils.parseEther('1')}
    );

    expect(await recursiveExchange.viewBalances(seller)).to.equal(ethers.utils.parseEther('1'));

    let bal = await ethers.provider.getBalance(seller)
    // console.log(bal.toString())

    // The number here is the token id of the erc721 that was exchanged
    expect(await createNFT.ownerOf(ethers.BigNumber.from('1'))).to.equal(buyer);

    // The number here is the offeringId that refers to the Offering struct for the token sale
    await recursiveArtNFT.connect(accounts[1]).mintRecursiveNFT(
      ethers.BigNumber.from('1'),
      'fakeCID'
    );

    expect(await recursiveArtNFT.ownerOf(ethers.BigNumber.from('1'))).to.equal(buyer);
  });
});


// 1. create an nft that you can then put on the exchange.
// 0xcA620Ea9c5fE250A92F423e564332F829D8ff5EA
// On the CreateNFT contract, call:
// mintToken('someCID')
// You need to add a string that holds the place of a content identifier
//
// 
// 0xF7637b9628369AcFAC832654D69462CE5b4Ff689
// 2. On RecursiveExchange, call placeOffering() with three arguments
//   a) the address of the CreateNFT contract
//   b) your token id from the token you just minted
//   c) the price in eth you want to sell it for (.00000001 is good so we don't waste test eth)
//
// 3. That function call will emit an event.  The first field of that event is offeringId.  Copy that value.
//
// 4. change accounts in metamask, then on RecursiveExchange call closeOffering() with the offeringId. Now the token ownership has changed accounts.
// closeOffering() emits the event that contains the data that will be used to generate the art.
//
// 5. With the account that bought the token, go to the RecursiveArtNFT contract and you can mint your new nft.  You'll have to enter a fake string to simulate the CID for the gen art. Under the hood, this function checks that the message sender is the owner of the NFT that was purchased on the exchange contract.
// 0xC01ae9e913Da086eCfC2F218FA9f1ecb2adCFEbf
// mintRecursiveNFT()
// First parameter: offering Id that you used in step #4
// second parameter:  make up some string for a CID
//
// Note that the token id and the offeringId might be the same, but over time this will not be the case, which is why two variables are needed.
// Note that when you want to check the ownership of this new recursive NFT, you need to use the function on the RecursiveArtNFT contract, ownerOf().  You enter the token id, just as you would with any other NFT contract.  I say this so you don't accidentally use the offeringId.

// deploying "RecursiveExchange" (tx: 0x4c6f5e0ec582b503e15065beb7cfe849526d179b461ae3fe7ef70a5403ef7a02)...: deployed at 0xF7637b9628369AcFAC832654D69462CE5b4Ff689 with 1377385 gas
// deploying "RecursiveArtNFT" (tx: 0xdabac82faf28290bb9a923b017749e4eb2300328e8fb044cf416746fcf84d14c)...: deployed at 0xC01ae9e913Da086eCfC2F218FA9f1ecb2adCFEbf with 2707783 gas
// deploying "CreateNFT" (tx: 0xb99090655dbc889a4f0d5b3dcb414573335cf7a994a8873d8e610ddceb1cfaf7)...: deployed at 0xcA620Ea9c5fE250A92F423e564332F829D8ff5EA with 2497476 gas
