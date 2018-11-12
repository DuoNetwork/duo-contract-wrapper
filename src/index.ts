import MagiWapper from './MagiWrapper';
import Web3Wapper from './Web3Wrapper';
// import ContractUtil from './contractUtil';

const web3 = new Web3Wapper(null, '', 'ws://localhost:8546', false);
const magi = new MagiWapper(web3, false);

magi.getStarted();
