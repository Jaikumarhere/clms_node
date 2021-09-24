const express = require('express');
const router = express.Router();

var config = require('../../database/dbconfig');
var sql = require('mssql');

//Tables
var dboperations = require('../../database/payroll/form_d_attendance_table');
var getMonth = require('../../database/payroll_table');


 

router.get('/form_d',(req, res)=>{
  formDObject = {};
	var user_Id = req.session.userId, user_name = req.session.user_name;
	if(user_Id == null)
  {
	  message = 'Wrong Credentials.';
	  res.render('login.ejs',{message: message});
	  return;
  }
  else{
    dboperations.attendanceReport().then(result=>{
      formDObject.user_Id = user_Id;
      formDObject.user_name = user_name;
      var form_d_data = result[0];
      formDObject.form_d_data = form_d_data;
      getMonth.get_month_data().then(result=>{
        var MonthDetails = result[0];
        //console.log(MonthDetails);
        formDObject.MonthDetails = MonthDetails; 
        //console.log(MonthDetails)
        res.render('pay_roll/form_d_attendance',formDObject);
    }) 
    })
  }
});

router.post('/pay_roll/form_d_attendance_data',(req,res,next)=>{
  var concode = req.body.ccode.split('-');
  var ccode = concode[0];

/*   var monthYearData = req.body.month.split('-');
  var month = monthYearData[0];
  var year = monthYearData[1]; */

  
  var payroll = req.body.month.split("-"); 
  var payroll_month = payroll[0];
  //console.log(payroll_month);
  var payroll_year  = payroll[1];
  //console.log(payroll_year);
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
  
  //console.log(from_date)
  //console.log(end_date)

      async function payroll_list_data(){
        try{
                let pool = await sql.connect(config);
                let products = await pool.request().query(`select CCODE,CNAME,PO_NUM,EMPCODE,IDCARDNO,Employee_Name,DAY(Shift_date) as Shift_date
                from Employee_Daily_Attendance where Shift_date between '${from_date}' and '${end_date}' and 
                PO_NUM in (select WORK_ORDER from cpcl_work_order_master where CCODE='${ccode}') and EMPCODE <> ''`); 
                return products.recordsets;
            }
            
        catch(error){
            console.log(error);
        }
    } 

    fdattendance = {};
    payroll_list_data().then(result=>{
        var PayrollData = result[0];
        //console.log(PayrollData);
       // console.log(PayrollData.length);
       // console.log(from_date)
       // console.log(end_date)
         var fdate  = from_date.split('-');
         var fday = fdate[2]

         var tdate  = end_date.split('-');
         var tday = tdate[2];
         var days = 0;
         for(i=fday;i<=tday;i++){
          days++;
         }
         //console.log(days);
         fdattendance.PayrollData=PayrollData;
         fdattendance.days=days;
         fdattendance.from_date=from_date;
         fdattendance.end_date=end_date;
       // console.log(fday);
        res.send(fdattendance);
      });   
});


module.exports = { formDAttendance : router}