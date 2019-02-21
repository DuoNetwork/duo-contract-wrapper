import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import vivaldiAbi from './static/Vivaldi.json';
import { IERC20CustodianAddresses, ITransactionOption, IVivaldiStates } from './types';
import Web3Wrapper from './Web3Wrapper';

export class VivaldiWrapper extends BaseContractWrapper {
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
		CST.EVENT_SET_VALUE,
		CST.EVENT_START_ROUND,
		CST.EVENT_END_ROUND
	];
	constructor(web3Wrapper: Web3Wrapper, address: string) {
		super(web3Wrapper, vivaldiAbi.abi, address);
	}

	public async startCustodian(
		account: string,
		aAddr: string,
		bAddr: string,
		oracleAddr: string,
		strike: number,
		isCall: boolean,
		isRelative: boolean,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.startCustodian(aAddr, bAddr, oracleAddr, Web3Wrapper.toWei(strike), isCall, isRelative)
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.START_CUSTODIAN_GAS,
					option
				)
			);
	}

	public async startRound(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.startRound()
			.send(
				await this.web3Wrapper.getTransactionOption(account, CST.START_ROUND_GAS, option)
			);
	}

	public async endRound(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.endRound()
			.send(await this.web3Wrapper.getTransactionOption(account, CST.END_ROUND_GAS, option));
	}

	public async forceEndRound(
		account: string,
		price: number,
		time: number,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.forceEndRound(Web3Wrapper.toWei(price), time)
			.send(await this.web3Wrapper.getTransactionOption(account, CST.END_ROUND_GAS, option));
	}

	public async create(account: string, value: number, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		const txOption = await this.web3Wrapper.getTransactionOption(
			account,
			CST.VIVALDI_CREATE_GAS,
			option
		);

		return new Promise<string>(resolve => {
			this.contract.methods
				.create(Web3Wrapper.toWei(value))
				.send(txOption)
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
			CST.VIVALDI_REDEEM_GAS,
			option
		);
		return new Promise<string>(resolve =>
			this.contract.methods
				.redeem(Web3Wrapper.toWei(amtA), Web3Wrapper.toWei(amtB))
				.send(txOption)
				.on('transactionHash', (txHash: string) => resolve(txHash))
		);
	}

	public async triggerReset(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.startReset()
			.send(
				await this.web3Wrapper.getTransactionOption(account, CST.RESET_GAS_LIMIT, option)
			);
	}

	public async triggerPreReset(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.startPreReset()
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.VIVALDI_PRE_RESET_GAS_LIMIT,
					option
				)
			);
	}

	public async collectFee(account: string, amount: number, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.collectFee(Web3Wrapper.toWei(amount))
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
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.DUAL_CLASS_SET_VALUE_GAS,
					option
				)
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

	public async getStates(): Promise<IVivaldiStates> {
		const states = await this.contract.methods.getStates().call();
		return {
			lastOperationTime: Number(states[CST.VVD_STATE.LAST_OPERATION_TIME].valueOf()) * 1000,
			operationCoolDown: Number(states[CST.VVD_STATE.OPERATION_COOLDOWN].valueOf()) * 1000,
			state: VivaldiWrapper.convertCustodianState(states[CST.VVD_STATE.STATE].valueOf()),
			minBalance: Web3Wrapper.fromWei(states[CST.VVD_STATE.MIN_BALANCE]),
			totalSupplyA: Web3Wrapper.fromWei(states[CST.VVD_STATE.TOTAL_SUPPLYA]),
			totalSupplyB: Web3Wrapper.fromWei(states[CST.VVD_STATE.TOTAL_SUPPLYB]),
			collateral: Web3Wrapper.fromWei(states[CST.VVD_STATE.TOKEN_COLLATERAL_IN_WEI]),
			lastPrice: Web3Wrapper.fromWei(states[CST.VVD_STATE.LAST_PRICE_IN_WEI]),
			lastPriceTime: Number(states[CST.VVD_STATE.LAST_PRICETIME_IN_SECOND].valueOf()) * 1000,
			resetPrice: Web3Wrapper.fromWei(states[CST.VVD_STATE.RESET_PRICE_IN_WEI]),
			resetPriceTime:
				Number(states[CST.VVD_STATE.RESET_PRICETIME_IN_SECOND].valueOf()) * 1000,
			createCommRate: Number(states[CST.VVD_STATE.CREATE_COMM_IN_BP].valueOf()) / 10000,
			redeemCommRate: Number(states[CST.VVD_STATE.REDEEM_COMM_IN_BP].valueOf()) / 10000,
			clearCommRate: Number(states[CST.VVD_STATE.CLEAR_COMM_IN_BP].valueOf()) / 10000,
			period: Number(states[CST.VVD_STATE.PERIOD].valueOf()) * 1000,
			maturity: Number(states[CST.VVD_STATE.MATURITY].valueOf()) * 1000,
			preResetWaitingBlocks: Number(states[CST.VVD_STATE.PRERESET_WAITING_BLOCKS].valueOf()),
			priceFetchCoolDown: Number(states[CST.VVD_STATE.PRICE_FETCH_COOLDOWN].valueOf()) * 1000,
			nextResetAddrIndex: Number(states[CST.VVD_STATE.NEXT_RESET_ADDR_INDEX].valueOf()),
			totalUsers: Number(states[CST.VVD_STATE.TOTAL_USERS].valueOf()),
			feeBalance: Web3Wrapper.fromWei(states[CST.VVD_STATE.TOKEN_FEE_BALANCE_IN_WEI]),
			iterationGasThreshold: Number(states[CST.VVD_STATE.ITERATION_GAS_THRESHOLD].valueOf()),
			roundStrike: Web3Wrapper.fromWei(states[CST.VVD_STATE.ROUND_STRIKE_IN_WEI]),
			isKnockedIn: await this.contract.methods.isKnockedIn().call()
		};
	}

	public async getAddresses(): Promise<IERC20CustodianAddresses> {
		const addr: string[] = await this.contract.methods.getAddresses().call();
		return {
			roleManager: addr[0],
			operator: addr[1],
			feeCollector: addr[2],
			oracle: addr[3],
			aToken: addr[4],
			bToken: addr[5],
			collateralToken: addr[6]
		};
	}

	public getUserAddress(index: number): Promise<string> {
		return this.contract.methods.users(index).call();
	}

	public async updateRoleManager(
		account: string,
		newManagerAddr: string,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.updateRoleManager(newManagerAddr)
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.UPDATE_ROLE_MANAGER_GAS,
					option
				)
			);
	}

	public async updateOracle(
		account: string,
		newOracleAddr: string,
		option: ITransactionOption = {}
	) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.updateOracle(newOracleAddr)
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.UPDATE_ROLE_MANAGER_GAS,
					option
				)
			);
	}

	public async updateOperator(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.updateOperator()
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.UPDATE_ROLE_MANAGER_GAS,
					option
				)
			);
	}

	public async updateFeeCollector(account: string, option: ITransactionOption = {}) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods
			.updateFeeCollector()
			.send(
				await this.web3Wrapper.getTransactionOption(
					account,
					CST.UPDATE_ROLE_MANAGER_GAS,
					option
				)
			);
	}
}

export default VivaldiWrapper;
