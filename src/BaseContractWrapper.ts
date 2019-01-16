import { Contract } from 'web3/types';
// import * as CST from './constants';
// import { IEthTxOption } from './types';
import Web3Wrapper from './Web3Wrapper';
const abiDecoder = require('abi-decoder');

export default abstract class BaseContractWrapper {
	public readonly web3Wrapper: Web3Wrapper;
	public readonly address: string;
	public readonly abi: any[];
	public readonly events: string[] = [];
	public contract: Contract;

	constructor(web3Wrapper: Web3Wrapper, abi: any[], contractAddress: string) {
		this.web3Wrapper = web3Wrapper;
		this.address = contractAddress;
		this.abi = abi;
		this.contract = this.web3Wrapper.createContract(this.abi, this.address);
		this.web3Wrapper.onSwitchToMetaMask(() => {
			this.contract = this.web3Wrapper.createContract(this.abi, this.address);
		});
		this.web3Wrapper.onSwitchToLedger(() => {
			this.contract = this.web3Wrapper.createContract(this.abi, this.address);
		});
	}

	// public async sendTransactionRaw(
	// 	address: string,
	// 	privateKey: string,
	// 	contractAddr: string,
	// 	value: number,
	// 	command: string,
	// 	option: IEthTxOption = {}
	// ) {
	// 	const nonce = option.nonce || (await this.web3Wrapper.getTransactionCount(address));
	// 	const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
	// 	const gasLimit = option.gasLimit || CST.DEFAULT_GAS_PRICE;
	// 	return this.web3Wrapper.sendSignedTransaction(
	// 		this.web3Wrapper.signTx(
	// 			this.web3Wrapper.createTxCommand(
	// 				nonce,
	// 				gasPrice,
	// 				gasLimit,
	// 				contractAddr,
	// 				value,
	// 				command
	// 			),
	// 			privateKey
	// 		)
	// 	);
	// }

	public async getContractCode(): Promise<string> {
		const code = await this.contract.methods.contractCode().call();
		return code.valueOf();
	}

	public decode(input: string): any {
		abiDecoder.addABI(this.abi);
		return abiDecoder.decodeMethod(input);
	}
}
