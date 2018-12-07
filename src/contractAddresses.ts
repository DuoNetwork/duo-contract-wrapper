import * as CST from './constants';
import { IContractAddresses } from './types';
export const kovan: IContractAddresses = {
	Custodians: {
		[CST.BEETHOVEN]: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'BEETHOVEN-PPT',
					address: '0x42d490b6Efb8c15a8A10aC73D4094a4242155bA8'
				},
				aToken: {
					code: 'aETH',
					address: '0x195D13ACCB7095e317EA309fc7C5aAB223DBcdc8'
				},
				bToken: {
					code: 'bETH',
					address: '0xf18f43BA6bE57db9BB52Ad885E1863234D7b70dB'
				}
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'BEETHOVEN-M19',
					address: '0x3c581c6418846c928113ff0318D6e51e7ac388F1'
				},
				aToken: {
					code: 'aETH-M19',
					address: '0x818cdfcc47E6DeC9b0f42ED86c47A85C5547115A'
				},
				bToken: {
					code: 'bETH-M19',
					address: '0x5daa81900f44e93e46c499903Bff9845448A16a5'
				}
			},
		},
		[CST.MOZART]: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'MOZART-PPT',
					address: '0x2b4Cb433e7de73355AA3175445fec9837c049DEa'
				},
				aToken: {
					code: 'sETH',
					address: '0x106fa5f2cb0F3b49D543f577F37A6c5436FcD3b1'
				},
				bToken: {
					code: 'LETH',
					address: '0x00A6419081EeBC95EbB889C87df0557a6c7422Aa'
				}
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'MOZART-M19',
					address: '0x67D1834a78502548cf53f49504Ee876516F70D99'
				},
				aToken: {
					code: 'sETH-M19',
					address: '0x5Fa6a47084511f6Fc63b01f0b4142c20F8584d64'
				},
				bToken: {
					code: 'LETH-M19',
					address: '0xE2b399F085D84A7B87271cAE114B48B4D529f601'
				}
			},
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
					code: 'BEETHOVEN-PPT',
					address: '0x42d490b6Efb8c15a8A10aC73D4094a4242155bA8'
				},
				aToken: {
					code: 'aETH',
					address: '0x195D13ACCB7095e317EA309fc7C5aAB223DBcdc8'
				},
				bToken: {
					code: 'bETH',
					address: '0xf18f43BA6bE57db9BB52Ad885E1863234D7b70dB'
				}
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'BEETHOVEN-M19',
					address: '0x3c581c6418846c928113ff0318D6e51e7ac388F1'
				},
				aToken: {
					code: 'aETH-M19',
					address: '0x818cdfcc47E6DeC9b0f42ED86c47A85C5547115A'
				},
				bToken: {
					code: 'bETH-M19',
					address: '0x5daa81900f44e93e46c499903Bff9845448A16a5'
				}
			},
		},
		Mozart: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'MOZART-PPT',
					address: '0x2b4Cb433e7de73355AA3175445fec9837c049DEa'
				},
				aToken: {
					code: 'sETH',
					address: '0x106fa5f2cb0F3b49D543f577F37A6c5436FcD3b1'
				},
				bToken: {
					code: 'LETH',
					address: '0x00A6419081EeBC95EbB889C87df0557a6c7422Aa'
				}
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'MOZART-M19',
					address: '0x67D1834a78502548cf53f49504Ee876516F70D99'
				},
				aToken: {
					code: 'sETH-M19',
					address: '0x5Fa6a47084511f6Fc63b01f0b4142c20F8584d64'
				},
				bToken: {
					code: 'LETH-M19',
					address: '0xE2b399F085D84A7B87271cAE114B48B4D529f601'
				}
			},
		},
		BeethovenMatured: {}
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
