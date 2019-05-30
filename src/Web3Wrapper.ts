import * as CST from './constants';
import { kovan, mainnet } from './contractAddresses';
import erc20Abi from './static/ERC20.json';
import { IContractAddresses, IEvent, ITransactionOption, Wallet } from './types';

const Web3 = require('web3');
const HDWalletProvider = require('./external/HDWalletProvider');
const BigNumber = require('bignumber.js');
const ProviderEngine = require('web3-provider-engine');
const FetchSubprovider = require('web3-provider-engine/subproviders/fetch');
const createLedgerSubprovider = require('@ledgerhq/web3-subprovider').default;
const TransportU2F = require('@ledgerhq/hw-transport-u2f').default;

export class Web3Wrapper {
	public web3: any;
	public wallet: Wallet = Wallet.None;
	public accountIndex: number = 0;
	private live: boolean;
	private providerUrl: string;
	public readonly contractAddresses: IContractAddresses;
	public readonly inceptionBlockNumber: number;
	public handleSwitchToMetaMask: Array<() => any>;
	public handleSwitchToLedger: Array<() => any>;

	constructor(window: any, providerUrl: string, privateKey: string, live: boolean) {
		this.live = live;
		this.contractAddresses = this.live ? mainnet : kovan;
		this.providerUrl = providerUrl;
		if (window && (window.ethereum || window.web3)) {
			this.web3 = new Web3(window.ethereum || window.web3.currentProvider);
			this.wallet = Wallet.MetaMask;
		} else if (!window && privateKey) {
			const hdWallet = new HDWalletProvider(privateKey, providerUrl);
			this.web3 = new Web3(hdWallet);
			this.wallet = Wallet.Local;
		} else {
			this.web3 = new Web3(providerUrl);
			this.wallet = Wallet.None;
		}
		this.handleSwitchToMetaMask = [];
		this.handleSwitchToLedger = [];
		this.inceptionBlockNumber = live ? CST.INCEPTION_BLK_MAIN : CST.INCEPTION_BLK_KOVAN;
	}

	public onSwitchToMetaMask(handleSwitchToMetaMask: () => any) {
		this.handleSwitchToMetaMask.push(handleSwitchToMetaMask);
	}

	public onSwitchToLedger(handleSwitchToLedger: () => any) {
		this.handleSwitchToLedger.push(handleSwitchToLedger);
	}

	public switchToMetaMask(window: any) {
		if (window && (window.ethereum || window.web3)) {
			this.web3 = new Web3(window.ethereum || window.web3.currentProvider);
			this.wallet = Wallet.MetaMask;
		} else {
			this.web3 = new Web3(this.providerUrl);
			this.wallet = Wallet.None;
		}
		this.accountIndex = 0;
		this.handleSwitchToMetaMask.forEach(h => {
			try {
				h();
			} catch (error) {
				console.log(error);
			}
		});
	}

	public async switchToLedger() {
		const engine = new ProviderEngine();
		const getTransport = () => TransportU2F.create();
		const networkId = this.live ? CST.ETH_MAINNET_ID : CST.ETH_KOVAN_ID;
		const rpcUrl = this.providerUrl;
		const ledger = createLedgerSubprovider(getTransport, {
			networkId,
			accountsLength: 20
		});
		engine.addProvider(ledger);
		engine.addProvider(new FetchSubprovider({ rpcUrl }));
		engine.start();
		const newWeb3 = new Web3(engine);
		const accounts = await newWeb3.eth.getAccounts();
		this.web3 = newWeb3;
		this.wallet = Wallet.Ledger;

		this.handleSwitchToLedger.forEach(h => {
			try {
				h();
			} catch (error) {
				console.log(error);
			}
		});
		return accounts;
	}

	public onWeb3AccountUpdate(onUpdate: (addr: string, network: number) => any) {
		if (this.wallet !== Wallet.MetaMask) return;

		const store = (this.web3.currentProvider as any).publicConfigStore;
		if (store)
			store.on('update', () => {
				if (
					this.wallet === Wallet.MetaMask &&
					store.getState().selectedAddress &&
					store.getState().networkVersion
				)
					onUpdate(
						store.getState().selectedAddress,
						Number(store.getState().networkVersion)
					);
			});
	}

	public isReadOnly() {
		return this.wallet === Wallet.None;
	}

	public readOnlyReject() {
		return Promise.reject('Read Only Mode');
	}

	public isLocal() {
		return this.wallet === Wallet.Local;
	}

	public isLive() {
		return this.live;
	}

	public wrongEnvReject() {
		return Promise.reject('Wrong Env');
	}

	public getGasPrice(): Promise<string> {
		return this.web3.eth.getGasPrice();
	}

	public async sendEther(
		from: string,
		to: string,
		value: number,
		option: ITransactionOption = {}
	): Promise<any> {
		const gasPrice = option.gasPrice || (await this.getGasPrice());
		const gasLimit = option.gasLimit || CST.DEFAULT_TX_GAS_LIMIT;
		const nonce = option.nonce || (await this.getTransactionCount(from));

		return this.web3.eth.sendTransaction({
			from: from,
			to: to,
			value: Web3Wrapper.toWei(value),
			gasPrice: gasPrice,
			gas: gasLimit,
			nonce: nonce
		});
	}

	public async erc20Transfer(
		contractAddress: string,
		from: string,
		to: string,
		value: number,
		option: ITransactionOption = {}
	): Promise<any> {
		if (this.isReadOnly()) return this.readOnlyReject();
		const gasPrice = option.gasPrice || (await this.getGasPrice());
		const gasLimit = option.gasLimit || CST.DEFAULT_TX_GAS_LIMIT;
		const nonce = option.nonce || (await this.getTransactionCount(from));
		const erc20Contract = this.createContract(erc20Abi.abi, contractAddress);

		return erc20Contract.methods.transfer(to, Web3Wrapper.toWei(value)).send({
			from: from,
			gasPrice: gasPrice,
			gas: gasLimit,
			nonce: nonce
		});
	}

	public async erc20Approve(
		contractAddress: string,
		from: string,
		spender: string,
		value: number,
		unlimited: boolean = false
	): Promise<any> {
		if (this.isReadOnly()) return this.readOnlyReject();
		return new Promise<string>(resolve => {
			const erc20Contract = this.createContract(erc20Abi.abi, contractAddress);
			return erc20Contract.methods
				.approve(
					spender,
					unlimited
						? Web3Wrapper.toHex(new BigNumber(2).pow(256).minus(1))
						: Web3Wrapper.toWei(value)
				)
				.send({
					from: from
				})
				.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public getCurrentBlockNumber(): Promise<number> {
		return this.web3.eth.getBlockNumber();
	}

	public getBlock(
		blkNumber: number | string
	): Promise<{
		number: number;
		hash: string;
		parentHash: string;
		nonce: string;
		sha3Uncles: string;
		logsBloom: string;
		transactionsRoot: string;
		stateRoot: string;
		receiptsRoot: string;
		miner: string;
		difficulty: string;
		totalDifficulty: string;
		size: number;
		extraData: string;
		gasLimit: string;
		gasUsed: string;
		timestamp: number;
		transactions: string[];
		uncles: string[];
	}> {
		return this.web3.eth.getBlock(blkNumber);
	}

	public async getBlockTimestamp(blkNumber: number = 0) {
		const blk = await this.getBlock(blkNumber || 'latest');
		if (!blk)
			throw new Error('Error: no block found for ' + blkNumber);
		return blk.timestamp * 1000;
	}

	public async getCurrentAddress(): Promise<string> {
		const accounts = await this.web3.eth.getAccounts();
		return accounts[this.accountIndex] || CST.DUMMY_ADDR;
	}

	public getCurrentNetwork(): Promise<number> {
		return this.web3.eth.net.getId();
	}

	public async getEthBalance(address: string): Promise<number> {
		return Web3Wrapper.fromWei(await this.web3.eth.getBalance(address));
	}

	public async getErc20Balance(contractAddress: string, address: string) {
		const erc20Contract = this.createContract(erc20Abi.abi, contractAddress);

		return Web3Wrapper.fromWei(await erc20Contract.methods.balanceOf(address).call());
	}

	public async getErc20Allowance(contractAddress: string, address: string, spender: string) {
		const erc20Contract = this.createContract(erc20Abi.abi, contractAddress);

		return Web3Wrapper.fromWei(await erc20Contract.methods.allowance(address, spender).call());
	}

	public static fromWei(value: string | number) {
		return Number(Web3.utils.fromWei(value, 'ether'));
	}

	public static toWei(value: string | number): any {
		return Web3.utils.toWei(value + '', 'ether');
	}

	public static toHex(value: any): string {
		return Web3.utils.toHex(value);
	}

	public static checkAddress(addr: string): boolean {
		if (!addr.startsWith('0x') || addr.length !== 42) return false;
		return Web3.utils.checkAddressChecksum(Web3.utils.toChecksumAddress(addr));
	}

	public getTransactionReceipt(
		txHash: string
	): Promise<null | {
		status: boolean;
		blockHash: string;
		blockNumber: number;
		transactionHash: string;
		transactionIndex: number;
		from: string;
		to: string;
		contractAddress: string | null;
		cumulativeGasUsed: number;
		gasUsed: number;
		logs: Array<{
			data: string;
			topics: string[];
			logIndex: number;
			transactionIndex: number;
			transactionHash: string;
			blockHash: string;
			blockNumber: number;
			address: string;
		}>;
	}> {
		return this.web3.eth.getTransactionReceipt(txHash);
	}

	public static parseEvent(
		eventLog: {
			event: string;
			address: string;
			returnValues: any;
			logIndex: number;
			transactionIndex: number;
			transactionHash: string;
			blockHash: string;
			blockNumber: number;
			raw?: { data: string; topics: string[] };
		},
		timestamp: number
	): IEvent {
		const returnValue = eventLog.returnValues;
		const output: IEvent = {
			contractAddress: eventLog.address,
			type: eventLog.event,
			id: (eventLog as any)['id'],
			blockHash: eventLog.blockHash,
			blockNumber: eventLog.blockNumber,
			transactionHash: eventLog.transactionHash,
			logStatus: (eventLog as any)['type'],
			parameters: {},
			timestamp: timestamp
		};
		for (const key in returnValue) output.parameters[key] = returnValue[key];

		return output;
	}

	public static pullEvents(
		contract: any,
		start: number,
		end: number,
		event: string
	): Promise<
		Array<{
			event: string;
			address: string;
			returnValues: any;
			logIndex: number;
			transactionIndex: number;
			transactionHash: string;
			blockHash: string;
			blockNumber: number;
			raw?: { data: string; topics: string[] };
		}>
	> {
		return contract.getPastEvents(event, {
			fromBlock: start,
			toBlock: end
		});
	}

	public createContract(abi: any[], address: string): any {
		return new this.web3.eth.Contract(abi, address);
	}

	public getTransactionCount(address: string): Promise<number> {
		return this.web3.eth.getTransactionCount(address);
	}

	public async getTransactionOption(
		account: string,
		defaultGasLimit: number,
		option: ITransactionOption = {}
	) {
		const gasPrice = option.gasPrice || (await this.getGasPrice());
		const gasLimit = option.gasLimit || defaultGasLimit;
		const nonce = option.nonce || (await this.getTransactionCount(account));
		return {
			from: account,
			gasPrice: gasPrice,
			gas: gasLimit,
			nonce: nonce
		};
	}
}

export default Web3Wrapper;
