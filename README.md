# DUO-CONTRACT-WRAPPER

We provide wrapper classes for our smart contracts. These classes come with simple but informative contract wrappers, making it easier for developers to understand and interact with contracts.

## DualClassWrapper

DualClassWrapper has wrappers that interact with DUO structure token Custodian Contracts which include: *Beethoven Perpetual*, *Beethoven M19*, *Mozart Perpetual*, *Mozart M19*, and more. Refer to our [Economic Whitepaper](https://duo.network/papers/duo_economic_white_paper.pdf) and Section 3.1 of [Technical Whitepaper](https://duo.network/papers/duo_technical_white_paper.pdf) to learn more about these custodian contracts.

Users can use wrappers to create and redeem between tranche tokens and ETH. Additionally, they can calculate the conversion ratio between ETH and tranche tokens, coupon rate or leverage ratio given the custodian contract , as well as net asset value (NAV) of tranche tokens in the system. Users can also check the state of a specific contract.

Contract administrators use wrappers to collect transaction fee from custodian contracts and set parameters of the contract.

## EsplanadeWrapper

EsplanadeWrapper manages the custodian's administrator system. This system is designed in a way so that no single account can jeopardize the integrity of contracts. Check Sections 2.6 and 3.4.4 of [Technical Whitepaper](https://duo.network/papers/duo_technical_white_paper.pdf) to learn more about the admin system.

Under this system, each custodian contract has a list of ETH addresses, each assignable to administrative roles such as price feeds, address pool manager, and more. Each administrative role is assigned by one moderator to one unique address in the list, and all administrative addresses are removed from this list once assigned.

Users can use this collection of wrappers to return states, address pool, moderators of each contract. Additionally, users can add or remove address, custodian, and new contracts.

## MagiWrapper

MagiWrapper deals with the price oracles for contract. Three price commit processes, or price oracles, are running on AWS, Azure, and GCP to feed prices to the custodian contracts. This minimizes the risk of manipulation of price committing system. More information on price commit can be found in Section 2.3.3 of [Technical Whitepaper](https://duo.network/papers/duo_technical_white_paper.pdf).

Price oracles can initiate the price commit process and subsequently accepting prices fed to the underlying contract.

[![CircleCI](https://circleci.com/gh/FinBook/duo-contract-wrapper.svg?style=svg)](https://circleci.com/gh/FinBook/duo-contract-wrapper)
[![Coverage Status](https://coveralls.io/repos/github/FinBook/duo-contract-wrapper/badge.svg?branch=master)](https://coveralls.io/github/FinBook/duo-contract-wrapper?branch=master)
# Introduction
Contract utilities for DUO Network smart contracts

# How to run test
clone the depository and install all dependencies     

```
npm install
npm test
```

# Community Reward
As part of our bounty reward program, any bug or issue found will be rewarded with community tokens based on seriousness of the issue.

# Community
[duo.network](https://duo.network)

[medium](https://medium.com/duo-network)

[telegram](https://t.me/duonetwork)

Copyrights © 2017-18 FinBook. All Rights Reserved.   
