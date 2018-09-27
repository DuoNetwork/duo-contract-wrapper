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
