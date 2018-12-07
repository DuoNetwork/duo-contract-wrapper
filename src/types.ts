import DualClassCustodianWapper from './DualClassCustodianWrapper';

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

export interface IManagedStates {
	lastOperationTime: number;
	operationCoolDown: number;
}

export interface IEsplanadeStates {
	isStarted: boolean;
	votingStage: string;
	poolAddrsHot: string[];
	poolAddrsCold: string[];
	custodianContractAddrs: string[];
	otherContractAddrs: string[];
	operationCoolDown: number;
	lastOperationTime: number;
	votingData: IVotingData;
}

export interface IEsplanadeAddresses {
	moderator: string;
	candidate: string;
}

export interface ICustodianStates extends IManagedStates {
	state: string;
	minBalance: number;
	totalSupplyA: number;
	totalSupplyB: number;
	ethCollateral: number;
	navA: number;
	navB: number;
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
		[tenor: string]: DualClassCustodianWapper
	}
}

export interface IDualClassStates extends ICustodianStates {
	resetState: string;
	alpha: number;
	beta: number;
	periodCoupon: number;
	limitPeriodic: number;
	limitUpper: number;
	limitLower: number;
	iterationGasThreshold: number;
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
	[tenor: string]: ICustodianContractAddress,
}

export interface IContractAddresses {
	Custodians: {
		[type: string]: ICustodianContractAddresses
	};
	MultiSigManagers: IContractAddress[];
	Oracles: IContractAddress[];
}
