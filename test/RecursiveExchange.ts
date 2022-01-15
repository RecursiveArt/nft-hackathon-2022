import {expect} from "./chai-setup";
import hre, {ethers, deployments, getNamedAccounts} from 'hardhat';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Deployment } from "hardhat-deploy/dist/types";
import type { RecursiveExchange, RecursiveArtNFT, CreateNFT } from '../typechain-types';

describe("RecursiveExchange", () => {
  let recursiveExchange: RecursiveExchange;
  let deployer: string;
  let buyer: string;
  let seller: string;

  beforeEach(async () => {
    ({deployer} = await getNamedAccounts());

    await deployments.fixture(['recursiveExchange', 'recursiveArtNFTDevelopmnet', 'createNFT']);

    const RecursiveExchangeDevelopmnet: Deployment = await deployments.get('RecursiveExchange');
    recursiveExchange = await Promise.resolve(ethers.getContractAt('RecursiveExchange', RecursiveExchangeDevelopmnet.address) as Promise<RecursiveExchange>);

    const RecursiveArtNFTDevelopmnet: Deployment = await deployments.get('RecursiveArtNFT');
    recursiveArtNFT = await Promise.resolve(ethers.getContractAt('RecursiveArtNFT', RecursiveArtNFTDevelopmnet.address) as Promise<RecursiveArtNFT>);

    const CreateNFTDevelopmnet: Deployment = await deployments.get('CreateNFT');
    createNFT = await Promise.resolve(ethers.getContractAt('CreateNFT', CreateNFTDevelopmnet.address) as Promise<CreateNFT>);
  });

  it('', async () => {

  });





});
