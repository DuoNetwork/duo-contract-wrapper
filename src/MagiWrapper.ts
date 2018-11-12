import { Contract } from 'web3/types';
import * as CST from './constants';
import magiAbi from './static/Magi.json';
import { IContractPrice } from './types';
import util from './util';
import Web3Wrapper from './Web3Wrapper';

export default class MagiWapper {
	public web3Wrapper: Web3Wrapper;
	public contract: Contract;
	public accountIndex: number = 0;
	public readonly address: string;

	// private live: boolean;

	constructor(web3Wrapper: Web3Wrapper, live: boolean) {
		// this.live = live;
		this.web3Wrapper = web3Wrapper;
		this.address = live ? CST.MAGI_ADDR_MAIN : CST.MAGI_ADDR_KOVAN;
		this.contract = new this.web3Wrapper.web3.eth.Contract(magiAbi.abi, this.address);
	}

	public async getStarted(): Promise<boolean> {
		const started = await this.contract.methods.started().call();
		return started === 'true' ? true : false;
	}

	public async startMagiRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		price: number,
		timeInSecond: number,
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

	public async commitPriceRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		price: number,
		timeInSecond: number,
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

	private async commitInternal(
		input: number[],
		command: string,
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		nonce: number
	) {
		nonce = nonce === -1 ? await this.web3Wrapper.web3.eth.getTransactionCount(address) : nonce;
		gasPrice = (await this.web3Wrapper.getGasPrice()) || gasPrice;
		util.logInfo(
			`price: ${input[0]}, time: ${
				input[1]
			}  gasPrice: ${gasPrice}, gasLimit: ${gasLimit}, nonce: ${nonce} `
		);
		return this.web3Wrapper.web3.eth
			.sendSignedTransaction(
				'0x' +
					this.web3Wrapper.signTx(
						this.web3Wrapper.createTxCommand(
							nonce,
							gasPrice,
							gasLimit,
							this.address,
							0,
							command
						),
						privateKey
					)
			)
			.then(receipt => console.log(receipt))
			.catch(err => console.log(err));
	}

	public async getLastPrice(): Promise<IContractPrice> {
		const lastPrice = await this.contract.methods.getLastPrice().call();
		return {
			price: this.web3Wrapper.fromWei(lastPrice[0].valueOf()),
			timestamp: Number(lastPrice[1].valueOf()) * 1000
		};
	}
}