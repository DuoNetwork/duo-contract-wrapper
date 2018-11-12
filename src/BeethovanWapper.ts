import { Contract } from 'web3/types';
import * as CST from './constants';
import beethovanAbi from './static/Beethoven.json';
import { IBeethovanStates, ICustodianAddresses } from './types';
import Web3Wrapper, { Wallet } from './Web3Wrapper';

const abiDecoder = require('abi-decoder');

export default class BeethovanWapper {
	public web3Wrapper: Web3Wrapper;
	public contract: Contract;
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

	public convertCustodianState(rawState: string) {
		switch (rawState) {
			case CST.STATE_INCEPTION:
				return CST.CTD_INCEPTION;
			case CST.STATE_TRADING:
				return CST.CTD_TRADING;
			case CST.STATE_PRERESET:
				return CST.CTD_PRERESET;
			case CST.STATE_RESET:
				return CST.CTD_RESET;
			default:
				return CST.CTD_LOADING;
		}
	}

	public convertResetState(rawState: string) {
		switch (rawState) {
			case CST.RESET_STATE_UP:
				return CST.BTV_UP_RESET;
			case CST.RESET_STATE_DOWN:
				return CST.BTV_DOWN_RESET;
			case CST.RESET_STATE_PERIOD:
				return CST.BTV_PERIOD_RESET;
			default:
				return '';
		}
	}

	public async getStates(): Promise<IBeethovanStates> {
		const states = await this.contract.methods.getStates().call();
		return {
			lastOperationTime: Number(states[0].valueOf()) * 1000,
			operationCoolDown: Number(states[1].valueOf()) * 1000,
			state: this.convertCustodianState(states[2].valueOf()),
			minBalance: this.web3Wrapper.fromWei(states[3]),
			totalSupplyA: this.web3Wrapper.fromWei(states[4]),
			totalSupplyB: this.web3Wrapper.fromWei(states[5]),
			ethCollateral: this.web3Wrapper.fromWei(states[6]),
			navA: this.web3Wrapper.fromWei(states[7]),
			navB: this.web3Wrapper.fromWei(states[8]),
			lastPrice: this.web3Wrapper.fromWei(states[9]),
			lastPriceTime: Number(states[10].valueOf()) * 1000,
			resetPrice: this.web3Wrapper.fromWei(states[11]),
			resetPriceTime: Number(states[12].valueOf()) * 1000,
			createCommRate: Number(states[13].valueOf()) / 10000,
			redeemCommRate: Number(states[14].valueOf()) / 10000,
			period: Number(states[15].valueOf()) * 1000,
			preResetWaitingBlocks: Number(states[16].valueOf()),
			priceFetchCoolDown: Number(states[17].valueOf()) * 1000,
			nextResetAddrIndex: Number(states[18].valueOf()),
			totalUsers: Number(states[19].valueOf()),
			feeBalance: this.web3Wrapper.fromWei(states[20]),
			resetState: this.convertResetState(states[21].valueOf()),
			alpha: Number(states[22].valueOf()) / 10000,
			beta: this.web3Wrapper.fromWei(states[23]),
			periodCoupon: this.web3Wrapper.fromWei(states[24]),
			limitPeriodic: this.web3Wrapper.fromWei(states[25]),
			limitUpper: this.web3Wrapper.fromWei(states[26]),
			limitLower: this.web3Wrapper.fromWei(states[27]),
			iterationGasThreshold: Number(states[28].valueOf)
		};
	}

	public async getAddresses(): Promise<ICustodianAddresses> {
		const addr: string[] = await this.contract.methods.getSystemAddresses().call();
		const balances = await Promise.all(addr.map(a => this.web3Wrapper.getEthBalance(a)));
		return {
			roleManager: {
				address: addr[0],
				balance: balances[0]
			},
			operator: {
				address: addr[1],
				balance: balances[1]
			},
			feeCollector: {
				address: addr[2],
				balance: balances[2]
			},
			oracle: {
				address: addr[3],
				balance: balances[3]
			},
			aToken: {
				address: addr[4],
				balance: balances[4]
			},
			bToken: {
				address: addr[4],
				balance: balances[5]
			}
		};
	}

	public getUserAddress(index: number) {
		return this.contract.methods.users(index).call();
	}

	public collectFee(address: string, amount: number) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.collectFee(this.web3Wrapper.toWei(amount)).send({
			from: address
		});
	}

	public setValue(address: string, index: number, newValue: number) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.setValue(index, newValue).send({
			from: address
		});
	}

	public decode(input: string): any {
		abiDecoder.addABI(beethovanAbi.abi);
		return abiDecoder.decodeMethod(input);
	}
}
