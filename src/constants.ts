export const ETH_MAINNET_ID = 1;
export const ETH_KOVAN_ID = 42;

export const DUMMY_ADDR = '0x0';

export const CTD_INCEPTION = 'Inception';
export const CTD_TRADING = 'Trading';
export const CTD_PRERESET = 'PreReset';
export const CTD_RESET = 'Reset';
export const CTD_MATURED = 'Matured';
export const CTD_LOADING = 'Loading';

export const BTV_UP_RESET = 'UpwardReset';
export const BTV_DOWN_RESET = 'DownwardReset';
export const BTV_PERIOD_RESET = 'PeriodicReset';

export const ESPLANADE = 'Esplanade';
export const ESP_NOT_STARTED = 'NotStarted';
export const ESP_MODERATOR = 'Moderator';
export const ESP_CONTRACT = 'Contract';

// wallet and contract
export const INCEPTION_BLK_KOVAN = 9355871;
export const INCEPTION_BLK_MAIN = 0;

// managed
export const EVENT_UPDATE_ROLE_MANAGER = 'UpdateRoleManager';
export const EVENT_UPDATE_OPERATOR = 'UpdateOperator';

// esplanade
export const EVENT_ADD_ADDRESS = 'AddAddress';
export const EVENT_REMOVE_ADDRESS = 'RemoveAddress';
export const EVENT_PROVIDE_ADDRESS = 'ProvideAddress';
export const EVENT_ADD_CUSTODIAN = 'AddCustodian';
export const EVENT_ADD_OTHER_CONTRACT = 'AddOtherContract';
export const EVENT_START_CONTRACT_VOTING = 'StartContractVoting';
export const EVENT_TERMINATE_CONTRACT_VOTING = 'TerminateContractVoting';
export const EVENT_START_MODERATOR_VOTING = 'StartModeratorVoting';
export const EVENT_TERMINATEBY_TIMEOUT = 'TerminateByTimeOut';
export const EVENT_VOTE = 'Vote';
export const EVENT_COMPLETE_VOTING = 'CompleteVoting';
export const EVENT_REPLACE_MODERATOR = 'ReplaceModerator';

// custodian
export const EVENT_START_TRADING = 'StartTrading';
export const EVENT_START_PRE_RESET = 'StartPreReset';
export const EVENT_START_RESET = 'StartReset';
export const EVENT_MATURED = 'Matured'
export const EVENT_ACCEPT_PRICE = 'AcceptPrice';
export const EVENT_CREATE = 'Create';
export const EVENT_REDEEM = 'Redeem';
export const EVENT_TOTAL_SUPPLY = 'TotalSupply';
export const EVENT_TRANSFER = 'Transfer';
export const EVENT_APPROVAL = 'Approval';
export const EVENT_COLLECT_FEE = 'CollectFee';
export const EVENT_UPDATE_ORACLE = 'UpdateOracle';
export const EVENT_UPDATE_FEE_COLLECTOR = 'UpdateFeeCollector';

// beethovan
export const EVENT_SET_VALUE = 'SetValue';

// magi
export const EVENT_COMMIT_PRICE = 'CommitPrice';
export const EVENT_UPDATE_PRICE_FEED = 'UpdatePriceFeed';

export const STATE_INCEPTION = '0';
export const STATE_TRADING = '1';
export const STATE_PRERESET = '2';
export const STATE_RESET = '3';
export const STATE_MATURED = '4';
export const RESET_STATE_UP = '0';
export const RESET_STATE_DOWN = '1';
export const RESET_STATE_PERIOD = '2';
export const VOTING_NOT_STARTED = '0';
export const VOTING_MODERATOR = '1';
export const VOTING_CONTRACT = '2';
export const SRC_MYETHER = 'myether';
export const SRC_INFURA = 'infura';
export const PROVIDER_LOCAL_HTTP = 'http://localhost:8545';
export const PROVIDER_MYETHER_MAIN = 'https://api.myetherapi.com/eth';
export const PROVIDER_INFURA_MAIN = 'https://mainnet.infura.io';
export const PROVIDER_INFURA_KOVAN = 'https://kovan.infura.io';
export const TRANSFER_TOKEN_GAS = 120000;
export const SET_VALUE_GAS = 100000;
export const COLLECT_FEE_GAS = 40000;
export const ADD_ADDR_GAS = 40000;
export const REMOVE_ADDR_GAS = 40000;
export const UPDATE_ADDR_GAS = 40000;
export const REDEEM_GAS = 160000;
export const CREATE_GAS = 160000;
export const DEFAULT_GAS_PRICE = 5;
export const PRE_RESET_GAS_LIMIT = 120000;
export const RESET_GAS_LIMIT = 4000000;
export const START_CUSTODIAN_GAS = 1000000;
export const FETCH_PRICE_GAS = 150000;
export const START_MAGI_GAS = 120000;
export const UPDATE_PRICE_FEED = 100000;
export const UPDATE_OPERATOR = 100000;
export const COMMIT_PRICE_GAS = 80000;
export const UPDATE_ROLE_MANAGER_GAS = 1000000;
export const DEFAULT_TX_GAS_LIMIT = 30000;

export const BTV_STATE = {
	LAST_OPERATION_TIME: 0,
	OPERATION_COOLDOWN: 1,
	STATE: 2,
	MIN_BALANCE: 3,
	TOTAL_SUPPLYA: 4,
	TOTAL_SUPPLYB: 5,
	ETH_COLLATERAL_INWEI: 6,
	NAVA_INWEI: 7,
	NAVB_INWEI: 8,
	LAST_PRICE_INWEI: 9,
	LAST_PRICETIME_INSECOND: 10,
	RESET_PRICE_INWEI: 11,
	RESET_PRICETIME_INSECOND: 12,
	CREATE_COMMINBP: 13,
	REDEEM_COMMINBP: 14,
	PERIOD: 15,
	MATURITY: 16,
	PRERESET_WAITING_BLOCKS: 17,
	PRICE_FETCH_COOLDOWN: 18,
	NEXT_RESET_ADDR_INDEX: 19,
	TOTAL_USERS: 20,
	FEE_BALANCE_INWEI: 21,
	RESET_STATE: 22,
	ALPHA_INBP: 23,
	BETA_INWEI: 24,
	PERIOD_COUPON_INWEI: 25,
	LIMIT_PERIODIC_INWEI: 26,
	LIMIT_UPPER_INWEI: 27,
	LIMIT_LOWER_INWEI: 28,
	ITERATION_GAS_THRESHOLD: 29
};

export const TENOR_PPT = 'Perpetual';
export const TENOR_M19 = 'M19';
export const BEETHOVEN = 'Beethoven';
export const MOZART = 'Mozart';
