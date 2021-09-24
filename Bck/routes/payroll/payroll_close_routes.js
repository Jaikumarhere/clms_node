var dboperations = require('../../database/payroll_table');
const express = require('express');
const router = express.Router();

var config = require('../../database/dbconfig');
var sql = require('mssql');


 

/*router.get('/pay_roll_close',(req, res)=>{
	var user_Id = req.session.userId, user_name = req.session.user_name;
	if(user_Id == null)
  {
	  message = 'Wrong Credentials.';
	  res.render('login.ejs',{message: message});
	  return;
  }
  else{
	res.render('pay_roll/pay_roll_close',{user_Id:user_Id,user_name:user_name});
  }
});*/

// month fetching data for payroll close 
payrollclosemonth = {};
router.get('/pay_roll_close',(req,res)=>{
var user_Id = req.session.userId, user_name = req.session.user_name;
if(user_Id == null)
  {
	  message = 'Wrong Credentials.';
	  res.render('login.ejs',{message: message});
	  return;
  }
  else{
    dboperations.get_payroll_close().then(result=>{
        var Month = result[0];
        //console.log(MonthDetails);
        payrollclosemonth.Month = Month;
        payrollclosemonth.user_Id = user_Id;
        payrollclosemonth.user_name = user_name;
      res.render('pay_roll/pay_roll_close',payrollclosemonth);
    })
  }
});

//payroll close process
router.post('/payroll/close',(req, res) => {
    var month = req.body.month;
    console.log(month) 
  
    async function payroll_close(){
        try{
            let pool = await sql.connect(config);
            await pool.request().query(`update payroll_master SET flag ='3' where month='${req.body.month}'`);
        }
        catch(error){
            console.log(error);
        }
        console.log("Payroll close Successfully");
    } 
    payroll_close();
      res.redirect('/pay_roll_close'); 
  
  });
  


module.exports = { payRollClose : router}