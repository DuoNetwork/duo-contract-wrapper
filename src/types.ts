export interface IEvent {
	contractAddress: string;
	type: string;
	id: string;
	blockHash: string;
	blockNumber: number;
	transactionHash: string;
	logStatus: string;
	parameters: {[key: string]: string};
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

export interface IAddress {
	address: string;
	balance: number;
}

export interface IManagedAddresses {
	operator: IAddress;
	roleManager: IAddress;
}

export interface ICustodianAddresses extends IManagedAddresses {
	feeCollector: IAddress;
	oracleAddress: IAddress;
	aTokenAddress: IAddress;
	bTokenAddress: IAddress;
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
