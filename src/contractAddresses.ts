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
					address: '0x32a42AeDe34Cd0D2D76e02E0d3A3440706A9c619'
				},
				aToken: {
					code: 'ETH-100C-1H',
					address: '0x75Bcb8C5f50Cc05d0B82c6321f22E848FEbB5F88'
				},
				bToken: {
					code: 'ETH-100P-1H',
					address: '0xCfC7C9792975193a9d0E78f0350041Ceb4fa388C'
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
	],
	Stakes: [
		{
			code: 'Stake-0',
			address: '0x71E17030E49A1361b8E1902d613C4e5dD2185e8A'
		},
		{
			code: 'Stake-60',
			address: '0x0646B77D768a459aA5F84E6A160A5B72b88d76eA'
		}
	],
	DUO: {
		code: 'DUO',
		address: '0x61cA89CfC5E8099702e64e97D9b5FC457cf1d355'
	}
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
		[CST.VIVALDI]: {
			'100C-1H': {
				custodian: {
					code: 'VIVALDI-100C-1H',
					address: '0xc2416a439f71a9521d5e275421F861F5f28C52ac'
				},
				aToken: {
					code: 'ETH-100C-1H',
					address: '0x446Fab78394F3893d651cdB7D066EF9a1833AE3b'
				},
				bToken: {
					code: 'ETH-100P-1H',
					address: '0x8fc1D8f251304fB68Aa633dB2782b2Bcc058fb20'
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
	],
	Stakes: [
		{
			code: 'Stake-0',
			address: '0x395cca6DeC865eb1F633D84C77220c40f26395bf'
		},
		{
			code: 'Stake-60',
			address: '0xb4bD4885ED177a8328F6034d5E5660C57Aa495e5'
		}
	],

	DUO: {
		code: 'DUO',
		address: '0x56e0B2C7694E6e10391E870774daA45cf6583486'
	}
};
