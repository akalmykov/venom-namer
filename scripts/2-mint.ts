import { Address, toNano, WalletTypes } from "locklift";

const nftItemABI = {
    "ABI version": 2,
    "version": "2.2",
    "header": ["pubkey", "time", "expire"],
    "functions": [
        {
            "name": "constructor",
            "inputs": [
                { "name": "owner", "type": "address" },
                { "name": "sendGasTo", "type": "address" },
                { "name": "remainOnNft", "type": "uint128" },
                { "name": "json", "type": "string" },
                { "name": "codeIndex", "type": "cell" },
                { "name": "indexDeployValue", "type": "uint128" },
                { "name": "indexDestroyValue", "type": "uint128" }
            ],
            "outputs": [
            ]
        },
        {
            "name": "indexCode",
            "inputs": [
                { "name": "answerId", "type": "uint32" }
            ],
            "outputs": [
                { "name": "code", "type": "cell" }
            ]
        },
        {
            "name": "indexCodeHash",
            "inputs": [
                { "name": "answerId", "type": "uint32" }
            ],
            "outputs": [
                { "name": "hash", "type": "uint256" }
            ]
        },
        {
            "name": "resolveIndex",
            "inputs": [
                { "name": "answerId", "type": "uint32" },
                { "name": "collection", "type": "address" },
                { "name": "owner", "type": "address" }
            ],
            "outputs": [
                { "name": "index", "type": "address" }
            ]
        },
        {
            "name": "getJson",
            "inputs": [
                { "name": "answerId", "type": "uint32" }
            ],
            "outputs": [
                { "name": "json", "type": "string" }
            ]
        },
        {
            "name": "transfer",
            "inputs": [
                { "name": "to", "type": "address" },
                { "name": "sendGasTo", "type": "address" },
                { "components": [{ "name": "value", "type": "uint128" }, { "name": "payload", "type": "cell" }], "name": "callbacks", "type": "map(address,tuple)" }
            ],
            "outputs": [
            ]
        },
        {
            "name": "changeOwner",
            "inputs": [
                { "name": "newOwner", "type": "address" },
                { "name": "sendGasTo", "type": "address" },
                { "components": [{ "name": "value", "type": "uint128" }, { "name": "payload", "type": "cell" }], "name": "callbacks", "type": "map(address,tuple)" }
            ],
            "outputs": [
            ]
        },
        {
            "name": "changeManager",
            "inputs": [
                { "name": "newManager", "type": "address" },
                { "name": "sendGasTo", "type": "address" },
                { "components": [{ "name": "value", "type": "uint128" }, { "name": "payload", "type": "cell" }], "name": "callbacks", "type": "map(address,tuple)" }
            ],
            "outputs": [
            ]
        },
        {
            "name": "getInfo",
            "inputs": [
                { "name": "answerId", "type": "uint32" }
            ],
            "outputs": [
                { "name": "id", "type": "uint256" },
                { "name": "owner", "type": "address" },
                { "name": "manager", "type": "address" },
                { "name": "collection", "type": "address" }
            ]
        },
        {
            "name": "supportsInterface",
            "inputs": [
                { "name": "answerId", "type": "uint32" },
                { "name": "interfaceID", "type": "uint32" }
            ],
            "outputs": [
                { "name": "value0", "type": "bool" }
            ]
        }
    ],
    "data": [
        { "key": 1, "name": "_id", "type": "uint256" }
    ],
    "events": [
        {
            "name": "NftCreated",
            "inputs": [
                { "name": "id", "type": "uint256" },
                { "name": "owner", "type": "address" },
                { "name": "manager", "type": "address" },
                { "name": "collection", "type": "address" }
            ],
            "outputs": [
            ]
        },
        {
            "name": "OwnerChanged",
            "inputs": [
                { "name": "oldOwner", "type": "address" },
                { "name": "newOwner", "type": "address" }
            ],
            "outputs": [
            ]
        },
        {
            "name": "ManagerChanged",
            "inputs": [
                { "name": "oldManager", "type": "address" },
                { "name": "newManager", "type": "address" }
            ],
            "outputs": [
            ]
        },
        {
            "name": "NftBurned",
            "inputs": [
                { "name": "id", "type": "uint256" },
                { "name": "owner", "type": "address" },
                { "name": "manager", "type": "address" },
                { "name": "collection", "type": "address" }
            ],
            "outputs": [
            ]
        }
    ],
    "fields": [
        { "name": "_pubkey", "type": "uint256" },
        { "name": "_timestamp", "type": "uint64" },
        { "name": "_constructorFlag", "type": "bool" },
        { "name": "_supportedInterfaces", "type": "optional(cell)" },
        { "name": "_id", "type": "uint256" },
        { "name": "_collection", "type": "address" },
        { "name": "_owner", "type": "address" },
        { "name": "_manager", "type": "address" },
        { "name": "_json", "type": "string" },
        { "name": "_indexDeployValue", "type": "uint128" },
        { "name": "_indexDestroyValue", "type": "uint128" },
        { "name": "_codeIndex", "type": "cell" }
    ]
}




async function main() {
    const signer = (await locklift.keystore.getSigner("0"))!;

    const contract = locklift.factory.getDeployedContract("NameNftMinter", new Address("0:85ac9e08f378369780c070b0490e84f55d523327e4adb645915e17422fce967b"));

    console.log(`Collection deployed at: ${contract.address.toString()}`);

    const { count: id } = await contract.methods.totalSupply({ answerId: 0 }).call();

    const everWalletAccount = await locklift.factory.accounts.addExistingAccount({
        address: new Address("0:fefdc5af29bd72bdb3d33ce54766b42b8c4280416aba93017754092fa27baf06"),
        type: WalletTypes.EverWallet,
    });

    await contract.methods.mintNft({ json: `{"name":"hello world"}` }).send({ from: everWalletAccount.address, amount: toNano(0.5) });
    const { nft: nftAddress } = await contract.methods.nftAddress({ answerId: 0, id: id }).call();

    console.log(`NFT: ${nftAddress.toString()}`);
    const { codeHash } = await contract.methods.nftCodeHash({ answerId: 0 } as never).call({ responsible: true });
    const nftCodeHash = BigInt(codeHash).toString(16);

    const addresses = await locklift.provider.getAccountsByCodeHash({
        codeHash: nftCodeHash,
    });

    console.log(addresses);
    if (addresses.accounts) {
        for (let acc of addresses.accounts) {
            const nftItemContract = new locklift.provider.Contract(
                nftItemABI,
                acc,
            );
            console.log(nftItemContract);
            // *** ERROR "Public function was called before constructor" raised from calling getInfo ****
            const getJsonAnswer = (await nftItemContract.methods
                .getInfo({ answerId: 0 } as never)
                .call()) as { json: string };
            const json = JSON.parse(getJsonAnswer.json ?? '{}') as any;
            console.log(json, 'JSON');
        }
    }

}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });



