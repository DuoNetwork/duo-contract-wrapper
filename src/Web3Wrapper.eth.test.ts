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
				getTransactionCount: jest.fn(() => 10),
				getBlockNumber: jest.fn(() => 100000),
				getBlock: jest.fn(() => ({ blockHash: 'blockHash', timestamp: 123456789 })),
				getBalance: jest.fn(() => Promise.resolve(10000000000000)),
				getTransactionReceipt: jest.fn(() => 'receipt'),
				net: {
					getId: jest.fn(() => Promise.resolve(42))
				},
				Contract: jest.fn(() => ({
					methods: {
						transfer: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				}))
			},
			utils: {
				fromWei: jest.fn(value => 1e-18 * value),
				toWei: jest.fn(value => 1e18 * value),
				checkAddressChecksum: jest.fn(() => true),
				toChecksumAddress: jest.fn(() => '0x0017d61f0B0a28E2F0eBB3B6E269738a6252CFeD')
			}
		};
	});
});

jest.mock('web3-provider-engine/subproviders/fetch');
jest.mock('@ledgerhq/web3-subprovider', () => ({
	default: jest.fn(getTransport => getTransport())
}));
jest.mock('@ledgerhq/hw-transport-u2f', () => ({
	default: {
		create: jest.fn()
	}
}));
jest.mock('web3-provider-engine', () => {
	return jest.fn().mockImplementation(() => {
		return {
			addProvider: jest.fn(),
			start: jest.fn()
		};
	});
});

test('toWei', () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(web3Wrapper.toWei(1)).toMatchSnapshot();
});

test('getGasPrice', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(await web3Wrapper.getGasPrice()).toMatchSnapshot();
});

test('getCurrentBlockNumber', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(await web3Wrapper.getCurrentBlockNumber()).toMatchSnapshot();
});

test('getCurrentAddress', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.accountIndex = 4;
	expect(await web3Wrapper.getCurrentAddress()).toMatchSnapshot();
});

test('getBlock', () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(web3Wrapper.getBlock(1)).toMatchSnapshot();
});

test('getBlockTimestamp, with blkNumber', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(await web3Wrapper.getBlockTimestamp(100)).toMatchSnapshot();
});

test('getBlockTimestamp, without blkNumber', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(await web3Wrapper.getBlockTimestamp()).toMatchSnapshot();
});

test('getCurretnNetwork', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(await web3Wrapper.getCurrentNetwork()).toMatchSnapshot();
});

test('getEthBalance', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(await web3Wrapper.getEthBalance('addr')).toMatchSnapshot();
});

test('getErc20Balance', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	const method = {
		balanceOf: jest.fn(() => ({
			call: jest.fn(() => Promise.resolve(1000000000000000))
		}))
	};
	web3Wrapper.createContract = jest.fn(() => ({
		methods: method
	}));
	expect(await web3Wrapper.getErc20Balance('contractAddr', 'addr')).toMatchSnapshot();
});

test('getErc20Allowance', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	const method = {
		allowance: jest.fn(() => ({
			call: jest.fn(() => Promise.resolve(1000000000000000))
		}))
	};
	web3Wrapper.createContract = jest.fn(() => ({
		methods: method
	}));
	expect(
		await web3Wrapper.getErc20Allowance('contractAddr', 'addr', 'spender')
	).toMatchSnapshot();
});

test('getTransactionReceipt', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(await web3Wrapper.getTransactionReceipt('txHash')).toMatchSnapshot();
});

test('checkAddress', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(await web3Wrapper.checkAddress('xxx')).toBeFalsy();
});

test('checkAddress', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(
		await web3Wrapper.checkAddress('0x0017d61f0B0a28E2F0eBB3B6E269738a6252CFeD')
	).toBeTruthy();
});

test('sendEther, without option', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	await web3Wrapper.sendEther('from', 'to', 1);
	expect((web3Wrapper.web3.eth.sendTransaction as jest.Mock).mock.calls).toMatchSnapshot();
});

test('sendEther, with option', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	await web3Wrapper.sendEther('from', 'to', 1, {
		gasLimit: 20000,
		gasPrice: 1000000000
	});
	expect((web3Wrapper.web3.eth.sendTransaction as jest.Mock).mock.calls).toMatchSnapshot();
});

test('erc20Transfer, readOnly', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await web3Wrapper.erc20Transfer('contractAddress', 'from', 'to', 1);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('erc20Transfer, without option', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	const method = {
		transfer: jest.fn(() => ({
			send: jest.fn()
		}))
	};
	web3Wrapper.createContract = jest.fn(() => ({
		methods: method
	}));
	await web3Wrapper.erc20Transfer('contractAddrdess', 'from', 'to', 1);
	expect((method.transfer as jest.Mock).mock.calls).toMatchSnapshot();
});

test('erc20Transfer, with option', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	const method = {
		transfer: jest.fn(() => ({
			send: jest.fn()
		}))
	};
	web3Wrapper.createContract = jest.fn(() => ({
		methods: method
	}));
	await web3Wrapper.erc20Transfer('contractAddrdess', 'from', 'to', 1, {
		gasPrice: 1000000000,
		gasLimit: 20000
	});
	expect((method.transfer as jest.Mock).mock.calls).toMatchSnapshot();
});

test('erc20Approve, readOnly', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await web3Wrapper.erc20Approve('contractAddress', 'from', 'spender', 1);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('erc20Approve, without option', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	const on = jest.fn();
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	const method = {
		approve: jest.fn(() => ({
			send: jest.fn(() => {
				setTimeout(() => on.mock.calls[0][1]('createTxHash'), 0);
				return {
					on: on
				};
			})
		}))
	};
	web3Wrapper.createContract = jest.fn(() => ({
		methods: method
	}));
	await web3Wrapper.erc20Approve('contractAddress', 'from', 'spender', 1);
	expect((method.approve as jest.Mock).mock.calls).toMatchSnapshot();
});

test('erc20Approve, unlimited', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	const on = jest.fn();
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	const method = {
		approve: jest.fn(() => ({
			send: jest.fn(() => {
				setTimeout(() => on.mock.calls[0][1]('createTxHash'), 0);
				return {
					on: on
				};
			})
		}))
	};
	web3Wrapper.createContract = jest.fn(() => ({
		methods: method
	}));
	await web3Wrapper.erc20Approve('contractAddress', 'from', 'spender', 1, true);
	expect((method.approve as jest.Mock).mock.calls).toMatchSnapshot();
});

test('erc20Approve, unlimited', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	const on = jest.fn();
	web3Wrapper.toWei = jest.fn(() => '1000000000000000000');
	const method = {
		approve: jest.fn(() => ({
			send: jest.fn(() => {
				setTimeout(() => on.mock.calls[0][1]('createTxHash'), 0);
				return {
					on: on
				};
			})
		}))
	};
	web3Wrapper.createContract = jest.fn(() => ({
		methods: method
	}));
	await web3Wrapper.erc20Approve('contractAddress', 'from', 'spender', 1, true);
	expect((method.approve as jest.Mock).mock.calls).toMatchSnapshot();
});

test('switchToLedger', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.handleSwitchToLedger = [jest.fn()];

	const res = await web3Wrapper.switchToLedger();
	expect(web3Wrapper.wallet).toBe(Wallet.Ledger);
	expect(res).toMatchSnapshot();
	expect(web3Wrapper.handleSwitchToLedger[0] as jest.Mock).toBeCalled();
});

test('switchToLedger kovan', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', false);
	web3Wrapper.handleSwitchToLedger = [
		jest.fn(() => {
			throw new Error('switchToLedgerError');
		})
	];

	const res = await web3Wrapper.switchToLedger();
	expect(web3Wrapper.wallet).toBe(Wallet.Ledger);
	expect(res).toMatchSnapshot();
	expect(web3Wrapper.handleSwitchToLedger[0] as jest.Mock).toBeCalled();
});
