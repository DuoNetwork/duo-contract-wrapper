import { Contract } from 'web3/types';
// import * as CST from './constants';
// import { ITransactionOption } from './types';
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

	public async getContractCode(): Promise<string> {
		const code = await this.contract.methods.contractCode().call();
		return code.valueOf();
	}

	public decode(input: string): any {
		abiDecoder.addABI(this.abi);
		return abiDecoder.decodeMethod(input);
	}
}
