// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import * as CST from './constants';
import MagiWrapper from './MagiWrapper';
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
	magiWrapper.contract.methods.startOracle = jest.fn(() => ({
		send: jest.fn()
	}));
	await magiWrapper.startMagi('address', 100, 123456789);
	expect((magiWrapper.contract.methods.startOracle as jest.Mock).mock.calls).toMatchSnapshot();

	// expect((magiWrapper.commitInternal as jest.Mock).mock.calls).toMatchSnapshot();
});

test('startMagi, with option', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.contract.methods.startOracle = jest.fn(() => ({
		send: jest.fn()
	}));
	await magiWrapper.startMagi('address', 100, 123456789, {
		gasPrice: 2000000000,
		gasLimit: 200000
	});
	expect((magiWrapper.contract.methods.startOracle as jest.Mock).mock.calls).toMatchSnapshot();
});

test('startMagi, without account', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.web3Wrapper.getCurrentAddress = jest.fn(() =>
		Promise.resolve('0x0017d61f0B0a28E2F0eBB3B6E269738a6252CFeD')
	);
	magiWrapper.contract.methods.startOracle = jest.fn(() => ({
		send: jest.fn()
	}));
	await magiWrapper.startMagi('', 100, 123456789, {
		gasPrice: 2000000000,
		gasLimit: 200000
	});
	expect((magiWrapper.contract.methods.startOracle as jest.Mock).mock.calls).toMatchSnapshot();
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
	magiWrapper.contract.methods.commitPrice = jest.fn(() => ({
		send: jest.fn()
	}));
	await magiWrapper.commitPrice('address', 100, 123456789);
	expect((magiWrapper.contract.methods.commitPrice as jest.Mock).mock.calls).toMatchSnapshot();

	// expect((magiWrapper.commitInternal as jest.Mock).mock.calls).toMatchSnapshot();
});

test('commitPrice, with option', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.contract.methods.commitPrice = jest.fn(() => ({
		send: jest.fn()
	}));
	await magiWrapper.commitPrice('address', 100, 123456789, {
		gasPrice: 2000000000,
		gasLimit: 200000
	});
	expect((magiWrapper.contract.methods.commitPrice as jest.Mock).mock.calls).toMatchSnapshot();
});

test('commitPrice, without account', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.web3Wrapper.getCurrentAddress = jest.fn(() =>
		Promise.resolve('0x0017d61f0B0a28E2F0eBB3B6E269738a6252CFeD')
	);
	magiWrapper.contract.methods.commitPrice = jest.fn(() => ({
		send: jest.fn()
	}));
	await magiWrapper.commitPrice('', 100, 123456789, {
		gasPrice: 2000000000,
		gasLimit: 200000
	});
	expect((magiWrapper.contract.methods.commitPrice as jest.Mock).mock.calls).toMatchSnapshot();
});

test('getLastPrice', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.web3Wrapper.getCurrentAddress = jest.fn(() =>
		Promise.resolve('0x0017d61f0B0a28E2F0eBB3B6E269738a6252CFeD')
	);
	magiWrapper.contract.methods.getLastPrice = jest.fn(() => ({
		call: jest.fn(() => Promise.resolve(
			['100', '123456789']
		))
	}));
	const res = await magiWrapper.getLastPrice();
	expect((magiWrapper.contract.methods.getLastPrice as jest.Mock).mock.calls).toMatchSnapshot();
	expect(res).toMatchSnapshot();
});

test('isStarted', async () => {
	magiWrapper.web3Wrapper.isLocal = jest.fn(() => true);
	magiWrapper.web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	magiWrapper.web3Wrapper.getCurrentAddress = jest.fn(() =>
		Promise.resolve('0x0017d61f0B0a28E2F0eBB3B6E269738a6252CFeD')
	);
	magiWrapper.contract.methods.isStarted = jest.fn(() => ({
		call: jest.fn(() => Promise.resolve(
			false
		))
	}));
	const res = await magiWrapper.isStarted();
	expect((magiWrapper.contract.methods.isStarted as jest.Mock).mock.calls).toMatchSnapshot();
	expect(res).toMatchSnapshot();
});
