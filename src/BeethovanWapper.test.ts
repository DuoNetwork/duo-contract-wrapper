import BeethovanWapper from './BeethovanWapper';
import * as CST from './constants';

test('convertCustodianState', () => {
	expect(BeethovanWapper.convertCustodianState(CST.STATE_INCEPTION)).toBe(CST.CTD_INCEPTION);
	expect(BeethovanWapper.convertCustodianState(CST.STATE_PRERESET)).toBe(CST.CTD_PRERESET);
	expect(BeethovanWapper.convertCustodianState(CST.STATE_RESET)).toBe(CST.CTD_RESET);
	expect(BeethovanWapper.convertCustodianState(CST.STATE_TRADING)).toBe(CST.CTD_TRADING);
	expect(BeethovanWapper.convertCustodianState('any')).toBe(CST.CTD_LOADING);
});

test('convertCustodianState', () => {
	expect(BeethovanWapper.convertResetState(CST.RESET_STATE_DOWN)).toBe(CST.BTV_DOWN_RESET);
	expect(BeethovanWapper.convertResetState(CST.RESET_STATE_UP)).toBe(CST.BTV_UP_RESET);
	expect(BeethovanWapper.convertResetState(CST.RESET_STATE_PERIOD)).toBe(CST.BTV_PERIOD_RESET);
	expect(BeethovanWapper.convertResetState('any')).toBe('');
});
