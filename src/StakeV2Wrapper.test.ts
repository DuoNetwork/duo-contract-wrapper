// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import StakeContractWrapper from './StakeV2Wrapper';
import { ITransactionOption } from './types';
import Web3Wrapper from './Web3Wrapper';

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
	setTimeout(() => on.mock.calls[0][1]('stageAddRewardHash'), 0);
	return {
		on: on
	};
});

const stageReduceRewardSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('stageReduceRewardHash'), 0);
	return {
		on: on
	};
});

const commitAddRewardSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('commitAddRewardHash'), 0);
	return {
		on: on
	};
});

const commitReduceRewardSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('commitReduceRewardHash'), 0);
	return {
		on: on
	};
});

const resetStagingAwardsSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('resetStagingAwardsHash'), 0);
	return {
		on: on
	};
});

const autoRollSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('autoRollHash'), 0);
	return {
		on: on
	};
});

const addOracleSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('addOracleHash'), 0);
	return {
		on: on
	};
});

const updateUploaderByOperatorSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('updateUploaderByOperatorSendHash'), 0);
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
				call: jest.fn(() => Promise.resolve(true))
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
			stageAddRewards: jest.fn(() => ({
				send: stageAddRewardSend
			})),
			stageReduceRewards: jest.fn(() => ({
				send: stageReduceRewardSend
			})),
			commitAddRewards: jest.fn(() => ({
				send: commitAddRewardSend
			})),
			commitReduceRewards: jest.fn(() => ({
				send: commitReduceRewardSend
			})),
			resetStagingAwards: jest.fn(() => ({
				send: resetStagingAwardsSend
			})),
			autoRoll: jest.fn(() => ({
				send: autoRollSend
			})),
			addOracle: jest.fn(() => ({
				send: addOracleSend
			})),
			updateUploaderByOperator: jest.fn(() => ({
				send: updateUploaderByOperatorSend
			})),
			addRewardStagingList: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve({
						user: 'addUser',
						amtInWei: Web3Wrapper.toWei(10)
					})
				)
			})),
			reduceRewardStagingList: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve({
						user: 'reduceUser',
						amtInWei: Web3Wrapper.toWei(10)
					})
				)
			})),
			addRewardStagingIdx: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve({
						first: '1',
						last: '3'
					})
				)
			})),
			reduceRewardStagingIdx: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve({
						first: '1',
						last: '3'
					})
				)
			})),
			setStakeFlag: jest.fn(() => ({
				send: setStakeFlagSend
			})),
			setValue: jest.fn(() => ({
				send: setValueSend
			})),
			lockMinTimeInSecond: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(3600))
			})),
			minStakeAmtInWei: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('5000000000000000000000'))
			})),
			maxOracleStakeAmtInWei: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('50000000000000000000000'))
			})),
			totalRewardsToDistributeInWei: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('50000000000000000000000'))
			})),
			getOracleSize: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(3))
			})),
			oracleList: jest.fn((index: number) => ({
				call: jest.fn(() => Promise.resolve('oracleAddr' + index))
			})),
			operator: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('operatorAddr'))
			})),
			uploader: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('uploaderAddr'))
			})),
			duoTokenAddress: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('duoTokenAddr'))
			})),
			burnAddress: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('duoBurnAddr'))
			})),
			getUserSize: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve(100))
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
				call: jest.fn(() => Promise.resolve(100))
			})),
			totalStakeInWei: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('100000000000000000000'))
			})),
			rewardsInWei: jest.fn(() => ({
				call: jest.fn(() => Promise.resolve('100000000000000000000'))
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

test('getStagingIndex', async () => {
	expect(await stakeWrapper.getStagingIndex()).toMatchSnapshot();
});

test('getUserSize', async () => {
	expect(await stakeWrapper.getUserSize()).toMatchSnapshot();
});

test('getUserStakes', async () => {
	expect(await stakeWrapper.getUserStakes('account', ['oracle0', 'oracle1'])).toMatchSnapshot();
	expect((stakeWrapper.contract.methods.userQueueIdx as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(stakeWrapper.contract.methods.userStakeQueue as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('getStagingAddReward', async () => {
	expect(await stakeWrapper.getStagingAddReward(1)).toMatchSnapshot();
});

test('getStagingReduceReward', async () => {
	expect(await stakeWrapper.getStagingReduceReward(1)).toMatchSnapshot();
});

test('getOracleStakes', async () => {
	expect(await stakeWrapper.getOracleStakes(['oracle0', 'oracle1'])).toMatchSnapshot();
	expect(
		(stakeWrapper.contract.methods.totalStakeInWei as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('getUserAward', async () => {
	expect(await stakeWrapper.getUserReward('account')).toMatchSnapshot();
	expect((stakeWrapper.contract.methods.rewardsInWei as jest.Mock).mock.calls).toMatchSnapshot();
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
	expect((stakeWrapper.contract.methods.stake as jest.Mock).mock.calls).toMatchSnapshot();
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
		await stakeWrapper.unstake('account', 'oracleAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.unstake('account', 'oracleAddr')).toMatchSnapshot();
	expect(
		await stakeWrapper.unstake('account', 'oracleAddr', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.unstake as jest.Mock).toBeCalledTimes(2);
	expect((stakeWrapper.contract.methods.unstake as jest.Mock).mock.calls).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('stageAddReward', async () => {
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
		await stakeWrapper.stageAddRewards('account', ['addr0', 'addr1'], [10, 20]);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(
		await stakeWrapper.stageAddRewards('account', ['addr0', 'addr1'], [10, 20])
	).toMatchSnapshot();
	expect(
		await stakeWrapper.stageAddRewards('account', ['addr0', 'addr1'], [10, 20], {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.stageAddRewards as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.stageAddRewards as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('stageReduceReward', async () => {
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
		await stakeWrapper.stageReduceRewards('account', ['addr0', 'addr1'], [10, 20]);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(
		await stakeWrapper.stageReduceRewards('account', ['addr0', 'addr1'], [10, 20])
	).toMatchSnapshot();
	expect(
		await stakeWrapper.stageReduceRewards('account', ['addr0', 'addr1'], [10, 20], {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.stageReduceRewards as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.stageReduceRewards as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('commitAddReward', async () => {
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
		await stakeWrapper.commitAddRewards('account', 2);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.commitAddRewards('account', 2)).toMatchSnapshot();
	expect(
		await stakeWrapper.commitAddRewards('account', 2, {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.commitAddRewards as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.commitAddRewards as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('commitReduceReward', async () => {
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
		await stakeWrapper.commitReduceRewards('account', 2);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.commitReduceRewards('account', 2)).toMatchSnapshot();
	expect(
		await stakeWrapper.commitReduceRewards('account', 2, {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.commitReduceRewards as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.commitReduceRewards as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('claimReward', async () => {
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
		await stakeWrapper.claimReward('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.claimReward('account')).toMatchSnapshot();
	expect(
		await stakeWrapper.claimReward('account', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.claimReward as jest.Mock).toBeCalledTimes(2);
	expect((stakeWrapper.contract.methods.claimReward as jest.Mock).mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('resetStagingAwards', async () => {
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
		await stakeWrapper.resetStagingAwards('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.resetStagingAwards('account')).toMatchSnapshot();
	expect(
		await stakeWrapper.resetStagingAwards('account', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.resetStagingAwards as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.resetStagingAwards as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('autoRoll', async () => {
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
		await stakeWrapper.autoRoll('account', 'oracleAddr', 100);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.autoRoll('account', 'oracleAddr', 100)).toMatchSnapshot();
	expect(
		await stakeWrapper.autoRoll('account', 'oracleAddr', 100, {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.autoRoll as jest.Mock).toBeCalledTimes(2);
	expect((stakeWrapper.contract.methods.autoRoll as jest.Mock).mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('enableStaking', async () => {
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
		await stakeWrapper.enableStaking('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.enableStaking('account')).toMatchSnapshot();
	expect(
		await stakeWrapper.enableStaking('account', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.setStakeFlag as jest.Mock).toBeCalledTimes(2);
	expect((stakeWrapper.contract.methods.setStakeFlag as jest.Mock).mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('disableStaking', async () => {
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
		await stakeWrapper.disableStaking('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.disableStaking('account')).toMatchSnapshot();
	expect(
		await stakeWrapper.disableStaking('account', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.setStakeFlag as jest.Mock).toBeCalledTimes(4);
	expect((stakeWrapper.contract.methods.setStakeFlag as jest.Mock).mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('addOracle', async () => {
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
		await stakeWrapper.addOracle('account', 'newOracleAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.addOracle('account', 'newOracleAddr')).toMatchSnapshot();
	expect(
		await stakeWrapper.addOracle('account', 'newOracleAddr', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.addOracle as jest.Mock).toBeCalledTimes(2);
	expect((stakeWrapper.contract.methods.addOracle as jest.Mock).mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('updateUploaderByOperator', async () => {
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
		await stakeWrapper.updateUploaderByOperator('account', 'newUploaderAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(
		await stakeWrapper.updateUploaderByOperator('account', 'newUploaderAddr')
	).toMatchSnapshot();
	expect(
		await stakeWrapper.updateUploaderByOperator('account', 'newUploaderAddr', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.updateUploaderByOperator as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.updateUploaderByOperator as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('setMinStakingAmt', async () => {
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
		await stakeWrapper.setMinStakeAmt('account', 100);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.setMinStakeAmt('account', 100)).toMatchSnapshot();
	expect(
		await stakeWrapper.setMinStakeAmt('account', 100, {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.setValue as jest.Mock).toBeCalledTimes(2);
	expect((stakeWrapper.contract.methods.setValue as jest.Mock).mock.calls).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('setMaxStakePerOracleAmt', async () => {
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
		await stakeWrapper.setMaxStakePerOracleAmt('account', 10000);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.setMaxStakePerOracleAmt('account', 10000)).toMatchSnapshot();
	expect(
		await stakeWrapper.setMaxStakePerOracleAmt('account', 10000, {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();

	expect(stakeWrapper.contract.methods.setValue as jest.Mock).toBeCalledTimes(4);
	expect((stakeWrapper.contract.methods.setValue as jest.Mock).mock.calls).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});
