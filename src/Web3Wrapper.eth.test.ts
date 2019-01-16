// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import { Wallet } from './types';
import Web3Wrapper from './Web3Wrapper';

jest.mock('web3', () => {
	return jest.fn().mockImplementation(() => {
		return {
			eth: {
				getAccounts: jest.fn(() => Promise.resolve(['account1', 'account2', 'account3'])),
				getGasPrice: jest.fn(() => 1000000000),
				sendTransaction: jest.fn(),
				getTransactionCount: jest.fn(() => 10)
			}
		};
	});
});

test('getGasPrice', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(await web3Wrapper.getGasPrice()).toMatchSnapshot();
});

test('sendEther, without option', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	await web3Wrapper.sendEther('from', 'to', 1);
	expect((web3Wrapper.web3.eth.sendTransaction as jest.Mock).mock.calls).toMatchSnapshot();
});

test('switchToLedger', async () => {
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
