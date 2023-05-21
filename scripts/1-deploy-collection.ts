import { toNano } from "locklift";

async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  const nftArtifacts = await locklift.factory.getContractArtifacts("NameNft");
  const indexArtifacts = await locklift.factory.getContractArtifacts("Index");
  const indexBasisArtifacts = await locklift.factory.getContractArtifacts("IndexBasis");

  const { contract, tx } = await locklift.factory.deployContract({
    contract: "NameNftMinter",
    publicKey: signer.publicKey,
    initParams: {},
    constructorParams: {
      codeNft: nftArtifacts.code,
      codeIndex: indexArtifacts.code,
      codeIndexBasis: indexBasisArtifacts.code,
      json: `{"collection":"tutorial"}` // EXAMPLE...not by TIP-4.2
    },
    value: locklift.utils.toNano(1),
  });

  console.log(`Collection deployed at: ${contract.address.toString()}`);

  const { count: id } = await contract.methods.totalSupply({ answerId: 0 }).call();
  await contract.methods.mintNft({ json: `{"name":"hello world"}` }).send({ from: contract.address, amount: toNano(0.5) });
  const { nft: nftAddress } = await contract.methods.nftAddress({ answerId: 0, id: id }).call();

  console.log(`NFT: ${nftAddress.toString()}`);

}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });



