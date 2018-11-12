import Web3 from 'web3';
import { Contract, EventLog } from 'web3/types';
import * as CST from './constants';
import custodianAbi from './static/Custodian.json';
import erc20Abi from './static/ERC20.json';
import {
	IBeethovanAddresses,
	IBeethovanBalances,
	IBeethovanPrices,
	IBeethovanStates,
	IEvent
} from './types';
const ProviderEngine = require('web3-provider-engine');
const FetchSubprovider = require('web3-provider-engine/subproviders/fetch');
const createLedgerSubprovider = require('@ledgerhq/web3-subprovider').default;
const TransportU2F = require('@ledgerhq/hw-transport-u2f').default;
const abiDecoder = require('abi-decoder');
const Tx = require('ethereumjs-tx');

export enum Wallet {
	None,
	Local,
	MetaMask,
	Ledger
}

export default class ContractUtil {
	public web3: Web3;
	public duo: Contract;
	public tokenA: Contract;
	public tokenB: Contract;
	public custodian: Contract;
	public wallet: Wallet = Wallet.None;
	public accountIndex: number = 0;
	public readonly custodianAddr: string;
	public readonly duoAddr: string;
	public readonly tokenAAddr: string;
	public readonly tokenBAddr: string;

	public readonly inceptionBlk: number = 0;
	private live: boolean;
	private provider: string;

	constructor(window: any, source: string, provider: string, live: boolean) {
		this.live = live;
		this.provider = provider;
		if (window && typeof window.web3 !== 'undefined') {
			this.web3 = new Web3(window.web3.currentProvider);
			this.wallet = Wallet.MetaMask;
		} else if (window) {
			this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
			this.wallet = Wallet.None;
		} else {
			this.web3 = new Web3(
				source
					? new Web3.providers.HttpProvider(provider)
					: new Web3.providers.WebsocketProvider(provider)
			);
			this.wallet = Wallet.Local;
		}

		this.custodianAddr = live ? CST.CUSTODIAN_ADDR_MAIN : CST.CUSTODIAN_ADDR_KOVAN;
		this.duoAddr = live ? CST.DUO_CONTRACT_ADDR_MAIN : CST.DUO_CONTRACT_ADDR_KOVAN;
		this.tokenAAddr = live ? CST.A_CONTRACT_ADDR_MAIN : CST.A_CONTRACT_ADDR_KOVAN;
		this.tokenBAddr = live ? CST.B_CONTRACT_ADDR_MAIN : CST.B_CONTRACT_ADDR_KOVAN;
		this.inceptionBlk = live ? CST.INCEPTION_BLK_MAIN : CST.INCEPTION_BLK_KOVAN;
		this.custodian = new this.web3.eth.Contract(custodianAbi.abi, this.custodianAddr);
		this.duo = new this.web3.eth.Contract(erc20Abi.abi, this.duoAddr);
		this.tokenA = new this.web3.eth.Contract(erc20Abi.abi, this.tokenAAddr);
		this.tokenB = new this.web3.eth.Contract(erc20Abi.abi, this.tokenBAddr);
	}

	public switchToMetaMask(window: any) {
		if (window && typeof (window as any).web3 !== 'undefined') {
			this.web3 = new Web3((window as any).web3.currentProvider);
			this.wallet = Wallet.MetaMask;
		} else {
			this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
			this.wallet = Wallet.None;
		}

		this.accountIndex = 0;
		this.custodian = new this.web3.eth.Contract(custodianAbi.abi, this.custodianAddr);
		this.duo = new this.web3.eth.Contract(erc20Abi.abi, this.duoAddr);
		this.tokenA = new this.web3.eth.Contract(erc20Abi.abi, this.tokenAAddr);
		this.tokenB = new this.web3.eth.Contract(erc20Abi.abi, this.tokenBAddr);
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
		this.custodian = new this.web3.eth.Contract(custodianAbi.abi, this.custodianAddr);
		this.duo = new this.web3.eth.Contract(erc20Abi.abi, this.duoAddr);
		this.tokenA = new this.web3.eth.Contract(erc20Abi.abi, this.tokenAAddr);
		this.tokenB = new this.web3.eth.Contract(erc20Abi.abi, this.tokenBAddr);
		this.wallet = Wallet.Ledger;
		return accounts;
	}

	public onWeb3AccountUpdate(onUpdate: (addr: string, network: number) => any) {
		if (this.wallet !== Wallet.MetaMask) return;

		const store = (this.web3.currentProvider as any).publicConfigStore;
		if (store)
			store.on('update', () => {
				onUpdate(
					store.getState().selectedAddress || '',
					Number(store.getState().networkVersion || '')
				);
			});
	}

	public isReadOnly() {
		return this.wallet === Wallet.None;
	}

	private readOnlyReject() {
		return Promise.reject('Read Only Mode');
	}

	private wrongEnvReject() {
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
	): object {
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
			console.log(err);
			return '';
		}
	}

	public getGasPrice() {
		return this.web3.eth.getGasPrice();
	}

	public async commitPrice(
		address: string,
		privateKey: string,
		price: number,
		timestamp: number,
		gasPrice: number,
		gasLimit: number,
		isInception: boolean = false
	) {
		if (this.wallet !== Wallet.Local) return this.wrongEnvReject();

		const priceInWei: string = this.web3.utils.toWei(price + '', 'ether');
		const priceInSeconds: string = Math.floor(timestamp / 1000) + '';
		console.log('ETH price is ' + priceInWei + ' at timestamp ' + priceInSeconds);
		const nonce = await this.web3.eth.getTransactionCount(address);
		const abi = {
			name: isInception ? CST.FN_START_CONTRACT : CST.FN_COMMIT_PRICE,
			type: 'function',
			inputs: isInception
				? [
						{
							name: 'priceInWei',
							type: 'uint256'
						},
						{
							name: 'timeInSecond',
							type: 'uint256'
						},
						{
							name: 'aAddr',
							type: 'address'
						},
						{
							name: 'bAddr',
							type: 'address'
						}
				]
				: [
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
		const command = this.generateTxString(abi, [
			priceInWei,
			priceInSeconds,
			this.web3.utils.toChecksumAddress(this.tokenAAddr),
			this.web3.utils.toChecksumAddress(this.tokenBAddr)
		]);
		// sending out transaction
		return this.web3.eth
			.sendSignedTransaction(
				'0x' +
					this.signTx(
						this.createTxCommand(
							nonce,
							gasPrice,
							gasLimit,
							this.custodianAddr,
							0,
							command
						),
						privateKey
					)
			)
			.then(receipt => console.log(receipt))
			.catch(error => console.log(error));
	}

	public async createRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		eth: number,
		nonce: number = -1
	) {
		if (this.wallet !== Wallet.Local) return this.wrongEnvReject();

		console.log('the account ' + address + ' is creating tokens with ' + privateKey);
		nonce = nonce === -1 ? await this.web3.eth.getTransactionCount(address) : nonce;
		const abi = {
			name: 'create',
			type: 'function',
			inputs: [
				{
					name: 'payFeeInEth',
					type: 'bool'
				}
			]
		};
		const input = [true];
		const command = this.generateTxString(abi, input);
		// sending out transaction
		gasPrice = (await this.getGasPrice()) || gasPrice;
		console.log(
			'gasPrice price ' +
				gasPrice +
				' gasLimit is ' +
				gasLimit +
				' nonce ' +
				nonce +
				' eth ' +
				eth
		);
		// gasPrice = gasPrice || await web3.eth.
		return this.web3.eth
			.sendSignedTransaction(
				'0x' +
					this.signTx(
						this.createTxCommand(
							nonce,
							gasPrice,
							gasLimit,
							this.custodianAddr,
							eth,
							command
						),
						privateKey
					)
			)
			.then(receipt => console.log(receipt))
			.catch(err => console.log(err));
	}

	public create(
		address: string,
		value: number,
		payFeeInEth: boolean,
		onTxHash: (hash: string) => any
	) {
		if (this.isReadOnly()) return this.readOnlyReject();

		return this.custodian.methods
			.create(payFeeInEth)
			.send({
				from: address,
				value: this.toWei(value)
			})
			.on('transactionHash', onTxHash);
	}

	public async redeemRaw(
		address: string,
		privateKey: string,
		amtA: number,
		amtB: number,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		if (this.wallet !== Wallet.Local) return this.wrongEnvReject();

		console.log('the account ' + address + ' privateKey is ' + privateKey);
		nonce = nonce === -1 ? await this.web3.eth.getTransactionCount(address) : nonce;
		const balanceOfA = await this.custodian.methods.balanceOf(0, address).call();
		const balanceOfB = await this.custodian.methods.balanceOf(1, address).call();
		console.log('current balanceA: ' + balanceOfA + ' current balanceB: ' + balanceOfB);
		const abi = {
			name: 'redeem',
			type: 'function',
			inputs: [
				{
					name: 'amtInWeiA',
					type: 'uint256'
				},
				{
					name: 'amtInWeiB',
					type: 'uint256'
				},
				{
					name: 'payFeeInEth',
					type: 'bool'
				}
			]
		};
		const input = [amtA, amtB, true];
		const command = this.generateTxString(abi, input);
		// sending out transaction
		gasPrice = (await this.getGasPrice()) || gasPrice;
		console.log(
			'gasPrice price ' +
				gasPrice +
				' gasLimit is ' +
				gasLimit +
				' nonce ' +
				nonce +
				' amtA ' +
				amtA +
				' amtB ' +
				amtB
		);
		// gasPrice = gasPrice || await web3.eth.
		return this.web3.eth
			.sendSignedTransaction(
				'0x' +
					this.signTx(
						this.createTxCommand(
							nonce,
							gasPrice,
							gasLimit,
							this.custodianAddr,
							0,
							command
						),
						privateKey
					)
			)
			.then(receipt => console.log(receipt))
			.catch(error => console.log(error));
	}

	public redeem(
		address: string,
		amtA: number,
		amtB: number,
		payFeeInEth: boolean,
		onTxHash: (hash: string) => any
	) {
		if (this.isReadOnly()) return this.readOnlyReject();

		return this.custodian.methods
			.redeem(this.toWei(amtA), this.toWei(amtB), payFeeInEth)
			.send({
				from: address
			})
			.on('transactionHash', onTxHash);
	}

	public async ethTransferRaw(
		from: string,
		privatekey: string,
		to: string,
		amt: number,
		nonce: number
	) {
		if (this.wallet !== Wallet.Local) return this.wrongEnvReject();

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
			.then(receipt => console.log(JSON.stringify(receipt, null, 4)));
	}

	public async duoTransferRaw(
		address: string,
		privateKey: string,
		to: string,
		value: number,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	): Promise<any> {
		if (this.wallet !== Wallet.Local) return this.wrongEnvReject();

		console.log(
			'the account ' +
				address +
				' privateKey is ' +
				privateKey +
				' transfering DUO token to ' +
				to +
				' with amt ' +
				value
		);
		nonce = nonce === -1 ? await this.web3.eth.getTransactionCount(address) : nonce;
		const abi = {
			name: 'transfer',
			type: 'function',
			inputs: [
				{
					name: 'to',
					type: 'address'
				},
				{
					name: 'value',
					type: 'uint256'
				}
			]
		};
		const input = [to, this.web3.utils.toWei(value + '', 'ether')];
		const command = this.generateTxString(abi, input);
		// sending out transaction
		gasPrice = (await this.getGasPrice()) * 2 || gasPrice;
		// gasPrice = gasPrice || await web3.eth.
		return this.web3.eth.sendSignedTransaction(
			'0x' +
				this.signTx(
					this.createTxCommand(nonce, gasPrice, gasLimit, this.duoAddr, 0, command),
					privateKey
				)
		);
	}

	private async trigger(
		address: string,
		privateKey: string,
		abi: object,
		input: any[],
		gasPrice: number,
		gasLimit: number
	) {
		const nonce = await this.web3.eth.getTransactionCount(address);
		const command = this.generateTxString(abi, input);
		// sending out transaction
		this.web3.eth
			.sendSignedTransaction(
				'0x' +
					this.signTx(
						this.createTxCommand(
							nonce,
							gasPrice,
							gasLimit,
							this.custodianAddr,
							0,
							command
						),
						privateKey
					)
			)
			.then(receipt => console.log(receipt))
			.catch(error => console.log(error));
	}

	public async tokenTransferRaw(
		index: number,
		address: string,
		privateKey: string,
		to: string,
		value: number,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		console.log(
			'the account ' +
				address +
				' privateKey is ' +
				privateKey +
				' transfering ' +
				index +
				' to ' +
				to +
				' with amt ' +
				value
		);
		nonce = nonce === -1 ? await this.web3.eth.getTransactionCount(address) : nonce;
		const abi = {
			name: 'transfer',
			type: 'function',
			inputs: [
				{
					name: 'index',
					type: 'uint256'
				},
				{
					name: 'from',
					type: 'address'
				},
				{
					name: 'to',
					type: 'address'
				},
				{
					name: 'tokens',
					type: 'uint256'
				}
			]
		};
		const input = [index, address, to, value];
		const command = this.generateTxString(abi, input);
		// sending out transaction
		gasPrice = (await this.getGasPrice()) || gasPrice;
		// gasPrice = gasPrice || await web3.eth.
		this.web3.eth
			.sendSignedTransaction(
				'0x' +
					this.signTx(
						this.createTxCommand(
							nonce,
							gasPrice,
							gasLimit,
							this.custodianAddr,
							0,
							command
						),
						privateKey
					)
			)
			.then(receipt => console.log(receipt))
			.catch(error => console.log(error));
	}

	public async triggerReset(address: string, privateKey: string, count: number = 1) {
		if (this.wallet !== Wallet.Local) return this.wrongEnvReject();

		const abi = {
			name: 'startReset',
			type: 'function',
			inputs: []
		};
		const gasPrice = (await this.getGasPrice()) || CST.DEFAULT_GAS_PRICE;
		console.log('gasPrice price ' + gasPrice + ' gasLimit is ' + CST.RESET_GAS_LIMIT);
		const promiseList: Array<Promise<void>> = [];
		for (let i = 0; i < count; i++)
			promiseList.push(
				this.trigger(address, privateKey, abi, [], gasPrice, CST.RESET_GAS_LIMIT)
			);

		return Promise.all(promiseList);
	}

	public async triggerPreReset(address: string, privateKey: string) {
		if (this.wallet !== Wallet.Local) return this.wrongEnvReject();

		const abi = {
			name: 'startPreReset',
			type: 'function',
			inputs: []
		};
		const gasPrice = (await this.getGasPrice()) || CST.DEFAULT_GAS_PRICE;
		console.log('gasPrice price ' + gasPrice + ' gasLimit is ' + CST.PRE_RESET_GAS_LIMIT);
		return this.trigger(address, privateKey, abi, [], gasPrice, CST.PRE_RESET_GAS_LIMIT); // 120000 for lastOne; 30000 for else
	}

	public getCurrentBlock() {
		return this.web3.eth.getBlockNumber();
	}

	public parseEvent(eventLog: EventLog, timestamp: number): IEvent {
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

	public async pullEvents(
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

	public convertCustodianState(rawState: string) {
		switch (rawState) {
			case CST.STATE_INCEPTION:
				return CST.CTD_INCEPTION;
			case CST.STATE_TRADING:
				return CST.CTD_TRADING;
			case CST.STATE_PRERESET:
				return CST.CTD_PRERESET;
			case CST.STATE_UP_RESET:
				return CST.CTD_UP_RESET;
			case CST.STATE_DOWN_RESET:
				return CST.CTD_DOWN_RESET;
			case CST.STATE_PERIOD_RESET:
				return CST.CTD_PERIOD_RESET;
			default:
				return CST.CTD_LOADING;
		}
	}

	public async getCustodianStates(): Promise<IBeethovanStates> {
		const states = await this.custodian.methods.getSystemStates().call();
		return {
			state: this.convertCustodianState(states[0].valueOf()),
			navA: this.fromWei(states[1]),
			navB: this.fromWei(states[2]),
			totalSupplyA: this.fromWei(states[3]),
			totalSupplyB: this.fromWei(states[4]),
			ethBalance: this.fromWei(states[5]),
			alpha: states[6].valueOf() / 10000,
			beta: this.fromWei(states[7]),
			feeAccumulated: this.fromWei(states[8]),
			periodCoupon: this.fromWei(states[9]),
			limitPeriodic: this.fromWei(states[10]),
			limitUpper: this.fromWei(states[11]),
			limitLower: this.fromWei(states[12]),
			createCommRate: states[13] / 10000,
			period: Number(states[14].valueOf()),
			iterationGasThreshold: Number(states[15].valueOf()),
			preResetWaitingBlocks: Number(states[17].valueOf()),
			priceTol: Number(states[18].valueOf() / 10000),
			priceFeedTol: Number(states[19].valueOf() / 10000),
			priceFeedTimeTol: Number(states[20].valueOf()),
			priceUpdateCoolDown: Number(states[21].valueOf()),
			numOfPrices: Number(states[22].valueOf()),
			nextResetAddrIndex: Number(states[23].valueOf()),
			lastAdminTime: Number(states[24].valueOf()),
			adminCoolDown: Number(states[25]),
			usersLength: Number(states[26].valueOf()),
			addrPoolLength: Number(states[27].valueOf()),
			redeemCommRate: states[states.length > 28 ? 28 : 13] / 10000
		};
	}

	public async getCustodianAddresses(): Promise<IBeethovanAddresses> {
		const addr: string[] = await this.custodian.methods.getSystemAddresses().call();
		const balances = await Promise.all(addr.map(a => this.getEthBalance(a)));
		return {
			operator: {
				address: addr[0],
				balance: balances[0]
			},
			feeCollector: {
				address: addr[1],
				balance: balances[1]
			},
			priceFeed1: {
				address: addr[2],
				balance: balances[2]
			},
			priceFeed2: {
				address: addr[3],
				balance: balances[3]
			},
			priceFeed3: {
				address: addr[4],
				balance: balances[4]
			},
			poolManager: {
				address: addr[5],
				balance: balances[5]
			}
		};
	}

	public async getCustodianPrices(): Promise<IBeethovanPrices> {
		const prices = await this.custodian.methods.getSystemPrices().call();
		const custodianPrices = [0, 1, 2, 3].map(i => ({
			address: prices[i * 3].valueOf(),
			price: this.fromWei(prices[1 + i * 3]),
			timestamp: prices[2 + i * 3].valueOf() * 1000
		}));

		return {
			first: custodianPrices[0],
			second: custodianPrices[1],
			reset: custodianPrices[2],
			last: custodianPrices[3]
		};
	}

	public async getBalances(address: string): Promise<IBeethovanBalances> {
		if (!address)
			return {
				eth: 0,
				tokenA: 0,
				tokenB: 0
			};

		const balances = await Promise.all([
			this.getEthBalance(address),
			this.getDuoBalance(address),
			this.getTokenBalance(address, true),
			this.getTokenBalance(address, false)
		]);

		return {
			eth: balances[0],
			tokenA: balances[2],
			tokenB: balances[3]
		};
	}

	public getUserAddress(index: number) {
		return this.custodian.methods.users(index).call();
	}

	public getPoolAddress(index: number) {
		return this.custodian.methods.addrPool(index).call();
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

	private async getDuoBalance(address: string): Promise<number> {
		return this.fromWei(await this.duo.methods.balanceOf(address).call());
	}

	public async getDuoAllowance(address: string): Promise<number> {
		return this.fromWei(await this.duo.methods.allowance(address, this.custodianAddr).call());
	}

	private async getTokenBalance(address: string, isA: boolean): Promise<number> {
		return this.fromWei(await this.custodian.methods.balanceOf(isA ? 0 : 1, address).call());
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

	public duoApprove(address: string, spender: string, value: number) {
		if (this.isReadOnly()) return this.readOnlyReject();

		return this.duo.methods.approve(spender, this.toWei(value)).send({
			from: address
		});
	}

	public duoTransfer(address: string, to: string, value: number) {
		if (this.isReadOnly()) return this.readOnlyReject();

		return this.duo.methods.transfer(to, this.toWei(value)).send({
			from: address
		});
	}

	public tokenApprove(address: string, spender: string, value: number, isA: boolean) {
		if (this.isReadOnly()) return this.readOnlyReject();

		if (isA)
			return this.tokenA.methods.approve(spender, this.toWei(value)).send({
				from: address
			});
		else
			return this.tokenB.methods.approve(spender, this.toWei(value)).send({
				from: address
			});
	}

	public tokenTransfer(address: string, to: string, value: number, isA: boolean) {
		if (this.isReadOnly()) return this.readOnlyReject();

		if (isA)
			return this.tokenA.methods.transfer(to, this.toWei(value)).send({
				from: address
			});
		else
			return this.tokenB.methods.transfer(to, this.toWei(value)).send({
				from: address
			});
	}

	public collectFee(address: string, amount: number) {
		if (this.isReadOnly()) return this.readOnlyReject();
		return this.custodian.methods.collectFee(this.toWei(amount)).send({
			from: address
		});
	}

	public setValue(address: string, index: number, newValue: number) {
		if (this.isReadOnly()) return this.readOnlyReject();
		return this.custodian.methods.setValue(index, newValue).send({
			from: address
		});
	}

	public addAddress(address: string, addr1: string, addr2: string) {
		if (this.isReadOnly()) return this.readOnlyReject();
		return this.custodian.methods.addAddress(addr1, addr2).send({
			from: address
		});
	}

	public removeAddress(address: string, addr: string) {
		if (this.isReadOnly()) return this.readOnlyReject();
		return this.custodian.methods.addAddress(addr).send({
			from: address
		});
	}

	public updateAddress(address: string, currentRole: string) {
		if (this.isReadOnly()) return this.readOnlyReject();
		return this.custodian.methods.addAddress(currentRole).send({
			from: address
		});
	}

	public decode(input: string): any {
		abiDecoder.addABI(custodianAbi.abi);
		return abiDecoder.decodeMethod(input);
	}
}
