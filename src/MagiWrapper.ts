import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import magiAbi from './static/Magi.json';
import { IContractPrice, IMagiAddresses, IMagiStates, ITransactionOption } from './types';
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

	public async getStates(): Promise<IMagiStates> {
		const firstPrice = await this.contract.methods.firstPrice().call();
		const secondPrice = await this.contract.methods.secondPrice().call();

		return {
			isStarted: await this.isStarted(),
			firstPrice: {
				price: Web3Wrapper.fromWei(firstPrice[0].valueOf()),
				timestamp: firstPrice[1].valueOf() * 1000,
				source: firstPrice[2].valueOf()
			},
			secondPrice: {
				price: Web3Wrapper.fromWei(secondPrice[0].valueOf()),
				timestamp: secondPrice[1].valueOf() * 1000,
				source: secondPrice[2].valueOf()
			},
			priceTolerance: (await this.contract.methods.priceTolInBP().call()) / 10000,
			priceFeedTolerance: (await this.contract.methods.priceFeedTolInBP().call()) / 10000,
			priceFeedTimeTolerance: (await this.contract.methods.priceFeedTimeTol().call()) * 1000,
			priceUpdateCoolDown: (await this.contract.methods.priceUpdateCoolDown().call()) * 1000,
			numOfPrices: Number(await this.contract.methods.numOfPrices().call()),
			lastOperationTime: (await this.contract.methods.lastOperationTime().call()) * 1000,
			operationCoolDown: (await this.contract.methods.operationCoolDown().call()) * 1000
		};
	}

	public async getAddresses(): Promise<IMagiAddresses> {
		return {
			priceFeed: [
				await this.contract.methods.priceFeed1().call(),
				await this.contract.methods.priceFeed2().call(),
				await this.contract.methods.priceFeed3().call()
			],
			operator: await this.contract.methods.operator().call(),
			roleManagerAddress: await this.contract.methods.roleManagerAddress().call()
		};
	}

	public async getLastPrice(): Promise<IContractPrice> {
		const lastPrice = await this.contract.methods.getLastPrice().call();
		return {
			price: Web3Wrapper.fromWei(lastPrice[0].valueOf()),
			timestamp: Number(lastPrice[1].valueOf()) * 1000
		};
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
			.send(await this.web3Wrapper.getTransactionOption(account, CST.MAGI_SET_VALUE_GAS, option));
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
					CST.UPDATE_OPERATOR,
					option
				)
			);
	}
}

export default MagiWrapper;
