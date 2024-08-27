import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor'
import * as anchor from '@coral-xyz/anchor'
import { v4 as uuidv4 } from 'uuid'
import { useMutation } from '@tanstack/react-query'
import { IDL } from '@/program/sol/contract_meme_hub_solana_program'

export const useSolDeploy = () => {
  const { connection } = useConnection()

  const wallet = useAnchorWallet()
  if (!wallet) return
  const provider = new AnchorProvider(connection, wallet, {})

  setProvider(provider)

  const programId = 'CKnatoahxx3KnNTDDfik7WXkrEBgDorKwKjc8jnq9q7H'

  const program = new Program(IDL, programId)

  let identifier = uuidv4().replace(/-/g, '')

  const [mintPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('mint'), Buffer.from(identifier)],
    new anchor.web3.PublicKey(programId)
  )
  console.log('mintPDA:', mintPDA.toString())

  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  )

  const metadata = {
    name: 'Kitty',
    symbol: 'CAT',
    uri: 'https://5vfxc4tr6xoy23qefqbj4qx2adzkzapneebanhcalf7myvn5gzja.arweave.net/7UtxcnH13Y1uBCwCnkL6APKsge0hAgacQFl-zFW9NlI',
    decimals: 9,
  }

  const [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintPDA.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )
  console.log('metadataAddress:', metadataAddress.toString())
  // const tokenAddr = "53XqPrZmfX6vHuW1TE4aJ6j8NzmRMisFAVGGSy8KjNyg";

  // const a = new anchor.web3.PublicKey(tokenAddr);
  // console.log(a);

  const [configPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('curve_config'), mintPDA.toBuffer()],
    program.programId
  )
  console.log('configPDA:', configPDA.toString())

  const [programSigner] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('program_signer')],
    program.programId
  )
  console.log('programSigner:', programSigner.toString())

  const vaultPDA = anchor.utils.token.associatedAddress({
    mint: mintPDA,
    owner: programSigner,
  })

  const context = {
    metadata: metadataAddress,
    mint: mintPDA,
    curveConfig: configPDA,
    vault: vaultPDA,
    programSigner: programSigner,
    user: wallet?.publicKey,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    systemProgram: anchor.web3.SystemProgram.programId,
    tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
  }

  const createSolToken = () => {
    return program.methods
      .createToken(metadata, identifier)
      .accounts(context)
      .rpc()
  }
  const {
    data: deployHash,
    error: submitError,
    isPending: isSubmitting,
    mutateAsync: deploy,
    isError: isSubmitError,
    isSuccess: isDeploySuccess,
    reset: resetDeploy,
  } = useMutation({
    mutationKey: ['createSolToken'],
    mutationFn: createSolToken,
  })

  return {
    deployHash,
    isSubmitError,
    isDeployError: isSubmitError,
    isSubmitting,
    deploy,
    resetDeploy,
    submitError,
    isDeploySuccess,
    deployedAddr: mintPDA,
    deployFee: 0,
    confirmError: submitError,
    isConfirming: isSubmitting,
  }
}
