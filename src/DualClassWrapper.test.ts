// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';

import * as CST from './constants';
import DualClassWrapper from './DualClassWrapper';
import { ITransactionOption } from './types';

test('convertCustodianState', () => {
	expect(DualClassWrapper.convertCustodianState(CST.STATE_INCEPTION)).toBe(CST.CTD_INCEPTION);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_PRERESET)).toBe(CST.CTD_PRERESET);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_RESET)).toBe(CST.CTD_RESET);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_TRADING)).toBe(CST.CTD_TRADING);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_MATURED)).toBe(CST.CTD_MATURED);
	expect(DualClassWrapper.convertCustodianState('any')).toBe(CST.CTD_LOADING);
});

test('convertCustodianState', () => {
	expect(DualClassWrapper.convertResetState(CST.RESET_STATE_DOWN)).toBe(CST.BTV_DOWN_RESET);
	expect(DualClassWrapper.convertResetState(CST.RESET_STATE_UP)).toBe(CST.BTV_UP_RESET);
	expect(DualClassWrapper.convertResetState(CST.RESET_STATE_PERIOD)).toBe(CST.BTV_PERIOD_RESET);
	expect(DualClassWrapper.convertResetState('any')).toBe('');
});

test('getTokensPerEth', () => {
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 1,
			alpha: 1
		} as any)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 0.8,
			alpha: 1
		} as any)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 1,
			alpha: 0.5
		} as any)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 1,
			alpha: 2
		} as any)
	).toMatchSnapshot();
});

test('getEthWithTokens', () => {
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 1
			} as any,
			100,
			100
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 1
			} as any,
			100,
			200
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 0.8,
				alpha: 1
			} as any,
			100,
			100
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 0.5
			} as any,
			100,
			100
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 0.5
			} as any,
			100,
			200
		)
	).toMatchSnapshot();
});

test('getTokenInterestOrLeverage', () => {
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				periodCoupon: 0.0001,
				period: 0
			} as any,
			true,
			true
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				periodCoupon: 0.0001,
				period: 3600000
			} as any,
			true,
			true
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				alpha: 1,
				navB: 1.5
			} as any,
			true,
			false
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				navA: 1.2
			} as any,
			false,
			true
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				alpha: 0.5,
				navB: 1.5
			} as any,
			false,
			false
		)
	).toMatchSnapshot();
});

test('calculateNav beethoven', () => {
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			300,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			40,
			10
		)
	).toMatchSnapshot();

	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			40,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			20,
			10
		)
	).toMatchSnapshot();
});

test('calculateNav mozart', () => {
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			300,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			40,
			10
		)
	).toMatchSnapshot();

	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			40,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			20,
			10
		)
	).toMatchSnapshot();
});

const collectFeeSend = jest.fn(() => Promise.resolve());
const setValueSend = jest.fn(() => Promise.resolve());
const createSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('createTxHash'), 0);
	return {
		on: on
	};
});

const createWithWETHSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('createWithWETHtxHash'), 0);
	return {
		on: on
	};
});
const redeemSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('redeemTxHash'), 0);
	return {
		on: on
	};
});
const redeemAllSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('redeemAllTxHash'), 0);
	return {
		on: on
	};
});
const startCustodianSend = jest.fn(() => Promise.resolve());
const fetchPriceSend = jest.fn(() => Promise.resolve());
const startPreResetSend = jest.fn(() => Promise.resolve());
const startResetSend = jest.fn(() => Promise.resolve());

const web3Wrapper = {
	isLocal: jest.fn(() => false),
	isReadOnly: jest.fn(() => true),
	onSwitchToMetaMask: jest.fn(() => ({} as any)),
	fromWei: jest.fn(value => value * 1e-18),
	toWei: jest.fn(value => value * 1e18),
	onSwitchToLedger: jest.fn(() => ({} as any)),
	readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
	wrongEnvReject: jest.fn(() => Promise.reject('wrong env')),
	getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
	getTransactionCount: jest.fn(() => Promise.resolve(2)),
	getTxOption: jest.fn((account: string, gasLimit: number, option: ITransactionOption = {}) =>
		Promise.resolve({
			from: account,
			gasPrice: option.gasPrice || 1000000000,
			gas: option.gasLimit || gasLimit,
			nonce: option.nonce || 10
		})
	),
	createContract: jest.fn(() => ({
		methods: {
			getStates: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve({
						'0': 12345678980,
						'1': 1000000000000000000000,
						'2': 100000000000000000,
						'3': 100000000000000000000000,
						'4': 100000,
						'5': 100,
						'6': 1000000000000000000,
						'7': 2000000000000000000,
						'8': 100000000000000000000,
						'9': 1000000000,
						'10': 100000000000000000000,
						'11': 10000000000000000000000000,
						'12': 1000000000000000000,
						'13': 1000000000000000000,
						'14': 1000000000000000000,
						'15': 1000000000000000000,
						'16': 1000000000000000000,
						'17': 1000000000000000000,
						'18': 1000000000000000000000,
						'19': 10000000000000000000,
						'20': 1000000000000000000000,
						'21': 100000000000000000000,
						'22': 1000000000000000000,
						'23': 1000000000000000000,
						'24': 1000000000000000000,
						'25': 150000000000000,
						'26': 15000000000000000000,
						'27': 2000000000000000000,
						'28': 1000000000000000000,
						'29': 10000
					})
				)
			})),
			getAddresses: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve({
						'0': 'roleManager',
						'1': 'operator',
						'2': 'feeCollector',
						'3': 'oracle',
						'4': 'aToken',
						'5': 'bToken'
					})
				)
			})),
			users: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve({}))
			})),
			collectFee: jest.fn(() => ({
				send: collectFeeSend
			})),
			setValue: jest.fn(() => ({
				send: setValueSend
			})),
			create: jest.fn(() => ({
				send: createSend
			})),
			createWithWETH: jest.fn(() => ({
				send: createWithWETHSend
			})),
			redeem: jest.fn(() => ({
				send: redeemSend
			})),
			redeemAll: jest.fn(() => ({
				send: redeemAllSend
			})),
			startCustodian: jest.fn(() => ({
				send: startCustodianSend
			})),
			fetchPrice: jest.fn(() => ({
				send: fetchPriceSend
			})),
			startReset: jest.fn(() => ({
				send: startResetSend
			})),
			startPreReset: jest.fn(() => ({
				send: startPreResetSend
			}))
		}
	}))
} as any;

const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

test('getStates', async () => {
	expect(await dualClassWrapper.getStates()).toMatchSnapshot();
});

test('getAddress', async () => {
	expect(await dualClassWrapper.getAddresses()).toMatchSnapshot();
});

test('getUserAddress', async () => {
	await dualClassWrapper.getUserAddress(1);
	expect((dualClassWrapper.contract.methods.users as jest.Mock).mock.calls).toMatchSnapshot();
});

test('collectFee', async () => {
	try {
		await dualClassWrapper.collectFee('account', 10);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	await dualClassWrapper.collectFee('account', 10);
	await dualClassWrapper.collectFee('account', 10, {
		gasLimit: 20000,
		gasPrice: 2000000000,
		nonce: 40
	});
	expect(
		(dualClassWrapper.contract.methods.collectFee as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(collectFeeSend.mock.calls).toMatchSnapshot();
});

test('setValue', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await dualClassWrapper.setValue('account', 1, 10);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await dualClassWrapper.setValue('account', 1, 10);
	await dualClassWrapper.setValue('account', 1, 10, {
		gasLimit: 20000,
		gasPrice: 2000000000,
		nonce: 40
	});
	// expect((web3Wrapper.getTransactionCount as jest.Mock).mock.calls).toMatchSnapshot();
	expect((dualClassWrapper.contract.methods.setValue as jest.Mock).mock.calls).toMatchSnapshot();
	expect(setValueSend.mock.calls).toMatchSnapshot();
});

test('create', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await dualClassWrapper.create('account', 1, '');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await dualClassWrapper.create('account', 1, 'wethAddr')).toMatchSnapshot();
	expect(await dualClassWrapper.create('account', 1, '')).toMatchSnapshot();
	expect(
		await dualClassWrapper.create('account', 1, '', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	expect(
		await dualClassWrapper.create('account', 1, 'wethAddr', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	expect(dualClassWrapper.contract.methods.create as jest.Mock).toBeCalledTimes(2);
	expect(
		(dualClassWrapper.contract.methods.createWithWETH as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(createSend.mock.calls).toMatchSnapshot();
	expect(createWithWETHSend.mock.calls).toMatchSnapshot();
});

test('redeem', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await dualClassWrapper.redeem('account', 1, 1);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await dualClassWrapper.redeem('account', 1, 1)).toMatchSnapshot();
	expect(
		await dualClassWrapper.redeem('account', 1, 1, {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect((dualClassWrapper.contract.methods.redeem as jest.Mock).mock.calls).toMatchSnapshot();
	expect(redeemSend.mock.calls).toMatchSnapshot();
});

test('redeemAll', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await dualClassWrapper.redeemAll('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await dualClassWrapper.redeemAll('account')).toMatchSnapshot();
	expect(
		await dualClassWrapper.redeemAll('account', {
			gasLimit: 20000,
			gasPrice: 100000,
			nonce: 30
		})
	).toMatchSnapshot();
	expect(dualClassWrapper.contract.methods.redeemAll as jest.Mock).toBeCalledTimes(2);
	expect(redeemAllSend.mock.calls).toMatchSnapshot();
});

test('startCustodian', async () => {
	try {
		await dualClassWrapper.startCustodian('account', 'aAddr', 'bAddr', 'oracleAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isLocal = jest.fn(() => true);
	await dualClassWrapper.startCustodian('account', 'aAddr', 'bAddr', 'oracleAddr');
	await dualClassWrapper.startCustodian('account', 'aAddr', 'bAddr', 'oracleAddr', {
		gasPrice: 1000000000,
		gasLimit: 20000,
		nonce: 10
	});
	expect(
		(dualClassWrapper.contract.methods.startCustodian as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(startCustodianSend.mock.calls).toMatchSnapshot();
});

test('fetchPrice', async () => {
	web3Wrapper.isLocal = jest.fn(() => false);
	try {
		await dualClassWrapper.fetchPrice('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isLocal = jest.fn(() => true);
	await dualClassWrapper.fetchPrice('account');
	await dualClassWrapper.fetchPrice('account', {
		gasPrice: 1000000000,
		gasLimit: 20000,
		nonce: 10
	});
	expect(dualClassWrapper.contract.methods.fetchPrice as jest.Mock).toBeCalledTimes(2);
	expect(fetchPriceSend.mock.calls).toMatchSnapshot();
});

test('triggerPreReset', async () => {
	web3Wrapper.isLocal = jest.fn(() => false);
	try {
		await dualClassWrapper.triggerPreReset('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isLocal = jest.fn(() => true);
	await dualClassWrapper.triggerPreReset('account');
	await dualClassWrapper.triggerPreReset('account', {
		gasLimit: 20000,
		gasPrice: 1000000000,
		nonce: 30
	});
	expect(dualClassWrapper.contract.methods.startPreReset as jest.Mock).toBeCalledTimes(2);
	expect(startPreResetSend.mock.calls).toMatchSnapshot();
});

test('triggerReset', async () => {
	web3Wrapper.isLocal = jest.fn(() => false);
	try {
		await dualClassWrapper.triggerReset('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isLocal = jest.fn(() => true);
	await dualClassWrapper.triggerReset('account');
	await dualClassWrapper.triggerReset('account', {
		gasLimit: 20000,
		gasPrice: 1000000000,
		nonce: 40
	});
	expect(dualClassWrapper.contract.methods.startReset as jest.Mock).toBeCalledTimes(2);
	expect(startResetSend.mock.calls).toMatchSnapshot();
});
