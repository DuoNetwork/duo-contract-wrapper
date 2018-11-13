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

export interface ICustodianPrices {
	reset: IContractPrice;
	last: IContractPrice;
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
	preResetWaitingBlocks: number;
	priceFetchCoolDown: number;
	nextResetAddrIndex: number;
	totalUsers: number;
	feeBalance: number;
}

export interface IBeethovanStates extends ICustodianStates {
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
	custodian: string;
	aToken: string;
	bToken: string;
}

export interface IContractAddresses {
	Beethovan: ICustodianContractAddress,
	Esplanade: string;
	Magi: string;
}
