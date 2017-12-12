module.exports = {
  CentralizedOracle: {
    address: '859db1298735e87ea11c7dd0d5d4a0e5e00742dc',
    abi: [{
      constant: true, inputs: [], name: 'bettingEndBlock', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: false, inputs: [], name: 'invalidateOracle', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
    }, {
      constant: true, inputs: [{ name: '_eventResultIndex', type: 'uint8' }], name: 'getEventResultName', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'oracle', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: false, inputs: [{ name: '_resultIndex', type: 'uint8' }], name: 'setResult', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
    }, {
      constant: true, inputs: [], name: 'getBetBalances', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'getVoteBalances', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'getTotalVotes', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'getTotalBets', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'getEventName', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'finished', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'invalidResultIndex', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'numOfResults', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: false, inputs: [{ name: '_resultIndex', type: 'uint8' }], name: 'bet', outputs: [], payable: true, stateMutability: 'payable', type: 'function',
    }, {
      constant: true, inputs: [], name: 'resultSettingEndBlock', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'getResult', outputs: [{ name: '', type: 'uint8' }, { name: '', type: 'string' }, { name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
    }, {
      constant: true, inputs: [], name: 'consensusThreshold', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      constant: true, inputs: [], name: 'eventAddress', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function',
    }, {
      inputs: [{ name: '_owner', type: 'address' }, { name: '_oracle', type: 'address' }, { name: '_eventAddress', type: 'address' }, { name: '_eventName', type: 'bytes32[10]' }, { name: '_eventResultNames', type: 'bytes32[10]' }, { name: '_numOfResults', type: 'uint8' }, { name: '_bettingEndBlock', type: 'uint256' }, { name: '_resultSettingEndBlock', type: 'uint256' }, { name: '_consensusThreshold', type: 'uint256' }], payable: false, stateMutability: 'nonpayable', type: 'constructor',
    }, { payable: true, stateMutability: 'payable', type: 'fallback' }, {
      anonymous: false, inputs: [{ indexed: true, name: '_oracleAddress', type: 'address' }, { indexed: true, name: '_participant', type: 'address' }, { indexed: false, name: '_resultIndex', type: 'uint8' }, { indexed: false, name: '_votedAmount', type: 'uint256' }], name: 'OracleResultVoted', type: 'event',
    }, {
      anonymous: false, inputs: [{ indexed: true, name: '_oracleAddress', type: 'address' }, { indexed: false, name: '_resultIndex', type: 'uint8' }], name: 'OracleResultSet', type: 'event',
    }, {
      anonymous: false, inputs: [{ indexed: true, name: '_oracleAddress', type: 'address' }], name: 'OracleInvalidated', type: 'event',
    }, {
      anonymous: false, inputs: [{ indexed: true, name: '_previousOwner', type: 'address' }, { indexed: true, name: '_newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event',
    }],
  },
};
