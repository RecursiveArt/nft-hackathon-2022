import {expect} from "./chai-setup";
import hre, {ethers, deployments, getNamedAccounts} from 'hardhat';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Deployment } from "hardhat-deploy/dist/types";
import type { RecursiveArtNFT } from '../typechain-types';

describe("Mercglist", () => {
  let recursiveArtNFT: RecursiveArtNFT;
  let deployer: string;

  beforeEach(async () => {
    ({deployer} = await getNamedAccounts());

    await deployments.fixture(['recursiveArtNFT']);

    const RecursiveArtNFTDevelopmnet: Deployment = await deployments.get('RecursiveArtNFT');
    recursiveArtNFT = await Promise.resolve(ethers.getContractAt('RecursiveArtNFT', RecursiveArtNFTDevelopmnet.address) as Promise<RecursiveArtNFT>);
  });

  it('', async () => {

  });

  it('', async () => {

  });

  it('', async () => {

  });

  it('', async () => {

  });

  it('', async () => {

  });

  it('', async () => {

  });
});
