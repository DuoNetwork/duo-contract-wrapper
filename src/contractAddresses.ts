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
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'BEETHOVEN-M19',
					address: '0x1e20057a6Ddc009b275926d7d54cCA19625c974E'
				},
				aToken: {
					code: 'aETH-M19',
					address: '0xB608f08d94662453ac8fce91f5956CCd00031449'
				},
				bToken: {
					code: 'bETH-M19',
					address: '0xe6c92061a8890FFC429485c36fa76853ddC4f07D'
				}
			},
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
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'MOZART-M19',
					address: '0x56e2727e56F9D6717e462418f822a8FE08Be4711'
				},
				aToken: {
					code: 'sETH-M19',
					address: '0x2B675f1A282954Ce4FEeb93b9504a6f78B616DE9'
				},
				bToken: {
					code: 'LETH-M19',
					address: '0x47aC357b44d1b3A0799D91741fA1bD717C1f7900'
				}
			},
		},
		[CST.VIVALDI]: {
			'100C-3H': {
				custodian: {
					code: 'VIVALDI-100C-3H',
					address: '0x5734Fe05187857066Ed00d963D4bBBeB619797f4'
				},
				aToken: {
					code: 'ETH-100C-3H',
					address: '0x2C4bD22588af822a95Fb9D7e972A1F1C4aE28F13'
				},
				bToken: {
					code: 'ETH-100P-3H',
					address: '0x9f49bb024EB176d227d4b85A58730a5dDeEF529D'
				}
			},
			'105C-3H': {
				custodian: {
					code: 'VIVALDI-105C-3H',
					address: '0x0'
				},
				aToken: {
					code: 'ETH-105C-3H',
					address: '0x0'
				},
				bToken: {
					code: 'ETH-105P-3H',
					address: '0x0'
				}
			},
			'095P-3H': {
				custodian: {
					code: 'VIVALDI-095P-3H',
					address: '0x0'
				},
				aToken: {
					code: 'ETH-095P-3H',
					address: '0x0'
				},
				bToken: {
					code: 'ETH-095C-3H',
					address: '0x0'
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
					address: '0xea9a5d3fb1fd82d152a30d71c2f9140798e6d877'
				},
				aToken: {
					code: 'aETH',
					address: '0x482f94cF654d9B753039DFa2E49405825581172F'
				},
				bToken: {
					code: 'bETH',
					address: '0xD3E376FdD6071071A9209dc98406297c3e9E7336'
				}
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'BEETHOVEN-M19',
					address: ''
				},
				aToken: {
					code: 'aETH-M19',
					address: ''
				},
				bToken: {
					code: 'bETH-M19',
					address: ''
				}
			},
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
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'MOZART-M19',
					address: ''
				},
				aToken: {
					code: 'sETH-M19',
					address: ''
				},
				bToken: {
					code: 'LETH-M19',
					address: ''
				}
			},
		},
		[CST.VIVALDI]: {
			'100C-3H': {
				custodian: {
					code: 'VIVALDI-100C-3H',
					address: '0xBEFf9eEE8E1055A5ACd7a690Fe5B295a346D7346'
				},
				aToken: {
					code: 'ETH-100C-3H',
					address: '0xaaa743285bcAB4F015890f67354204fF2228fc3f'
				},
				bToken: {
					code: 'ETH-100P-3H',
					address: '0x5EEfab02C9A7059Ba463c41BeC2233A9Fac5f0F1'
				}
			},
			'105C-3H': {
				custodian: {
					code: 'VIVALDI-105C-3H',
					address: '0x0'
				},
				aToken: {
					code: 'ETH-105C-3H',
					address: '0x0'
				},
				bToken: {
					code: 'ETH-105P-3H',
					address: '0x0'
				}
			},
			'095P-3H': {
				custodian: {
					code: 'VIVALDI-095P-3H',
					address: '0x0'
				},
				aToken: {
					code: 'ETH-095P-3H',
					address: '0x0'
				},
				bToken: {
					code: 'ETH-095C-3H',
					address: '0x0'
				}
			}
		}
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
