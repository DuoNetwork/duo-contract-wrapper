// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import StakeContractWrapper from './StakeContractWrapper';
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

const claimAwardSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('claimAwardTxHash'), 0);
	return {
		on: on
	};
});

const batchAddAwardSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('batchAddAwardTxHash'), 0);
	return {
		on: on
	};
});

const batchReduceAwardSend = jest.fn(() => {
	const on = jest.fn();
	setTimeout(() => on.mock.calls[0][1]('batchReduceAwardTxHash'), 0);
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
			canStake: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve(true)
				)
			})),
			canUnstake: jest.fn(() => ({
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
			claimAward: jest.fn(() => ({
				send: claimAwardSend
			})),
			batchAddAward:  jest.fn(() => ({
				send: batchAddAwardSend
			})),
			batchReduceAward:  jest.fn(() => ({
				send: batchReduceAwardSend
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
			totalStakAmtInWei: jest.fn(() => ({
				call: jest.fn(() =>
					Promise.resolve("100000000000000000000")
				)
			})),
			awardsInWei: jest.fn(() => ({
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
		(stakeWrapper.contract.methods.totalStakAmtInWei as jest.Mock).mock.calls).toMatchSnapshot();
});

test('getUserAward', async () => {
	expect(await stakeWrapper.getUserAward('account')).toMatchSnapshot();
	expect(
		(stakeWrapper.contract.methods.awardsInWei as jest.Mock).mock.calls).toMatchSnapshot();
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

test('claimAward', async () => {
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
		await stakeWrapper.claimAward('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.claimAward('account')).toMatchSnapshot();
	expect(
		await stakeWrapper.claimAward('account', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	
	expect(stakeWrapper.contract.methods.claimAward as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.claimAward as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});


test('batchAddAward', async () => {
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
		await stakeWrapper.batchAddAward('account', ['addr0', 'addr1'], [10,20]);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.batchAddAward('account', ['addr0', 'addr1'], [10,20])).toMatchSnapshot();
	expect(
		await stakeWrapper.batchAddAward('account', ['addr0', 'addr1'], [10,20], {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	
	expect(stakeWrapper.contract.methods.batchAddAward as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.batchAddAward as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('batchReduceAward', async () => {
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
		await stakeWrapper.batchReduceAward('account', ['addr0', 'addr1'], [10,20]);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.batchReduceAward('account', ['addr0', 'addr1'], [10,20])).toMatchSnapshot();
	expect(
		await stakeWrapper.batchReduceAward('account', ['addr0', 'addr1'], [10,20], {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	
	expect(stakeWrapper.contract.methods.batchReduceAward as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.batchReduceAward as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('enableStakingAndUnstaking', async () => {
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
		await stakeWrapper.enableStakingAndUnstaking('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.enableStakingAndUnstaking('account')).toMatchSnapshot();
	expect(
		await stakeWrapper.enableStakingAndUnstaking('account', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	
	expect(stakeWrapper.contract.methods.setStakeFlag as jest.Mock).toBeCalledTimes(2);
	expect(
		(stakeWrapper.contract.methods.setStakeFlag as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});

test('disableStakingAndUnstaking', async () => {
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
		await stakeWrapper.disableStakingAndUnstaking('account');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	web3Wrapper.isReadOnly = jest.fn(() => false);
	expect(await stakeWrapper.disableStakingAndUnstaking('account')).toMatchSnapshot();
	expect(
		await stakeWrapper.disableStakingAndUnstaking('account', {
			gasPrice: 1000000000,
			gasLimit: 20000,
			nonce: 10
		})
	).toMatchSnapshot();
	
	expect(stakeWrapper.contract.methods.setStakeFlag as jest.Mock).toBeCalledTimes(4);
	expect(
		(stakeWrapper.contract.methods.setStakeFlag as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
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
	expect(
		(stakeWrapper.contract.methods.setValue as jest.Mock).mock.calls
	).toMatchSnapshot();
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
	expect(
		(stakeWrapper.contract.methods.setValue as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(stakeSend.mock.calls).toMatchSnapshot();
	expect((web3Wrapper.getTransactionOption as jest.Mock).mock.calls).toMatchSnapshot();
});