// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import MagiWrapper from './MagiWrapper';
import { ITransactionOption } from './types';

const web3Wrapper = {
	isReadOnly: jest.fn(() => false),
	onSwitchToMetaMask: jest.fn(() => ({} as any)),
	fromWei: jest.fn(value => value * 1e-18),
	onSwitchToLedger: jest.fn(() => ({} as any)),
	readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
	getEthBalance: jest.fn(() => Promise.resolve('10')),
	getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
	wrongEnvReject: jest.fn(() => Promise.reject('Wrong Env')),
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
			startOracle: jest.fn(() => ({
				send: jest.fn()
			})),
			commitPrice: jest.fn(() => ({
				send: jest.fn()
			})),
			getLastPrice: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(['100', '123456789']))
			})),
			started: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(false))
			})),
			updateRoleManager: jest.fn(() => ({
				send: jest.fn()
			})),
			setValue: jest.fn(() => ({
				send: jest.fn()
			})),
			updatePriceFeed: jest.fn(() => ({
				send: jest.fn()
			})),
			updateOperator: jest.fn(() => ({
				send: jest.fn()
			}))
		}
	}))
} as any;

const magiWrapper = new MagiWrapper(web3Wrapper, 'magiContractAddress');

test('startMagi, wrong env', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => false);
	try {
		await magiWrapper.startMagi('address', 100, 123456789);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('startMagi, without option', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	await magiWrapper.startMagi('address', 100, 123456789);
	expect((magiWrapper.contract.methods.startOracle as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('startMagi, with option', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	await magiWrapper.startMagi('address', 100, 123456789, {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect((magiWrapper.contract.methods.startOracle as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('commitPrice, wrong env', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => false);
	try {
		await magiWrapper.commitPrice('address', 100, 123456789);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('commitPrice, without option', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	await magiWrapper.commitPrice('address', 100, 123456789);
	expect((magiWrapper.contract.methods.commitPrice as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('commitPrice, with option', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	await magiWrapper.commitPrice('address', 100, 123456789, {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect((magiWrapper.contract.methods.commitPrice as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('getLastPrice', async () => {
	expect(await magiWrapper.getLastPrice()).toMatchSnapshot();
});

test('isStarted', async () => {
	expect(await magiWrapper.isStarted()).toBeFalsy();
});

test('updatePriceFeed', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	await magiWrapper.updatePriceFeed('address', 0);
	await magiWrapper.updatePriceFeed('address', 0, {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect(
		(magiWrapper.contract.methods.updatePriceFeed as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
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
	await magiWrapper.setValue('address', 0, 100);
	await magiWrapper.setValue('address', 0, 100, {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect((magiWrapper.contract.methods.setValue as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
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
	await magiWrapper.updateRoleManager('address', 'newRoleManager');
	await magiWrapper.updateRoleManager('address', 'newRoleManager', {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect(
		(magiWrapper.contract.methods.updateRoleManager as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
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
	await magiWrapper.updateOperator('address');
	await magiWrapper.updateOperator('address', {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});
