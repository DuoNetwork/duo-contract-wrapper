import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import magiAbi from './static/Magi.json';
import { IContractPrice, ITransactionOption } from './types';
import Web3Wrapper from './Web3Wrapper';

export class MagiWrapper extends BaseContractWrapper {
	public readonly events = [
		CST.EVENT_UPDATE_ROLE_MANAGER,
		CST.EVENT_UPDATE_OPERATOR,
		CST.EVENT_COMMIT_PRICE,
		CST.EVENT_ACCEPT_PRICE,
		CST.EVENT_SET_VALUE,
		CST.EVENT_UPDATE_PRICE_FEED
	];
	constructor(web3Wrapper: Web3Wrapper, address: string) {
		super(web3Wrapper, magiAbi.abi, address);
	}

	public async isStarted(): Promise<boolean> {
		return await this.contract.methods.started().call();
	}

	public async startMagi(
		account: string,
		price: number,
		timeInSecond: number,
		option: ITransactionOption = {}
	) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		return this.contract.methods
			.startOracle(Web3Wrapper.toWei(price), timeInSecond)
			.send(await this.web3Wrapper.getTransactionOption(account, CST.START_MAGI_GAS, option));
	}

	public async commitPrice(
		account: string,
		price: number,
		timeInSecond: number,
		option: ITransactionOption = {}
	) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		return this.contract.methods
			.commitPrice(Web3Wrapper.toWei(price), timeInSecond)
			.send(
				await this.web3Wrapper.getTransactionOption(account, CST.COMMIT_PRICE_GAS, option)
			);
	}

	public async getLastPrice(): Promise<IContractPrice> {
		const lastPrice = await this.contract.methods.getLastPrice().call();
		return {
			price: Web3Wrapper.fromWei(lastPrice[0].valueOf()),
			timestamp: Number(lastPrice[1].valueOf()) * 1000
		};
	}

	public async updatePriceFeed(account: string, index: number, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.updatePriceFeed(index)
			.send(
				await this.web3Wrapper.getTransactionOption(account, CST.UPDATE_PRICE_FEED, option)
			);
	}

	public async setValue(
		account: string,
		index: number,
		newValue: number,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.setValue(index, newValue)
			.send(await this.web3Wrapper.getTransactionOption(account, CST.SET_VALUE_GAS, option));
	}

	public async updateRoleManager(
		account: string,
		newManagerAddr: string,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.updateRoleManager(newManagerAddr)
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.UPDATE_ROLE_MANAGER_GAS,
					option
				)
			);
	}

	public async updateOperator(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.updateOperator()
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.UPDATE_ROLE_MANAGER_GAS,
					option
				)
			);
	}
}

export default MagiWrapper;
