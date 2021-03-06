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
export const INCEPTION_BLK_MAIN = 7278544;

// managed
export const EVENT_UPDATE_ROLE_MANAGER = 'UpdateRoleManager';
export const EVENT_UPDATE_OPERATOR = 'UpdateOperator';

// Stake
export const EVENT_ADD_STAKE = 'AddStake';
export const EVENT_UN_STAKE = 'Unstake';
export const EVENT_ADD_AWARD = 'AddAward';
export const EVENT_REDUCE_AWARD = 'ReduceAward';
export const EVENT_CLAIM_AWARD = 'ClaimAward';

// StakeV2
export const EVENT_COMMIT_ADD_REWARD = 'CommitAddReward';
export const EVENT_COMMIT_REDUCE_REWARD = 'CommitReduceReward';
export const EVENT_UPDATE_UPLOADER = 'UpdateUploader';
export const EVENT_CLAIM_REWARD = 'ClaimReward';

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
export const EVENT_MATURED = 'Matured';
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

// vivaldi
export const EVENT_START_ROUND = 'StartRound';
export const EVENT_END_ROUND = 'EndRound';

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
export const PROVIDER_INFURA_MAIN = 'https://mainnet.infura.io/v3';
export const PROVIDER_INFURA_KOVAN = 'https://kovan.infura.io/v3';
export const TRANSFER_TOKEN_GAS = 120000;
export const MAGI_SET_VALUE_GAS = 100000;
export const DUAL_CLASS_SET_VALUE_GAS = 50000;
export const COLLECT_FEE_GAS = 40000;
export const ADD_ADDR_GAS = 40000;
export const REMOVE_ADDR_GAS = 40000;
export const UPDATE_ADDR_GAS = 40000;
export const DUAL_CLASS_REDEEM_GAS = 160000;
export const DUAL_CLASS_CREATE_GAS = 160000;
export const VIVALDI_REDEEM_GAS = 160000;
export const VIVALDI_CREATE_GAS = 250000;
export const DEFAULT_GAS_PRICE = 5;
export const DUAL_CLASS_PRE_RESET_GAS_LIMIT = 240000;
export const VIVALDI_PRE_RESET_GAS_LIMIT = 240000;
export const RESET_GAS_LIMIT = 4000000;
export const START_CUSTODIAN_GAS = 400000;
export const FETCH_PRICE_GAS = 150000;
export const START_MAGI_GAS = 120000;
export const UPDATE_PRICE_FEED = 100000;
export const UPDATE_OPERATOR = 100000;
export const COMMIT_PRICE_GAS = 160000;
export const UPDATE_ROLE_MANAGER_GAS = 1000000;
export const DEFAULT_TX_GAS_LIMIT = 30000;
export const START_ROUND_GAS = 300000;
export const END_ROUND_GAS = 300000;

// stake v1
export const STAKE_V1_STAKING_GAS = 240000;
export const STAKE_V1_UNSTAKING_GAS = 240000;
export const STAKE_V1_CLAIM_REWARD_GAS = 60000;
export const STAKE_V1_ENABLE_STAKING_GAS = 50000;
export const STAKE_V1_DISENABLE_STAKING_GAS = 50000;
export const STAKE_V1_BATCH_ADD_REWAD_LIMIT = 500000;
export const STAKE_V1_BATCH_REDUCE_REWAD_LIMIT = 500000;

// stake v2
export const STAKE_V2_STAKING_GAS = 240000;
export const STAKE_V2_UNSTAKING_GAS = 240000;
export const STAKE_V2_CLAIM_REWARD_GAS = 60000;
export const STAKE_V2_ENABLE_STAKING_GAS = 50000;
export const STAKE_V2_DISENABLE_STAKING_GAS = 50000;
export const STAKE_V2_STAGE_ADD_REWAD_GAS = 500000;
export const STAKE_V2_STAGE_REDUCE_REWAD_GAS = 500000;
export const STAKE_V2_COMMIT_REDUCE_REWAD_GAS = 500000;
export const STAKE_V2_COMMIT_ADD_REWAD_GAS = 500000;
export const STAKE_V2_AUTO_ROLL_GAS = 200000;
export const STAKE_V2_RESET_STAGING_GAS = 100000;

export const BTV_STATE = {
	LAST_OPERATION_TIME: 0,
	OPERATION_COOLDOWN: 1,
	STATE: 2,
	MIN_BALANCE: 3,
	TOTAL_SUPPLYA: 4,
	TOTAL_SUPPLYB: 5,
	ETH_COLLATERAL_IN_WEI: 6,
	NAVA_IN_WEI: 7,
	NAVB_IN_WEI: 8,
	LAST_PRICE_IN_WEI: 9,
	LAST_PRICETIME_IN_SECOND: 10,
	RESET_PRICE_IN_WEI: 11,
	RESET_PRICETIME_IN_SECOND: 12,
	CREATE_COMM_IN_BP: 13,
	REDEEM_COMM_IN_BP: 14,
	PERIOD: 15,
	MATURITY: 16,
	PRERESET_WAITING_BLOCKS: 17,
	PRICE_FETCH_COOLDOWN: 18,
	NEXT_RESET_ADDR_INDEX: 19,
	TOTAL_USERS: 20,
	FEE_BALANCE_IN_WEI: 21,
	RESET_STATE: 22,
	ALPHA_INBP: 23,
	BETA_IN_WEI: 24,
	PERIOD_COUPON_IN_WEI: 25,
	LIMIT_PERIODIC_IN_WEI: 26,
	LIMIT_UPPER_IN_WEI: 27,
	LIMIT_LOWER_IN_WEI: 28,
	ITERATION_GAS_THRESHOLD: 29
};

export const VVD_STATE = {
	LAST_OPERATION_TIME: 0,
	OPERATION_COOLDOWN: 1,
	STATE: 2,
	MIN_BALANCE: 3,
	TOTAL_SUPPLYA: 4,
	TOTAL_SUPPLYB: 5,
	TOKEN_COLLATERAL_IN_WEI: 6,
	LAST_PRICE_IN_WEI: 7,
	LAST_PRICETIME_IN_SECOND: 8,
	RESET_PRICE_IN_WEI: 9,
	RESET_PRICETIME_IN_SECOND: 10,
	CREATE_COMM_IN_BP: 11,
	REDEEM_COMM_IN_BP: 12,
	CLEAR_COMM_IN_BP: 13,
	PERIOD: 14,
	MATURITY: 15,
	PRERESET_WAITING_BLOCKS: 16,
	PRICE_FETCH_COOLDOWN: 17,
	NEXT_RESET_ADDR_INDEX: 18,
	TOTAL_USERS: 19,
	TOKEN_FEE_BALANCE_IN_WEI: 20,
	ITERATION_GAS_THRESHOLD: 21,
	ROUND_STRIKE_IN_WEI: 22
};

export const TENOR_PPT = 'Perpetual';
export const TENOR_M19 = 'M19';
export const BEETHOVEN = 'Beethoven';
export const MOZART = 'Mozart';
export const VIVALDI = 'Vivaldi';
export const PERIOD_3H = '3H';
export const PERIOD_1D = '1D';
