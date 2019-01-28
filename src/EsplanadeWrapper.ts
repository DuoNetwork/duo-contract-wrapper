import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import esplanadeAbi from './static/Esplanade.json';
import { IEsplanadeStates, IVotingData } from './types';
import Web3Wrapper from './Web3Wrapper';

export default class EsplanadeWrapper extends BaseContractWrapper {
	public readonly events = [
		CST.EVENT_ADD_ADDRESS,
		CST.EVENT_REMOVE_ADDRESS,
		CST.EVENT_PROVIDE_ADDRESS,
		CST.EVENT_ADD_CUSTODIAN,
		CST.EVENT_ADD_OTHER_CONTRACT,
		CST.EVENT_START_CONTRACT_VOTING,
		CST.EVENT_TERMINATE_CONTRACT_VOTING,
		CST.EVENT_START_MODERATOR_VOTING,
		CST.EVENT_TERMINATEBY_TIMEOUT,
		CST.EVENT_VOTE,
		CST.EVENT_COMPLETE_VOTING,
		CST.EVENT_REPLACE_MODERATOR
	];
	constructor(web3Wrapper: Web3Wrapper, address: string) {
		super(web3Wrapper, esplanadeAbi.abi, address);
	}

	public async getStates(): Promise<IEsplanadeStates> {
		const hotColdSizes = await this.contract.methods.getAddressPoolSizes().call();
		const contractSizes = await this.contract.methods.getContractPoolSizes().call();
		return {
			isStarted: await this.isStarted(),
			votingStage: await this.getVotingStage(),
			poolSizes: {
				hot: Number(hotColdSizes[1].valueOf()),
				cold: Number(hotColdSizes[0].valueOf()),
				custodian: Number(contractSizes[0].valueOf()),
				otherContract: Number(contractSizes[1].valueOf())
			},
			operationCoolDown: await this.getOperationCoolDown(),
			lastOperationTime: await this.getLastOperationTime()
		};
	}

	public getAddressPoolIndex(hot: boolean) {
		return hot ? 1 : 0;
	}

	public static convertVotingStage(stage: string) {
		switch (stage) {
			case CST.VOTING_MODERATOR:
				return CST.ESP_MODERATOR;
			case CST.VOTING_CONTRACT:
				return CST.ESP_CONTRACT;
			default:
				return CST.ESP_NOT_STARTED;
		}
	}

	public async getVotingStage(): Promise<string> {
		const stage = await this.contract.methods.votingStage().call();
		return EsplanadeWrapper.convertVotingStage(stage.valueOf());
	}

	public async getModerator(): Promise<string> {
		return (await this.contract.methods.moderator().call()).valueOf();
	}

	public async getCandidate(): Promise<string> {
		return (await this.contract.methods.candidate().call()).valueOf();
	}

	public async getPoolSize(isHot: boolean): Promise<number> {
		const poolSize = await this.contract.methods.getAddressPoolSizes().call();
		return Number(poolSize[isHot ? 1 : 0].valueOf());
	}

	public async getContractSize(isContract: boolean) {
		const contractSizes = await this.contract.methods.getContractPoolSizes().call();
		return Number(contractSizes[isContract ? 0 : 1].valueOf());
	}

	public async getPoolAddr(isHot: boolean, index: number): Promise<string> {
		const poolIndex = this.getAddressPoolIndex(isHot);
		return (await this.contract.methods.addrPool(poolIndex, index).call()).valueOf();
	}

	public async getContractAddr(isCustodian: boolean, index: number): Promise<string> {
		const addr = isCustodian
			? await this.contract.methods.custodianPool(index).call()
			: await this.contract.methods.otherContractPool(index).call();
		return addr.valueOf();
	}

	public async getOperationCoolDown(): Promise<number> {
		return Number((await this.contract.methods.operatorCoolDown().call()).valueOf()) * 1000;
	}

	public async getLastOperationTime(): Promise<number> {
		return Number((await this.contract.methods.lastOperationTime().call()).valueOf()) * 1000;
	}

	public async isStarted(): Promise<boolean> {
		const isStarted = await this.contract.methods.started().call();
		return isStarted.valueOf();
	}

	public async getVotingData(): Promise<IVotingData> {
		return {
			started: (await this.contract.methods.voteStartTimestamp().call()) * 1000,
			votedFor: await this.contract.methods.votedFor().call(),
			votedAgainst: await this.contract.methods.votedAgainst().call(),
			totalVoters: (await this.contract.methods.getAddressPoolSizes().call())[
				this.getAddressPoolIndex(false)
			]
		};
	}

	public async startContractVoting(account: string, candidateAddress: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.startContractVoting(candidateAddress).send({
			from: account
		});
	}

	public async terminateContractVoting(account: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.terminateContractVoting().send({
			from: account
		});
	}

	public async terminateByTimeout(account: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.terminateByTimeout().send({
			from: account
		});
	}

	public async startModeratorVoting(account: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.startModeratorVoting().send({
			from: account
		});
	}

	public async vote(account: string, voteFor: boolean) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.vote(voteFor).send({
			from: account
		});
	}

	public async startManager(account: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.startManager().send({
			from: account
		});
	}

	public async addCustodian(account: string, custodianAddr: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.addCustodian(custodianAddr).send({
			from: account
		});
	}

	public async addOtherContracts(account: string, contractAddr: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.addOtherContracts(contractAddr).send({
			from: account
		});
	}

	public async addAddress(account: string, addr1: string, addr2: string, hot: boolean) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.addAddress(addr1, addr2, this.getAddressPoolIndex(hot)).send({
			from: account
		});
	}

	public async removeAddress(account: string, addr: string, hot: boolean) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.removeAddress(addr, this.getAddressPoolIndex(hot)).send({
			from: account
		});
	}
}
