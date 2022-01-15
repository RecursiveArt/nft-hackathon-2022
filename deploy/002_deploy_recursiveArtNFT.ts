import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { ethers } from 'ethers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const recursiveExchange = await deployments.get('RecursiveExchange');

  await deploy('RecursiveArtNFT', {
    from: deployer,
    args: [recursiveExchange.address],
    log: true,
  });
};
export default func;

func.tags = ['recursiveArtNFT'];
func.dependencies = ['recursiveExchange'];
