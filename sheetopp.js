require("dotenv").config()
const {google} = require("googleapis");

const authorize = async ()=>{
  const auth = new google.auth.GoogleAuth({
    keyFile: "creds.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  return {auth,googleSheets}
}

//check if anable is on or off
const enablecheck = async (clanName)=>{
   const {auth,googleSheets} = await authorize()
  const spreadsheetId = process.env.SPREADSHEET_ID

  const getclan = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:A",
  
  });

  for(let i=0;i<getclan.data.values.length;i++){
    if(getclan.data.values[i][0]===clanName){
        const getEnable = await googleSheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range: "Sheet1!D"+(i+1),
        
        });
        if(getEnable.data.values[0][0]==="yes"){return true}
    }
  }
 return false
}

//enablecheck("uzumaki")

module.exports.eneblecheck = enablecheck

const emailValidity = async (clan,emailId)=>{

  const {auth,googleSheets} = await authorize()
  const spreadsheetId = process.env.SPREADSHEET_ID
  //get members sheet id
  const clanSheet = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet1!A:A"

  })
  for(let i=1;i<clanSheet.data.values.length;i++){
    if(clanSheet.data.values[i][0]===clan){
      var memberSheetID = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId ,
        range : "Sheet1!C"+(i+1)
      })
    }

  }
 //check if email exist in the member sheet
  const memberSheet = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId : memberSheetID.data.values[0][0],
    range: "Sheet1!A:A"

  })
  for(let i=1;i<memberSheet.data.values.length;i++){
    if(memberSheet.data.values[i][0]===emailId){
      console.log(memberSheet.data.values[i][0])
      const temdata = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId : memberSheetID.data.values[0][0],
        range: "Sheet1!B"+(i+1)
      })
     if((!temdata.data.values)||(temdata.data.values[0][0]==='')||(temdata.data.values[0][0]===null)){
      //console.log("success")
      return {
        status : true,
        message : "success"
      }

     }
     return {
       status : false,
       message : "user already registered"
     }
    }//if statement 

  }
  return {
    status : false,
    message : "not a valid email"
  }
}

module.exports.emailValidity = emailValidity
//emailValidity("uzumaki","naruto123@gmail.com")

const writeTosheet = async (clan,email,fieldB,fieldC)=>{
  //get member sheet id
  const {auth,googleSheets} = await authorize()
  const spreadsheetId = process.env.SPREADSHEET_ID

  const getclan = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1",
  
  });
  
  for(let i=1;i<getclan.data.values.length;i++){
      if(getclan.data.values[i][0]===clan){
        var memberSheetId = getclan.data.values[i][2]
          var memberSheet = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId : getclan.data.values[i][2],
            range: "Sheet1",
          
          });
          
      }
   }

   for(let i=1;i<memberSheet.data.values.length;i++){
        if(memberSheet.data.values[i][0]===email){
          console.log("user found")
          const range = "Sheet1!B"+(i+1)+":C"+(i+1)
          const updateData = await googleSheets.spreadsheets.values.update({
            auth,
            spreadsheetId : memberSheetId,
            range : range,
            valueInputOption: "USER_ENTERED",
         resource: { range: range, majorDimension: "ROWS", values: [[fieldB,fieldC]] },
        })
        }

   }


}

module.exports.writeTosheet = writeTosheet