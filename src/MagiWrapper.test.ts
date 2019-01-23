// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import * as CST from './constants';
import MagiWrapper from './MagiWrapper';
import { ITransactionOption } from './types';
import Web3Wrapper from './Web3Wrapper';

const web3Wrapper = new Web3Wrapper(null, CST.PROVIDER_INFURA_KOVAN, '', false);
const magiWrapper = new MagiWrapper(web3Wrapper, web3Wrapper.contractAddresses.Oracles[0].address);

test('startMagi, wrong env', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => false);
	try {
		await magiWrapper.startMagi('address', 100, 123456789);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('startMagi, without option', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	magiWrapper.contract.methods.startOracle = jest.fn(() => ({
		send: jest.fn()
	}));
	await magiWrapper.startMagi('address', 100, 123456789);
	expect((magiWrapper.contract.methods.startOracle as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('startMagi, with option', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	magiWrapper.contract.methods.startOracle = jest.fn(() => ({
		send: jest.fn()
	}));
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
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	magiWrapper.contract.methods.commitPrice = jest.fn(() => ({
		send: jest.fn()
	}));
	await magiWrapper.commitPrice('address', 100, 123456789);
	expect((magiWrapper.contract.methods.commitPrice as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(magiWrapper.web3Wrapper.getTransactionOption as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('commitPrice, with option', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	magiWrapper.contract.methods.commitPrice = jest.fn(() => ({
		send: jest.fn()
	}));
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
	magiWrapper.contract.methods.getLastPrice = jest.fn(() => ({
		call: jest.fn(() => Promise.resolve(['100', '123456789']))
	}));
	expect(await magiWrapper.getLastPrice()).toMatchSnapshot();
});

test('isStarted', async () => {
	magiWrapper.contract.methods.started = jest.fn(() => ({
		call: jest.fn(() => Promise.resolve(false))
	}));
	expect(await magiWrapper.isStarted()).toBeFalsy();
});
