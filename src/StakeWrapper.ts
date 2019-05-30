import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import stakeAbi from './static/Stake.json';
import {
	IStakeAddress,
	IStakeLot,
	IStakeQueueIdx,
	IStakeStates,
	ITransactionOption
} from './types';
import Web3Wrapper from './Web3Wrapper';

export class StakeWrapper extends BaseContractWrapper {
	public readonly events = [
		CST.EVENT_UPDATE_ROLE_MANAGER,
		CST.EVENT_UPDATE_OPERATOR,
		CST.EVENT_SET_VALUE,
		CST.EVENT_ADD_STAKE,
		CST.EVENT_UN_STAKE,
		CST.EVENT_ADD_AWARD,
		CST.EVENT_REDUCE_AWARD,
		CST.EVENT_CLAIM_AWARD 
	];
	constructor(web3Wrapper: Web3Wrapper, address: string) {
		super(web3Wrapper, stakeAbi.abi, address);
	}

	public async getStates(): Promise<IStakeStates> {
		return {
			canStake: await this.contract.methods.canStake().call(),
			canUnstake: await this.contract.methods.canUnstake().call(),
			lockMinTimeInSecond: await this.contract.methods.lockMinTimeInSecond().call(),
			minStakeAmt: Web3Wrapper.fromWei(
				(await this.contract.methods.minStakeAmtInWei().call()).valueOf()
			),
			maxStakePerOracle: Web3Wrapper.fromWei(
				(await this.contract.methods.maxOracleStakeAmtInWei().call()).valueOf()
			),
			totalAwardsToDistribute: Web3Wrapper.fromWei(
				(await this.contract.methods.totalAwardsToDistributeInWei().call()).valueOf()
			)
		};
	}

	public async getAddresses(): Promise<IStakeAddress> {
		return {
			priceFeedList: await this.getOracleList(),
			operator: await this.contract.methods.operator().call()
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
			const oracleStake = await this.contract.methods.totalStakAmtInWei(oracleAddr).call();
			oracleStakes[oracleAddr] = Web3Wrapper.fromWei((oracleStake));
		}
		return oracleStakes;
	}

	public async getUserAward(account: string): Promise<number> {
		const awardsInWei = await this.contract.methods.awardsInWei(account).call();
		return Web3Wrapper.fromWei(awardsInWei);
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
			CST.DEFAULT_GAS_PRICE,
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
			CST.DEFAULT_GAS_PRICE,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.unstake(oracleAddr)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async claimAward(account: string, option: ITransactionOption = {}): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_GAS_PRICE,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.claimAward(true, 0)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async batchAddAward(
		account: string,
		addrList: string[],
		awardList: number[],
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_GAS_PRICE,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.batchAddAward(addrList, awardList.map(award => Web3Wrapper.toWei(award)))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async batchReduceAward(
		account: string,
		addrList: string[],
		awardList: number[],
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_GAS_PRICE,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.batchReduceAward(addrList, awardList.map(award => Web3Wrapper.toWei(award)))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async enableStakingAndUnstaking(
		account: string,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_GAS_PRICE,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.setStakeFlag(true, true)
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async disableStakingAndUnstaking(
		account: string,
		option: ITransactionOption = {}
	): Promise<string> {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.DEFAULT_GAS_PRICE,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.setStakeFlag(false, false)
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
			CST.DEFAULT_GAS_PRICE,
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
			CST.DEFAULT_GAS_PRICE,
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

export default StakeWrapper;
