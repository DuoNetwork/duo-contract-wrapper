import DualClassWrapper from './DualClassWrapper';

export enum Wallet {
	None,
	Local,
	MetaMask,
	Ledger
}

export interface IEvent {
	contractAddress: string;
	type: string;
	id: string;
	blockHash: string;
	blockNumber: number;
	transactionHash: string;
	logStatus: string;
	parameters: { [key: string]: string };
	timestamp: number;
}

export interface IContractPrice {
	price: number;
	timestamp: number;
}

export interface IManagedAddresses {
	operator: string;
	roleManager: string;
}

export interface ICustodianAddresses extends IManagedAddresses {
	feeCollector: string;
	oracle: string;
	aToken: string;
	bToken: string;
}

export interface IERC20CustodianAddresses extends ICustodianAddresses {
	collateralToken: string;
}

export interface IManagedStates {
	lastOperationTime: number;
	operationCoolDown: number;
}

export interface IMagiStates {
	isStarted: boolean;
	firstPrice: {
		price: number;
		timestamp: number;
		source: string;
	};
	secondPrice: {
		price: number;
		timestamp: number;
		source: string;
	};
	priceTolerance: number;
	priceFeedTolerance: number;
	priceFeedTimeTolerance: number;
	priceUpdateCoolDown: number;
	numOfPrices: number;
	lastOperationTime: number;
	operationCoolDown: number;
}

export interface IMagiAddresses {
	priceFeed: string[];
	operator: string;
	roleManagerAddress: string;
}

export interface IStakeStates {
	canStake: boolean;
	canUnstake: boolean;
	lockMinTimeInSecond: number;
	minStakeAmt: number;
	maxStakePerPf: number;
	totalAwardsToDistribute: number;
}

export interface IStakeAddress {
	operator: string;
	priceFeedList: string[];
}

export interface IStakeLot {
	timestamp: number;
	amount: number;
}

export interface IStakeQueueIdx {
	first: number;
	last: number;
}

export interface IEsplanadeStates {
	isStarted: boolean;
	votingStage: string;
	poolSizes: {
		cold: number;
		hot: number;
		custodian: number;
		otherContract: number;
	};
	operationCoolDown: number;
	lastOperationTime: number;
}

export interface ICustodianStates extends IManagedStates {
	state: string;
	minBalance: number;
	totalSupplyA: number;
	totalSupplyB: number;
	collateral: number;
	lastPrice: number;
	lastPriceTime: number;
	resetPrice: number;
	resetPriceTime: number;
	createCommRate: number;
	redeemCommRate: number;
	period: number;
	maturity: number;
	preResetWaitingBlocks: number;
	priceFetchCoolDown: number;
	nextResetAddrIndex: number;
	totalUsers: number;
	feeBalance: number;
}

export interface ICustodianWrappers {
	[type: string]: {
		[tenor: string]: DualClassWrapper;
	};
}

export interface IDualClassStates extends ICustodianStates {
	navA: number;
	navB: number;
	resetState: string;
	alpha: number;
	beta: number;
	periodCoupon: number;
	limitPeriodic: number;
	limitUpper: number;
	limitLower: number;
	iterationGasThreshold: number;
}

export interface IVivaldiStates extends ICustodianStates {
	clearCommRate: number;
	iterationGasThreshold: number;
	roundStrike: number;
	isKnockedIn: boolean;
}

export interface IVotingData {
	started: number;
	votedFor: number;
	votedAgainst: number;
	totalVoters: number;
}

export interface ICustodianContractAddress {
	custodian: IContractAddress;
	aToken: IContractAddress;
	bToken: IContractAddress;
}

export interface IContractAddress {
	code: string;
	address: string;
}

export interface ICustodianContractAddresses {
	[tenor: string]: ICustodianContractAddress;
}

export interface IContractAddresses {
	Custodians: {
		[type: string]: ICustodianContractAddresses;
	};
	MultiSigManagers: IContractAddress[];
	Oracles: IContractAddress[];
	Stake: string;
}

export interface ITransactionOption {
	gasPrice?: number;
	gasLimit?: number;
	nonce?: number;
}
