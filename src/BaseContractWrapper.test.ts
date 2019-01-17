// // fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';

import BaseContractWrapper from './BaseContractWrapper';
import Web3Wrapper from './Web3Wrapper';

const abiDecoder = require('abi-decoder');

class BaseClass extends BaseContractWrapper {
	constructor(web3Wrapper: Web3Wrapper, address: string) {
		super(web3Wrapper, [], address);
	}
}

const createContract = jest.fn(() => ({
	methods: {
		contractCode: jest.fn()
	}
}));

const baseClass = new BaseClass(
	{
		getGasPrice: jest.fn(() => Promise.resolve(2000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(10)),
		sendSignedTransaction: jest.fn(),
		signTx: jest.fn(),
		createTxCommand: jest.fn(() => 'createTxCommand'),
		createContract: createContract,
		onSwitchToMetaMask: jest.fn(),
		onSwitchToLedger: jest.fn()
	} as any,
	'contractAddress'
);

test('constructor', () => {
	expect(baseClass.web3Wrapper.onSwitchToLedger as jest.Mock).toBeCalledTimes(1);
	(baseClass.web3Wrapper.onSwitchToLedger as jest.Mock).mock.calls[0][0]();
	expect(baseClass.web3Wrapper.onSwitchToMetaMask as jest.Mock).toBeCalledTimes(1);
	(baseClass.web3Wrapper.onSwitchToMetaMask as jest.Mock).mock.calls[0][0]();
	expect(createContract.mock.calls).toMatchSnapshot();
});

test('getContractCode', async () => {
	baseClass.contract.methods.contractCode = jest.fn(() => ({
		call: jest.fn(() => Promise.resolve('contractCode'))
	}));
	expect(await baseClass.getContractCode()).toMatchSnapshot();
});

test('decode', async () => {
	abiDecoder.decodeMethod = jest.fn(() => 'decodedOutput');
	expect(await baseClass.decode('input')).toMatchSnapshot();
});
