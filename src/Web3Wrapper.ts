import Web3 from 'web3';
import { Contract, EventLog } from 'web3/types';
import * as CST from './constants';
import { kovan, mainnet } from './contractAddresses';
import erc20Abi from './static/ERC20.json';
import { IContractAddresses, IEthTxOption, IEvent, Wallet } from './types';
import util from './util';

const HDWalletProvider = require('./external/HDWalletProvider');
const BigNumber = require('bignumber.js');
const ProviderEngine = require('web3-provider-engine');
const FetchSubprovider = require('web3-provider-engine/subproviders/fetch');
const createLedgerSubprovider = require('@ledgerhq/web3-subprovider').default;
const TransportU2F = require('@ledgerhq/hw-transport-u2f').default;
const Tx = require('ethereumjs-tx');

export default class Web3Wrapper {
	private web3: Web3;
	public wallet: Wallet = Wallet.None;
	public accountIndex: number = 0;
	private live: boolean;
	private provider: string;
	public readonly contractAddresses: IContractAddresses;
	public readonly inceptionBlockNumber: number;
	private handleSwitchToMetaMask: Array<() => any>;
	private handleSwitchToLedger: Array<() => any>;

	constructor(window: any, provider: string, privateKey: string, live: boolean) {
		this.live = live;
		this.contractAddresses = this.live ? mainnet : kovan;
		this.provider = provider;
		if (window && (window.ethereum || window.web3)) {
			this.web3 = new Web3(window.ethereum || window.web3.currentProvider);
			this.wallet = Wallet.MetaMask;
		} else if (!window && privateKey) {
			const hdWallet = new HDWalletProvider(
				privateKey,
				new Web3.providers.HttpProvider(provider)
			);
			this.web3 = new Web3(hdWallet);
			this.wallet = Wallet.Local;
		} else {
			this.web3 = new Web3(provider);
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
			this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
			this.wallet = Wallet.None;
		}

		this.accountIndex = 0;

		this.handleSwitchToMetaMask.forEach(h => {
			try {
				h();
			} catch (error) {
				util.logError(error);
			}
		});
	}

	public async switchToLedger() {
		const engine = new ProviderEngine();
		const getTransport = () => TransportU2F.create();
		const networkId = this.live ? CST.ETH_MAINNET_ID : CST.ETH_KOVAN_ID;
		const rpcUrl = this.provider;
		const ledger = createLedgerSubprovider(getTransport, {
			networkId,
			accountsLength: 5
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
				util.logError(error);
			}
		});
		return accounts;
	}

	public onWeb3AccountUpdate(onUpdate: (addr: string, network: number) => any) {
		if (this.wallet !== Wallet.MetaMask) return;

		const store = (this.web3.currentProvider as any).publicConfigStore;
		if (store)
			store.on('update', () => {
				if (this.wallet === Wallet.MetaMask)
					onUpdate(
						store.getState().selectedAddress || '',
						Number(store.getState().networkVersion || '')
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

	public wrongEnvReject() {
		return Promise.reject('Wrong Env');
	}

	public generateTxString(abi: object, input: any[]): string {
		return this.web3.eth.abi.encodeFunctionCall(abi, input);
	}

	public createTxCommand(
		nonce: number,
		gasPrice: number,
		gasLimit: number,
		toAddr: string,
		amount: number,
		data: string
	) {
		return {
			nonce, // web3.utils.toHex(nonce), //nonce,
			gasPrice: this.web3.utils.toHex(gasPrice),
			gasLimit: this.web3.utils.toHex(gasLimit),
			to: toAddr,
			value: this.web3.utils.toHex(this.web3.utils.toWei(amount.toString(), 'ether')),
			data
		};
	}

	public signTx(rawTx: object, privateKey: string): string {
		try {
			const tx = new Tx(rawTx);
			tx.sign(new Buffer(privateKey, 'hex'));
			return tx.serialize().toString('hex');
		} catch (err) {
			util.logError(err);
			return '';
		}
	}

	public getGasPrice() {
		return this.web3.eth.getGasPrice();
	}

	public async ethTransferRaw(
		from: string,
		privatekey: string,
		to: string,
		amt: number,
		nonce: number
	) {
		if (!this.isLocal()) return this.wrongEnvReject();
		from = from || (await this.getCurrentAddress());
		const rawTx = {
			nonce: nonce,
			gasPrice: this.web3.utils.toHex((await this.getGasPrice()) || CST.DEFAULT_GAS_PRICE),
			gasLimit: this.web3.utils.toHex(23000),
			from: from,
			to: to,
			value: this.web3.utils.toHex(this.web3.utils.toWei(amt.toPrecision(3) + '', 'ether'))
		};
		return this.web3.eth
			.sendSignedTransaction('0x' + this.signTx(rawTx, privatekey))
			.then(receipt => util.logInfo(JSON.stringify(receipt, null, 4)));
	}

	public async sendEther(from: string, to: string, value: number, option: IEthTxOption = {}) {
		const gasPrice = option.gasPrice || (await this.getGasPrice());
		const gasLimit = option.gasLimit || CST.DEFAULT_GAS_PRICE;
		from = from || (await this.getCurrentAddress());
		const nonce = option.nonce || (await this.getTransactionCount(from));

		return this.web3.eth.sendTransaction({
			from: from,
			to: to,
			value: this.toWei(value),
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
		option: IEthTxOption = {}
	) {
		if (this.isReadOnly()) return this.readOnlyReject();
		const gasPrice = option.gasPrice || (await this.getGasPrice());
		const gasLimit = option.gasLimit || CST.DEFAULT_TX_GAS_LIMIT;
		from = from || (await this.getCurrentAddress());
		const nonce = option.nonce || (await this.getTransactionCount(from));
		const erc20Contract = new this.web3.eth.Contract(erc20Abi.abi, contractAddress);

		return erc20Contract.methods.transfer(to, this.toWei(value)).send({
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
	) {
		if (this.isReadOnly()) return this.readOnlyReject();
		from = from || (await this.getCurrentAddress());
		return new Promise<string>(resolve => {
			const erc20Contract = new this.web3.eth.Contract(erc20Abi.abi, contractAddress);
			return erc20Contract.methods
				.approve(
					spender,
					unlimited ? new BigNumber(2).pow(256).minus(1) : this.toWei(value)
				)
				.send({
					from: from
				})
				.on('transactionHash', txHash => resolve(txHash));
		});
	}

	public getCurrentBlockNumber() {
		return this.web3.eth.getBlockNumber();
	}

	public getBlock(blkNumber: number) {
		return this.web3.eth.getBlock(blkNumber);
	}

	public async getBlockTimestamp(blkNumber: number = 0): Promise<number> {
		if (!blkNumber) blkNumber = await this.getCurrentBlockNumber();
		const blk = await this.web3.eth.getBlock(blkNumber);
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
		return this.fromWei(await this.web3.eth.getBalance(address));
	}

	public async getErc20Balance(contractAddress: string, address: string) {
		const erc20Contract = new this.web3.eth.Contract(erc20Abi.abi, contractAddress);

		return this.fromWei(await erc20Contract.methods.balanceOf(address).call());
	}

	public async getErc20Allowance(contractAddress: string, address: string, spender: string) {
		const erc20Contract = new this.web3.eth.Contract(erc20Abi.abi, contractAddress);

		return this.fromWei(await erc20Contract.methods.allowance(address, spender).call());
	}

	public fromWei(value: string | number) {
		return Number(this.web3.utils.fromWei(value, 'ether'));
	}

	public toWei(value: string | number) {
		return this.web3.utils.toWei(value + '', 'ether');
	}

	public checkAddress(addr: string) {
		if (!addr.startsWith('0x') || addr.length !== 42) return false;
		return this.web3.utils.checkAddressChecksum(this.web3.utils.toChecksumAddress(addr));
	}

	public getTransactionReceipt(txHash: string) {
		return this.web3.eth.getTransactionReceipt(txHash);
	}

	public static parseEvent(eventLog: EventLog, timestamp: number): IEvent {
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

	public static async pullEvents(
		contract: Contract,
		start: number,
		end: number,
		event: string
	): Promise<EventLog[]> {
		return contract.getPastEvents(event, {
			fromBlock: start,
			toBlock: end
		});
	}

	public createContract(abi: any[], address: string): Contract {
		return new this.web3.eth.Contract(abi, address);
	}

	public getTransactionCount(address: string) {
		return this.web3.eth.getTransactionCount(address);
	}

	public sendSignedTransaction(signedTx: string) {
		return new Promise<string>(resolve =>
			this.web3.eth
				.sendSignedTransaction('0x' + signedTx)
				.on('transactionHash', txHash => resolve(txHash))
		);
	}
}
