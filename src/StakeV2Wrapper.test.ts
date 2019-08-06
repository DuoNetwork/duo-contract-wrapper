// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import StakeContractWrapper from './StakeV2Wrapper';
import { ITransactionOption } from './types';




const stakeSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('stakeTxHash'), 0);
	return {
		on: on
	};
});

const unstakeSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('unstakeTxHash'), 0);
	return {
		on: on
	};
});

const claimRewardSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('claimRewardTxHash'), 0);
	return {
		on: on
	};
});

const stageAddRewardSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('commitAddReward'), 0);
	return {
		on: on
	};
});

const stageReduceRewardSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('commitAddReward'), 0);
	return {
		on: on
	};
});

const setStakeFlagSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('setStakeFlagTxHash'), 0);
	return {
		on: on
	};
});

const setValueSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('setValueTxHash'), 0);
	return {
		on: on
	};
});

const web3Wrapper = {
	isReadOnly: jest.fn(() => false),
	onSwitchToMetaMask: jest.fn(() => ({} as any)),
	fromWei: jest.fn(value => value * 1e-18),
	onSwitchToLedger: jest.fn(() => ({} as any)),
	readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
	getEthBalance: jest.fn(() => Promise.resolve('10')),
	getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
	wrongEnvReject: jest.fn(() => Promise.reject('Wrong Env')),
	getTransactionOption: jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	),
	createContract: jest.fn(() => ({
		methods: {
			stakingEnabled: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve(true)
				)
			})),
			stake: jest.fn(() => ({
				send: stakeSend
			})),
			unstake: jest.fn(() => ({
				send: unstakeSend
			})),
			claimReward: jest.fn(() => ({
				send: claimRewardSend
			})),
			stageAddRewards:  jest.fn(() => ({
				send: stageAddRewardSend
			})),
			stageReduceRewards:  jest.fn(() => ({
				send: stageReduceRewardSend
			})),
			setStakeFlag:  jest.fn(() => ({
				send: setStakeFlagSend
			})),
			setValue:  jest.fn(() => ({
				send: setValueSend
			})),
			lockMinTimeInSecond: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve(3600)
				)
			})),
			minStakeAmtInWei: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve("5000000000000000000000")
				)
			})),
			maxOracleStakeAmtInWei: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve("50000000000000000000000")
				)
			})),
			totalAwardsToDistributeInWei: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve("50000000000000000000000")
				)
			})),
			getOracleSize: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve(3)
				)
			})),
			oracleList: jest.fn((index: number) => ({
				call: jest.fn(() =>
					Promise.resolve('oracleAddr' + index)
				)
			})),
			operator: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve('operatorAddr')
				)
			})),
			uploader: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve('uploaderAddr')
				)
			})),
			duoTokenAddress: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve('duoTokenAddr')
				)
			})),
			burnAddress: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve('duoBurnAddr')
				)
			})),
			getUserSize: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve(100)
				)
			})),
			userQueueIdx: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve({
						first: 1,
						last: 2
					})
				)
			})),
			userStakeQueue: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve(100)
				)
			})),
			totalStakeInWei: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve("100000000000000000000")
				)
			})),
			rewardsInWei: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve("100000000000000000000")
				)
			}))
		}
	}))
} as any;

const stakeWrapper = new StakeContractWrapper(web3Wrapper, 'stakeContractAddress');

test('getStates', async () => {
	expect(await stakeWrapper.getStates()).toMatchSnapshot();
});

test('getAddresses', async () => {
	expect(await stakeWrapper.getAddresses()).toMatchSnapshot();
});

test('getOracleList', async () => {
	expect(await stakeWrapper.getOracleList()).toMatchSnapshot();
});

test('getUserSize', async () => {
	expect(await stakeWrapper.getUserSize()).toMatchSnapshot();
});

test('getUserStakes', async () => {
	expect(await stakeWrapper.getUserStakes('account', ['oracle0', 'oracle1'])).toMatchSnapshot();
	expect(
		(stakeWrapper.contract.methods.userQueueIdx as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(stakeWrapper.contract.methods.userStakeQueue as jest.Mock).mock.calls).toMatchSnapshot();
});

test('getOracleStakes', async () => {
	expect(await stakeWrapper.getOracleStakes(['oracle0', 'oracle1'])).toMatchSnapshot();
	expect(
		(stakeWrapper.contract.methods.totalStakeInWei as jest.Mock).mock.calls).toMatchSnapshot();
});

test('getUserAward', async () => {
	expect(await stakeWrapper.getUserReward('account')).toMatchSnapshot();
	expect(
		(stakeWrapper.contract.methods.rewardsInWei as jest.Mock).mock.calls).toMatchSnapshot();
});

test('stake', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await stakeWrapper.stake('account', 'oracleAddr', 100);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.stake('account', 'oracleAddr', 100)).toMatchSnapshot();
	expect(
		await stakeWrapper.stake('account', 'oracleAddr', 100, {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	
	expect(stakeWrapper.contract.methods.stake as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.stake as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('unstake', async () => {
	web3Wrapper.getTransactionOption = jest.fn(
		(account: string, gasLimit: number, option: ITransactionOption = {}) =>
			Promise.resolve({
				from: account,
				gasPrice: option.gasPrice || 1000000000,
				gas: option.gasLimit || gasLimit,
				nonce: option.nonce || 10
			})
	);
	web3Wrapper.isReadOnly = jest.fn(() => true);
	try {
		await stakeWrapper.unstake('account','oracleAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.unstake('account','oracleAddr')).toMatchSnapshot();
	expect(
		await stakeWrapper.unstake('account','oracleAddr', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	
	expect(stakeWrapper.contract.methods.unstake as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.unstake as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

