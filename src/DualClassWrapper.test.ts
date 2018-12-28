import * as CST from './constants';
import DualClassWrapper from './DualClassWrapper';

test('convertCustodianState', () => {
	expect(DualClassWrapper.convertCustodianState(CST.STATE_INCEPTION)).toBe(CST.CTD_INCEPTION);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_PRERESET)).toBe(CST.CTD_PRERESET);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_RESET)).toBe(CST.CTD_RESET);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_TRADING)).toBe(CST.CTD_TRADING);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_MATURED)).toBe(CST.CTD_MATURED);
	expect(DualClassWrapper.convertCustodianState('any')).toBe(CST.CTD_LOADING);
});

test('convertCustodianState', () => {
	expect(DualClassWrapper.convertResetState(CST.RESET_STATE_DOWN)).toBe(CST.BTV_DOWN_RESET);
	expect(DualClassWrapper.convertResetState(CST.RESET_STATE_UP)).toBe(CST.BTV_UP_RESET);
	expect(DualClassWrapper.convertResetState(CST.RESET_STATE_PERIOD)).toBe(CST.BTV_PERIOD_RESET);
	expect(DualClassWrapper.convertResetState('any')).toBe('');
});

test('getTokensPerEth', () => {
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 1,
			alpha: 1
		} as any)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 0.8,
			alpha: 1
		} as any)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 1,
			alpha: 0.5
		} as any)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 1,
			alpha: 2
		} as any)
	).toMatchSnapshot();
});

test('getEthWithTokens', () => {
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 1
			} as any,
			100,
			100
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 1
			} as any,
			100,
			200
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 0.8,
				alpha: 1
			} as any,
			100,
			100
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 0.5
			} as any,
			100,
			100
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 0.5
			} as any,
			100,
			200
		)
	).toMatchSnapshot();
});

test('getTokenInterestOrLeverage', () => {
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				periodCoupon: 0.0001,
				period: 3600000
			} as any,
			true,
			true
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				alpha: 1,
				navB: 1.5
			} as any,
			true,
			false
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				navA: 1.2
			} as any,
			false,
			true
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				alpha: 0.5,
				navB: 1.5
			} as any,
			false,
			false
		)
	).toMatchSnapshot();
});

test('calculateNav beethoven', () => {
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			40,
			10
		)
	).toMatchSnapshot();

	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			40,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			20,
			10
		)
	).toMatchSnapshot();
});

test('calculateNav mozart', () => {
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			40,
			10
		)
	).toMatchSnapshot();

	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			40,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			20,
			10
		)
	).toMatchSnapshot();
});
