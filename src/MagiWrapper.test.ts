// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import MagiWrapper from './MagiWrapper';
import { ITransactionOption } from './types';

const web3Wrapper = {
	isReadOnly: jest.fn(() => true),
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
			})),
			priceFeed1: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('priceFeed1'))
			})),
			priceFeed2: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('priceFeed2'))
			})),
			priceFeed3: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('priceFeed3'))
			})),

			priceTolInBP: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(500))
			})),
			priceFeedTolInBP: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(100))
			})),
			priceFeedTimeTol: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(60))
			})),
			priceUpdateCoolDown: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(3600))
			})),
			numOfPrices: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(0))
			})),
			firstPrice: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve(['100000000000000000000', '123456789', 'priceFeed1'])
				)
			})),
			secondPrice: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve(['102000000000000000000', '123456789', 'priceFeed2'])
				)
			})),
			operator: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('operatorAddress'))
			})),
			roleManagerAddress: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('roleManagerAddress'))
			})),
			lastOperationTime: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(1234567890))
			})),
			operationCoolDown: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(1000))
			}))
		}
	}))
} as any;

const magiWrapper = new MagiWrapper(web3Wrapper, 'magiContractAddress');

test('startMagi, wrong env', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => false);
	try {
		await magiWrapper.startMagi('account', 100, 123456789);
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
	await magiWrapper.startMagi('account', 100, 123456789);
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
	await magiWrapper.startMagi('account', 100, 123456789, {
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
		await magiWrapper.commitPrice('account', 100, 123456789);
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
	await magiWrapper.commitPrice('account', 100, 123456789);
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
	await magiWrapper.commitPrice('account', 100, 123456789, {
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
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await magiWrapper.updatePriceFeed('account', 0);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await magiWrapper.updatePriceFeed('account', 0);
	await magiWrapper.updatePriceFeed('account', 0, {
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
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await magiWrapper.setValue('account', 0, 100);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await magiWrapper.setValue('account', 0, 100);
	await magiWrapper.setValue('account', 0, 100, {
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
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await magiWrapper.updateRoleManager('account', 'newRoleManager');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await magiWrapper.updateRoleManager('account', 'newRoleManager');
	await magiWrapper.updateRoleManager('account', 'newRoleManager', {
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

	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await magiWrapper.updateOperator('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await magiWrapper.updateOperator('account');
	await magiWrapper.updateOperator('account', {
		gasPrice: 2000000000,
		gasLimit: 200000,
		nonce: 10
	});
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('getAddresses', async () => {
	expect(await magiWrapper.getAddresses()).toMatchSnapshot();
});

test('getStates', async () => {
	expect(await magiWrapper.getStates()).toMatchSnapshot();
});
