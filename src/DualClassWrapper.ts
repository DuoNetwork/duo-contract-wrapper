import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import dualClassAbi from './static/DualClassCustodian.json';
import { ICustodianAddresses, IDualClassStates, ITransactionOption } from './types';
import Web3Wrapper from './Web3Wrapper';

export class DualClassWrapper extends BaseContractWrapper {
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
		option: ITransactionOption = {}
	) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		return this.contract.methods
			.startCustodian(aAddr, bAddr, oracleAddr)
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.START_CUSTODIAN_GAS,
					option
				)
			);
	}

	public async fetchPrice(account: string, option: ITransactionOption = {}) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		return this.contract.methods
			.fetchPrice()
			.send(
				await this.web3Wrapper.getTransactionOption(account, CST.FETCH_PRICE_GAS, option)
			);
	}

	public async create(
		account: string,
		value: number,
		wethAddr: string,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.CREATE_GAS,
			option
		);

		return new Promise<string>(resolve => {
			if (wethAddr)
				this.contract.methods
					.createWithWETH(this.web3Wrapper.toWei(value), wethAddr)
					.send(txOption)
					.on('transactionHash', (txHash: string) => resolve(txHash));
			else
				this.contract.methods
					.create()
					.send(
						Object.assign(txOption, {
							value: this.web3Wrapper.toWei(value)
						})
					)
					.on('transactionHash', (txHash: string) => resolve(txHash));
		});
	}

	public async redeem(
		account: string,
		amtA: number,
		amtB: number,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.REDEEM_GAS,
			option
		);
		return new Promise<string>(resolve =>
			this.contract.methods
				.redeem(this.web3Wrapper.toWei(amtA), this.web3Wrapper.toWei(amtB))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash))
		);
	}

	public async redeemAll(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.REDEEM_GAS,
			option
		);
		return new Promise<string>(resolve =>
			this.contract.methods
				.redeemAll()
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash))
		);
	}

	public async triggerReset(account: string, option: ITransactionOption = {}) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		return this.contract.methods
			.startReset()
			.send(
				await this.web3Wrapper.getTransactionOption(account, CST.RESET_GAS_LIMIT, option)
			);
	}

	public async triggerPreReset(account: string, option: ITransactionOption = {}) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();
		return this.contract.methods
			.startPreReset()
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.PRE_RESET_GAS_LIMIT,
					option
				)
			);
	}

	public async collectFee(account: string, amount: number, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.collectFee(this.web3Wrapper.toWei(amount))
			.send(
				await this.web3Wrapper.getTransactionOption(account, CST.COLLECT_FEE_GAS, option)
			);
	}

	public async setValue(
		account: string,
		index: number,
		newValue: number,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.setValue(index, newValue)
			.send(await this.web3Wrapper.getTransactionOption(account, CST.SET_VALUE_GAS, option));
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
}

export default DualClassWrapper;
