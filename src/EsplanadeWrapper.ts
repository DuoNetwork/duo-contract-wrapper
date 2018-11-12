import { Contract } from 'web3/types';
import * as CST from './constants';
import esplanadeAbi from './static/Esplanade.json';
import { IAddress, IVotingData } from './types';
import Web3Wrapper from './Web3Wrapper';

export default class EsplanadeWapper {
	public web3Wrapper: Web3Wrapper;
	public contract: Contract;
	public readonly address: string;

	public readonly inceptionBlk: number = 0;
	// private live: boolean;

	constructor(web3Wrapper: Web3Wrapper, live: boolean) {
		// this.live = live;
		this.web3Wrapper = web3Wrapper;

		this.address = live ? CST.ESPLANADE_ADDR_MAIN : CST.ESPLANADE_ADDR_KOVAN;
		this.contract = new this.web3Wrapper.web3.eth.Contract(esplanadeAbi.abi, this.address);
		this.inceptionBlk = live ? CST.INCEPTION_BLK_MAIN : CST.INCEPTION_BLK_KOVAN;
	}

	public switchToMetaMask(window: any) {
		this.web3Wrapper.switchToMetaMask(window);
		this.contract = new this.web3Wrapper.web3.eth.Contract(esplanadeAbi.abi, this.address);
	}

	public async switchToLedger() {
		const accounts = this.web3Wrapper.switchToLedger();
		this.contract = new this.web3Wrapper.web3.eth.Contract(esplanadeAbi.abi, this.address);
		return accounts;
	}

	public getAddressPoolIndex(hot: boolean) {
		return hot ? 1 : 0;
	}

	public async getVotingStage() {
		const stage = await this.contract.methods.votingStage().call();

		switch (stage.valueOf()) {
			case CST.VOTING_MODERATOR:
				return CST.ESP_MODERATOR;
			case CST.VOTING_CONTRACT:
				return CST.ESP_CONTRACT;
			default:
				return CST.ESP_NOT_STARTED;
		}
	}

	public async getModerator(): Promise<IAddress> {
		const moderator = await this.contract.methods.moderator().call();
		return {
			address: moderator,
			balance: await this.web3Wrapper.getEthBalance(moderator)
		};
	}

	public async getCandidate(): Promise<IAddress> {
		const candidate = await this.contract.methods.candidate().call();
		return {
			address: candidate,
			balance: await this.web3Wrapper.getEthBalance(candidate)
		};
	}

	public async getPoolAddresses(hot: boolean): Promise<IAddress[]> {
		const poolIndex = this.getAddressPoolIndex(hot);
		const poolSizes = await this.contract.methods.getAddressPoolSizes().call();
		const length = Number(poolSizes[poolIndex].valueOf());
		const addresses: IAddress[] = [];
		for (let i = 0; i < length; i++) {
			const poolAddr = await this.contract.methods.addrPool(poolIndex, i).call();
			addresses.push({
				address: poolAddr,
				balance: await this.web3Wrapper.getEthBalance(poolAddr)
			});
		}

		return addresses;
	}

	public async getContractAddresses(custodian: boolean): Promise<IAddress[]> {
		const poolSizes = await this.contract.methods.getContractPoolSizes().call();
		const length = Number(poolSizes[custodian ? 0 : 1].valueOf());
		const addresses: IAddress[] = [];
		for (let i = 0; i < length; i++) {
			const poolAddr = custodian
				? await this.contract.methods.custodianPool(i).call()
				: await this.contract.methods.otherContractPool(i).call();
			addresses.push({
				address: poolAddr,
				balance: await this.web3Wrapper.getEthBalance(poolAddr)
			});
		}

		return addresses;
	}

	public async getOperationCoolDown() {
		return Number((await this.contract.methods.operatorCoolDown().call()).valueOf()) * 1000;
	}

	public async getLastOperationTime() {
		return Number((await this.contract.methods.lastOperationTime().call()).valueOf()) * 1000;
	}

	public async isStarted(): Promise<boolean> {
		const started = await this.contract.methods.started().call();
		return started === 'true' ? true : false;
	}

	public async getVotingData(): Promise<IVotingData> {
		return {
			started: Number((await this.contract.methods.voteStartTimestamp().call()).valueof()) * 1000,
			votedFor: Number((await this.contract.methods.votedFor().call()).valueof()),
			votedAgainst: Number((await this.contract.methods.votedAgainst().call()).valueof()),
			totalVoters: Number((await this.contract.methods.getAddressPoolSizes().call())[this.getAddressPoolIndex(false)].valueof())
		}
	}

	public startContractVoting(address: string, candidateAddress: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods.startContractVoting(candidateAddress).send({
			from: address
		});
	}

	public terminateContractVoting(address: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods.terminateContractVoting().send({
			from: address
		});
	}

	public terminateByTimeout(address: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods.terminateByTimeout().send({
			from: address
		});
	}

	public startModeratorVoting(address: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods.startModeratorVoting().send({
			from: address
		});
	}

	public vote(address: string, voteFor: boolean) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods.vote(voteFor).send({
			from: address
		});
	}

	public startManager(address: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods.startManager().send({
			from: address
		});
	}

	public addCustodian(address: string, custodianAddr: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods.addCustodian(custodianAddr).send({
			from: address
		});
	}

	public addOtherContracts(address: string, contractAddr: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods.addOtherContracts(contractAddr).send({
			from: address
		});
	}

	public addAddress(address: string, addr1: string, addr2: string, hot: boolean) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.addAddress(addr1, addr2, this.getAddressPoolIndex(hot)).send({
			from: address
		});
	}

	public removeAddress(address: string, addr: string, hot: boolean) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.removeAddress(addr, this.getAddressPoolIndex(hot)).send({
			from: address
		});
	}
}
