import * as CST from './constants';
import EsplanadeWrapper from './EsplanadeWrapper';

const addrPool = [['coldAddr1', 'coldAddr2', 'coldAddr3'], ['hotAddr1', 'hotAddr2', 'hotAddr3']];
const custodianPool = ['custodianAddr1', 'custodianAddr2', 'custodianAddr3'];
const otherPool = ['otherAddr1', 'otherAddr2', 'otherAddr3'];

const web3Wrapper = {
	isReadOnly: jest.fn(() => true),
	onSwitchToMetaMask: jest.fn(() => ({} as any)),
	fromWei: jest.fn(value => value * 1e-18),
	onSwitchToLedger: jest.fn(() => ({} as any)),
	readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
	getEthBalance: jest.fn(() => Promise.resolve('10')),
	createContract: jest.fn(() => ({
		methods: {
			moderator: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('moderator'))
			})),
			candidate: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('candidatre'))
			})),
			votingStage: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('1'))
			})),
			addrPool: jest.fn((poolIndex, i) => ({
				call: jest.fn(() => Promise.resolve(addrPool[poolIndex][i]))
			})),
			getAddressPoolSizes: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(['3', '3']))
			})),
			custodianPool: jest.fn(i => ({
				call: jest.fn(() => Promise.resolve(custodianPool[i]))
			})),
			otherContractPool: jest.fn(i => ({
				call: jest.fn(() => Promise.resolve(otherPool[i]))
			})),
			getContractPoolSizes: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(['3', '3']))
			})),
			operatorCoolDown: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('100'))
			})),
			lastOperationTime: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('100'))
			})),
			started: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(true))
			})),
			voteStartTimestamp: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(123456789))
			})),
			votedFor: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('10'))
			})),
			votedAgainst: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('5'))
			})),
			startContractVoting: jest.fn(() => ({
				send: jest.fn()
			})),
			terminateContractVoting: jest.fn(() => ({
				send: jest.fn()
			})),
			terminateByTimeout: jest.fn(() => ({
				send: jest.fn()
			})),
			startModeratorVoting: jest.fn(() => ({
				send: jest.fn()
			})),
			vote: jest.fn(() => ({
				send: jest.fn()
			})),
			startManager: jest.fn(() => ({
				send: jest.fn()
			})),
			addCustodian: jest.fn(() => ({
				send: jest.fn()
			})),
			addOtherContracts: jest.fn(() => ({
				send: jest.fn()
			})),
			addAddress: jest.fn(() => ({
				send: jest.fn()
			})),
			removeAddress: jest.fn(() => ({
				send: jest.fn()
			})),
			getAddresses: jest.fn(() => ({
				call: jest.fn()
			}))
		}
	}))
} as any;
const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');

test('startContractVoting', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.startContractVoting('account', 'candidateAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.startContractVoting('account', 'candidateAdddr');
	expect(
		(esplanadeWrapper.contract.methods.startContractVoting as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('terminateContractVoting', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.terminateContractVoting('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.terminateContractVoting('account');
	expect(esplanadeWrapper.contract.methods.terminateContractVoting as jest.Mock).toBeCalledTimes(
		1
	);
});

test('terminateByTimeout', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.terminateByTimeout('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.terminateByTimeout('account');
	expect(esplanadeWrapper.contract.methods.terminateByTimeout as jest.Mock).toBeCalledTimes(1);
});

test('startModeratorVoting', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.startModeratorVoting('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.startModeratorVoting('account');
	expect(esplanadeWrapper.contract.methods.startModeratorVoting as jest.Mock).toBeCalledTimes(1);
});

test('vote', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.vote('account', true);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.vote('account', true);
	await esplanadeWrapper.vote('', true);
	expect((esplanadeWrapper.contract.methods.vote as jest.Mock).mock.calls).toMatchSnapshot();
});

test('startManager', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.startManager('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.startManager('account');
	expect(esplanadeWrapper.contract.methods.startManager as jest.Mock).toBeCalledTimes(1);
});

test('addCustodian', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.addCustodian('account', 'custodianAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.addCustodian('account', 'custodianAddr');
	expect(
		(esplanadeWrapper.contract.methods.addCustodian as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('addOtherContracts', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.addOtherContracts('account', 'contractAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.addOtherContracts('account', 'otherContractAddr');
	expect(
		(esplanadeWrapper.contract.methods.addOtherContracts as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('addAddress', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.addAddress('account', 'addr1', 'addr2', true);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.addAddress('account', 'addr1', 'addr2', true);
	expect(
		(esplanadeWrapper.contract.methods.addAddress as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('removeAddress', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await esplanadeWrapper.removeAddress('account', 'addr', true);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
	web3Wrapper.isReadOnly = jest.fn(() => false);
	await esplanadeWrapper.removeAddress('account', 'addr', true);
	expect(
		(esplanadeWrapper.contract.methods.removeAddress as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('getStates', async () => {
	web3Wrapper.isReadOnly = jest.fn(() => true);
	expect(await esplanadeWrapper.getStates()).toMatchSnapshot();
});

test('convertVotingStage', () => {
	expect(EsplanadeWrapper.convertVotingStage(CST.VOTING_CONTRACT)).toBe(CST.ESP_CONTRACT);
	expect(EsplanadeWrapper.convertVotingStage(CST.VOTING_MODERATOR)).toBe(CST.ESP_MODERATOR);
	expect(EsplanadeWrapper.convertVotingStage('any')).toBe(CST.ESP_NOT_STARTED);
});

test('getAddressPoolindex', () => {
	expect(esplanadeWrapper.getAddressPoolIndex(true)).toBe(1);
	expect(esplanadeWrapper.getAddressPoolIndex(false)).toBe(0);
});

test('getModerator', async () => {
	expect(await esplanadeWrapper.getModerator()).toMatchSnapshot();
});

test('getCandidate', async () => {
	expect(await esplanadeWrapper.getCandidate()).toMatchSnapshot();
});

test('getAddressPoolAddress', async () => {
	expect(await esplanadeWrapper.getAddressPoolAddress(true, 0)).toMatchSnapshot();
	expect(await esplanadeWrapper.getAddressPoolAddress(true, 1)).toMatchSnapshot();
	expect(await esplanadeWrapper.getAddressPoolAddress(true, 2)).toMatchSnapshot();
	expect(await esplanadeWrapper.getAddressPoolAddress(false, 0)).toMatchSnapshot();
	expect(await esplanadeWrapper.getAddressPoolAddress(false, 1)).toMatchSnapshot();
	expect(await esplanadeWrapper.getAddressPoolAddress(false, 2)).toMatchSnapshot();
});

test('getContractPoolAddress', async () => {
	expect(await esplanadeWrapper.getContractPoolAddress(true, 0)).toMatchSnapshot();
	expect(await esplanadeWrapper.getContractPoolAddress(true, 1)).toMatchSnapshot();
	expect(await esplanadeWrapper.getContractPoolAddress(true, 2)).toMatchSnapshot();
	expect(await esplanadeWrapper.getContractPoolAddress(false, 0)).toMatchSnapshot();
	expect(await esplanadeWrapper.getContractPoolAddress(false, 1)).toMatchSnapshot();
	expect(await esplanadeWrapper.getContractPoolAddress(false, 2)).toMatchSnapshot();
});

test('getAddressPoolSize', async () => {
	expect(await esplanadeWrapper.getAddressPoolSize(true)).toMatchSnapshot();
	expect(await esplanadeWrapper.getAddressPoolSize(false)).toMatchSnapshot();
});

test('getContractPoolSize', async () => {
	expect(await esplanadeWrapper.getContractPoolSize(true)).toMatchSnapshot();
	expect(await esplanadeWrapper.getContractPoolSize(false)).toMatchSnapshot();
});

test('voteStartTimestamp', async () => {
	expect(await esplanadeWrapper.getVotingData()).toMatchSnapshot();
});
