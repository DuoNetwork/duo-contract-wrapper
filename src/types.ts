export interface IEvent {
	type: string;
	id: string;
	blockHash: string;
	blockNumber: number;
	transactionHash: string;
	logStatus: string;
	parameters: {[key: string]: string};
	timestamp: number;
}

export interface IAddress {
	address: string;
	balance: number;
}

export interface IAddresses {
	operator: IAddress;
	feeCollector: IAddress;
	priceFeed1: IAddress;
	priceFeed2: IAddress;
	priceFeed3: IAddress;
	poolManager: IAddress;
	[role: string]: IAddress;
}

export interface IBalances {
	eth: number;
	duo: number;
	allowance: number;
	tokenA: number;
	tokenB: number;
}

export interface ICustodianPrice {
	address: string;
	price: number;
	timestamp: number;
}

export interface IAccount {
	address: string;
	privateKey: string;
}

export interface IOption {
	// live: boolean;
	dbLive: boolean;
	server: boolean;
	dynamo: boolean;
	aws: boolean;
	gcp: boolean;
	azure: boolean;
	force: boolean;
	gasPrice: number;
	gasLimit: number;
	eth: number;
	address: string;
	addr1: string;
	addr2: string;
	privateKey: string;
	price: number;
	source: string;
	pwd: string;
	event: string;
	provider: string;
	contractState: string;
	accountNum: number;
	saveAccount: boolean;
	from: string;
	to: string;
	value: number;
	index: number;
	total: number;
	minEther: number;
	alpha: number;
	amtA: number;
	amtB: number;
	numOfMinutes: number;
	numOfHours: number;
	key: string;
	endBlk: number;
	network: string;
}

export interface ICustodianStates {
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

export interface ICustodianPrices {
	first: ICustodianPrice;
	second: ICustodianPrice;
	reset: ICustodianPrice;
	last: ICustodianPrice;
}
