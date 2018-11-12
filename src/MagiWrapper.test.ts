import * as CST from './constants';
import MagiWrapper from './MagiWrapper';
import Web3Wrapper from './Web3Wrapper';

const magiWrapper = new MagiWrapper(
	new Web3Wrapper(null, 'source', CST.PROVIDER_INFURA_KOVAN, false),
	false
);

test('startMagi', async () => {
	magiWrapper.commitInternal = jest.fn(() => Promise.resolve());
	await magiWrapper.startMagi('address', 'privateKey', 1, 2, 3, 4);
	expect((magiWrapper.commitInternal as jest.Mock).mock.calls).toMatchSnapshot();
});

test('commitPrice', async () => {
	magiWrapper.commitInternal = jest.fn(() => Promise.resolve());
	await magiWrapper.commitPrice('address', 'privateKey', 1, 2, 3, 4);
	expect((magiWrapper.commitInternal as jest.Mock).mock.calls).toMatchSnapshot();
});
