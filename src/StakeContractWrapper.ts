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
			canStake: await this.contract.methods.canStake().call(),
			canUnstake: await this.contract.methods.canUnstake().call(),
			lockMinTimeInSecond: await this.contract.methods.lockMinTimeInSecond().call(),
			minStakeAmt: Web3Wrapper.fromWei(
				(await this.contract.methods.minStakeAmtInWei().call()).valueOf()
			),
			maxStakePerPf: Web3Wrapper.fromWei(
				(await this.contract.methods.maxOracleStakeAmtInWei().call()).valueOf()
			),
			totalAwardsToDistribute: Web3Wrapper.fromWei(
				(await this.contract.methods.totalAwardsToDistributeInWei().call()).valueOf()
			)
		};
	}

	public async getAddresses(): Promise<IStakeAddress> {
		return {
			priceFeedList: await this.getPfList(),
			operator: await this.contract.methods.operator().call()
		};
	}

	private async getPfList(): Promise<string[]> {
		const pfSize = await this.contract.methods.getPfSize().call();
		const pfList = [];
		for (let i = 0; i < pfSize; i++) pfList.push(await this.contract.methods.oracleList(i));

		return pfList;
	}

	public async getUserStakes(account: string): Promise<{ [key: string]: IStakeLot[] }> {
		const pfList = await this.getPfList();
		const userStake: { [key: string]: IStakeLot[] } = {};
		for (const pf of pfList) {
			if (!userStake[pf]) userStake[pf] = [];

			const stakeQueueIdx: IStakeQueueIdx = await this.contract.methods
				.userQueueIdx()
				.call(account, pf);
			if (stakeQueueIdx.last >= stakeQueueIdx.first)
				for (let i = Number(stakeQueueIdx.first); i <= Number(stakeQueueIdx.last); i++) {
					const stakeLot: IStakeLot = await this.contract.methods
						.userStakeQueue()
						.call(account, pf, i);
					userStake[pf].push(stakeLot);
				}
		}
		return userStake;
	}

	public async getUserAward(account: string): Promise<number> {
		const awardsInWei = this.contract.methods.awardsInWei(account).call();
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
				.claimAwabatchAddAwardrd(addrList, awardList.map(award => Web3Wrapper.toWei(award)))
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

	public async disableStakingAndUnstaking(account: string, option: ITransactionOption = {}): Promise<string> {
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

	public async setMaxStakePerPfAmt(
		account: string,
		maxStakePerPf: number,
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
				.setValue(0, Web3Wrapper.toWei(maxStakePerPf))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}
}

export default StakeContractWrapper;
