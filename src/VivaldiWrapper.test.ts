// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import * as CST from './constants';
import { ITransactionOption } from './types';
import VivaldiWrapper from './VivaldiWrapper';

test('convertCustodianState', () => {
	expect(VivaldiWrapper.convertCustodianState(CST.STATE_INCEPTION)).toBe(CST.CTD_INCEPTION);
	expect(VivaldiWrapper.convertCustodianState(CST.STATE_PRERESET)).toBe(CST.CTD_PRERESET);
	expect(VivaldiWrapper.convertCustodianState(CST.STATE_RESET)).toBe(CST.CTD_RESET);
	expect(VivaldiWrapper.convertCustodianState(CST.STATE_TRADING)).toBe(CST.CTD_TRADING);
	expect(VivaldiWrapper.convertCustodianState(CST.STATE_MATURED)).toBe(CST.CTD_MATURED);
	expect(VivaldiWrapper.convertCustodianState('any')).toBe(CST.CTD_LOADING);
});

const collectFeeSend = jest.fn(() => Promise.resolve());
const setValueSend = jest.fn(() => Promise.resolve());
const startRoundSend = jest.fn(() => Promise.resolve());
const endRoundSend = jest.fn(() => Promise.resolve());
const forceEndRoundSend = jest.fn(() => Promise.resolve());
const createSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('createTxHash'), 0);
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
const startCustodianSend = jest.fn(() => Promise.resolve());
const startPreResetSend = jest.fn(() => Promise.resolve());
const startResetSend = jest.fn(() => Promise.resolve());

const web3Wrapper = {
	isReadOnly: jest.fn(() => true),
	onSwitchToMetaMask: jest.fn(() => ({} as any)),
	fromWei: jest.fn(value => value * 1e-18),
	toWei: jest.fn(value => value * 1e18),
	onSwitchToLedger: jest.fn(() => ({} as any)),
	readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
	wrongEnvReject: jest.fn(() => Promise.reject('wrong env')),
	getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
	getTransactionCount: jest.fn(() => Promise.resolve(2)),
	getTransactionOption: jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	),
	createContract: jest.fn(() => ({
		methods: {
			isKnockedIn: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(true))
			})),
			getStates: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve({
						'0': '12345678980',
						'1': '1000000000000000000000',
						'2': '100000000000000000',
						'3': '100000000000000000000000',
						'4': '100000',
						'5': '100',
						'6': '1000000000000000000',
						'7': '2000000000000000000',
						'8': '100000000000000000000',
						'9': '1000000000',
						'10': '100000000000000000000',
						'11': '10000000000000000000000000',
						'12': '1000000000000000000',
						'13': '1000000000000000000',
						'14': '1000000000000000000',
						'15': '1000000000000000000',
						'16': '1000000000000000000',
						'17': '1000000000000000000',
						'18': '1000000000000000000000',
						'19': '10000000000000000000',
						'20': '1000000000000000000000',
						'21': '100000000000000000000',
						'22': '1000000000000000000',
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
						'5': 'bToken',
						'6': 'collateralToken'
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
			startRound: jest.fn(() => ({
				send: startRoundSend
			})),
			endRound: jest.fn(() => ({
				send: endRoundSend
			})),
			forceEndRound: jest.fn(() => ({
				send: forceEndRoundSend
			})),
			create: jest.fn(() => ({
				send: createSend
			})),
			redeem: jest.fn(() => ({
				send: redeemSend
			})),
			startCustodian: jest.fn(() => ({
				send: startCustodianSend
			})),
			startReset: jest.fn(() => ({
				send: startResetSend
			})),
			startPreReset: jest.fn(() => ({
				send: startPreResetSend
			})),
			updateRoleManager: jest.fn(() => ({
				send: jest.fn()
			})),
			updateOperator: jest.fn(() => ({
				send: jest.fn()
			})),
			updateOracle: jest.fn(() => ({
				send: jest.fn()
			})),
			updateFeeCollector: jest.fn(() => ({
				send: jest.fn()
			}))
		}
	}))
} as any;

const vivaldiWrapper = new VivaldiWrapper(web3Wrapper, 'address');

test('getStates', async () => {
	expect(await vivaldiWrapper.getStates()).toMatchSnapshot();
});

test('getAddress', async () => {
	expect(await vivaldiWrapper.getAddresses()).toMatchSnapshot();
});

test('getUserAddress', async () => {
	await vivaldiWrapper.getUserAddress(1);
	expect((vivaldiWrapper.contract.methods.users as jest.Mock).mock.calls).toMatchSnapshot();
});

test('collectFee', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	try {
		await vivaldiWrapper.collectFee('account', 10);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.collectFee('account', 10);
	await vivaldiWrapper.collectFee('account', 10, {
		gasLimit: 20000,
		gasPrice: 2000000000,
		nonce: 40
	});
	expect((vivaldiWrapper.contract.methods.collectFee as jest.Mock).mock.calls).toMatchSnapshot();
	expect(collectFeeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('setValue', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.setValue('account', 1, 10);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.setValue('account', 1, 10);
	await vivaldiWrapper.setValue('account', 1, 10, {
		gasLimit: 20000,
		gasPrice: 2000000000,
		nonce: 40
	});
	expect((vivaldiWrapper.contract.methods.setValue as jest.Mock).mock.calls).toMatchSnapshot();
	expect(setValueSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('startRound', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	try {
		await vivaldiWrapper.startRound('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.startRound('account');
	await vivaldiWrapper.startRound('account', {
		gasLimit: 20000,
		gasPrice: 2000000000,
		nonce: 40
	});
	expect((vivaldiWrapper.contract.methods.startRound as jest.Mock).mock.calls).toMatchSnapshot();
	expect(startRoundSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('endRound', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	try {
		await vivaldiWrapper.endRound('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.endRound('account');
	await vivaldiWrapper.endRound('account', {
		gasLimit: 20000,
		gasPrice: 2000000000,
		nonce: 40
	});
	expect((vivaldiWrapper.contract.methods.endRound as jest.Mock).mock.calls).toMatchSnapshot();
	expect(endRoundSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('forceEndRound', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	try {
		await vivaldiWrapper.forceEndRound('account', 123, 456);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.forceEndRound('account', 123, 456);
	await vivaldiWrapper.forceEndRound('account', 123, 456, {
		gasLimit: 20000,
		gasPrice: 2000000000,
		nonce: 40
	});
	expect((vivaldiWrapper.contract.methods.forceEndRound as jest.Mock).mock.calls).toMatchSnapshot();
	expect(forceEndRoundSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('create', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.create('account', 1);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await vivaldiWrapper.create('account', 1)).toMatchSnapshot();
	expect(
		await vivaldiWrapper.create('account', 1, {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	expect(vivaldiWrapper.contract.methods.create as jest.Mock).toBeCalledTimes(2);
	expect(createSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('redeem', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.redeem('account', 1, 1);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await vivaldiWrapper.redeem('account', 1, 1)).toMatchSnapshot();
	expect(
		await vivaldiWrapper.redeem('account', 1, 1, {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect((vivaldiWrapper.contract.methods.redeem as jest.Mock).mock.calls).toMatchSnapshot();
	expect(redeemSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('startCustodian', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.startCustodian(
			'account',
			'aAddr',
			'bAddr',
			'oracleAddr',
			123,
			true,
			true
		);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.startCustodian('account', 'aAddr', 'bAddr', 'oracleAddr', 123, true, true);
	await vivaldiWrapper.startCustodian(
		'account',
		'aAddr',
		'bAddr',
		'oracleAddr',
		123,
		true,
		true,
		{
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		}
	);
	expect(
		(vivaldiWrapper.contract.methods.startCustodian as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(startCustodianSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('triggerPreReset', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.triggerPreReset('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.triggerPreReset('account');
	await vivaldiWrapper.triggerPreReset('account', {
		gasLimit: 20000,
		gasPrice: 1000000000,
		nonce: 30
	});
	expect(vivaldiWrapper.contract.methods.startPreReset as jest.Mock).toBeCalledTimes(2);
	expect(startPreResetSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('triggerReset', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.triggerReset('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.triggerReset('account');
	await vivaldiWrapper.triggerReset('account', {
		gasLimit: 20000,
		gasPrice: 1000000000,
		nonce: 40
	});
	expect(vivaldiWrapper.contract.methods.startReset as jest.Mock).toBeCalledTimes(2);
	expect(startResetSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('updateRoleManager', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.updateRoleManager('account', 'newRoleManager');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.updateRoleManager('account', 'newRoleManager');
	await vivaldiWrapper.updateRoleManager('account', 'newRoleManager', {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect(
		(vivaldiWrapper.contract.methods.updateRoleManager as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(
		(vivaldiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('updateOperator', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.updateOperator('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.updateOperator('account');
	await vivaldiWrapper.updateOperator('account', {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect(
		(vivaldiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('updateOracle', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.updateOracle('account', 'newOracleAddress');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.updateOracle('account', 'newOracleAddress');
	await vivaldiWrapper.updateOracle('account', 'newOracleAddress', {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect(
		(vivaldiWrapper.contract.methods.updateOracle as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(
		(vivaldiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('updateFeeCollector', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await vivaldiWrapper.updateFeeCollector('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await vivaldiWrapper.updateFeeCollector('account');
	await vivaldiWrapper.updateFeeCollector('account', {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect(
		(vivaldiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});
