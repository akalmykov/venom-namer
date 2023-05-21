import { expect } from "chai";
import { Contract, Signer, toNano, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";

// let NameNftMinter: Contract<FactorySource["NameNFT"]>;
let signer: Signer;

describe("NameNFTMinter Test", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Deploy contract & mint Nft", async function () {
    it("Load contract factory", async function () {
      const nftMinter = locklift.factory.getContractArtifacts("NameNftMinter");
      const nftArtifacts = locklift.factory.getContractArtifacts("NameNft");
      const indexArtifacts = locklift.factory.getContractArtifacts("Index");
      const indexBasisArtifacts = locklift.factory.getContractArtifacts("IndexBasis");

      expect(nftMinter.code).not.to.equal(undefined, "nftMinter code should be available");
      expect(nftMinter.abi).not.to.equal(undefined, "nftMinter ABI should be available");
      expect(nftMinter.tvc).not.to.equal(undefined, "nftMinter tvc should be available");

      expect(nftArtifacts.code).not.to.equal(undefined, "nftArtifacts code should be available");
      expect(nftArtifacts.abi).not.to.equal(undefined, "nftArtifacts ABI should be available");
      expect(nftArtifacts.tvc).not.to.equal(undefined, "nftArtifacts tvc should be available");

      expect(indexArtifacts.code).not.to.equal(undefined, "indexArtifacts code should be available");
      expect(indexArtifacts.abi).not.to.equal(undefined, "indexArtifacts ABI should be available");
      expect(indexArtifacts.tvc).not.to.equal(undefined, "indexArtifacts tvc should be available");

      expect(indexBasisArtifacts.code).not.to.equal(undefined, "indexBasisArtifacts code should be available");
      expect(indexBasisArtifacts.abi).not.to.equal(undefined, "indexBasisArtifacts ABI should be available");
      expect(indexBasisArtifacts.tvc).not.to.equal(undefined, "indexBasisArtifacts tvc should be available");

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
        value: locklift.utils.toNano(5),
      });

      console.log(`Collection deployed at: ${contract.address.toString()}`);
      const { account } = await locklift.factory.accounts.addNewAccount({
        type: WalletTypes.WalletV3,
        value: toNano(10),
        publicKey: signer.publicKey
      });
      console.log(`User account: ${account.address}`);

      const { count: id } = await contract.methods.totalSupply({ answerId: 0 }).call();
      await contract.methods.mintNft({ json: `{"name":"hello world"}` }).send({ from: account.address, amount: toNano(1) });
      const { nft: nftAddress } = await contract.methods.nftAddress({ answerId: 0, id: id }).call();
      expect((await contract.methods.totalSupply({ answerId: 0 }).call()).count).to.equal("1");

      console.log(`NFT: ${nftAddress.toString()}`);
    });

    // it("Deploy contract", async function () {
    //   const INIT_STATE = 0;
    //   const { contract } = await locklift.factory.deployContract({
    //     contract: "NameNftMinter",
    //     publicKey: signer.publicKey,
    //     initParams: {
    //       _nonce: locklift.utils.getRandomNonce(),
    //     },
    //     constructorParams: {
    //       _state: INIT_STATE,
    //     },
    //     value: locklift.utils.toNano(2),
    //   });
    //   sample = contract;

    //   expect(await locklift.provider.getBalance(sample.address).then(balance => Number(balance))).to.be.above(0);
    // });

    // it("Interact with contract", async function () {
    //   const NEW_STATE = 1;

    //   await sample.methods.setState({ _state: NEW_STATE }).sendExternal({ publicKey: signer.publicKey });

    //   const response = await sample.methods.getDetails({}).call();

    //   expect(Number(response._state)).to.be.equal(NEW_STATE, "Wrong state");
    // });
  });
});
