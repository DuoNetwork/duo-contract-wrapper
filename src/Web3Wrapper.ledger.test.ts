// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
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
