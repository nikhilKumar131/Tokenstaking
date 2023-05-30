import Youtube from "react-youtube";
import { useRef, useState, useEffect } from 'react';
import web3modal from "web3modal";
import { ethers } from 'ethers';
import { address, ABI } from '../contracts/smc';

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 1,
  }
}
export default function Home() {

  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenStaked, setTokenStaked] = useState(0);
  let web3modalRef = useRef();
  const [walletStatus, setWalletStatus] = useState(false);
  const [STokenEntered, setSTokenEntered] = useState();
  const [USTokenEntered, setUSTokenEntered] = useState();
  const [CReward, setCReward] = useState();


  async function getProviderOrSigner(signer = false) {
    try {
      const provider = await web3modalRef.current.connect()
      const providers = new ethers.providers.Web3Provider(provider)

      //checking network connected
      const { chainId } = await providers.getNetwork();
      if (chainId !== 11155111) {
          window.alert("Change the network to Sepolai");
          throw new Error("Change network to Sepolai");
      }
      5
      if (signer) {
        const signer = providers.getSigner();
        return signer;
      }

      return providers;
    }
    catch {
      (err) => { console.error(err) }
    }

  }

  useEffect(() => {
    if (walletStatus == false) {
      web3modalRef.current = new web3modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      getProviderOrSigner()
      setWalletStatus(true)
      Tbalance();
      Tstaked();
    }
    try { balance() } catch { err => { console.error(err) } }

  }, [walletStatus])

  //functions

  //mint function to mint free tokens
  async function mint() {
    try {
      const signer = await getProviderOrSigner(true);
      const addr = await signer.getAddress();


      const contract = new ethers.Contract(address, ABI, signer);
      const txn = await contract.mintToken(addr, 1000);
      const reciept = await txn.wait();
      console.log(txn);
      Tbalance();

    }
    catch { err => { console.error(err) } }
  }

  //token Balance
  async function Tbalance() {
    try {
      const signer = await getProviderOrSigner(true);
      const addr = await signer.getAddress();
      console.log(addr);

      const contract = new ethers.Contract(address, ABI, signer);
      const txn = await contract.balanceOf(addr);
      const _bal = parseInt(txn);
      // const reciept = await txn.wait();
      console.log(_bal);
      setTokenBalance(_bal)


    }
    catch { err => { console.error(err) } }
  }

  //Token Staked
  async function Tstaked() {
    try {
      const signer = await getProviderOrSigner(true);
      const addr = await signer.getAddress();
      console.log(addr);

      const contract = new ethers.Contract(address, ABI, signer);
      const txn = await contract.individual(addr);
      const _bal = parseInt(txn[0]);
      // const reciept = await txn.wait();
      console.log(_bal);
      setTokenStaked(_bal);


    }
    catch { err => { console.error(err) } }
  }

  //Stake Tokens
  async function Tstaking() {
    try {
      const signer = await getProviderOrSigner(true);

      const contract = new ethers.Contract(address, ABI, signer);
      const txn = await contract.stakeToken(STokenEntered);
      const reciept = await txn.wait();
      console.log(reciept);
      Tstaked();
      Tbalance();
      setCReward("transaction Complete");

    }
    catch { err => { console.error(err) } }
  }

  //Unstake Tokens
  async function TUNstaking() {
    try {
      const signer = await getProviderOrSigner(true);

      const contract = new ethers.Contract(address, ABI, signer);
      const txn = await contract.unStakeToken(USTokenEntered);
      const reciept = await txn.wait();
      console.log(reciept);
      Tstaked();
      Tbalance();
      setCReward("transaction Complete")

    }
    catch { err => { console.error(err) } }
  }


  //Claim Reward
  async function ClaimRew() {
    try {
      const signer = await getProviderOrSigner(true);

      const contract = new ethers.Contract(address, ABI, signer);
      const txn = await contract.receiveReward();
      const reciept = await txn.wait();
      console.log(reciept);
      Tstaked();
      Tbalance();
      setCReward("reward has been claimed")



    }
    catch { err => { console.error(err) } }
  }

  //Calculate Reward

  async function CalcualteRew() {
    try {
      const signer = await getProviderOrSigner(true);

      const contract = new ethers.Contract(address, ABI, signer);
      const txn = await contract.calculatedReward();
      const _bal = parseInt(txn);
      // const reciept = await txn.wait();
      console.log(_bal);
      setCReward(_bal);
      Tstaked();
      Tbalance();



    }
    catch { err => { console.error(err) } }
  }

  return (

    <div className=" bg-gray-800 h-full text-white">
      <div className=" ">
        <img src="banner.jpg" className="absolute w-full overflow-hidden" />

        {/* <div className=" h-20 flex justify-center items-center relative">
          header
        </div> */}
        <div className=" h-96 flex flex-row  items-center w-screen relative">
          <div className="ml-20 w-3/5">
            <h1 className="text-4xl">Red Token</h1>
            <p className="text-lg">This is erc20 token deployed on <span className="font-bold text-xl">SEPOLAIeth</span> test network</p>
            <p className="text-lg mb-10">Earn 1 token per second per 100 tokens</p>
            <button className="bg-orange-500 rounded-full ">< a className=" text-lg mt-10 mx-10" onClick={getProviderOrSigner}>MetaMask</a></button>
            <p className="text-lg mt-10">MINT Some FREE tokens for testing.</p>
            <button className="bg-orange-500 rounded-full " onClick={mint}>< a className=" text-lg mt-10 mx-10" >Mint</a></button>
          </div>
          <div className="flex w-2/5 justify-center items-center">
            <Youtube videoId="EUHDhVMsvsk" onReady={(e) => {e.target.pauseVideo()}} opts={opts} className="relative align-middle mt-20" />
          </div>

        </div>
        <div className="relative ml-20 mt-36">
          <div className="">
            Stake Tokens and earn Reward.
          </div>
          <div className="">
            click <a className="text-blue-700 " href="https://github.com/nikhilKumar131/Tokenstaking/blob/main/contracts/contract.sol" target="_blank">here</a> to get to github link of the deployed SMART CONTRACT</div>
        </div>
      </div>
      <div className="">
        <div className="relative mt-28 grid  grid-row-3 gap-10 justify-center">
          <div className="flex justify-center">
            Stake
            <input className="mx-10 bg-gray-800 rounded-xl hover:bg-gray-500" placeholder=" XX tokens" onChange={(e) => { setSTokenEntered(e.target.value) }} />
            <button className="bg-orange-500 rounded-full ">< a className=" text-lg mt-10 mx-10" onClick={Tstaking}>Stake</a></button>
          </div>
          <div className="flex justify-center">
            Unstake
            <input className="mx-10 bg-gray-800 rounded-xl hover:bg-gray-500" placeholder=" XX tokens" onChange={(e) => { setUSTokenEntered(e.target.value) }} />
            <button className="bg-orange-500 rounded-full ">< a className=" text-lg mt-10 mx-10" onClick={TUNstaking}>Unstake</a></button>
          </div>
          <div className="flex justify-center space-x-4">
            <p>Reward</p>
            <button className="bg-orange-500 rounded-full ">< a className=" text-lg mt-10 mx-10" onClick={ClaimRew}>Claim Reward</a></button>
            <button className="bg-orange-500 rounded-full ">< a className=" text-lg mt-10 mx-10" onClick={CalcualteRew}>Calculate Reward</a></button>
            <p>{CReward}</p>
          </div>
          <div className="flex justify-center space-x-4 pb-14">
            Total Tokens: <span>{tokenBalance}</span>
            <p>Total Staked: <span>{tokenStaked}</span></p>
          </div>

        </div>
      </div>


    </div>
  )
}
