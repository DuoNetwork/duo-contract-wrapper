import BaseWrapper from './BaseWrapper';
import * as CST from './constants';
import magiAbi from './static/Magi.json';
import { IContractPrice } from './types';
import util from './util';
import Web3Wrapper from './Web3Wrapper';

export default class MagiWapper extends BaseWrapper {
	constructor(web3Wrapper: Web3Wrapper, live: boolean) {
		super(web3Wrapper, magiAbi.abi, web3Wrapper.contractAddresses.Magi);
		this.inceptionBlockNumber = live ? CST.INCEPTION_BLK_MAIN : CST.INCEPTION_BLK_KOVAN;
	}

	public async isStarted(): Promise<boolean> {
		return await this.contract.methods.started().call();
	}

	public async startMagi(
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

	public async commitPrice(
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
		return this.web3Wrapper
			.sendSignedTransaction(
				this.web3Wrapper.signTx(
					this.web3Wrapper.createTxCommand(
						nonce,
						gasPrice,
						gasLimit,
						this.web3Wrapper.contractAddresses.Magi,
						0,
						command
					),
					privateKey
				)
			)
			.then(receipt => util.logInfo(receipt))
			.catch(err => util.logError(err));
	}

	public async getLastPrice(): Promise<IContractPrice> {
		const lastPrice = await this.contract.methods.getLastPrice().call();
		return {
			price: this.web3Wrapper.fromWei(lastPrice[0].valueOf()),
			timestamp: Number(lastPrice[1].valueOf()) * 1000
		};
	}
}
