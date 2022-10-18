import * as AWS from 'aws-sdk'


//aws config setting to connect DynamoDB
AWS.config.update({
    region: process.env.REACT_APP_REGION,
     accessKeyId: process.env.REACT_APP_ACCESS,
    secretAccessKey: process.env.REACT_APP_SECRET,
  });
  
const docClient = new AWS.DynamoDB.DocumentClient()

 const PutData = (releaseNumber,data) => {

     data.forEach((itemData) => {
   console.log(itemData)  
        itemData.ts =  Date().toLocaleString()
        itemData.releaseNumber = releaseNumber
        
        var params = {
        TableName: 'releaseinfo_tbl',
        Item: itemData,
        Key:{ "docId": itemData.docId},
        UpdateExpression: "set profitCenter= :profitCenter,costCenter= :costCenter,CashjournalNo= :CashjournalNo,releaseId= :releaseId,releaseNumber= :releaseNumber,ts= :ts",
        ExpressionAttributeValues: {
          ":profitCenter": itemData.profitCenter,
          ":costCenter": itemData.costCenter,
          ":CashjournalNo": itemData.CashjournalNo,
          ":releaseId": itemData.releaseId,
          ":releaseNumber":itemData.releaseNumber,
          ":ts":itemData.ts
        }
       
    }
       

    docClient.update(params, function (err, data) {
        if (err) {
            console.log('Error', err)
        } else {
            console.log('Success', data)
        }
    })
})

}

export default PutData;