import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import dualClassAbi from './static/DualClassCustodian.json';
import { ICustodianAddresses, IDualClassStates, IEthTxOption } from './types';
import util from './util';
import Web3Wrapper from './Web3Wrapper';

export default class DualClassWrapper extends BaseContractWrapper {
	public readonly events = [
		CST.EVENT_UPDATE_ROLE_MANAGER,
		CST.EVENT_UPDATE_OPERATOR,
		CST.EVENT_START_TRADING,
		CST.EVENT_START_PRE_RESET,
		CST.EVENT_START_RESET,
		CST.EVENT_MATURED,
		CST.EVENT_ACCEPT_PRICE,
		CST.EVENT_CREATE,
		CST.EVENT_REDEEM,
		CST.EVENT_TOTAL_SUPPLY,
		CST.EVENT_TRANSFER,
		CST.EVENT_APPROVAL,
		CST.EVENT_COLLECT_FEE,
		CST.EVENT_UPDATE_ORACLE,
		CST.EVENT_UPDATE_FEE_COLLECTOR,
		CST.EVENT_SET_VALUE
	];
	constructor(web3Wrapper: Web3Wrapper, address: string) {
		super(web3Wrapper, dualClassAbi.abi, address);
	}

	public async startCustodian(
		account: string,
		aAddr: string,
		bAddr: string,
		oracleAddr: string,
		option: IEthTxOption = {}
	) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.START_CUSTODIAN_GAS;
		const from = account || await this.web3Wrapper.getCurrentAddress();
		return new Promise<string>(resolve => {
			return this.contract.methods
				.startCustodian(aAddr, bAddr, oracleAddr)
				.send({
					from: from,
					gasPrice: gasPrice,
					gas: gasLimit
				})
				.on('transactionHash', txHash => resolve(txHash));
		});
	}
	public async fetchPrice(account: string, option: IEthTxOption = {}) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.START_CUSTODIAN_GAS;
		const nonce = option.nonce || (await this.web3Wrapper.getTransactionCount(this.address));
		return this.contract.methods.fetchPrice().send({
			from: account || await this.web3Wrapper.getCurrentAddress(),
			gasPrice: gasPrice,
			gas: gasLimit,
			nonce: nonce
		});
	}

	public async create(
		account: string,
		value: number,
		wethAddr: string,
		option: IEthTxOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.CREATE_GAS;
		const from = account || await this.web3Wrapper.getCurrentAddress();
		return new Promise<string>(resolve => {
			if (wethAddr)
				this.contract.methods
					.createWithWETH(this.web3Wrapper.toWei(value), wethAddr)
					.send({
						from: from,
						gasPrice: gasPrice,
						gas: gasLimit
					})
					.on('transactionHash', txHash => resolve(txHash));
			else
				this.contract.methods
					.create()
					.send({
						from: from,
						value: this.web3Wrapper.toWei(value),
						gasPrice: gasPrice,
						gas: gasLimit
					})
					.on('transactionHash', txHash => resolve(txHash));
		});
	}

	public async redeem(account: string, amtA: number, amtB: number, option: IEthTxOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.REDEEM_GAS;
		const from = account || await this.web3Wrapper.getCurrentAddress();

		return new Promise<string>(resolve =>
			this.contract.methods
				.redeem(this.web3Wrapper.toWei(amtA), this.web3Wrapper.toWei(amtB))
				.send({
					from: from,
					gasPrice: gasPrice,
					gas: gasLimit
				})
				.on('transactionHash', txHash => resolve(txHash))
		);
	}

	public async redeemAll(account: string, option: IEthTxOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.REDEEM_GAS;
		const from = account || await this.web3Wrapper.getCurrentAddress();
		return new Promise<string>(resolve =>
			this.contract.methods
				.redeemAll()
				.send({
					from: from,
					gasPrice: gasPrice,
					gas: gasLimit
				})
				.on('transactionHash', txHash => resolve(txHash))
		);
	}

	public async triggerReset(account: string, count: number = 1, option: IEthTxOption = {}) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.RESET_GAS_LIMIT;
		const from = account || await this.web3Wrapper.getCurrentAddress();
		const promiseList: Array<Promise<string>> = [];
		for (let i = 0; i < count; i++)
			promiseList.push(
				new Promise<string>(resolve =>
					this.contract.methods
						.startReset()
						.send({
							from: from,
							gasPrice: gasPrice,
							gas: gasLimit
						})
						.on('transactionHash', txHash => resolve(txHash))
				)
			);

		return Promise.all(promiseList);
	}

	public async triggerPreReset(account: string, option: IEthTxOption = {}) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.PRE_RESET_GAS_LIMIT;
		const from = account || await this.web3Wrapper.getCurrentAddress();
		return new Promise<string>(resolve =>
			this.contract.methods
				.startPreReset()
				.send({
					from: from,
					gasPrice: gasPrice,
					gas: gasLimit
				})
				.on('transactionHash', txHash => resolve(txHash))
		);
	}

	public static convertCustodianState(rawState: string) {
		switch (rawState) {
			case CST.STATE_INCEPTION:
				return CST.CTD_INCEPTION;
			case CST.STATE_TRADING:
				return CST.CTD_TRADING;
			case CST.STATE_PRERESET:
				return CST.CTD_PRERESET;
			case CST.STATE_RESET:
				return CST.CTD_RESET;
			case CST.STATE_MATURED:
				return CST.CTD_MATURED;
			default:
				return CST.CTD_LOADING;
		}
	}

	public static convertResetState(rawState: string) {
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

	public static getTokensPerEth(states: IDualClassStates) {
		const bTokenPerEth = (states.resetPrice * states.beta) / (1 + states.alpha);
		return [bTokenPerEth * states.alpha, bTokenPerEth];
	}

	public static getEthWithTokens(states: IDualClassStates, amtA: number, amtB: number): number {
		const adjAmtA = amtA / states.alpha;
		const deductAmtB = Math.min(adjAmtA, amtB);
		const deductAmtA = deductAmtB * states.alpha;
		return (deductAmtA + deductAmtB) / states.resetPrice / states.beta;
	}

	public static getTokenInterestOrLeverage(
		states: IDualClassStates,
		isBeethoven: boolean,
		isA: boolean
	) {
		if (isA && isBeethoven)
			return (states.periodCoupon * 365 * 24 * 3600000) / (states.period || 1);
		if (isA && !isBeethoven) return (states.navA - 2) / states.navA;

		return ((isBeethoven ? 1 : 2) * states.alpha + states.navB) / states.navB;
	}

	public static calculateNav(
		states: IDualClassStates,
		isBeethoven: boolean,
		price: number,
		time: number
	) {
		const { resetPrice, resetPriceTime, period, periodCoupon, alpha, beta } = states;
		if (isBeethoven) {
			const navParent = (price / resetPrice / beta) * (1 + alpha);

			const navA = 1 + Math.floor((time - resetPriceTime) / period) * periodCoupon;
			const navAAdj = navA * alpha;
			if (navParent <= navAAdj) return [navParent / alpha, 0];
			else return [navA, navParent - navAAdj];
		} else {
			const navEth = price / resetPrice;
			const navParent = navEth * (1 + alpha);

			if (navEth >= 2) return [0, navParent];

			if (navEth <= (2 * alpha) / (2 * alpha + 1)) return [navParent / alpha, 0];
			return [2 - navEth, (2 * alpha + 1) * navEth - 2 * alpha];
		}
	}

	public async getStates(): Promise<IDualClassStates> {
		const states = await this.contract.methods.getStates().call();
		return {
			lastOperationTime: Number(states[CST.BTV_STATE.LAST_OPERATION_TIME].valueOf()) * 1000,
			operationCoolDown: Number(states[CST.BTV_STATE.OPERATION_COOLDOWN].valueOf()) * 1000,
			state: DualClassWrapper.convertCustodianState(states[CST.BTV_STATE.STATE].valueOf()),
			minBalance: this.web3Wrapper.fromWei(states[CST.BTV_STATE.MIN_BALANCE]),
			totalSupplyA: this.web3Wrapper.fromWei(states[CST.BTV_STATE.TOTAL_SUPPLYA]),
			totalSupplyB: this.web3Wrapper.fromWei(states[CST.BTV_STATE.TOTAL_SUPPLYB]),
			ethCollateral: this.web3Wrapper.fromWei(states[CST.BTV_STATE.ETH_COLLATERAL_INWEI]),
			navA: this.web3Wrapper.fromWei(states[CST.BTV_STATE.NAVA_INWEI]),
			navB: this.web3Wrapper.fromWei(states[CST.BTV_STATE.NAVB_INWEI]),
			lastPrice: this.web3Wrapper.fromWei(states[CST.BTV_STATE.LAST_PRICE_INWEI]),
			lastPriceTime: Number(states[CST.BTV_STATE.LAST_PRICETIME_INSECOND].valueOf()) * 1000,
			resetPrice: this.web3Wrapper.fromWei(states[CST.BTV_STATE.RESET_PRICE_INWEI]),
			resetPriceTime: Number(states[CST.BTV_STATE.RESET_PRICETIME_INSECOND].valueOf()) * 1000,
			createCommRate: Number(states[CST.BTV_STATE.CREATE_COMMINBP].valueOf()) / 10000,
			redeemCommRate: Number(states[CST.BTV_STATE.REDEEM_COMMINBP].valueOf()) / 10000,
			period: Number(states[CST.BTV_STATE.PERIOD].valueOf()) * 1000,
			maturity: Number(states[CST.BTV_STATE.MATURITY].valueOf()) * 1000,
			preResetWaitingBlocks: Number(states[CST.BTV_STATE.PRERESET_WAITING_BLOCKS].valueOf()),
			priceFetchCoolDown: Number(states[CST.BTV_STATE.PRICE_FETCH_COOLDOWN].valueOf()) * 1000,
			nextResetAddrIndex: Number(states[CST.BTV_STATE.NEXT_RESET_ADDR_INDEX].valueOf()),
			totalUsers: Number(states[CST.BTV_STATE.TOTAL_USERS].valueOf()),
			feeBalance: this.web3Wrapper.fromWei(states[CST.BTV_STATE.FEE_BALANCE_INWEI]),
			resetState: DualClassWrapper.convertResetState(
				states[CST.BTV_STATE.RESET_STATE].valueOf()
			),
			alpha: Number(states[CST.BTV_STATE.ALPHA_INBP].valueOf()) / 10000,
			beta: this.web3Wrapper.fromWei(states[CST.BTV_STATE.BETA_INWEI]),
			periodCoupon: this.web3Wrapper.fromWei(states[CST.BTV_STATE.PERIOD_COUPON_INWEI]),
			limitPeriodic: this.web3Wrapper.fromWei(states[CST.BTV_STATE.LIMIT_PERIODIC_INWEI]),
			limitUpper: this.web3Wrapper.fromWei(states[CST.BTV_STATE.LIMIT_UPPER_INWEI]),
			limitLower: this.web3Wrapper.fromWei(states[CST.BTV_STATE.LIMIT_LOWER_INWEI]),
			iterationGasThreshold: Number(states[CST.BTV_STATE.ITERATION_GAS_THRESHOLD].valueOf())
		};
	}

	public async getAddresses(): Promise<ICustodianAddresses> {
		const addr: string[] = await this.contract.methods.getAddresses().call();
		return {
			roleManager: addr[0],
			operator: addr[1],
			feeCollector: addr[2],
			oracle: addr[3],
			aToken: addr[4],
			bToken: addr[5]
		};
	}

	public getUserAddress(index: number) {
		return this.contract.methods.users(index).call();
	}

	public async collectFee(account: string, amount: number, option: IEthTxOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.COLLECT_FEE_GAS;
		return this.contract.methods.collectFee(this.web3Wrapper.toWei(amount)).send({
			from: account || await this.web3Wrapper.getCurrentAddress(),
			gasPrice: gasPrice,
			gas: gasLimit
		});
	}

	public async setValue(
		account: string,
		index: number,
		newValue: number,
		option: IEthTxOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const gasPrice = option.gasPrice || (await this.web3Wrapper.getGasPrice());
		const gasLimit = option.gasLimit || CST.SET_VALUE_GAS;
		return this.contract.methods.setValue(index, newValue).send({
			from: account || await this.web3Wrapper.getCurrentAddress(),
			gasPrice: gasPrice,
			gas: gasLimit
		});
	}

	// Below is raw method
	public async startCustodianRaw(
		address: string,
		privateKey: string,
		aAddr: string,
		bAddr: string,
		oracleAddr: string,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		util.logInfo(`the account ${address} is starting custodian`);
		nonce = nonce === -1 ? await this.web3Wrapper.getTransactionCount(address) : nonce;
		const abi = {
			name: 'startCustodian',
			type: 'function',
			inputs: [
				{
					name: 'aAddr',
					type: 'address'
				},
				{
					name: 'bAddr',
					type: 'address'
				},
				{
					name: 'oracleAddr',
					type: 'address'
				}
			]
		};
		const input = [aAddr, bAddr, oracleAddr];

		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		await this.sendTransactionRaw(address, privateKey, this.address, 0, command, {
			gasPrice,
			gasLimit,
			nonce
		});
	}

	public async fetchPriceRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		util.logInfo(`the account ${address} is fetching price`);
		nonce = nonce === -1 ? await this.web3Wrapper.getTransactionCount(address) : nonce;
		const abi = {
			type: 'function',
			inputs: [],
			name: 'fetchPrice'
		};

		const command = this.web3Wrapper.generateTxString(abi, []);
		await this.sendTransactionRaw(address, privateKey, this.address, 0, command, {
			gasPrice,
			gasLimit,
			nonce
		});
	}

	public async createRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		eth: number,
		wethAddr: string,
		nonce: number = -1
	) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();

		let abi: any = {
			name: 'create',
			type: 'function',
			inputs: []
		};
		let input: any = [];
		if (wethAddr) {
			abi = {
				inputs: [
					{
						name: 'amount',
						type: 'uint256'
					},
					{
						name: 'wethAddr',
						type: 'address'
					}
				],
				name: 'createWithWETH',
				type: 'function'
			};
			input = [this.web3Wrapper.toWei(eth), wethAddr];
		}

		nonce = nonce === -1 ? await this.web3Wrapper.getTransactionCount(address) : nonce;
		const command = this.web3Wrapper.generateTxString(abi, input);
		gasPrice = Math.max((await this.web3Wrapper.getGasPrice()) || gasPrice, 5000000000);
		return this.sendTransactionRaw(address, privateKey, this.address, eth, command, {
			gasPrice,
			gasLimit,
			nonce
		});
	}
}
