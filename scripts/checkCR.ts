import { expect } from "chai";
import { network } from "hardhat";

const connection = await network.connect();
const ethers = connection.ethers;

const GalaxisRegistryAddress   = "0x1e8150050A7a4715aad42b905C08df76883f396F"
const CommunityRegistryAddress = "0x0ABb7098a35907dE911FcA61420EC5fa55959726"

const REGISTRY_ABI = [
    "function getRegistryAddress(string memory key) external view returns (address)"
]

async function main(){

    const [sender] = await ethers.getSigners();
    const GalaxisRegistry = new ethers.Contract(GalaxisRegistryAddress, REGISTRY_ABI, sender.provider);
    const CommunityRegistry = new ethers.Contract(CommunityRegistryAddress, REGISTRY_ABI, sender.provider);

    console.log("community list   : ",await GalaxisRegistry.getRegistryAddress("COMMUNITY_LIST"))
    console.log(`TOKEN_1          : ${await CommunityRegistry.getRegistryAddress("TOKEN_1")}`)
    console.log(`TRAIT_REGISTRY_1 : ${await CommunityRegistry.getRegistryAddress("TRAIT_REGISTRY_1")}`)

}



main()