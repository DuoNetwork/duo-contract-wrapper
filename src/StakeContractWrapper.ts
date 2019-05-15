import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import stakeAbi from './static/Stake.json';
import { IStakeStates, IStakeAddress } from './types';
import Web3Wrapper from './Web3Wrapper';

export class StakeContractWrapper extends BaseContractWrapper {
	public readonly events = [
		CST.EVENT_UPDATE_ROLE_MANAGER,
		CST.EVENT_UPDATE_OPERATOR,
		CST.EVENT_COMMIT_PRICE,
		CST.EVENT_ACCEPT_PRICE,
		CST.EVENT_SET_VALUE,
		CST.EVENT_UPDATE_PRICE_FEED
	];
	constructor(web3Wrapper: Web3Wrapper, address: string) {
		super(web3Wrapper, stakeAbi.abi, address);
	}

	public async getStates(): Promise<IStakeStates> {
		return {
			canStake : await this.contract.methods.canStake().call(),
			canUnstake : await this.contract.methods.canUnstake().call(),
			lockMinTimeInSecond : await this.contract.methods.lockMinTimeInSecond().call(),
			minStakeAmt: Web3Wrapper.fromWei((await this.contract.methods.minStakeAmtInWei().call()).valueOf()),
			maxStakePerPf:  Web3Wrapper.fromWei((await this.contract.methods.maxStakePerPfInWei().call()).valueOf()),
			totalAwardsToDistribute: Web3Wrapper.fromWei((await this.contract.methods.totalAwardsToDistribute().call()).valueOf())
		};
	}

	public async getAddresses(): Promise<IStakeAddress> {
		const pfSize = await this.contract.methods.getPfSize().call();
		const pfList = [];
		for(let i = 0; i < pfSize; i++){
			pfList.push(await this.contract.methods.pfList().call(i));
		}
		return {
			priceFeedList: pfList,
			operator: await this.contract.methods.operator().call(),
		};
	}

	// TODO
	public async getUserStakes(): Promise<void> {
	}

	public async getUserAward(): Promise<void> {
	}

	public async stake(): Promise<void> {
	}

	public async unstake(): Promise<void> {
	}

	public async claimAward(): Promise<void> {
	}

	public async batchAddAward(): Promise<void> {
	}

	public async batchReduceAward(): Promise<void> {
	}

	public async enableStakingAndUnstaking(): Promise<void> {
	}

	public async disableStakingAndUnstaking(): Promise<void> {
	}

	public async disableStaking(): Promise<void> {
	}

	public async setMinStakeAmt(): Promise<void> {
	}

	public async setMaxStakePerPfAmt(): Promise<void> {
	}
	// TODO

	
}

export default StakeContractWrapper;
