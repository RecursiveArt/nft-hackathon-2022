import {expect} from "./chai-setup";
import hre, {ethers, deployments, getNamedAccounts} from 'hardhat';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Deployment } from "hardhat-deploy/dist/types";
import type { RecursiveExchange } from '../typechain-types';

describe("Mercglist", () => {
  let recursiveExchange: RecursiveExchange;
  let deployer: string;

  beforeEach(async () => {
    ({deployer} = await getNamedAccounts());

    await deployments.fixture(['recursiveExchange']);

    const RecursiveExchangeDevelopmnet: Deployment = await deployments.get('RecursiveExchange');
    recursiveExchange = await Promise.resolve(ethers.getContractAt('RecursiveExchange', RecursiveExchangeDevelopmnet.address) as Promise<RecursiveExchange>);
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
