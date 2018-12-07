import * as CST from './constants';
import BeethovenWapper from './DualClassCustodianWrapper';

test('convertCustodianState', () => {
	expect(BeethovenWapper.convertCustodianState(CST.STATE_INCEPTION)).toBe(CST.CTD_INCEPTION);
	expect(BeethovenWapper.convertCustodianState(CST.STATE_PRERESET)).toBe(CST.CTD_PRERESET);
	expect(BeethovenWapper.convertCustodianState(CST.STATE_RESET)).toBe(CST.CTD_RESET);
	expect(BeethovenWapper.convertCustodianState(CST.STATE_TRADING)).toBe(CST.CTD_TRADING);
	expect(BeethovenWapper.convertCustodianState(CST.STATE_MATURED)).toBe(CST.CTD_MATURED);
	expect(BeethovenWapper.convertCustodianState('any')).toBe(CST.CTD_LOADING);
});

test('convertCustodianState', () => {
	expect(BeethovenWapper.convertResetState(CST.RESET_STATE_DOWN)).toBe(CST.BTV_DOWN_RESET);
	expect(BeethovenWapper.convertResetState(CST.RESET_STATE_UP)).toBe(CST.BTV_UP_RESET);
	expect(BeethovenWapper.convertResetState(CST.RESET_STATE_PERIOD)).toBe(CST.BTV_PERIOD_RESET);
	expect(BeethovenWapper.convertResetState('any')).toBe('');
});
