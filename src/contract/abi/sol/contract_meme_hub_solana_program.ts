export type ContractMemeHubSolanaProgram = {
  version: "0.1.0";
  name: "contract_meme_hub_solana_program";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "programSigner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "feeConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "feeReceiverAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "createToken";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "curveConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "programSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMetadataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "params";
          type: {
            defined: "InitTokenParams";
          };
        },
        {
          name: "identifier";
          type: "string";
        }
      ];
    },
    {
      name: "buy";
      accounts: [
        {
          name: "curveConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultSol";
          isMut: true;
          isSigner: false;
        },
        {
          name: "programSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "feeConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "feeReceiverAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "receiver";
          isMut: false;
          isSigner: false;
        },
        {
          name: "receiverAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amountIn";
          type: "u128";
        }
      ];
    },
    {
      name: "sell";
      accounts: [
        {
          name: "curveConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultSol";
          isMut: true;
          isSigner: false;
        },
        {
          name: "programSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "feeConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "feeReceiverAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userTokenAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "receiver";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amountIn";
          type: "u128";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "curve";
      type: {
        kind: "struct";
        fields: [
          {
            name: "initVirtualTokenReserve";
            type: "u128";
          },
          {
            name: "initVirtualEthReserve";
            type: "u128";
          }
        ];
      };
    },
    {
      name: "feeConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tradeFeeNumerator";
            type: "u64";
          },
          {
            name: "tradeFeeDenominator";
            type: "u64";
          },
          {
            name: "feeReceiverAccount";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "curveConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "virtualTokenReserve";
            type: "u128";
          },
          {
            name: "virtualEthReserve";
            type: "u128";
          },
          {
            name: "k";
            type: "u128";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "InitTokenParams";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "decimals";
            type: "u8";
          }
        ];
      };
    }
  ];
};

export const IDL: ContractMemeHubSolanaProgram = {
  version: "0.1.0",
  name: "contract_meme_hub_solana_program",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "programSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "feeConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "feeReceiverAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createToken",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "curveConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "programSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "InitTokenParams",
          },
        },
        {
          name: "identifier",
          type: "string",
        },
      ],
    },
    {
      name: "buy",
      accounts: [
        {
          name: "curveConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultSol",
          isMut: true,
          isSigner: false,
        },
        {
          name: "programSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "feeConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "feeReceiverAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "receiver",
          isMut: false,
          isSigner: false,
        },
        {
          name: "receiverAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amountIn",
          type: "u128",
        },
      ],
    },
    {
      name: "sell",
      accounts: [
        {
          name: "curveConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultSol",
          isMut: true,
          isSigner: false,
        },
        {
          name: "programSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "feeConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "feeReceiverAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "receiver",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amountIn",
          type: "u128",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "curve",
      type: {
        kind: "struct",
        fields: [
          {
            name: "initVirtualTokenReserve",
            type: "u128",
          },
          {
            name: "initVirtualEthReserve",
            type: "u128",
          },
        ],
      },
    },
    {
      name: "feeConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "tradeFeeNumerator",
            type: "u64",
          },
          {
            name: "tradeFeeDenominator",
            type: "u64",
          },
          {
            name: "feeReceiverAccount",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "curveConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "virtualTokenReserve",
            type: "u128",
          },
          {
            name: "virtualEthReserve",
            type: "u128",
          },
          {
            name: "k",
            type: "u128",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "InitTokenParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "decimals",
            type: "u8",
          },
        ],
      },
    },
  ],
};
