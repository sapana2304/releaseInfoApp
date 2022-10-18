import React from "react";
import './App.css';
import Upload from './components/Upload';
import PutData from './components/PutData';

// STARTS HERE

function App() {

  const addDataToDynamoDB = async () => {
    const userData = {
      id:1,
      name:"Faisal",
      age:"170"
    }
    
    await PutData('users' , userData)
  }
  
  return (
    <div className="App">
      
       <Upload></Upload>
       
    </div>
  );
}

export default App;
