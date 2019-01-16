import { LOG_DEBUG, LOG_ERROR, LOG_INFO } from './constants';
import util from './util';

test('isNumber() return true for numbers', () => {
	expect(util.isNumber(5)).toBe(true);
	expect(util.isNumber(5.0)).toBe(true);
});

test('isNumber() return true for empty string and null', () => {
	expect(util.isNumber('')).toBe(true);
	expect(util.isNumber(null)).toBe(true);
});

test('isNumber() return true for number strings', () => {
	expect(util.isNumber('5')).toBe(true);
	expect(util.isNumber('5.0')).toBe(true);
});

test('isNumber() return false for other strings', () => {
	expect(util.isNumber('5.0s')).toBe(false);
	expect(util.isNumber('test')).toBe(false);
	expect(util.isNumber('NaN')).toBe(false);
});

test('isNumber() return false for undefined, infinity, NaN', () => {
	expect(util.isNumber(undefined)).toBe(false);
	expect(util.isNumber(Infinity)).toBe(false);
	expect(util.isNumber(NaN)).toBe(false);
});

test('{}, null, undefined is empty', () => {
	expect(util.isEmptyObject({})).toBe(true);
	expect(util.isEmptyObject(null)).toBe(true);
	expect(util.isEmptyObject(undefined)).toBe(true);
});

test('{test: true} is not empty', () => {
	expect(util.isEmptyObject({ test: true })).toBe(false);
});

test('log error', () => {
	util.getUTCNowTimestamp = jest.fn(() => 1234567890);
	console.log = jest.fn();

	util.logLevel = LOG_ERROR;
	util.logError('error');
	util.logInfo('info');
	util.logDebug('debug');
	expect((console.log as jest.Mock).mock.calls).toMatchSnapshot();
});

test('log info', () => {
	util.getUTCNowTimestamp = jest.fn(() => 1234567890);
	console.log = jest.fn();

	util.logLevel = LOG_INFO;
	util.logError('error');
	util.logInfo('info');
	util.logDebug('debug');
	expect((console.log as jest.Mock).mock.calls).toMatchSnapshot();
});

test('log debug', () => {
	util.getUTCNowTimestamp = jest.fn(() => 1234567890);
	console.log = jest.fn();

	util.logLevel = LOG_DEBUG;
	util.logError('error');
	util.logInfo('info');
	util.logDebug('debug');
	expect((console.log as jest.Mock).mock.calls).toMatchSnapshot();
});
