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
    console.log(bal.toString())
  });

  it('')
});


// 1. create an nft that you can then put on the exchange.
// On the CreateNFT contract, call:
// mintToken('someCID')
// You need to add a string that holds the place of a content identifier
//
// 2. On RecursiveExchange, call placeOffering() with three arguments
//   a) the address of the CreateNFT contract
//   b) your token id from the token you just minted
//   c) the price in eth you want to sell it for (.00000001 is good so we don't waste test eth)
//
// 3. That function call will emit an event.  The first field of that event is offeringId.  Copy that value.
//
// 4. change accounts in metamask, then on RecursiveExchange call closeOffering() with the offeringId. Now the token ownership has changed accounts.
// closeOffering() emits the event that contains the data that will be used to generate the art.
