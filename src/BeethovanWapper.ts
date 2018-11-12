import { Contract } from 'web3/types';
import * as CST from './constants';
import beethovanAbi from './static/Beethoven.json';
// import {
// 	IBeethovanAddresses,
// 	IBeethovanBalances,
// 	IBeethovanPrices,
// 	IBeethovanStates
// } from './types';
import Web3Wrapper, { Wallet } from './Web3Wrapper';

export default class BeethovanWapper {
	public web3Wrapper: Web3Wrapper;
	public contract: Contract;
	public accountIndex: number = 0;
	public readonly address: string;

	public readonly inceptionBlk: number = 0;
	// private live: boolean;

	constructor(web3Wrapper: Web3Wrapper, live: boolean) {
		// this.live = live;
		this.web3Wrapper = web3Wrapper;

		this.address = live ? CST.BEETHOVAN_ADDR_MAIN : CST.BEETHOVAN_ADDR_KOVAN;
		this.contract = new this.web3Wrapper.web3.eth.Contract(beethovanAbi.abi, this.address);
		this.inceptionBlk = live ? CST.INCEPTION_BLK_MAIN : CST.INCEPTION_BLK_KOVAN;
	}

	public switchToMetaMask(window: any) {
		this.web3Wrapper.switchToMetaMask(window);
		this.contract = new this.web3Wrapper.web3.eth.Contract(beethovanAbi.abi, this.address);
	}

	public async switchToLedger() {
		const accounts = this.web3Wrapper.switchToLedger();
		this.contract = new this.web3Wrapper.web3.eth.Contract(beethovanAbi.abi, this.address);
		return accounts;
	}

	public async createRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		eth: number,
		nonce: number = -1
	) {
		if (this.web3Wrapper.wallet !== Wallet.Local) return this.web3Wrapper.wrongEnvReject();

		console.log('the account ' + address + ' is creating tokens with ' + privateKey);
		nonce = nonce === -1 ? await this.web3Wrapper.web3.eth.getTransactionCount(address) : nonce;
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
		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		gasPrice = (await this.web3Wrapper.getGasPrice()) || gasPrice;
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
		return this.web3Wrapper.web3.eth
			.sendSignedTransaction(
				'0x' +
					this.web3Wrapper.signTx(
						this.web3Wrapper.createTxCommand(
							nonce,
							gasPrice,
							gasLimit,
							this.address,
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
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods
			.create(payFeeInEth)
			.send({
				from: address,
				value: this.web3Wrapper.toWei(value)
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
		if (this.web3Wrapper.wallet !== Wallet.Local) return this.web3Wrapper.wrongEnvReject();

		console.log('the account ' + address + ' privateKey is ' + privateKey);
		nonce = nonce === -1 ? await this.web3Wrapper.web3.eth.getTransactionCount(address) : nonce;
		const balanceOfA = await this.contract.methods.balanceOf(0, address).call();
		const balanceOfB = await this.contract.methods.balanceOf(1, address).call();
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
		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		gasPrice = (await this.web3Wrapper.getGasPrice()) || gasPrice;
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
			.catch(error => console.log(error));
	}

	public redeem(
		address: string,
		amtA: number,
		amtB: number,
		payFeeInEth: boolean,
		onTxHash: (hash: string) => any
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods
			.redeem(this.web3Wrapper.toWei(amtA), this.web3Wrapper.toWei(amtB), payFeeInEth)
			.send({
				from: address
			})
			.on('transactionHash', onTxHash);
	}

	private async trigger(
		address: string,
		privateKey: string,
		abi: object,
		input: any[],
		gasPrice: number,
		gasLimit: number
	) {
		const nonce = await this.web3Wrapper.web3.eth.getTransactionCount(address);
		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		this.web3Wrapper.web3.eth
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
			.catch(error => console.log(error));
	}

	public async triggerReset(address: string, privateKey: string, count: number = 1) {
		if (this.web3Wrapper.wallet !== Wallet.Local) return this.web3Wrapper.wrongEnvReject();

		const abi = {
			name: 'startReset',
			type: 'function',
			inputs: []
		};
		const gasPrice = (await this.web3Wrapper.getGasPrice()) || CST.DEFAULT_GAS_PRICE;
		console.log('gasPrice price ' + gasPrice + ' gasLimit is ' + CST.RESET_GAS_LIMIT);
		const promiseList: Array<Promise<void>> = [];
		for (let i = 0; i < count; i++)
			promiseList.push(
				this.trigger(address, privateKey, abi, [], gasPrice, CST.RESET_GAS_LIMIT)
			);

		return Promise.all(promiseList);
	}

	public async triggerPreReset(address: string, privateKey: string) {
		if (this.web3Wrapper.wallet !== Wallet.Local) return this.web3Wrapper.wrongEnvReject();

		const abi = {
			name: 'startPreReset',
			type: 'function',
			inputs: []
		};
		const gasPrice = (await this.web3Wrapper.getGasPrice()) || CST.DEFAULT_GAS_PRICE;
		console.log('gasPrice price ' + gasPrice + ' gasLimit is ' + CST.PRE_RESET_GAS_LIMIT);
		return this.trigger(address, privateKey, abi, [], gasPrice, CST.PRE_RESET_GAS_LIMIT); // 120000 for lastOne; 30000 for else
	}

	// public convertBeethovanState(rawState: string) {
	// 	switch (rawState) {
	// 		case CST.STATE_INCEPTION:
	// 			return CST.CTD_INCEPTION;
	// 		case CST.STATE_TRADING:
	// 			return CST.CTD_TRADING;
	// 		case CST.STATE_PRERESET:
	// 			return CST.CTD_PRERESET;
	// 		case CST.STATE_UP_RESET:
	// 			return CST.CTD_UP_RESET;
	// 		case CST.STATE_DOWN_RESET:
	// 			return CST.CTD_DOWN_RESET;
	// 		case CST.STATE_PERIOD_RESET:
	// 			return CST.CTD_PERIOD_RESET;
	// 		default:
	// 			return CST.CTD_LOADING;
	// 	}
	// }

	// public async getCustodianStates(): Promise<IBeethovanStates> {
	// 	const states = await this.contract.methods.getSystemStates().call();
	// 	return {
	// 		state: this.convertCustodianState(states[0].valueOf()),
	// 		resetState
	// 		navA: this.fromWei(states[1]),
	// 		navB: this.fromWei(states[2]),
	// 		totalSupplyA: this.fromWei(states[3]),
	// 		totalSupplyB: this.fromWei(states[4]),
	// 		ethBalance: this.fromWei(states[5]),
	// 		alpha: states[6].valueOf() / 10000,
	// 		beta: this.fromWei(states[7]),
	// 		feeAccumulated: this.fromWei(states[8]),
	// 		periodCoupon: this.fromWei(states[9]),
	// 		limitPeriodic: this.fromWei(states[10]),
	// 		limitUpper: this.fromWei(states[11]),
	// 		limitLower: this.fromWei(states[12]),
	// 		createCommRate: states[13] / 10000,
	// 		period: Number(states[14].valueOf()),
	// 		iterationGasThreshold: Number(states[15].valueOf()),
	// 		preResetWaitingBlocks: Number(states[17].valueOf()),
	// 		priceTol: Number(states[18].valueOf() / 10000),
	// 		priceFeedTol: Number(states[19].valueOf() / 10000),
	// 		priceFeedTimeTol: Number(states[20].valueOf()),
	// 		priceUpdateCoolDown: Number(states[21].valueOf()),
	// 		numOfPrices: Number(states[22].valueOf()),
	// 		nextResetAddrIndex: Number(states[23].valueOf()),
	// 		lastAdminTime: Number(states[24].valueOf()),
	// 		adminCoolDown: Number(states[25]),
	// 		usersLength: Number(states[26].valueOf()),
	// 		addrPoolLength: Number(states[27].valueOf()),
	// 		redeemCommRate: states[states.length > 28 ? 28 : 13] / 10000
	// 	};
	// }

	// public async getCustodianAddresses(): Promise<IBeethovanAddresses> {
	// 	const addr: string[] = await this.custodian.methods.getSystemAddresses().call();
	// 	const balances = await Promise.all(addr.map(a => this.getEthBalance(a)));
	// 	return {
	// 		operator: {
	// 			address: addr[0],
	// 			balance: balances[0]
	// 		},
	// 		feeCollector: {
	// 			address: addr[1],
	// 			balance: balances[1]
	// 		},
	// 		priceFeed1: {
	// 			address: addr[2],
	// 			balance: balances[2]
	// 		},
	// 		priceFeed2: {
	// 			address: addr[3],
	// 			balance: balances[3]
	// 		},
	// 		priceFeed3: {
	// 			address: addr[4],
	// 			balance: balances[4]
	// 		},
	// 		poolManager: {
	// 			address: addr[5],
	// 			balance: balances[5]
	// 		}
	// 	};
	// }

	// public async getCustodianPrices(): Promise<IBeethovanPrices> {
	// 	const prices = await this.custodian.methods.getSystemPrices().call();
	// 	const custodianPrices = [0, 1, 2, 3].map(i => ({
	// 		address: prices[i * 3].valueOf(),
	// 		price: this.fromWei(prices[1 + i * 3]),
	// 		timestamp: prices[2 + i * 3].valueOf() * 1000
	// 	}));

	// 	return {
	// 		first: custodianPrices[0],
	// 		second: custodianPrices[1],
	// 		reset: custodianPrices[2],
	// 		last: custodianPrices[3]
	// 	};
	// }

	// public async getBalances(address: string): Promise<IBeethovanBalances> {
	// 	if (!address)
	// 		return {
	// 			eth: 0,
	// 			tokenA: 0,
	// 			tokenB: 0
	// 		};

	// 	const balances = await Promise.all([
	// 		this.getEthBalance(address),
	// 		this.getDuoBalance(address),
	// 		this.getTokenBalance(address, true),
	// 		this.getTokenBalance(address, false)
	// 	]);

	// 	return {
	// 		eth: balances[0],
	// 		tokenA: balances[2],
	// 		tokenB: balances[3]
	// 	};
	// }

	// public getUserAddress(index: number) {
	// 	return this.custodian.methods.users(index).call();
	// }

	// public getPoolAddress(index: number) {
	// 	return this.custodian.methods.addrPool(index).call();
	// }

	// public async getCurrentAddress(): Promise<string> {
	// 	const accounts = await this.web3.eth.getAccounts();
	// 	return accounts[this.accountIndex] || CST.DUMMY_ADDR;
	// }

	// public getCurrentNetwork(): Promise<number> {
	// 	return this.web3.eth.net.getId();
	// }

	// public async getEthBalance(address: string): Promise<number> {
	// 	return this.fromWei(await this.web3.eth.getBalance(address));
	// }

	// private async getDuoBalance(address: string): Promise<number> {
	// 	return this.fromWei(await this.duo.methods.balanceOf(address).call());
	// }

	// public async getDuoAllowance(address: string): Promise<number> {
	// 	return this.fromWei(await this.duo.methods.allowance(address, this.custodianAddr).call());
	// }

	// private async getTokenBalance(address: string, isA: boolean): Promise<number> {
	// 	return this.fromWei(await this.custodian.methods.balanceOf(isA ? 0 : 1, address).call());
	// }

	// public fromWei(value: string | number) {
	// 	return Number(this.web3.utils.fromWei(value, 'ether'));
	// }

	// public toWei(value: string | number) {
	// 	return this.web3.utils.toWei(value + '', 'ether');
	// }

	// public checkAddress(addr: string) {
	// 	if (!addr.startsWith('0x') || addr.length !== 42) return false;
	// 	return this.web3.utils.checkAddressChecksum(this.web3.utils.toChecksumAddress(addr));
	// }

	// public getTransactionReceipt(txHash: string) {
	// 	return this.web3.eth.getTransactionReceipt(txHash);
	// }

	// public duoApprove(address: string, spender: string, value: number) {
	// 	if (this.isReadOnly()) return this.readOnlyReject();

	// 	return this.duo.methods.approve(spender, this.toWei(value)).send({
	// 		from: address
	// 	});
	// }

	// public duoTransfer(address: string, to: string, value: number) {
	// 	if (this.isReadOnly()) return this.readOnlyReject();

	// 	return this.duo.methods.transfer(to, this.toWei(value)).send({
	// 		from: address
	// 	});
	// }

	// public tokenApprove(address: string, spender: string, value: number, isA: boolean) {
	// 	if (this.isReadOnly()) return this.readOnlyReject();

	// 	if (isA)
	// 		return this.tokenA.methods.approve(spender, this.toWei(value)).send({
	// 			from: address
	// 		});
	// 	else
	// 		return this.tokenB.methods.approve(spender, this.toWei(value)).send({
	// 			from: address
	// 		});
	// }

	// public tokenTransfer(address: string, to: string, value: number, isA: boolean) {
	// 	if (this.isReadOnly()) return this.readOnlyReject();

	// 	if (isA)
	// 		return this.tokenA.methods.transfer(to, this.toWei(value)).send({
	// 			from: address
	// 		});
	// 	else
	// 		return this.tokenB.methods.transfer(to, this.toWei(value)).send({
	// 			from: address
	// 		});
	// }

	// public collectFee(address: string, amount: number) {
	// 	if (this.isReadOnly()) return this.readOnlyReject();
	// 	return this.custodian.methods.collectFee(this.toWei(amount)).send({
	// 		from: address
	// 	});
	// }

	// public setValue(address: string, index: number, newValue: number) {
	// 	if (this.isReadOnly()) return this.readOnlyReject();
	// 	return this.custodian.methods.setValue(index, newValue).send({
	// 		from: address
	// 	});
	// }

	// public addAddress(address: string, addr1: string, addr2: string) {
	// 	if (this.isReadOnly()) return this.readOnlyReject();
	// 	return this.custodian.methods.addAddress(addr1, addr2).send({
	// 		from: address
	// 	});
	// }

	// public removeAddress(address: string, addr: string) {
	// 	if (this.isReadOnly()) return this.readOnlyReject();
	// 	return this.custodian.methods.addAddress(addr).send({
	// 		from: address
	// 	});
	// }

	// public updateAddress(address: string, currentRole: string) {
	// 	if (this.isReadOnly()) return this.readOnlyReject();
	// 	return this.custodian.methods.addAddress(currentRole).send({
	// 		from: address
	// 	});
	// }

	// public decode(input: string): any {
	// 	abiDecoder.addABI(custodianAbi.abi);
	// 	return abiDecoder.decodeMethod(input);
	// }
}
