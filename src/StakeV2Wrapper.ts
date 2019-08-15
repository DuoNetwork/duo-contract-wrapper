import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import stakeAbi from './static/StakeV2.json';
import {
	IRewardFromContract,
	IRewardList,
	IStagingIndex,
	IStakeLot,
	IStakeQueueIdx,
	IStakeV2Address,
	IStakeV2States,
	ITransactionOption
} from './types';
import Web3Wrapper from './Web3Wrapper';

export class StakeV2Wrapper extends BaseContractWrapper {
	public readonly events = [
		CST.EVENT_UPDATE_ROLE_MANAGER,
		CST.EVENT_UPDATE_OPERATOR,
		CST.EVENT_SET_VALUE,
		CST.EVENT_ADD_STAKE,
		CST.EVENT_UN_STAKE,
		CST.EVENT_COMMIT_ADD_REWARD,
		CST.EVENT_COMMIT_REDUCE_REWARD,
		CST.EVENT_UPDATE_UPLOADER,
		CST.EVENT_CLAIM_AWARD
	];
	constructor(web3Wrapper: Web3Wrapper, address: string) {
		super(web3Wrapper, stakeAbi.abi, address);
	}

	public async getStates(): Promise<IStakeV2States> {
		return {
			stakingEnabled: await this.contract.methods.stakingEnabled().call(),
			lockMinTimeInSecond: await this.contract.methods.lockMinTimeInSecond().call(),
			minStakeAmt: Web3Wrapper.fromWei(
				(await this.contract.methods.minStakeAmtInWei().call()).valueOf()
			),
			maxStakePerOracle: Web3Wrapper.fromWei(
				(await this.contract.methods.maxOracleStakeAmtInWei().call()).valueOf()
			),
			totalRewardsToDistribute: Web3Wrapper.fromWei(
				(await this.contract.methods.totalRewardsToDistributeInWei().call()).valueOf()
			)
		};
	}

	public async getAddresses(): Promise<IStakeV2Address> {
		return {
			priceFeedList: await this.getOracleList(),
			operator: await this.contract.methods.operator().call(),
			burnAddress: await this.contract.methods.burnAddress().call(),
			duoTokenAddress: await this.contract.methods.duoTokenAddress().call(),
			uploader: await this.contract.methods.uploader().call()
		};
	}

	public async getOracleList(): Promise<string[]> {
		const oracleSize = await this.contract.methods.getOracleSize().call();
		const oracleList = [];
		for (let i = 0; i < oracleSize; i++)
			oracleList.push(await this.contract.methods.oracleList(i).call());

		return oracleList;
	}

	public async getUserSize(): Promise<number> {
		const userSize = await this.contract.methods.getUserSize().call();
		return Number(userSize.valueOf());
	}

	public async getStagingAddReward(index: number): Promise<IRewardList> {
		const userReward: IRewardFromContract = await this.contract.methods
			.addRewardStagingList(index)
			.call();
		return {
			user: userReward.user,
			amount: Web3Wrapper.fromWei(userReward.amtInWei)
		};
	}

	public async getStagingReduceReward(index: number): Promise<IRewardList> {
		const userReward: IRewardFromContract = await this.contract.methods
			.reduceRewardStagingList(index)
			.call();
		return {
			user: userReward.user,
			amount: Web3Wrapper.fromWei(userReward.amtInWei)
		};
	}

	public async getStagingIndex(): Promise<IStagingIndex> {
		const addRewardStagingIdx = await this.contract.methods.addRewardStagingIdx().call();
		const reduceRewardStagingIdx = await this.contract.methods.reduceRewardStagingIdx().call();
		return {
			add: {
				first: Number(addRewardStagingIdx.first),
				last: Number(addRewardStagingIdx.last)
			},
			reduce: {
				first: Number(reduceRewardStagingIdx.first),
				last: Number(reduceRewardStagingIdx.last)
			}
		};
	}

	public async getUserStakes(
		account: string,
		oracleList: string[]
	): Promise<{ [key: string]: IStakeLot[] }> {
		const userStake: { [key: string]: IStakeLot[] } = {};
		for (const oracle of oracleList) {
			userStake[oracle] = [];

			const stakeQueueIdx: IStakeQueueIdx = await this.contract.methods
				.userQueueIdx(account, oracle)
				.call();
			if (stakeQueueIdx.last >= stakeQueueIdx.first)
				for (let i = Number(stakeQueueIdx.first); i <= Number(stakeQueueIdx.last); i++) {
					const stakeLot: IStakeLot = await this.contract.methods
						.userStakeQueue(account, oracle, i)
						.call();
					userStake[oracle].push(stakeLot);
				}
		}
		return userStake;
	}

	public async getOracleStakes(oracleList: string[]): Promise<{ [key: string]: number }> {
		const oracleStakes: { [key: string]: number } = {};
		for (const oracleAddr of oracleList) {
			const oracleStake = await this.contract.methods.totalStakeInWei(oracleAddr).call();
			oracleStakes[oracleAddr] = Web3Wrapper.fromWei(oracleStake);
		}
		return oracleStakes;
	}

	public async getUserReward(account: string): Promise<number> {
		const rewardsInWei = await this.contract.methods.rewardsInWei(account).call();
		return Web3Wrapper.fromWei(rewardsInWei);
	}

	public async stake(
		account: string,
		oracleAddr: string,
		amount: number,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.STAKE_V2_STAKING_GAS,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.stake(oracleAddr, Web3Wrapper.toWei(amount))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async unstake(
		account: string,
		oracleAddr: string,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.STAKE_V2_UNSTAKING_GAS,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.unstake(oracleAddr)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async claimReward(account: string, option: ITransactionOption = {}): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.STAKE_V2_CLAIM_REWARD_GAS,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.claimReward(true, 0)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async stageAddRewards(
		account: string,
		addrList: string[],
		rewardList: number[],
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.STAKE_V2_STAGE_ADD_REWAD_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.stageAddRewards(addrList, rewardList.map(award => Web3Wrapper.toWei(award)))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async stageReduceRewards(
		account: string,
		addrList: string[],
		rewardList: number[],
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.STAKE_V2_STAGE_REDUCE_REWAD_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.stageReduceRewards(addrList, rewardList.map(award => Web3Wrapper.toWei(award)))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async commitAddRewards(
		account: string,
		numOfRewards: number,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.STAKE_V2_COMMIT_ADD_REWAD_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.commitAddRewards(numOfRewards)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async commitReduceRewards(
		account: string,
		numOfRewards: number,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.STAKE_V2_COMMIT_ADD_REWAD_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.commitReduceRewards(numOfRewards)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async resetStagingAwards(
		account: string,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_TX_GAS_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.resetStagingAwards()
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async autoRoll(
		account: string,
		oracle: string,
		amount: number,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_TX_GAS_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.autoRoll(oracle, Web3Wrapper.toWei(amount))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async enableStaking(account: string, option: ITransactionOption = {}): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.STAKE_V2_ENABLE_STAKING_GAS,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.setStakeFlag(true)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async disableStaking(account: string, option: ITransactionOption = {}): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.STAKE_V2_DISENABLE_STAKING_GAS,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.setStakeFlag(false)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async updateUploaderByOperator(
		account: string,
		newUploader: string,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_TX_GAS_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.updateUploaderByOperator(newUploader)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async addOracle(
		account: string,
		newOracleAddress: string,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_TX_GAS_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.addOracle(newOracleAddress)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async setMinStakeAmt(
		account: string,
		minStakeAmount: number,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_TX_GAS_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.setValue(0, Web3Wrapper.toWei(minStakeAmount))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async setMaxStakePerOracleAmt(
		account: string,
		maxStakePerOracle: number,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_TX_GAS_LIMIT,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.setValue(0, Web3Wrapper.toWei(maxStakePerOracle))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}
}

export default StakeV2Wrapper;
