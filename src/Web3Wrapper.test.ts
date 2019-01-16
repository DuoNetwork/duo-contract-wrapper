// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
// import * as CST from './constants';
import sampleEvent from './samples/events.json';
import Web3Wrapper from './Web3Wrapper';

test('parseEvent', () =>
	sampleEvent.forEach(e => expect(Web3Wrapper.parseEvent(e, 1234567890)).toMatchSnapshot()));
