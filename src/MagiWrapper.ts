import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import magiAbi from './static/Magi.json';
import { IContractPrice, IEthTxOption } from './types';
import util from './util';
import Web3Wrapper from './Web3Wrapper';

export default class MagiWrapper extends BaseContractWrapper {
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

	public async startMagiRaw(
		address: string,
		privateKey: string,
		price: number,
		timeInSecond: number,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		util.logInfo('the account ' + address + ' is starting Magi contract ');

		const abi = {
			name: 'startOracle',
			type: 'function',
			inputs: [
				{
					name: 'priceInWei',
					type: 'uint256'
				},
				{
					name: 'timeInSecond',
					type: 'uint256'
				}
			]
		};

		const input = [this.web3Wrapper.toWei(price), timeInSecond];
		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		await this.commitInternal(input, command, address, privateKey, gasPrice, gasLimit, nonce);
	}

	public async startMagi(account: string, price: number, timeInSecond: number, option: IEthTxOption = {}) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.START_MAGI_GAS;
		return this.contract.methods.startOracle(this.web3Wrapper.toWei(price), timeInSecond).send({
			from: account || await this.web3Wrapper.getCurrentAddress(),
			gasPrice: gasPrice,
			gas: gasLimit
		});
	}

	public async commitPriceRaw(
		address: string,
		privateKey: string,
		price: number,
		timeInSecond: number,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		util.logInfo('the account ' + address + ' is committing price to Magi contract ');
		const abi = {
			name: 'commitPrice',
			type: 'function',
			inputs: [
				{
					name: 'priceInWei',
					type: 'uint256'
				},
				{
					name: 'timeInSecond',
					type: 'uint256'
				}
			]
		};

		const input = [this.web3Wrapper.toWei(price), timeInSecond];
		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		await this.commitInternal(input, command, address, privateKey, gasPrice, gasLimit, nonce);
	}

	public async commitPrice(account: string, price: number, timeInSecond: number, option: IEthTxOption = {}) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.COMMIT_PRICE_GAS;
		return this.contract.methods.commitPrice(this.web3Wrapper.toWei(price), timeInSecond).send({
			from: account || await this.web3Wrapper.getCurrentAddress(),
			gasPrice: gasPrice,
			gas: gasLimit
		});
	}

	public async commitInternal(
		input: number[],
		command: string,
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		nonce: number
	) {
		nonce = nonce === -1 ? await this.web3Wrapper.getTransactionCount(address) : nonce;
		gasPrice = (await this.web3Wrapper.getGasPrice()) || gasPrice;
		util.logInfo(
			`price: ${input[0]}, time: ${
				input[1]
			}  gasPrice: ${gasPrice}, gasLimit: ${gasLimit}, nonce: ${nonce} `
		);
		return this.sendTransactionRaw(address, privateKey, this.address, 0, command, {
			gasPrice,
			gasLimit,
			nonce
		});
	}

	public async getLastPrice(): Promise<IContractPrice> {
		const lastPrice = await this.contract.methods.getLastPrice().call();
		return {
			price: this.web3Wrapper.fromWei(lastPrice[0].valueOf()),
			timestamp: Number(lastPrice[1].valueOf()) * 1000
		};
	}
}
