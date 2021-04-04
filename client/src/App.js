import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";
import "./App.css";

class App extends Component {
  state = { ipfsHash: 0, web3: null, accounts: null, contract: null };

  constructor(){
    super();
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit=this.onSubmit.bind(this);

  }

  componentDidMount = async () => {
    
    try {

      console.log('innnnnuuuu');
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];

      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,

      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {

    const { accounts, contract } = this.state;
    // Stores a given value, 5 by default.
    // await contract.methods.set("pd").send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.
    console.log('hererere');
    // const response = await contract.methods.get().call(accounts[0]);
    // 
    // Update state with the result.
    // this.setState({ ipfsHash: response });
  };

  captureFile(event)
  {

    console.log('capture');
    event.preventDefault();
    const file = event.target.files[0];
    console.log(file);
    const reader = new window.FileReader();     // convert to array which buufer understands
    reader.readAsArrayBuffer(file);

    console.log(reader);
    reader.onloadend = () =>{
    this.setState({buffer: Buffer(reader.result)})
    console.log(this.state.buffer);

    }
  }

    onSubmit(event)

    {
    event.preventDefault();
    console.log('submit');

    ipfs.files.add(this.state.buffer, (error,result) =>{
      
      if(error){
        console.log(error);
        return
      }

      // console.log(result[0].hash); 
      var content = document.getElementById("content");
      var hashValue = document.getElementById("hashValue");

      content.innerText="File Uploaded successfully";
      var a = document.createElement('a');

      a.href=`https://ipfs.io/ipfs/${result[0].hash}`;

      // <img src='https://ipfs.io/ipfs/${result[0].hash}'/>

      
      hashValue.innerHTML = a

      // contract.methods.set(result[0].hash).send({ from: accounts[0]}).then(
      console.log(result[0].hash);

      const { accounts, contract } = this.state;

      console.log('ccccccc',contract);

      // await contract.methods.set(75).send({ from: accounts[0] });

      contract.methods.set(result[0].hash).send({from :accounts[0]});

      // const response =  contract.methods.get().call(accounts[0]);

    // Update state with the result.

      // this.setState({ ipfsHash: response });

      // console.log('got from eth',ipfsHash);

      return this.setState({
        ipfsHash: result[0].hash
        
      })
    })
    // console.log('yoooo',this.state.ipfsHash);

  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (

      <div className="App">

        <h1>Good to Go!</h1>

        <p id='content'>Your Truffle Box is installed and ready.</p>

        <p id='hashValue'> Here</p>

        <h2>Upload Files to IPFS</h2>

        <form onSubmit= {this.onSubmit}>

            <input type = "file" onChange = {this.captureFile}/>
            <input type = "submit"/>
            
        </form>

        </div>
    );
  }
}

export default App;
