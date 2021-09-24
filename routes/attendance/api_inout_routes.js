var dboperations = require('../../database/attendance/attendance_in_out_table');
var cont = require('../../database/contractor/employee_master_table');
const express = require('express');
const router = express.Router();

var config = require('../../database/dbconfig');
var sql = require('mssql');
const { response } = require('express');
const axios = require('axios');

 



router.get('/all_in_out',(req, res)=>{
  condetails = {};
	var user_Id = req.session.userId, user_name = req.session.user_name;
  
	  if(user_Id == null)
    {
		message = 'Wrong Credentials.';
        res.render('login.ejs',{message: message});
		return;
    }
    else{
     /*  dboperations.attendance_in_out_data().then(result =>{                
      var contractor = result[0];
     // console.log(contractor);
      att.contract_attendance= contract_attendance;
      att.contractor = contractor;
      att.user_Id = user_Id;
      att.user_name = user_name;
      res.render('attendance/attendance_in_out',att);
      }) */ 

      cont.get_contractor_code().then(result=>{
        condetails.user_Id = user_Id;
        condetails.user_name = user_name;
        var conDetailsCode = result[0]; 
          condetails.conDetailsCode = conDetailsCode;
          res.render('attendance/all_in_out',condetails);
  })
    }
});


router.post('/all_attendance',(req,res)=>{
  console.log("empty"); 
  var data                    = req.body;
  //console.log(data);
  var ccodeName               = req.body.contractor_code.split("-",1);
  var ccode                   = ccodeName[0];

  var from_date               = req.body.from_date;
  var to_date                 = req.body.to_date;
  
  var str1 = "http://59.90.242.23:2000/api/attendance/";
  var str2 = from_date;
  var url = str1.concat(str2);

  //console.log(url);

  axios.get('http://59.90.242.23:2000/api/attendance/')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });

    res.send('Hello World!')

  });



module.exports = { api : router}