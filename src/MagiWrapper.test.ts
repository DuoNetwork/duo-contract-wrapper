// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import * as CST from './constants';
import MagiWrapper from './MagiWrapper';
import Web3Wrapper from './Web3Wrapper';

const web3Wrapper = new Web3Wrapper(null, CST.PROVIDER_INFURA_KOVAN, '', false);
const magiWrapper = new MagiWrapper(web3Wrapper, web3Wrapper.contractAddresses.Oracles[0].address);

test('startMagi', async () => {
	magiWrapper.commitInternal = jest.fn(() => Promise.resolve());
	await magiWrapper.startMagiRaw('address', 'privateKey', 1, 2, 3, 4);
	expect((magiWrapper.commitInternal as jest.Mock).mock.calls).toMatchSnapshot();
});

test('commitPrice', async () => {
	magiWrapper.commitInternal = jest.fn(() => Promise.resolve());
	await magiWrapper.commitPriceRaw('address', 'privateKey', 1, 2, 3, 4);
	expect((magiWrapper.commitInternal as jest.Mock).mock.calls).toMatchSnapshot();
});
