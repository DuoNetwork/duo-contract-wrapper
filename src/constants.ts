export const ETH_MAINNET_ID = 1;
export const ETH_KOVAN_ID = 42;

export const DUMMY_ADDR = '0x0';

export const CTD_INCEPTION = 'Inception';
export const CTD_TRADING = 'Trading';
export const CTD_PRERESET = 'PreReset';
export const CTD_RESET = 'RESET';
export const CTD_LOADING = 'Loading';

export const BTV_UP_RESET = 'UpwardReset';
export const BTV_DOWN_RESET = 'DownwardReset';
export const BTV_PERIOD_RESET = 'PeriodicReset';

export const ESP_NOT_STARTED = 'NotStarted';
export const ESP_MODERATOR = 'Moderator';
export const ESP_CONTRACT = 'Contract';

// wallet and contract
export const DUO_CONTRACT_ADDR_KOVAN = '0x1e1A2E7c5E669c9aa6ad6F49B1508C3F5F0b9fFc';
export const ESPLANADE_ADDR_KOVAN = '0xD728681490d63582047A6Cd2fC80B1343C6AbA20';
export const BEETHOVAN_ADDR_KOVAN = '0x55a59583F78e6BF27EB7F3668980A81Ff4e9E302';
export const MAGI_ADDR_KOVAN = '0x0d729B3C11b3E6Bf5792d36f640f3Be6f187Dd67';
export const BEETHOVAN_A_ADDR_KOVAN = '0x22705b8081E1364be4D0DF22C529C4094Ab402f3';
export const BEETHOVAN_B_ADDR_KOVAN = '0x8429943cFfE82182436e567e1202fc5c112837A0';
export const DUO_CONTRACT_ADDR_MAIN = '0xa8Cac43aA0C2B61BA4e0C10DC85bCa02662E1Bee';
export const MAGI_ADDR_MAIN = '0x2739135A37750590B6679083fCDBfD0D7a459923';
export const ESPLANADE_ADDR_MAIN = '0xd0a5439300c09ab75ee8a3de920cb03cec87cc0f';
export const BEETHOVAN_ADDR_MAIN = '0x9952eA6d8F373543C1Af1192537dB6C771b23A4e';
export const BEETHOVAN_A_ADDR_MAIN = '0xb30cB711E88bd226bCD31a0e190a43A6dA197eE4';
export const BEETHOVAN_B_ADDR_MAIN = '0x57044839157c8749b8EfF63564647f0Ca2044B30';
export const INCEPTION_BLK_KOVAN = 9355871;
export const INCEPTION_BLK_MAIN = 0;
export const EVENT_ACCEPT_PRICE = 'AcceptPrice';
export const EVENT_START_PRE_RESET = 'StartPreReset';
export const EVENT_START_RESET = 'StartReset';
export const EVENT_START_TRADING = 'StartTrading';
export const EVENT_CREATE = 'Create';
export const EVENT_REDEEM = 'Redeem';
export const EVENT_COMMIT_PRICE = 'CommitPrice';
export const EVENT_TRANSFER = 'Transfer';
export const EVENT_APPROVAL = 'Approval';
export const EVENT_ADD_ADDRESS = 'AddAddress';
export const EVENT_UPDATE_ADDRESS = 'UpdateAddress';
export const EVENT_REMOVE_ADDRESS = 'RemoveAddress';
export const EVENT_SET_VALUE = 'SetValue';
export const EVENT_COLLECT_FEE = 'CollectFee';
export const EVENT_TOTAL_SUPPLY = 'TotalSupply';
export const EVENTS = [
	EVENT_START_TRADING,
	EVENT_ACCEPT_PRICE,
	EVENT_CREATE,
	EVENT_REDEEM,
	EVENT_COMMIT_PRICE,
	EVENT_TRANSFER,
	EVENT_APPROVAL,
	EVENT_ADD_ADDRESS,
	EVENT_UPDATE_ADDRESS,
	EVENT_REMOVE_ADDRESS,
	EVENT_SET_VALUE,
	EVENT_COLLECT_FEE,
	EVENT_TOTAL_SUPPLY,
	EVENT_START_PRE_RESET,
	EVENT_START_RESET
];

export const STATE_INCEPTION = '0';
export const STATE_TRADING = '1';
export const STATE_PRERESET = '2';
export const STATE_RESET = '3';
export const RESET_STATE_UP = '0';
export const RESET_STATE_DOWN = '1';
export const RESET_STATE_PERIOD = '2';
export const VOTING_NOT_STARTED = '0';
export const VOTING_MODERATOR = '1';
export const VOTING_CONTRACT = '2';
export const FN_START_CONTRACT = 'startContract';
export const FN_COMMIT_PRICE = 'commitPrice';
export const SRC_MYETHER = 'myether';
export const SRC_INFURA = 'infura';
export const PROVIDER_LOCAL_HTTP = 'http://localhost:8545';
// export const PROVIDER_LOCAL_WS = 'ws://localhost:8546';
export const PROVIDER_INFURA_MAIN_WS = 'wss://mainnet.infura.io/ws';
export const PROVIDER_INFURA_KOVAN_WS = 'wss://kovan.infura.io/ws';
export const PROVIDER_MYETHER_MAIN = 'https://api.myetherapi.com/eth';
export const PROVIDER_MYETHER_ROP = 'https://api.myetherapi.com/rop';
export const PROVIDER_INFURA_MAIN = 'https://mainnet.infura.io';
export const PROVIDER_INFURA_KOVAN = 'https://kovan.infura.io';
export const TRANSFER_TOKEN_INTERVAL = 30; // in seconds
export const TRANSFER_TOKEN_GAS = 120000;
export const TRANSFER_TOKEN_GAS_TH = 0.01; // in ether
export const SET_VALUE_GAS = 50000;
export const SET_VALUE_GAS_PRICE = 3; // in Gwei
export const COLLECT_FEE_GAS = 40000;
export const COLLECT_FEE_GAS_PRICE = 4; // in Gwei
export const ADD_ADDR_GAS = 40000;
export const ADD_ADDR_GAS_PRICE = 5; // in Gwei
export const REMOVE_ADDR_GAS = 40000;
export const REMOVE_ADDR_GAS_PRICE = 5; // in Gwei
export const UPDATE_ADDR_GAS = 40000;
export const UPDATE_ADDR_GAS_PRICE = 5; // in Gwei
export const TRANSFER_INTERVAL = 10; // in seconds
export const TRANSFER_GAS_TH = 0.01;
export const REDEEM_INTERVAL = 10; // in seconds
export const REDEEM_GAS = 80000;
export const REDEEM_GAS_TH = 0.005;
export const CREATE_INTERVAL = 10; // in seconds
export const CREATE_GAS = 160000;
export const CREATE_GAS_TH = 0.01;
export const DEFAULT_GAS_PRICE = 5;
export const PRE_RESET_GAS_LIMIT = 120000;
export const RESET_GAS_LIMIT = 4000000;
export const EVENT_FETCH_BLOCK_INTERVAL = 100;
export const EVENT_FETCH_TIME_INVERVAL = 600000;

export const LOG_INFO = 'INFO';
export const LOG_DEBUG = 'DEBUG';
export const LOG_ERROR = 'ERROR';
export const LOG_RANKING: { [level: string]: number } = {
	[LOG_ERROR]: 0,
	[LOG_INFO]: 1,
	[LOG_DEBUG]: 2
};

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
	PRERESET_WAITING_BLOCKS: 16,
	PRICE_FETCH_COOLDOWN: 17,
	NEXT_RESET_ADDR_INDEX: 18,
	TOTAL_USERS: 19,
	FEE_BALANCE_INWEI: 20,
	RESET_STATE: 21,
	ALPHA_INBP: 22,
	BETA_INWEI: 23,
	PERIOD_COUPON_INWEI: 24,
	LIMIT_PERIODIC_INWEI: 25,
	LIMIT_UPPER_INWEI: 26,
	LIMIT_LOWER_INWEI: 27,
	ITERATION_GAS_THRESHOLD: 28
};
