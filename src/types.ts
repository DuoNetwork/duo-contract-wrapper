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
	address: string;
	price: number;
	timestamp: number;
}

export interface IAddress {
	address: string;
	balance: number;
}

export interface IBeethovanAddresses {
	operator: IAddress;
	feeCollector: IAddress;
	priceFeed1: IAddress;
	priceFeed2: IAddress;
	priceFeed3: IAddress;
	poolManager: IAddress;
	[role: string]: IAddress;
}

export interface IBeethovanBalances {
	eth: number;
	duo: number;
	allowance: number;
	tokenA: number;
	tokenB: number;
}

export interface IBeethovanStates {
	state: string;
	navA: number;
	navB: number;
	totalSupplyA: number;
	totalSupplyB: number;
	alpha: number;
	beta: number;
	feeAccumulated: number;
	periodCoupon: number;
	limitPeriodic: number;
	limitUpper: number;
	limitLower: number;
	createCommRate: number;
	redeemCommRate: number;
	period: number;
	iterationGasThreshold: number;
	ethDuoFeeRatio: number;
	preResetWaitingBlocks: number;
	priceTol: number;
	priceFeedTol: number;
	priceFeedTimeTol: number;
	priceUpdateCoolDown: number;
	numOfPrices: number;
	nextResetAddrIndex: number;
	lastAdminTime: number;
	adminCoolDown: number;
	usersLength: number;
	addrPoolLength: number;
	ethBalance: number;
	duoBalance: number;
}

export interface IBeethovanPrices {
	first: IContractPrice;
	second: IContractPrice;
	reset: IContractPrice;
	last: IContractPrice;
}
