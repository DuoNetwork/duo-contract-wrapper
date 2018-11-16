import * as CST from './constants';
import { IContractAddresses } from './types';
export const kovan: IContractAddresses = {
	Custodians: {
		Beethoven: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'B-PPT',
					address: '0x53a53B2Ab9aCe8F87ae81C866Ac0d977D72b6196'
				},
				aToken: {
					code: 'B-PPT-I0',
					address: '0xbc4e4029B41B0894353C31267CE86c2192545e53'
				},
				bToken: {
					code: 'B-PPT-L2',
					address: '0xFeCd43cd0bc217e5513116c83F48498A018A1da6'
				}
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'B-M19',
					address: '0xeA41720A694915648E37FD236f45E544c4DD6AC2'
				},
				aToken: {
					code: 'B-M19-I0',
					address: '0x754741185C6a95c9b1083C770b19E27287712bF7'
				},
				bToken: {
					code: 'B-M19-L2',
					address: '0xDce7E1dEB0ca5Cd69449be9E1e2ADb5E23C1B610'
				}
			},
			[CST.TENOR_MATURED]: {}
		}
	},
	Oracles: [
		{
			code: 'Magi',
			address: '0x0d729B3C11b3E6Bf5792d36f640f3Be6f187Dd67'
		}
	],
	MultiSigManagers: [
		{
			code: 'Esplanade',
			address: '0xD728681490d63582047A6Cd2fC80B1343C6AbA20'
		}
	]
};

export const mainnet: IContractAddresses = {
	Custodians: {
		Beethoven: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'B-PPT',
					address: '0x53a53B2Ab9aCe8F87ae81C866Ac0d977D72b6196'
				},
				aToken: {
					code: 'B-PPT-I0',
					address: '0xbc4e4029B41B0894353C31267CE86c2192545e53'
				},
				bToken: {
					code: 'B-PPT-L2',
					address: '0xFeCd43cd0bc217e5513116c83F48498A018A1da6'
				}
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'B-M19',
					address: '0xeA41720A694915648E37FD236f45E544c4DD6AC2'
				},
				aToken: {
					code: 'B-M19-I0',
					address: '0x754741185C6a95c9b1083C770b19E27287712bF7'
				},
				bToken: {
					code: 'B-M19-L2',
					address: '0xDce7E1dEB0ca5Cd69449be9E1e2ADb5E23C1B610'
				}
			},
			[CST.TENOR_MATURED]: {}
		}
	},
	Oracles: [
		{
			code: 'Magi',
			address: '0x0d729B3C11b3E6Bf5792d36f640f3Be6f187Dd67'
		}
	],
	MultiSigManagers: [
		{
			code: 'Esplanade',
			address: '0xD728681490d63582047A6Cd2fC80B1343C6AbA20'
		}
	]
};
