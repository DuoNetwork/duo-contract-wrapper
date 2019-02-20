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
					address: '0xdAe93661F5d44E331bbf852C661363427607cF7D'
				},
				aToken: {
					code: 'ETH-100C-3H',
					address: '0x1A93a7ce3Dc8858648482A4763a9f3B9e6E97873'
				},
				bToken: {
					code: 'ETH-100P-3H',
					address: '0x8e158382191E23B299375d16Ce614f8c456CDB3a'
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
