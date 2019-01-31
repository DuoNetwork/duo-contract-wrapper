import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import esplanadeAbi from './static/Esplanade.json';
import { IEsplanadeStates, ITransactionOption, IVotingData } from './types';
import Web3Wrapper from './Web3Wrapper';

export class EsplanadeWrapper extends BaseContractWrapper {
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

	public async getVotingStage() {
		return EsplanadeWrapper.convertVotingStage(
			await this.contract.methods.votingStage().call()
		);
	}

	public getModerator(): Promise<string> {
		return this.contract.methods.moderator().call();
	}

	public getCandidate(): Promise<string> {
		return this.contract.methods.candidate().call();
	}

	public async getAddressPoolSize(isHot: boolean) {
		const poolSize = await this.contract.methods.getAddressPoolSizes().call();
		return Number(poolSize[this.getAddressPoolIndex(isHot)].valueOf());
	}

	public async getContractPoolSize(isCustodian: boolean) {
		const contractSizes = await this.contract.methods.getContractPoolSizes().call();
		return Number(contractSizes[isCustodian ? 0 : 1].valueOf());
	}

	public getAddressPoolAddress(isHot: boolean, index: number): Promise<string> {
		return this.contract.methods.addrPool(this.getAddressPoolIndex(isHot), index).call();
	}

	public async getContractPoolAddress(isCustodian: boolean, index: number): Promise<string> {
		return isCustodian
			? await this.contract.methods.custodianPool(index).call()
			: await this.contract.methods.otherContractPool(index).call();
	}

	public async getOperationCoolDown() {
		return Number((await this.contract.methods.operatorCoolDown().call()).valueOf()) * 1000;
	}

	public async getLastOperationTime() {
		return Number((await this.contract.methods.lastOperationTime().call()).valueOf()) * 1000;
	}

	public isStarted(): Promise<boolean> {
		return this.contract.methods.started().call();
	}

	public isContractPassed(address: string): Promise<boolean> {
		return this.contract.methods.passedContract(address).call();
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

	public async startContractVoting(
		account: string,
		candidateAddress: string,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.startContractVoting(candidateAddress)
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}

	public async terminateContractVoting(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.terminateContractVoting()
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}

	public async terminateByTimeout(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.terminateByTimeout()
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}

	public async startModeratorVoting(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.startModeratorVoting()
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}

	public async vote(account: string, voteFor: boolean, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.vote(voteFor)
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}

	public async startManager(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.startManager()
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}

	public async addCustodian(
		account: string,
		custodianAddr: string,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.addCustodian(custodianAddr)
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}

	public async addOtherContracts(
		account: string,
		contractAddr: string,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.addOtherContracts(contractAddr)
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}

	public async addAddress(
		account: string,
		addr1: string,
		addr2: string,
		hot: boolean,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.addAddress(addr1, addr2, this.getAddressPoolIndex(hot))
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}

	public async removeAddress(
		account: string,
		addr: string,
		hot: boolean,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.removeAddress(addr, this.getAddressPoolIndex(hot))
			.send(await this.web3Wrapper.getTransactionOption(account, 200000, option));
	}
}

export default EsplanadeWrapper;
