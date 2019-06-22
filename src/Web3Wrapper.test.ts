// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import * as CST from './constants';
import { kovan, mainnet } from './contractAddresses';
import { Wallet } from './types';
import Web3Wrapper from './Web3Wrapper';

const sampleEvent = [
	{
		address: '0x46e8Da839a538695F1435a33A1D44bBb0C093a45',
		blockHash: '0xb236fabff690963c1e38ba2bc0ed8fff6f24d2c2a06d3437e587858a343e1562',
		blockNumber: 7584187,
		logIndex: 1,
		transactionHash: '0xab624432b3cc6b1d8ada365be7899617f5ffa095b0e68bc054fdc02e309dc76e',
		transactionIndex: 1,
		transactionLogIndex: '0x0',
		type: 'mined',
		id: 'log_fdade6f4',
		returnValues: {
			'0': '0x00D8d0660b243452fC2f996A892D3083A903576F',
			'1': '12472699044214333750',
			'2': '12472699044214333750',
			'3': '94090000000000000',
			'4': '0',
			'5': '0',
			sender: '0x00D8d0660b243452fC2f996A892D3083A903576F',
			redeemedTokenAInWei: '12472699044214333750',
			redeemedTokenBInWei: '12472699044214333750',
			ethAmtInWei: '94090000000000000',
			totalSupplyA: '0',
			totalSupplyB: '0'
		},
		event: 'Redeem',
		signature: '0xfaf7975f90774bcdcad0cfda3280c17402f0df1477ecf3264a062c35cebf7ada',
		raw: {
			data:
				'0x000000000000000000000000000000000000000000000000ad17edb290bfe136000000000000000000000000000000000000000000000000ad17edb290bfe136000000000000000000000000000000000000000000000000014e465b42eaa00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			topics: [
				'0xfaf7975f90774bcdcad0cfda3280c17402f0df1477ecf3264a062c35cebf7ada',
				'0x00000000000000000000000000d8d0660b243452fc2f996a892d3083a903576f'
			]
		}
	},
	{
		address: '0x46e8Da839a538695F1435a33A1D44bBb0C093a45',
		blockHash: '0xc018d11ef3c8ecd69376c555cf52b3b8323e9f5793cd1a2653fe25b58cd3fbff',
		blockNumber: 7583611,
		logIndex: 0,
		transactionHash: '0x657c4d19de5efd60265f03059507fc801dec7795da7f80f8f4a31813a3e8cdfb',
		transactionIndex: 0,
		transactionLogIndex: '0x0',
		type: 'mined',
		id: 'log_fbe8fbfd',
		returnValues: {
			'0': '175481866396422670000',
			'1': '1528174500',
			'2': '0x0022BFd6AFaD3408A1714fa8F9371ad5Ce8A0F1a',
			'3': '1000002000000000000',
			'4': '1085147861640112792',
			priceInWei: '175481866396422670000',
			timeInSecond: '1528174500',
			sender: '0x0022BFd6AFaD3408A1714fa8F9371ad5Ce8A0F1a',
			navAInWei: '1000002000000000000',
			navBInWei: '1085147861640112792'
		},
		event: 'AcceptPrice',
		signature: '0x0ff9498fffdbb224271afcb40764991d34fdf5517d1cf851ab4577b6f3dbabd8',
		raw: {
			data:
				'0x0000000000000000000000000022bfd6afad3408a1714fa8f9371ad5ce8a0f1a0000000000000000000000000000000000000000000000000de0b88550ae20000000000000000000000000000000000000000000000000000f0f383b15d56a98',
			topics: [
				'0x0ff9498fffdbb224271afcb40764991d34fdf5517d1cf851ab4577b6f3dbabd8',
				'0x000000000000000000000000000000000000000000000009834cd3bea95486b0',
				'0x000000000000000000000000000000000000000000000000000000005b1617a4'
			]
		}
	},
	{
		address: '0x46e8Da839a538695F1435a33A1D44bBb0C093a45',
		blockHash: '0x2faf54a3e08816dc4d13d651a3aaedadc3860353797ac62bc2b52eaaf4f05852',
		blockNumber: 7583652,
		logIndex: 0,
		transactionHash: '0x2c8f0f87de5b1a08b8725c1dd33ffd6847920dfd29c3c6767fb9fe025f678914',
		transactionIndex: 0,
		transactionLogIndex: '0x0',
		type: 'mined',
		id: 'log_5a9a1166',
		returnValues: {
			'0': '200032406268784400000',
			'1': '1528174800',
			'2': '0x0022BFd6AFaD3408A1714fa8F9371ad5Ce8A0F1a',
			'3': '0',
			priceInWei: '200032406268784400000',
			timeInSecond: '1528174800',
			sender: '0x0022BFd6AFaD3408A1714fa8F9371ad5Ce8A0F1a',
			index: '0'
		},
		event: 'CommitPrice',
		signature: '0xe95a7bb58ff5f75fa581ca00ff98b7a825caba174942abffb75a1d2b12d90dd9',
		raw: {
			data:
				'0x0000000000000000000000000022bfd6afad3408a1714fa8f9371ad5ce8a0f1a0000000000000000000000000000000000000000000000000000000000000000',
			topics: [
				'0xe95a7bb58ff5f75fa581ca00ff98b7a825caba174942abffb75a1d2b12d90dd9',
				'0x00000000000000000000000000000000000000000000000ad801ddaf3183d680',
				'0x000000000000000000000000000000000000000000000000000000005b1618d0'
			]
		}
	},
	{
		address: '0x46e8Da839a538695F1435a33A1D44bBb0C093a45',
		blockHash: '0x27c822696c709975f9aa01270ca037c265afa5cfb4dcb62e8dd1d16605afcc49',
		blockNumber: 7583579,
		logIndex: 0,
		transactionHash: '0xb5f7ddfeb52fc8680d4c9f6e24739b091732219602cecc679da63af485824d7b',
		transactionIndex: 0,
		transactionLogIndex: '0x0',
		type: 'mined',
		id: 'log_1ab4180f',
		returnValues: {
			'0': '1000000000000000000',
			'1': '1000000000000000000',
			navAInWei: '1000000000000000000',
			navBInWei: '1000000000000000000'
		},
		event: 'StartTrading',
		signature: '0xe59d261c86f3e28ec60b2625dd89458b15cc93d4b260e2122846d5823a5aafab',
		raw: {
			data:
				'0x0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a7640000',
			topics: ['0xe59d261c86f3e28ec60b2625dd89458b15cc93d4b260e2122846d5823a5aafab']
		}
	},
	{
		address: '0x46e8Da839a538695F1435a33A1D44bBb0C093a45',
		blockHash: '0x3aedb0c0fb29d50e590f062a3fd708e8e043cd916760b316b2d6c56e0fd07750',
		blockNumber: 7584181,
		logIndex: 0,
		transactionHash: '0x863d368faffe95427d36a3fe59ef6e83fc93b8e106d28df8f0cff023eadf4cdf',
		transactionIndex: 0,
		transactionLogIndex: '0x0',
		type: 'mined',
		id: 'log_d796919c',
		returnValues: {
			'0': '0x00D8d0660b243452fC2f996A892D3083A903576F',
			'1': '12472699044214333750',
			'2': '12472699044214333750',
			'3': '12472699044214333750',
			'4': '12472699044214333750',
			sender: '0x00D8d0660b243452fC2f996A892D3083A903576F',
			createdTokenAInWei: '12472699044214333750',
			createdTokenBInWei: '12472699044214333750',
			totalSupplyA: '12472699044214333750',
			totalSupplyB: '12472699044214333750'
		},
		event: 'Create',
		signature: '0x1bbfc9eb113af4226de738bd6f2c94b98c4618014c7d65650e0b5d179697bf27',
		raw: {
			data:
				'0x000000000000000000000000000000000000000000000000ad17edb290bfe136000000000000000000000000000000000000000000000000ad17edb290bfe136000000000000000000000000000000000000000000000000ad17edb290bfe136000000000000000000000000000000000000000000000000ad17edb290bfe136',
			topics: [
				'0x1bbfc9eb113af4226de738bd6f2c94b98c4618014c7d65650e0b5d179697bf27',
				'0x00000000000000000000000000d8d0660b243452fc2f996a892d3083a903576f'
			]
		}
	}
];

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

test('isLive, live', () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	expect(web3Wrapper.isLive()).toBeTruthy();
});

test('isLive, dev', () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', false);
	expect(web3Wrapper.isLive()).toBeFalsy();
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
	web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve('1000000000'));
	web3Wrapper.getTransactionCount = jest.fn(() => Promise.resolve(10));
	expect(await web3Wrapper.getTransactionOption('account', 100000)).toMatchSnapshot();
	expect((web3Wrapper.getTransactionCount as jest.Mock).mock.calls).toMatchSnapshot();
	expect(web3Wrapper.getGasPrice as jest.Mock).toBeCalledTimes(1);
});

test('getTransactionOption, with option', async () => {
	const web3Wrapper = new Web3Wrapper({ ethereum: {} }, '', '', true);
	web3Wrapper.getGasPrice = jest.fn(() => Promise.resolve('1000000000'));
	web3Wrapper.getTransactionCount = jest.fn(() => Promise.resolve(10));
	expect(
		await web3Wrapper.getTransactionOption('account', 100000, {
			gasPrice: 2000000000,
			gasLimit: 200000,
			nonce: 10
		})
	).toMatchSnapshot();
	expect(web3Wrapper.getTransactionCount as jest.Mock).not.toBeCalled();
	expect(web3Wrapper.getGasPrice as jest.Mock).not.toBeCalled();
});

test('toWei', () => {
	expect(Web3Wrapper.toWei(1)).toBe('1000000000000000000');
});

test('toHex', () => {
	expect(Web3Wrapper.toHex(1234567890)).toMatchSnapshot();
});

test('fromWei', () => {
	expect(Web3Wrapper.fromWei('1000000000000000000')).toBe(1);
});

test('checkAddress', () => {
	expect(Web3Wrapper.checkAddress('xxx')).toBeFalsy();
});

test('checkAddress', () => {
	expect(Web3Wrapper.checkAddress('0x0017d61f0B0a28E2F0eBB3B6E269738a6252CFeD')).toBeTruthy();
});

test('web3PersonalSign, reject', async () => {
	const testWeb3Util = new Web3Wrapper({ ethereum: {} }, '', '', true);
	testWeb3Util.wallet = Wallet.None;
	try {
		await testWeb3Util.web3PersonalSign('0x0017d61f0B0a28E2F0eBB3B6E269738a6252CFeD', 'message');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('web3PersonalSign', async () => {
	const testWeb3Util = new Web3Wrapper({ ethereum: {} }, '', '', true);
	testWeb3Util.web3Personal = {
		sign: jest.fn()
	}
	await testWeb3Util.web3PersonalSign('0x0017d61f0B0a28E2F0eBB3B6E269738a6252CFeD', 'message');
	expect((testWeb3Util.web3Personal.sign as jest.Mock).mock.calls).toMatchSnapshot();
});
