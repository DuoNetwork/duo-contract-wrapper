import * as CST from './constants';
import { IContractAddresses } from './types';
export const kovan: IContractAddresses = {
	Custodians: {
		[CST.BEETHOVEN]: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'BEETHOVEN-PPT',
					address: '0x13016f27945f3f7b39A5Daae068D698e34E55491'
				},
				aToken: {
					code: 'aETH',
					address: '0x59E6B3d43F762310626d2905148939973db2BBd3'
				},
				bToken: {
					code: 'bETH',
					address: '0x8A3bEca74E0E737460bDE45a09594A8D7D8c9886'
				}
			}
		},
		[CST.MOZART]: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'MOZART-PPT',
					address: '0x00be45Fe5903AB1b33a9d3969b05b29552a6d18b'
				},
				aToken: {
					code: 'sETH',
					address: '0x2cB7CDDF82AD7fF2b207AD43586976FEB19BA985'
				},
				bToken: {
					code: 'LETH',
					address: '0x977feC72C295EdAf7E7deA5681E42CaFf69749e3'
				}
			}
		},
		[CST.VIVALDI]: {

			'100C-1H': {
				custodian: {
					code: 'VIVALDI-100C-1H',
					address: '0xd49C2CfcA78EeCF00bD503c85225790264A176eb'
				},
				aToken: {
					code: 'ETH-100C-1H',
					address: '0x9d26644705f993A373646E0E113b3488F21d5DC9 '
				},
				bToken: {
					code: 'ETH-100P-1H',
					address: '0x5B312EC6D16BdC7e9Bcad2E972d9d571A505c5c1'
				}

			}
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
		[CST.BEETHOVEN]: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'BEETHOVEN-PPT',
					address: '0x55c4ec02D22cC26d9DACd5ab5977A62439476e79'
				},
				aToken: {
					code: 'aETH',
					address: '0x6186258287372Bfde88c74312e417bD19cbec550'
				},
				bToken: {
					code: 'bETH',
					address: '0x765B73E0E2d6b6F16B36b4881E40bD433Be95A5a'
				}
			}
		},
		[CST.MOZART]: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'MOZART-PPT',
					address: '0x6ed1f59206a71600b50e27D7C910fd882754D6a8'
				},
				aToken: {
					code: 'sETH',
					address: '0xC35a516a66D98E20D519F8200c322EaE571853A4'
				},
				bToken: {
					code: 'LETH',
					address: '0x96460126E40167a145A41978E261F34E4f2C4706'
				}
			}
		},
		[CST.VIVALDI]: {}
	},
	Oracles: [
		{
			code: 'Magi',
			address: '0x6a6b391Ba6C00418D0Ece1177c357C2Bd4e894f6'
		}
	],
	MultiSigManagers: [
		{
			code: 'Esplanade',
			address: '0xbaa6a5B0b63597bCF8a81b2B3E12BEcF591B77a9'
		}
	]
};
