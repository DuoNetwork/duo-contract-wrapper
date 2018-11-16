import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import esplanadeAbi from './static/Esplanade.json';
import { IVotingData } from './types';
import util from './util';
import Web3Wrapper from './Web3Wrapper';

export default class EsplanadeWapper extends BaseContractWrapper {
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

	public getAddressPoolIndex(hot: boolean) {
		return hot ? 1 : 0;
	}

	public static convertVotingStage(stage: string) {
		switch (stage.valueOf()) {
			case CST.VOTING_MODERATOR:
				return CST.ESP_MODERATOR;
			case CST.VOTING_CONTRACT:
				return CST.ESP_CONTRACT;
			default:
				return CST.ESP_NOT_STARTED;
		}
	}

	public async getVotingStage() {
		const stage = await this.contract.methods.votingStage().call();
		return EsplanadeWapper.convertVotingStage(stage.valueOf());
	}

	public getModerator(): Promise<string> {
		return this.contract.methods.moderator().call();
	}

	public getCandidate(): Promise<string> {
		return this.contract.methods.candidate().call();
	}

	public async getPoolAddresses(hot: boolean): Promise<string[]> {
		const poolIndex = this.getAddressPoolIndex(hot);
		const poolSizes = await this.contract.methods.getAddressPoolSizes().call();
		const length = Number(poolSizes[poolIndex].valueOf());
		const addresses: string[] = [];
		for (let i = 0; i < length; i++)
			addresses.push(await this.contract.methods.addrPool(poolIndex, i).call());

		return addresses;
	}

	public async getContractAddresses(custodian: boolean): Promise<string[]> {
		const poolSizes = await this.contract.methods.getContractPoolSizes().call();
		const length = Number(poolSizes[custodian ? 0 : 1].valueOf());
		const addresses: string[] = [];
		for (let i = 0; i < length; i++)
			addresses.push(
				custodian
					? await this.contract.methods.custodianPool(i).call()
					: await this.contract.methods.otherContractPool(i).call()
			);

		return addresses;
	}

	public async getOperationCoolDown() {
		return Number((await this.contract.methods.operatorCoolDown().call()).valueOf()) * 1000;
	}

	public async getLastOperationTime() {
		return Number((await this.contract.methods.lastOperationTime().call()).valueOf()) * 1000;
	}

	public async isStarted(): Promise<boolean> {
		return await this.contract.methods.started().call();
	}

	public async getVotingData(): Promise<IVotingData> {
		return {
			started:
				Number((await this.contract.methods.voteStartTimestamp().call()).valueof()) * 1000,
			votedFor: Number((await this.contract.methods.votedFor().call()).valueof()),
			votedAgainst: Number((await this.contract.methods.votedAgainst().call()).valueof()),
			totalVoters: Number(
				(await this.contract.methods.getAddressPoolSizes().call())[
					this.getAddressPoolIndex(false)
				].valueof()
			)
		};
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

	public async startManagerRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		util.logInfo(`the account ${address} is starting esplanade`);

		const abi = {
			name: 'startManager',
			type: 'function',
			inputs: []
		};

		const command = this.web3Wrapper.generateTxString(abi, []);
		await this.sendTransactionRaw(
			address,
			privateKey,
			this.address,
			0,
			gasPrice,
			gasLimit,
			nonce,
			command
		);
	}

	public addCustodian(address: string, custodianAddr: string) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods.addCustodian(custodianAddr).send({
			from: address
		});
	}

	public async addCustodianRaw(
		address: string,
		privateKey: string,
		custodianAddr: string,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		util.logInfo(`the account ${address} is addCustodian ${custodianAddr}`);
		const abi = {
			type: 'function',
			inputs: [
				{
					name: 'custodianAddr',
					type: 'address'
				}
			],
			name: 'addCustodian'
		};

		const input = [custodianAddr];
		const command = this.web3Wrapper.generateTxString(abi, input);
		await this.sendTransactionRaw(
			address,
			privateKey,
			this.address,
			0,
			gasPrice,
			gasLimit,
			nonce,
			command
		);
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
