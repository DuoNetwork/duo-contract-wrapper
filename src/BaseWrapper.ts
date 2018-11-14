import { Contract } from 'web3/types';
import util from './util';
import Web3Wrapper from './Web3Wrapper';

export default abstract class BaseWrapper {
	public web3Wrapper: Web3Wrapper;
	public contract: Contract;
	public readonly events: string[] = [];
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

	public async sendTransactionRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		command: string,
		nonce: number
	) {
		nonce = nonce === -1 ? await this.web3Wrapper.getTransactionCount(address) : nonce;
		gasPrice = (await this.web3Wrapper.getGasPrice()) || gasPrice;
		this.web3Wrapper
			.sendSignedTransaction(
				this.web3Wrapper.signTx(
					this.web3Wrapper.createTxCommand(
						nonce,
						gasPrice,
						gasLimit,
						this.web3Wrapper.contractAddresses.Esplanade,
						0,
						command
					),
					privateKey
				)
			)
			.then(receipt => util.logInfo(receipt))
			.catch(error => util.logInfo(error));
	}
}
