import { expect } from "chai";
import { network } from "hardhat";

const connection = await network.connect();
const ethers = connection.ethers;


let test1: any;
let test2: any;
let test3: any;
let Cats : any;
let CatSwap: any;
let GalaxisRegistry : any;




async function deployContract(name: string, args: any[], KEY : string) {
    console.log(`Deploying ${name} contract to ${connection.networkName}`);
    const instance = await ethers.deployContract(name, args, {});
    console.log(`${name} deployed to: ${await instance.getAddress()}`);
     if (KEY.length > 0) {
        let tx = await GalaxisRegistry.setRegistryAddress(KEY,instance.target)
        await tx.wait()
    }
    return instance;
}

describe("test",function(){

    before(async function(){
        [test1, test2, test3] = await ethers.getSigners();
        GalaxisRegistry = await deployContract("TheRegistry",[],"")
        const GalaxisRegistryAddress = await GalaxisRegistry.getAddress()
        console.log(`Galaxis Registry at ${GalaxisRegistryAddress}`)
        Cats = await deployContract("Cats",[],"TOKAIDO_CATS");
        await Cats.connect(test1).mint(10)
        await Cats.connect(test2).mint(10)
        await Cats.connect(test3).mint(10)
        CatSwap = await deployContract("CatSwap",[GalaxisRegistryAddress],"CAT_SWAP")
    })

    it("1.0 t1 offers 1 for swap",async function(){
        await Cats.connect(test1).setApprovalForAll(CatSwap.target,true)
        await CatSwap.connect(test1).submitForTrade(1,[11,12,21,22]);
        let ta = await CatSwap.tokensAvailable();
        expect(ta.length).to.equal(1)
        expect(ta[0]).to.equal(1)
        let tw = Numberise(await CatSwap.tokensWanted())
        expect(tw.length).to.equal(4)
        expect(tw.includes(11)).to.equal(true)
        expect(tw.includes(12)).to.equal(true)
        expect(tw.includes(21)).to.equal(true)
        expect(tw.includes(22)).to.equal(true)
    })

    it("2.0 t2 offers 13 for swap",async function(){
        await Cats.connect(test2).setApprovalForAll(CatSwap.target,true)
        await CatSwap.connect(test2).submitForTrade(13,[4,5,24,25]);
        let ta = Numberise(await CatSwap.tokensAvailable());
        expect(ta.length).to.equal(2)
        expect(ta.includes(1)).to.equal(true)
        expect(ta.includes(13)).to.equal(true)
        let tw = Numberise(await CatSwap.tokensWanted())
        expect(tw.length).to.equal(8)
        expect(tw.includes(11)).to.equal(true)
        expect(tw.includes(12)).to.equal(true)
        expect(tw.includes(21)).to.equal(true)
        expect(tw.includes(22)).to.equal(true)
        expect(tw.includes(4)).to.equal(true)
        expect(tw.includes(5)).to.equal(true)
        expect(tw.includes(24)).to.equal(true)
        expect(tw.includes(25)).to.equal(true)
    })

    it("3.0 t3 offers 26 for swap",async function(){
        await Cats.connect(test3).setApprovalForAll(CatSwap.target,true)
        await CatSwap.connect(test3).submitForTrade(26,[11,21,17,27,8]);
        let ta = Numberise(await CatSwap.tokensAvailable());
        expect(ta.length).to.equal(3)
        expect(ta.includes(1)).to.equal(true)
        expect(ta.includes(13)).to.equal(true)
        expect(ta.includes(26)).to.equal(true)
        let tw = Numberise(await CatSwap.tokensWanted())
        expect(tw.length).to.equal(11)
        expect(tw.includes(8)).to.equal(true)
        expect(tw.includes(11)).to.equal(true)
        expect(tw.includes(12)).to.equal(true)
        expect(tw.includes(21)).to.equal(true)
        expect(tw.includes(22)).to.equal(true)
        expect(tw.includes(4)).to.equal(true)
        expect(tw.includes(5)).to.equal(true)
        expect(tw.includes(24)).to.equal(true)
        expect(tw.includes(25)).to.equal(true)
        expect(tw.includes(17)).to.equal(true)
        expect(tw.includes(27)).to.equal(true)
    })

    it("4.0 t2 swaps 12 for 1",async function(){
        let wg = Numberise(await CatSwap.whatCanIGetFor(12))
        expect(wg.length).to.equal(1);
        expect(wg[0]).to.equal(1)
        await expect(CatSwap.connect(test2).completeTrade(12,26)).to.be.revertedWith("CatSwap : this swap does not exist")
        await CatSwap.connect(test2).completeTrade(12,1)
        expect(await Cats.ownerOf(12)).to.equal(test1)
        expect(await Cats.ownerOf(1)).to.equal(test2)

        let ta = Numberise(await CatSwap.tokensAvailable());
        expect(ta.length).to.equal(2)
        expect(ta.includes(1)).to.equal(false)
        expect(ta.includes(13)).to.equal(true)
        expect(ta.includes(26)).to.equal(true)


        let tw = Numberise(await CatSwap.tokensWanted())
        expect(tw.length).to.equal(9)
        expect(tw.includes(8)).to.equal(true)
        expect(tw.includes(11)).to.equal(true)
        expect(tw.includes(12)).to.equal(false) 
        expect(tw.includes(21)).to.equal(true)
        expect(tw.includes(22)).to.equal(false)
        expect(tw.includes(4)).to.equal(true)
        expect(tw.includes(5)).to.equal(true)
        expect(tw.includes(24)).to.equal(true)
        expect(tw.includes(25)).to.equal(true)
        expect(tw.includes(17)).to.equal(true)
        expect(tw.includes(27)).to.equal(true)
 
    })

    it("4.0 t3 swaps 21 for 26",async function(){
        let wg = Numberise(await CatSwap.whatCanIGetFor(21))
        expect(wg.length).to.equal(1);
        expect(wg[0]).to.equal(26)
       await CatSwap.connect(test3).completeTrade(21,26)
        expect(await Cats.ownerOf(26)).to.equal(test3)
        expect(await Cats.ownerOf(21)).to.equal(test3)

        let ta = Numberise(await CatSwap.tokensAvailable());
        expect(ta.length).to.equal(1)
        expect(ta.includes(1)).to.equal(false)
        expect(ta.includes(13)).to.equal(true)
        expect(ta.includes(26)).to.equal(false)


        let tw = Numberise(await CatSwap.tokensWanted())
        expect(tw.length).to.equal(4)
        expect(tw.includes(8)).to.equal(false)
        expect(tw.includes(11)).to.equal(false)
        expect(tw.includes(12)).to.equal(false) 
        expect(tw.includes(21)).to.equal(false)
        expect(tw.includes(22)).to.equal(false)
        expect(tw.includes(4)).to.equal(true)
        expect(tw.includes(5)).to.equal(true)
        expect(tw.includes(24)).to.equal(true)
        expect(tw.includes(25)).to.equal(true)
        expect(tw.includes(17)).to.equal(false)
        expect(tw.includes(27)).to.equal(false)
 
    })
    
     it("5.0 t2 withdraws #13",async function(){
        expect(await Cats.ownerOf(13)).to.equal(CatSwap.target)
        await expect(CatSwap.connect(test1).withdrawMyToken(13)).to.be.revertedWith("CatSwap : not your token")
        await CatSwap.connect(test2).withdrawMyToken(13)
        expect(await Cats.ownerOf(13)).to.equal(test2)


        let ta = Numberise(await CatSwap.tokensAvailable());
        expect(ta.length).to.equal(0)


        let tw = Numberise(await CatSwap.tokensWanted())
        expect(tw.length).to.equal(0)
        expect(tw.includes(8)).to.equal(false)
        expect(tw.includes(11)).to.equal(false)
        expect(tw.includes(12)).to.equal(false) 
        expect(tw.includes(21)).to.equal(false)
        expect(tw.includes(22)).to.equal(false)
        expect(tw.includes(4)).to.equal(false)
        expect(tw.includes(5)).to.equal(false)
        expect(tw.includes(24)).to.equal(false)
        expect(tw.includes(25)).to.equal(false)
        expect(tw.includes(17)).to.equal(false)
        expect(tw.includes(27)).to.equal(false)
 
    })


    function Numberise(x:any) {
        return x.map(function(x:any){ return Number(x)});
    }

})