import hre from "hardhat";
import {network} from "hardhat"
import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";


const connection = await network.connect();
const ethers = connection.ethers

const deployment = process.env.DEPLOYMENT

const liveNetworks = ["mainnet","polygon","arbitrum","base"];
const testNetworks = ["sepolia","amoy","base_sepolia","arbitrum_sepolia"]

let redeploys:any = [
   "CAT_SWAP"
]

let GalaxisRegistryAddress:any
let GalaxisRegistry:any
if (liveNetworks.includes(connection.networkName)) {
    if (deployment == "deploy_registry")  {
        GalaxisRegistryAddress = ""
    } else if (deployment == "dave") {
        GalaxisRegistryAddress = "0x5dd5526BB4B4944f49f9E77C7E99aDFB9510221E"
    }else if (deployment != "production") {
        console.log(`invalid deployment : ${deployment}`)
        process.exit(1)
    } else 
        GalaxisRegistryAddress = "0xdBD9608fBcA959828C1615d29AEb3dc872d40Ae2"
} else if (testNetworks.includes(connection.networkName)) {
    if (deployment == "development") {
        GalaxisRegistryAddress = "0xCA94d8F6ecF6D6321863Ad0cA95E248d0bd7263D"
    } else if (deployment == "staging") {
        GalaxisRegistryAddress = "0x710ec4f2248B202D069F6BD125922FF3AeDE9c41"
    } else {
        console.log("unknown deployment")
        console.log(`usage : DEPLOYMENT=development  npx hardhat run scripts/10.ER721Shop/10.ERC721Shop.ts --network sepolia`)
        process.exit(1)
    }
}
    


async function deployContract(CONTRACT_NAME:any,ARGS:any,KEY:any) {
    if (KEY.length > 0) {
        const old = await GalaxisRegistry.getRegistryAddress(KEY)
        if (old != ethers.ZeroAddress) {
            if (! redeploys.includes(KEY)) {
                console.log(`using contract at ${old} for ${KEY}`)
                const artifacts = await ethers.getContractFactory(CONTRACT_NAME)
                return artifacts.attach(old);
            }
        }
    }
    console.log(`Deploying ${CONTRACT_NAME} contract to ${connection.networkName}`);
    const contract = await ethers.deployContract(CONTRACT_NAME, ARGS, {});
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log(`${CONTRACT_NAME} deployed to ${contractAddress}`);
    await contract.deploymentTransaction()?.wait(16)
    if (KEY.length > 0) {
        let tx = await GalaxisRegistry.setRegistryAddress(KEY,contractAddress)
        await tx.wait()
    }
    try {

        await verifyContract(
            { 
                address: contractAddress,
                constructorArgs: ARGS,
                provider: "etherscan"
            },
            hre
        )
    } catch(error) {
        console.error(error);
    }
    return contract;
}


async function main() {
    const [account] = await ethers.getSigners()

    if (deployment == "deploy_registry") {
        const R = await deployContract("TheRegistry",[],"")
        GalaxisRegistryAddress = R.target
        let tx = await R.setRegistryAddress("TOKAIDO_CATS","0xd7041d13887f4ab96db72b9532579dcd842768d6")
        await tx.wait()
        console.log("Registry deployed and TOKAIDO CATS set")
        process.exit(1)
    }


    console.log(`Network     : ${connection.networkName}`);
    console.log(`deployer    : ${account.address}`)
    console.log(`deployment  : ${deployment}`);
    console.log(`registry    : ${GalaxisRegistryAddress}`)


    const GalaxisRegistryArtifacts = await ethers.getContractFactory("TheRegistry")
    GalaxisRegistry = GalaxisRegistryArtifacts.attach(GalaxisRegistryAddress)

    if (!await GalaxisRegistry.isAdmin(account.address)) {
        console.log(`address : ${account.address} is not an admin on registry`)
        process.exit(1)
    }

    await deployContract("CatSwap",[GalaxisRegistryAddress],"CAT_SWAP")

}

main()