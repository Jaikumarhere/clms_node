var dboperations = require('../../database/payroll_table');
const express = require('express');
const router = express.Router();

var config = require('../../database/dbconfig');
var sql = require('mssql');

//contractor list and month fetching data 
condetails = {};
router.get('/form_b_wage_register',(req,res)=>{
var user_Id = req.session.userId, user_name = req.session.user_name;
if(user_Id == null)
  {
	  message = 'Wrong Credentials.';
	  res.render('login.ejs',{message: message});
	  return;
  }
  else{
    dboperations.payroll_contract_data().then(result=>{
      condetails.user_Id = user_Id;
      condetails.user_name = user_name;
    var conDetailsCode = result[0]; 
    condetails.conDetailsCode = conDetailsCode;
    dboperations.get_month_data().then(result=>{
        var MonthDetails = result[0];
        //console.log(MonthDetails);
        condetails.MonthDetails = MonthDetails; 
      res.render('pay_roll/form_b_wage_reg',condetails);
    }) 
  })
  }
});

//form b wage register fetch data
router.post('/pay_roll/form_b_wage_reg_data',(req,res)=>{
  var concode = req.body.ccode.split('-');
  var ccode = concode[0];
 // cosole.log(ccode)
  var month = req.body.month;
  console.log(month)
  var payroll = month.split("-"); 
  var payroll_month = payroll[0];
  var payroll_year  = payroll[1];
  
  //console.log(payroll_month)
  //console.log(payroll_year)
  var from_date = payroll_year+'-'+'0'+payroll_month+'-'+'0'+1; 
  var getDaysInMonth = function(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
   return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  };
  var end_of_month = getDaysInMonth(payroll_month, payroll_year);
  var end_date = payroll_year+'-'+'0'+payroll_month+'-'+end_of_month; 
  
        async function payroll_list_data() {
        try{
          console.log(from_date)
          console.log(end_date)
          let pool = await sql.connect(config);
           let payroll_query =await pool.request().query(`EXEC wage_form_b '${ccode}',${payroll_month},${payroll_year}`);
          // console.log(`EXEC payroll_emp_salary 114008,'${from_date}','${end_date}',${payroll_month},${payroll_year}`);
           //let payroll_query =await pool.request().query(  `EXEC payroll_emp_salary 114008,'2021-02-01','2021-02-28',2,2021`);
                  return payroll_query.recordsets;
        }
        catch(error) {
            console.log(error)
        }
      }
      
      payroll_list_data().then(result=>{
        var PayrollData = result[0];
          
        //console.log(PayrollData);
        //console.log(result.rows[0].ECODE);
        res.send(PayrollData);
      }); 
       
  
});




module.exports = {
    formbwage : router
}