import {expect} from "./chai-setup";
import hre, {ethers, deployments, getNamedAccounts} from 'hardhat';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Deployment } from "hardhat-deploy/dist/types";
import type { TokenExchange } from '../typechain-types';

describe("Mercglist", () => {
  let tokenExchange: TokenExchange;
  let deployer: string;

  beforeEach(async () => {
    ({deployer} = await getNamedAccounts());

    await deployments.fixture(['tokenExchange']);

    const TokenExchangeDevelopmnet: Deployment = await deployments.get('TokenExchange');
    tokenExchange = await Promise.resolve(ethers.getContractAt('TokenExchange', TokenExchangeDevelopmnet.address) as Promise<TokenExchange>);
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
