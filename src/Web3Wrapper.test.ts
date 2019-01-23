// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import * as CST from './constants';
import { kovan, mainnet } from './contractAddresses';
import sampleEvent from './samples/events.json';
import { Wallet } from './types';
import Web3Wrapper from './Web3Wrapper';

test('constructor privateKey', async () => {
	const web3Wrapper = new Web3Wrapper(null, 'provider', 'privateKey', false);
	expect(web3Wrapper.wallet === Wallet.Local);
	expect(web3Wrapper.contractAddresses).toBe(kovan);
	expect(web3Wrapper.isLocal()).toBeTruthy();
	try {
		await web3Wrapper.wrongEnvReject();
		expect(false).toBeTruthy();
	} catch (error) {
		expect(error).toMatchSnapshot();
	}
});

test('constructor none', async () => {
	const web3Wrapper = new Web3Wrapper(null, CST.PROVIDER_INFURA_KOVAN, '', false);
	expect(web3Wrapper.wallet === Wallet.None);
	expect(web3Wrapper.contractAddresses).toBe(kovan);
	expect(web3Wrapper.isReadOnly()).toBeTruthy();
	try {
		await web3Wrapper.readOnlyReject();
		expect(false).toBeTruthy();
	} catch (error) {
		expect(error).toMatchSnapshot();
	}
});

test('constructor metamask provider new', () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(web3Wrapper.wallet).toBe(Wallet.MetaMask);
	expect(web3Wrapper.contractAddresses).toBe(mainnet);
});

test('constructor metamask provider old', () => {
	const web3Wrapper = new Web3Wrapper({ web3: { currentProvider: {} } }, '', '', false);
	expect(web3Wrapper.wallet).toBe(Wallet.MetaMask);
	expect(web3Wrapper.contractAddresses).toBe(kovan);
});

test('onSwitchToMetaMask', () => {
	const web3Wrapper = new Web3Wrapper(null, CST.PROVIDER_INFURA_KOVAN, '', false);
	const handle = jest.fn();
	web3Wrapper.onSwitchToMetaMask(handle);
	expect(web3Wrapper.handleSwitchToMetaMask).toHaveLength(1);
	expect(web3Wrapper.handleSwitchToMetaMask[0]).toBe(handle);
});

test('onSwitchToLedger', () => {
	const web3Wrapper = new Web3Wrapper(null, CST.PROVIDER_INFURA_KOVAN, '', false);
	const handle = jest.fn();
	web3Wrapper.onSwitchToLedger(handle);
	expect(web3Wrapper.handleSwitchToLedger).toHaveLength(1);
	expect(web3Wrapper.handleSwitchToLedger[0]).toBe(handle);
});

test('parseEvent', () =>
	sampleEvent.forEach(e => expect(Web3Wrapper.parseEvent(e, 1234567890)).toMatchSnapshot()));

test('pullEvents', async () => {
	const getPastEvents = jest.fn(() => Promise.resolve());
	await Web3Wrapper.pullEvents({ getPastEvents: getPastEvents } as any, 123, 456, 'event');
	expect(getPastEvents.mock.calls).toMatchSnapshot();
});

test('switchToMetaMask, metaMask', () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.handleSwitchToMetaMask = [
		jest.fn(),
		jest.fn(() => {
			throw new Error('switchToMetaMaskError');
		})
	];
	web3Wrapper.switchToMetaMask({ ethereum: {} });
	expect(web3Wrapper.wallet).toBe(Wallet.MetaMask);
	expect(web3Wrapper.accountIndex).toBe(0);
	expect(web3Wrapper.handleSwitchToMetaMask[0] as jest.Mock).toBeCalled();
	expect(web3Wrapper.handleSwitchToMetaMask[1] as jest.Mock).toBeCalled();
});

test('switchToMetaMask, metaMask old', () => {
	const web3Wrapper = new Web3Wrapper({ web3: { currentProvider: {} } }, '', '', true);
	web3Wrapper.handleSwitchToMetaMask = [jest.fn()];
	web3Wrapper.switchToMetaMask({ web3: { currentProvider: {} } });
	expect(web3Wrapper.wallet).toBe(Wallet.MetaMask);
	expect(web3Wrapper.accountIndex).toBe(0);
	expect(web3Wrapper.handleSwitchToMetaMask[0] as jest.Mock).toBeCalled();
});

test('switchToMetaMask, none', () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.handleSwitchToMetaMask = [jest.fn()];
	web3Wrapper.switchToMetaMask(null);
	expect(web3Wrapper.wallet).toBe(Wallet.None);
	expect(web3Wrapper.accountIndex).toBe(0);
	expect(web3Wrapper.handleSwitchToMetaMask[0] as jest.Mock).toBeCalled();
});

test('onWeb3AccountUpdate', () => {
	const testWeb3Util = new Web3Wrapper(null, '', '', false);
	const handleOn = jest.fn();
	testWeb3Util.web3.currentProvider = {
		publicConfigStore: {
			on: handleOn,
			getState: () => ({
				selectedAddress: '',
				networkVersion: ''
			})
		}
	} as any;

	testWeb3Util.onWeb3AccountUpdate(() => ({}));
	expect(handleOn).not.toBeCalled();
	testWeb3Util.wallet = Wallet.MetaMask;
	const onUpdate = jest.fn();
	testWeb3Util.onWeb3AccountUpdate(onUpdate);
	expect(handleOn).toBeCalledTimes(1);
	expect(handleOn.mock.calls[0][0]).toBe('update');
	handleOn.mock.calls[0][1]();
	expect(onUpdate).not.toBeCalled();
	testWeb3Util.web3.currentProvider = {
		publicConfigStore: {
			on: handleOn,
			getState: () => ({
				selectedAddress: 'selectedAddress',
				networkVersion: '123'
			})
		}
	} as any;
	testWeb3Util.onWeb3AccountUpdate(onUpdate);
	expect(handleOn).toBeCalledTimes(2);
	expect(handleOn.mock.calls[1][0]).toBe('update');
	handleOn.mock.calls[1][1]();
	expect(onUpdate.mock.calls).toMatchSnapshot();
});

test('isReadOnly', () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.wallet = Wallet.MetaMask;
	expect(web3Wrapper.isReadOnly()).toBeFalsy();
	web3Wrapper.wallet = Wallet.None;
	expect(web3Wrapper.isReadOnly()).toBeTruthy();
});

test('getTransactionOption, no option', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	web3Wrapper.getTransactionCount = jest.fn(() => Promise.resolve(10));
	expect(await web3Wrapper.getTransactionOption('account', 100000)).toMatchSnapshot();
	expect((web3Wrapper.getTransactionCount as jest.Mock).mock.calls).toMatchSnapshot();
	expect(web3Wrapper.getGasPrice as jest.Mock).toBeCalledTimes(1);
});

test('getTransactionOption, with option', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve(1000000000));
	web3Wrapper.getTransactionCount = jest.fn(() => Promise.resolve(10));
	expect(
		await web3Wrapper.getTransactionOption('account', 100000, {
			gasPrice: 2000000000,
			gasLimit: 200000,
			nonce: 10
		})
	).toMatchSnapshot();
	expect((web3Wrapper.getTransactionCount as jest.Mock)).not.toBeCalled();
	expect(web3Wrapper.getGasPrice as jest.Mock).not.toBeCalled();
});
