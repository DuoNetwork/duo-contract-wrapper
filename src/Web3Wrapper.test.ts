import * as CST from './constants';
import sampleEvent from './samples/events.json';
import Web3Wrapper from './Web3Wrapper';

test('parseEvent', () =>
	sampleEvent.forEach(e => expect(Web3Wrapper.parseEvent(e, 1234567890)).toMatchSnapshot()));

const web3Wrapper = new Web3Wrapper(null, 'source', CST.PROVIDER_INFURA_KOVAN, false);

const rawTx = web3Wrapper.createTxCommand(1, 2, 3, 'toAddr', 4, 'data');
test('createTxCommand', () => expect(rawTx).toMatchSnapshot());
