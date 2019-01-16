// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import * as CST from './constants';
import { kovan, mainnet } from './contractAddresses';
import sampleEvent from './samples/events.json';
import { Wallet } from './types';
import Web3Wrapper from './Web3Wrapper';

jest.mock('web3', () => {
	return jest.fn().mockImplementation(() => {
		return {
			eth: {
				getAccounts: jest.fn(() => Promise.resolve(['account1', 'account2', 'account3']))
			}
		};
	});
});

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
	web3Wrapper.handleSwitchToMetaMask = [jest.fn()];
	web3Wrapper.switchToMetaMask({ ethereum: {} });
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

test.only('switchToLedger', async () => {
	jest.mock('web3-provider-engine/subproviders/fetch');
	jest.mock('@ledgerhq/web3-subprovider', () => ({
		default: jest.fn()
	}));
	jest.mock('web3-provider-engine', () => {
		return jest.fn().mockImplementation(() => {
			return {
				addProvider: jest.fn(),
				start: jest.fn()
			};
		});
	});
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.handleSwitchToLedger = [jest.fn()];
	const res = await web3Wrapper.switchToLedger();
	expect(web3Wrapper.wallet).toBe(Wallet.Ledger);
	expect(res).toMatchSnapshot();
	expect(web3Wrapper.handleSwitchToLedger[0] as jest.Mock).toBeCalled();
});
