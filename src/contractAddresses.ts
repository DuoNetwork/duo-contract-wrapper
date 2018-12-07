import * as CST from './constants';
import { IContractAddresses } from './types';
export const kovan: IContractAddresses = {
	Custodians: {
		[CST.BEETHOVEN]: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'BEETHOVEN-PPT',
					address: '0x95B3BE483e9e3685Ed631e9611b8cDba4C13641E'
				},
				aToken: {
					code: 'aETH',
					address: '0xC600fe64CDa57b607B251aa0879b8386e9FEd9f7'
				},
				bToken: {
					code: 'bETH',
					address: '0xa03b5171fE58fD2d6a018693E8D2CeD83b73ce00'
				}
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'BEETHOVEN-M19',
					address: '0xe71eF76530278A4071EdE7aEB625aff9D9851b72'
				},
				aToken: {
					code: 'aETH-M19',
					address: '0x057Cb8fBE06545Ec76667417C641017060411C6e'
				},
				bToken: {
					code: 'bETH-M19',
					address: '0x9bE03Fb668E3923a85Bb7337b21AEd127b0a1A64'
				}
			},
		},
		[CST.MOZART]: {
			[CST.TENOR_PPT]: {
				custodian: {
					code: 'MOZART-PPT',
					address: '0xCbee126472204d921c7FEafC83cbf23bbbcC36E4'
				},
				aToken: {
					code: 'sETH',
					address: '0x7c705DB91495b811f97797db6F838868C8A38021'
				},
				bToken: {
					code: 'LETH',
					address: '0x9e497f7a996E702D3b0a1a57E5E237c88b84Bff3'
				}
			},
			[CST.TENOR_M19]: {
				custodian: {
					code: 'MOZART-M19',
					address: '0x2631220C48abc5C64b91bCCdCfDe05F9f0b5aC4E'
				},
				aToken: {
					code: 'sETH-M19',
					address: '0x9FD5dB8696848E0Fd72d64eD35b1653E326811De'
				},
				bToken: {
					code: 'LETH-M19',
					address: '0x0829a65aF5c4999A164A9b6C7e1A383bF8e82047'
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
