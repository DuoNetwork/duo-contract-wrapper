// wallet and contract
export const DUO_CONTRACT_ADDR_KOVAN = '0xa8Cac43aA0C2B61BA4e0C10DC85bCa02662E1Bee';
export const CUSTODIAN_ADDR_KOVAN = '0x0f80F055c7482b919183EcD06e0dd5FD7991D309'; // '0x72c89F7e11C845c4ADb7280d1990b3e54F84B417'; // 7648017
export const A_CONTRACT_ADDR_KOVAN = '0x8e9962286823F21960D849CCC52F8c4a09a4b30f'; //deploy gas 1094050
export const B_CONTRACT_ADDR_KOVAN = '0x1575e11F5DA9067A577175f898A92e9B4BfbE060'; // deploy gas 1094050
export const DUO_CONTRACT_ADDR_MAIN = '0xa8Cac43aA0C2B61BA4e0C10DC85bCa02662E1Bee'; // temparary using kovan
export const CUSTODIAN_ADDR_MAIN = '0x0f80F055c7482b919183EcD06e0dd5FD7991D309'; // temparary using kovan
export const A_CONTRACT_ADDR_MAIN = '0x8e9962286823F21960D849CCC52F8c4a09a4b30f'; // temparary using kovan
export const B_CONTRACT_ADDR_MAIN = '0x1575e11F5DA9067A577175f898A92e9B4BfbE060'; // temparary using kovan
export const INCEPTION_BLK_KOVAN = 8261673;
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
export const STATE_UP_RESET = '3';
export const STATE_DOWN_RESET = '4';
export const STATE_PERIOD_RESET = '5';
export const FN_START_CONTRACT = 'startContract';
export const FN_COMMIT_PRICE = 'commitPrice';
export const SRC_MYETHER = 'myether';
export const SRC_INFURA = 'infura';
export const PROVIDER_LOCAL_HTTP = 'http://localhost:8545';
export const PROVIDER_LOCAL_WS = 'ws://localhost:8546';
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
