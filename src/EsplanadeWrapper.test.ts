import * as CST from './constants';
import EsplanadeWrapper from './EsplanadeWrapper';

test('getAddrs', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						moderator: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve('moderator'))
						})),
						candidate: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve('candidatre'))
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	esplanadeWrapper.getModerator = jest.fn(() => Promise.resolve('moderator'));
	const res = await esplanadeWrapper.getAddrs();
	expect(res).toMatchSnapshot();
	expect((esplanadeWrapper.web3Wrapper.getEthBalance as jest.Mock).mock.calls).toMatchSnapshot();
});

test('getVotingStage', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						votingStage: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve('1'))
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	expect(await esplanadeWrapper.getVotingStage()).toMatchSnapshot();
});

test('getModerator', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						moderator: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve('moderator'))
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	expect(await esplanadeWrapper.getModerator()).toMatchSnapshot();
});

test('getPoolAddresses', async () => {
	const addrPool = [
		['coldAddr1', 'coldAddr2', 'coldAddr3'],
		['hotAddr1', 'hotAddr2', 'hotAddr3']
	];
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						addrPool: jest.fn((poolIndex, i) => ({
							call: jest.fn(() => Promise.resolve(addrPool[poolIndex][i]))
						})),
						getAddressPoolSizes: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve(['3', '3']))
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	expect(await esplanadeWrapper.getPoolAddresses(false)).toMatchSnapshot();
	expect(await esplanadeWrapper.getPoolAddresses(true)).toMatchSnapshot();
});

test('getContractAddresses', async () => {
	const custodianPool = ['custodianAddr1', 'custodianAddr2', 'custodianAddr3'];
	const otherPool = ['otherAddr1', 'otherAddr2', 'otherAddr3'];

	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						custodianPool: jest.fn(i => ({
							call: jest.fn(() => Promise.resolve(custodianPool[i]))
						})),
						otherContractPool: jest.fn(i => ({
							call: jest.fn(() => Promise.resolve(otherPool[i]))
						})),
						getContractPoolSizes: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve(['3', '3']))
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	expect(await esplanadeWrapper.getContractAddresses(false)).toMatchSnapshot();
	expect(await esplanadeWrapper.getContractAddresses(true)).toMatchSnapshot();
});

test('getOperationCoolDown', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						operatorCoolDown: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve('100'))
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	expect(await esplanadeWrapper.getOperationCoolDown()).toMatchSnapshot();
});

test('getLastOperationTime', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						lastOperationTime: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve('100'))
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	expect(await esplanadeWrapper.getLastOperationTime()).toMatchSnapshot();
});

test('isStarted', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						started: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve(true))
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	expect(await esplanadeWrapper.isStarted()).toMatchSnapshot();
});

test('getVotingData', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						voteStartTimestamp: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve(123456789))
						})),
						votedFor: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve('10'))
						})),
						votedAgainst: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve('5'))
						})),
						getAddressPoolSizes: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve(['5', '5']))
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	expect(await esplanadeWrapper.getVotingData()).toMatchSnapshot();
});

test('startContractVoting, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.startContractVoting('account', 'candidateAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('startContractVoting, with account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startContractVoting: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.startContractVoting('account', 'candidateAdddr');
	expect(
		(esplanadeWrapper.contract.methods.startContractVoting as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('startContractVoting, without account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startContractVoting: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.startContractVoting('', 'candidateAdddr');
	expect(
		(esplanadeWrapper.contract.methods.startContractVoting as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('terminateContractVting, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.terminateContractVoting('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('terminateContractVoting, with account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						terminateContractVoting: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.terminateContractVoting('account');
	expect(
		(esplanadeWrapper.contract.methods.terminateContractVoting as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('terminateContractVoting, without account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						terminateContractVoting: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.terminateContractVoting('account');
	expect(
		(esplanadeWrapper.contract.methods.terminateContractVoting as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('terminateByTimeout, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.terminateByTimeout('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('terminateByTimeout, with account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						terminateByTimeout: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.terminateByTimeout('account');
	expect(
		(esplanadeWrapper.contract.methods.terminateByTimeout as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('terminateByTimeout, without account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						terminateByTimeout: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.terminateByTimeout('account');
	expect(
		(esplanadeWrapper.contract.methods.terminateByTimeout as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('startModeratorVoting, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.startModeratorVoting('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('startModeratorVoting, with account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startModeratorVoting: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.startModeratorVoting('account');
	expect(
		(esplanadeWrapper.contract.methods.startModeratorVoting as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('startModeratorVoting, without account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startModeratorVoting: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.startModeratorVoting('account');
	expect(
		(esplanadeWrapper.contract.methods.startModeratorVoting as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('vote, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.vote('account', true);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('vote, with account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						vote: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.vote('account', true);
	expect(
		(esplanadeWrapper.contract.methods.vote as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('vote, without account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						vote: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.vote('account', true);
	expect(
		(esplanadeWrapper.contract.methods.vote as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('startManager, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.startManager('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('startManager, with account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startManager: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.startManager('account');
	expect(
		(esplanadeWrapper.contract.methods.startManager as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('startManager, without account', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startManager: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.startManager('account');
	expect(
		(esplanadeWrapper.contract.methods.startManager as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('addCustodian, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.addCustodian('custodianAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('addCustodian', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						addCustodian: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.addCustodian('custodianAddr');
	expect(
		(esplanadeWrapper.contract.methods.addCustodian as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('addOtherContracts, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.addOtherContracts('contractAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('addOtherContracts', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						addOtherContracts: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	await esplanadeWrapper.addOtherContracts('otherContractAddr');
	expect(
		(esplanadeWrapper.contract.methods.addOtherContracts as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('addAddress, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.addAddress('addr1', 'addr2', true);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('addAddress', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						addAddress: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	esplanadeWrapper.getAddressPoolIndex = jest.fn(() => 1);
	await esplanadeWrapper.addAddress('addr1', 'addr2', true);
	expect(
		(esplanadeWrapper.contract.methods.addAddress as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('removeAddress, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		createContract: jest.fn()
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	try {
		await esplanadeWrapper.removeAddress('addr', true);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('removeAddress', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getEthBalance: jest.fn(() => Promise.resolve('10')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddr')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						removeAddress: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	esplanadeWrapper.getAddressPoolIndex = jest.fn(() => 1);
	await esplanadeWrapper.removeAddress('addr', true);
	expect(
		(esplanadeWrapper.contract.methods.removeAddress as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('getStates', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						getAddresses: jest.fn(() => ({
							call: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper, 'address');
	esplanadeWrapper.isStarted = jest.fn(() => Promise.resolve(true));
	esplanadeWrapper.getVotingStage = jest.fn(() => Promise.resolve('Moderator'));
	esplanadeWrapper.getPoolAddresses = jest.fn(isCold =>
		Promise.resolve([
			{
				address: `${isCold ? 'cold' : 'hot'}Addr1`,
				balance: 10
			}
		])
	);
	esplanadeWrapper.getContractAddresses = jest.fn(isCustodian =>
		Promise.resolve([
			{
				address: `${isCustodian ? 'custodian' : 'other'}ContractAddr1`,
				balance: 10
			}
		])
	);

	esplanadeWrapper.getOperationCoolDown = jest.fn(() => Promise.resolve(1000));
	esplanadeWrapper.getLastOperationTime = jest.fn(() => Promise.resolve(123456789));
	esplanadeWrapper.getVotingData = jest.fn(() =>
		Promise.resolve({
			started: 123456789,
			votedFor: 4,
			votedAgainst: 3,
			totalVoters: 100
		})
	);

	expect(await esplanadeWrapper.getStates()).toMatchSnapshot();
});

test('convertVotingStage', () => {
	expect(EsplanadeWrapper.convertVotingStage(CST.VOTING_CONTRACT)).toBe(CST.ESP_CONTRACT);
	expect(EsplanadeWrapper.convertVotingStage(CST.VOTING_MODERATOR)).toBe(CST.ESP_MODERATOR);
	expect(EsplanadeWrapper.convertVotingStage('any')).toBe(CST.ESP_NOT_STARTED);
});

test('getAddressPoolindex', () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						getAddresses: jest.fn(() => ({
							call: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const esplanadeWrapper = new EsplanadeWrapper(web3Wrapper as any, 'address');
	expect(esplanadeWrapper.getAddressPoolIndex(true)).toBe(1);
	expect(esplanadeWrapper.getAddressPoolIndex(false)).toBe(0);
});
