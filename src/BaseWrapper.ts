import { Contract } from 'web3/types';
import Web3Wrapper from './Web3Wrapper';

export default abstract class BaseWrapper {
	public web3Wrapper: Web3Wrapper;
	public contract: Contract;
	constructor(web3Wrapper: Web3Wrapper, abi: any[], contractAddress: string) {
		this.web3Wrapper = web3Wrapper;
		this.contract = this.web3Wrapper.createContract(abi, contractAddress);
		this.web3Wrapper.onSwitchToMetaMask(() => {
			this.contract = this.web3Wrapper.createContract(abi, contractAddress);
		});
		this.web3Wrapper.onSwitchToLedger(() => {
			this.contract = this.web3Wrapper.createContract(abi, contractAddress);
		});
	}
}
