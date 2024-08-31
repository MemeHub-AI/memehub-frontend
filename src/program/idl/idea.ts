export type ContractMemeXSolanaProgram = {
  version: '0.1.0'
  name: 'contract_meme_x_solana_program'
  instructions: [
    {
      name: 'initialize'
      accounts: [
        {
          name: 'programAdmin'
          isMut: true
          isSigner: false
        },
        {
          name: 'migrationAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'programConfig'
          isMut: true
          isSigner: false
        },
        {
          name: 'owner'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'initializeIdoAccount'
      accounts: [
        {
          name: 'idoProject'
          isMut: true
          isSigner: false
        },
        {
          name: 'idoProjectConfig'
          isMut: true
          isSigner: false
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenVaultAuthority'
          isMut: true
          isSigner: false
        },
        {
          name: 'owner'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'identifier'
          type: 'string'
        }
      ]
    },
    {
      name: 'initializeIdo'
      accounts: [
        {
          name: 'idoProject'
          isMut: false
          isSigner: false
        },
        {
          name: 'idoProjectConfig'
          isMut: true
          isSigner: false
        },
        {
          name: 'programConfig'
          isMut: false
          isSigner: false
        },
        {
          name: 'vault'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenVaultAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'isCreatorClaimedToken'
          isMut: true
          isSigner: false
        },
        {
          name: 'owner'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'identifier'
          type: 'string'
        }
      ]
    },
    {
      name: 'buyIdo'
      accounts: [
        {
          name: 'depositConfig'
          isMut: true
          isSigner: false
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: true
          isSigner: true
        },
        {
          name: 'idoProject'
          isMut: false
          isSigner: false
        },
        {
          name: 'idoProjectConfig'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'eventAuthority'
          isMut: false
          isSigner: false
        },
        {
          name: 'program'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'refundSol'
      accounts: [
        {
          name: 'depositConfig'
          isMut: true
          isSigner: false
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'idoProjectConfig'
          isMut: false
          isSigner: false
        },
        {
          name: 'user'
          isMut: true
          isSigner: true
        },
        {
          name: 'idoProject'
          isMut: false
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'withdraw'
      accounts: [
        {
          name: 'idoProject'
          isMut: false
          isSigner: false
        },
        {
          name: 'idoProjectConfig'
          isMut: false
          isSigner: false
        },
        {
          name: 'vault'
          isMut: true
          isSigner: false
        },
        {
          name: 'programAdmin'
          isMut: false
          isSigner: false
        },
        {
          name: 'migration'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'setIdoToken'
      accounts: [
        {
          name: 'idoProject'
          isMut: false
          isSigner: false
        },
        {
          name: 'idoProjectConfig'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenVault'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'programAdmin'
          isMut: false
          isSigner: false
        },
        {
          name: 'migration'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'claimToken'
      accounts: [
        {
          name: 'idoProject'
          isMut: false
          isSigner: false
        },
        {
          name: 'idoProjectConfig'
          isMut: false
          isSigner: false
        },
        {
          name: 'depositConfig'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenMint'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenVault'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenVaultAuthority'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: true
          isSigner: true
        },
        {
          name: 'receiver'
          isMut: false
          isSigner: false
        },
        {
          name: 'receiverAta'
          isMut: true
          isSigner: false
        },
        {
          name: 'isCreatorClaimedToken'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'associatedTokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: []
    },
    {
      name: 'setAdmin'
      accounts: [
        {
          name: 'programAdmin'
          isMut: true
          isSigner: false
        },
        {
          name: 'newAdmin'
          isMut: false
          isSigner: false
        },
        {
          name: 'oldAdmin'
          isMut: true
          isSigner: true
        }
      ]
      args: []
    },
    {
      name: 'setMigrationAccount'
      accounts: [
        {
          name: 'programAdmin'
          isMut: true
          isSigner: false
        },
        {
          name: 'newMigrationAccount'
          isMut: false
          isSigner: false
        },
        {
          name: 'admin'
          isMut: true
          isSigner: true
        }
      ]
      args: []
    },
    {
      name: 'setProgramConfig'
      accounts: [
        {
          name: 'programAdmin'
          isMut: false
          isSigner: false
        },
        {
          name: 'programConfig'
          isMut: true
          isSigner: false
        },
        {
          name: 'admin'
          isMut: false
          isSigner: true
        }
      ]
      args: [
        {
          name: 'programConfigParams'
          type: {
            defined: 'ProgramConfigParams'
          }
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'depositConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'isClaimedSol'
            type: 'bool'
          },
          {
            name: 'isClaimedToken'
            type: 'bool'
          },
          {
            name: 'depositAmount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'feeConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'tradeFeeNumerator'
            type: 'u64'
          },
          {
            name: 'tradeFeeDenominator'
            type: 'u64'
          },
          {
            name: 'creationFee'
            type: 'u64'
          },
          {
            name: 'feeReceiverAccount'
            type: 'publicKey'
          }
        ]
      }
    },
    {
      name: 'idoProjectConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'tokenMint'
            type: 'publicKey'
          },
          {
            name: 'tokenVault'
            type: 'publicKey'
          },
          {
            name: 'tokenVaultAuthority'
            type: 'publicKey'
          },
          {
            name: 'creator'
            type: 'publicKey'
          },
          {
            name: 'raisedAmount'
            type: 'u32'
          },
          {
            name: 'totalAmount'
            type: 'u32'
          },
          {
            name: 'startTime'
            type: 'u64'
          },
          {
            name: 'endTime'
            type: 'u64'
          },
          {
            name: 'perFundAmount'
            type: 'u64'
          },
          {
            name: 'creatorRatio'
            type: 'u8'
          },
          {
            name: 'participatorRatio'
            type: 'u8'
          },
          {
            name: 'status'
            type: 'u8'
          },
          {
            name: 'waitingTime'
            type: 'u16'
          }
        ]
      }
    },
    {
      name: 'isCreatorClaimedToken'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'isClaimed'
            type: 'bool'
          }
        ]
      }
    },
    {
      name: 'programAdmin'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'admin'
            type: 'publicKey'
          },
          {
            name: 'migrationAccount'
            type: 'publicKey'
          }
        ]
      }
    },
    {
      name: 'programConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'version'
            type: {
              array: ['u8', 8]
            }
          },
          {
            name: 'duration'
            type: 'u64'
          },
          {
            name: 'creatorRatio'
            type: 'u8'
          },
          {
            name: 'participatorRatio'
            type: 'u8'
          },
          {
            name: 'totalAmount'
            type: 'u32'
          },
          {
            name: 'perFundAmount'
            type: 'u64'
          },
          {
            name: 'waitingTime'
            type: 'u16'
          }
        ]
      }
    },
    {
      name: 'depositConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'isClaimedSol'
            type: 'bool'
          },
          {
            name: 'isClaimedToken'
            type: 'bool'
          }
        ]
      }
    }
  ]
  types: [
    {
      name: 'InitTokenParams'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'symbol'
            type: 'string'
          },
          {
            name: 'uri'
            type: 'string'
          },
          {
            name: 'decimals'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'ProgramConfigParams'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'duration'
            type: 'u64'
          },
          {
            name: 'creatorRatio'
            type: 'u8'
          },
          {
            name: 'participatorRatio'
            type: 'u8'
          },
          {
            name: 'totalAmount'
            type: 'u32'
          },
          {
            name: 'perFundAmount'
            type: 'u64'
          },
          {
            name: 'waitingTime'
            type: 'u16'
          }
        ]
      }
    }
  ]
  events: [
    {
      name: 'BuyIdoEvent'
      fields: [
        {
          name: 'user'
          type: 'publicKey'
          index: false
        },
        {
          name: 'idoProject'
          type: 'publicKey'
          index: false
        }
      ]
    },
    {
      name: 'InitPoolEvent'
      fields: [
        {
          name: 'identifier'
          type: 'string'
          index: false
        },
        {
          name: 'user'
          type: 'publicKey'
          index: false
        },
        {
          name: 'idoProject'
          type: 'publicKey'
          index: false
        }
      ]
    },
    {
      name: 'InitializeEvent'
      fields: [
        {
          name: 'version'
          type: 'string'
          index: false
        }
      ]
    }
  ]
  errors: [
    {
      code: 6000
      name: 'RaiseLimited'
      msg: 'The amount raised has reached the target value'
    },
    {
      code: 6001
      name: 'AlreadyOver'
      msg: 'The IDO project already over'
    },
    {
      code: 6002
      name: 'AlreadyClaimedSol'
      msg: 'User has already claimed SOL'
    },
    {
      code: 6003
      name: 'ClaimAccountError'
      msg: 'Claim account error'
    },
    {
      code: 6004
      name: 'AlreadyClaimedToken'
      msg: 'User has already claimed Token'
    },
    {
      code: 6005
      name: 'AmountExceedsMaxLimit'
      msg: 'Requested refund amount exceeds the maximum limit'
    },
    {
      code: 6006
      name: 'InvalidAmountIn'
      msg: 'Amount in does not match the required standard amount'
    },
    {
      code: 6007
      name: 'IdoNotStart'
      msg: 'The start time is not reached'
    },
    {
      code: 6008
      name: 'IdoNotEnd'
      msg: 'IDO is in progress, not end'
    },
    {
      code: 6009
      name: 'TokenCreated'
      msg: 'IDO already ended and the token is created'
    },
    {
      code: 6010
      name: 'NoTokenToClaim'
      msg: 'Token is not created'
    },
    {
      code: 6011
      name: 'IdoAlreadyEnd'
      msg: 'IDO already end'
    }
  ]
}

export const ideaIdl: ContractMemeXSolanaProgram = {
  version: '0.1.0',
  name: 'contract_meme_x_solana_program',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'programAdmin',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'migrationAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'programConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'initializeIdoAccount',
      accounts: [
        {
          name: 'idoProject',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'idoProjectConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenVaultAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'identifier',
          type: 'string',
        },
      ],
    },
    {
      name: 'initializeIdo',
      accounts: [
        {
          name: 'idoProject',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'idoProjectConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'programConfig',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenVaultAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'isCreatorClaimedToken',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'identifier',
          type: 'string',
        },
      ],
    },
    {
      name: 'buyIdo',
      accounts: [
        {
          name: 'depositConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'idoProject',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'idoProjectConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'refundSol',
      accounts: [
        {
          name: 'depositConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'idoProjectConfig',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'idoProject',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'withdraw',
      accounts: [
        {
          name: 'idoProject',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'idoProjectConfig',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'programAdmin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'migration',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'setIdoToken',
      accounts: [
        {
          name: 'idoProject',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'idoProjectConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenVault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'programAdmin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'migration',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'claimToken',
      accounts: [
        {
          name: 'idoProject',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'idoProjectConfig',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'depositConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenVaultAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'receiver',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'receiverAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'isCreatorClaimedToken',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'setAdmin',
      accounts: [
        {
          name: 'programAdmin',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'newAdmin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'oldAdmin',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'setMigrationAccount',
      accounts: [
        {
          name: 'programAdmin',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'newMigrationAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'setProgramConfig',
      accounts: [
        {
          name: 'programAdmin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'programConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'programConfigParams',
          type: {
            defined: 'ProgramConfigParams',
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'depositConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'isClaimedSol',
            type: 'bool',
          },
          {
            name: 'isClaimedToken',
            type: 'bool',
          },
          {
            name: 'depositAmount',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'feeConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tradeFeeNumerator',
            type: 'u64',
          },
          {
            name: 'tradeFeeDenominator',
            type: 'u64',
          },
          {
            name: 'creationFee',
            type: 'u64',
          },
          {
            name: 'feeReceiverAccount',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'idoProjectConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokenMint',
            type: 'publicKey',
          },
          {
            name: 'tokenVault',
            type: 'publicKey',
          },
          {
            name: 'tokenVaultAuthority',
            type: 'publicKey',
          },
          {
            name: 'creator',
            type: 'publicKey',
          },
          {
            name: 'raisedAmount',
            type: 'u32',
          },
          {
            name: 'totalAmount',
            type: 'u32',
          },
          {
            name: 'startTime',
            type: 'u64',
          },
          {
            name: 'endTime',
            type: 'u64',
          },
          {
            name: 'perFundAmount',
            type: 'u64',
          },
          {
            name: 'creatorRatio',
            type: 'u8',
          },
          {
            name: 'participatorRatio',
            type: 'u8',
          },
          {
            name: 'status',
            type: 'u8',
          },
          {
            name: 'waitingTime',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'isCreatorClaimedToken',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'isClaimed',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'programAdmin',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'admin',
            type: 'publicKey',
          },
          {
            name: 'migrationAccount',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'programConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'version',
            type: {
              array: ['u8', 8],
            },
          },
          {
            name: 'duration',
            type: 'u64',
          },
          {
            name: 'creatorRatio',
            type: 'u8',
          },
          {
            name: 'participatorRatio',
            type: 'u8',
          },
          {
            name: 'totalAmount',
            type: 'u32',
          },
          {
            name: 'perFundAmount',
            type: 'u64',
          },
          {
            name: 'waitingTime',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'depositConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'isClaimedSol',
            type: 'bool',
          },
          {
            name: 'isClaimedToken',
            type: 'bool',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'InitTokenParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'symbol',
            type: 'string',
          },
          {
            name: 'uri',
            type: 'string',
          },
          {
            name: 'decimals',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'ProgramConfigParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'duration',
            type: 'u64',
          },
          {
            name: 'creatorRatio',
            type: 'u8',
          },
          {
            name: 'participatorRatio',
            type: 'u8',
          },
          {
            name: 'totalAmount',
            type: 'u32',
          },
          {
            name: 'perFundAmount',
            type: 'u64',
          },
          {
            name: 'waitingTime',
            type: 'u16',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'BuyIdoEvent',
      fields: [
        {
          name: 'user',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'idoProject',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'InitPoolEvent',
      fields: [
        {
          name: 'identifier',
          type: 'string',
          index: false,
        },
        {
          name: 'user',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'idoProject',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'InitializeEvent',
      fields: [
        {
          name: 'version',
          type: 'string',
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'RaiseLimited',
      msg: 'The amount raised has reached the target value',
    },
    {
      code: 6001,
      name: 'AlreadyOver',
      msg: 'The IDO project already over',
    },
    {
      code: 6002,
      name: 'AlreadyClaimedSol',
      msg: 'User has already claimed SOL',
    },
    {
      code: 6003,
      name: 'ClaimAccountError',
      msg: 'Claim account error',
    },
    {
      code: 6004,
      name: 'AlreadyClaimedToken',
      msg: 'User has already claimed Token',
    },
    {
      code: 6005,
      name: 'AmountExceedsMaxLimit',
      msg: 'Requested refund amount exceeds the maximum limit',
    },
    {
      code: 6006,
      name: 'InvalidAmountIn',
      msg: 'Amount in does not match the required standard amount',
    },
    {
      code: 6007,
      name: 'IdoNotStart',
      msg: 'The start time is not reached',
    },
    {
      code: 6008,
      name: 'IdoNotEnd',
      msg: 'IDO is in progress, not end',
    },
    {
      code: 6009,
      name: 'TokenCreated',
      msg: 'IDO already ended and the token is created',
    },
    {
      code: 6010,
      name: 'NoTokenToClaim',
      msg: 'Token is not created',
    },
    {
      code: 6011,
      name: 'IdoAlreadyEnd',
      msg: 'IDO already end',
    },
  ],
}
