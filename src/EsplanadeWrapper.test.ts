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
