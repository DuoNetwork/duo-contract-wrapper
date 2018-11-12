import * as CST from './constants';
import EsplanadeWrapper from './EsplanadeWrapper';

test('convertVotingStage', () => {
	expect(EsplanadeWrapper.convertVotingStage(CST.VOTING_CONTRACT)).toBe(CST.ESP_CONTRACT);
	expect(EsplanadeWrapper.convertVotingStage(CST.VOTING_MODERATOR)).toBe(CST.ESP_MODERATOR);
	expect(EsplanadeWrapper.convertVotingStage('any')).toBe(CST.ESP_NOT_STARTED);
});
