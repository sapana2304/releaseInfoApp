import React,{ useRef } from "react";
import S3 from "react-aws-s3";
import * as XLSX from "xlsx";
import PutData from './PutData';
import 'antd/dist/antd.css';
import { message } from 'antd';

window.Buffer = window.Buffer || require("buffer").Buffer;

const Upload  = () => {

const fileInput = useRef();
const releaseInput = useRef();

const handleClick = event =>{
event.preventDefault();
let file = fileInput.current.files[0];

//check validation of file type set as only .xlsx
const isXls = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
if (!isXls) {
  message.error('You can only upload .xlsx file!');
}
else{
let releaseNumber = releaseInput.current.value  // get release number 
let fileName = fileInput.current.files[0].name  // get file name
let fileext = fileName.split(".").pop();  // fetch only extention for adding suffix
let newFileName = fileName.substring(0, fileName.lastIndexOf('.'))+"_"+releaseNumber+"."+fileext;

//Set the AWS Config to connect s3 bucket
const config = {
    bucketName: process.env.REACT_APP_BUCKET_NAME,
    region: process.env.REACT_APP_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS,
    secretAccessKey: process.env.REACT_APP_SECRET
}


const ReactS3Client = new S3(config);
ReactS3Client.uploadFile(file, newFileName,releaseNumber)
    .then((data)=>{
        // After SucessFully Upload into s3 Bucket Read exel file
        const reader = new FileReader();

        reader.onload = (evt) => {

         let Heading = [
                ["docId", "profitCenter", "costCenter","CashjournalNo","releaseId"],
              ];

          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          XLSX.utils.sheet_add_aoa(ws, Heading);
          
         // const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        
         const data = XLSX.utils.sheet_to_json(ws);
        
         //Calling Function dynamoDB 
          addDataToDynamoDB(releaseNumber,data).then(

            fileInput.current.value = "",
            releaseInput.current.value = "",

            message.success("Suceessfully Process the File !!")

          ).catch(console.log("error"))
        };
        reader.readAsBinaryString(file);
       
    }).catch((err)=>{
        console.log(err)
    })

    //Call DynamoDB function 
    const addDataToDynamoDB = async (releasedata,data) => {
        await PutData(releasedata,data)
      }
      
  }
};

 return(
        <div>
    <form className="register-form" onSubmit={ handleClick }>
         <input
          id="release-no"
          className="form-field"
          type="number" min="1" max="10000"
          placeholder="Release Number"
          name="releaseno"
          ref={releaseInput}
           required

          />
        <input
          id="fileupload"
          className="form-field"
          type="file"
          placeholder="Upload File"
          name="fileupload"
          ref={fileInput}
          required
          
        />
       
        <button className="form-field" type="submit">
          submit
        </button>
      </form>

        </div>
    )
}



export default Upload
