var config = require('../../database/dbconfig');
var sql = require('mssql');

var dboperations = require('../../database/payroll_table');
const express = require('express');
const router = express.Router();



// month fetching for payroll generate 
payrollmonth = {};
router.get('/pay_roll_generationnew',(req,res)=>{
var user_Id = req.session.userId, user_name = req.session.user_name;
if(user_Id == null)
  {
	  message = 'Wrong Credentials.';
	  res.render('login.ejs',{message: message});
	  return;
  }
  else{
      dboperations.get_payroll_month().then(result=>{
        //var numRows = result.length;
        var arr = result[0]; //An Array is defined with 5 instances
        var len= arr.length;  //Now arr.length returns 5.Basically, len=5.
        //console.log(result[0])
        console.log(len); //gives 5
        //console.log(arr.length); //also gives 5
        if(len == 0){
            // console.log("empty");
            async function get_cur_payroll_month (){
              try{
                  let pool = await sql.connect(config);
                  let payroll = await pool.request().query("select top 1 id,month,year,flag  from payroll_master where flag ='1'  and flag != 2 ");
                  return payroll.recordsets;
              }
              catch(error){
                  console.log(error);
              }
            }
            get_cur_payroll_month().then(result=>{
              var MonthlList = result[0];
              //console.log(MonthlList);        
              payrollmonth.MonthlList = MonthlList;
              payrollmonth.user_Id = user_Id;
              payrollmonth.user_name = user_name;
      
              console.log(payrollmonth.MonthlList);
              res.render('pay_roll/pay_roll_generationnew.ejs',payrollmonth);
            }); 
          }else{
            dboperations.get_payroll_month().then(result=>{
              var MonthlList = result[0];
              //console.log(MonthlList);        
              payrollmonth.MonthlList = MonthlList;
              payrollmonth.user_Id = user_Id;
              payrollmonth.user_name = user_name;
      
              //dboperations.get_attendance_data().then(result=>{
              //payrollmonth.data =  result[0];
              console.log(payrollmonth.MonthlList);
              res.render('pay_roll/pay_roll_generationnew.ejs',payrollmonth);
              //})
          })
      
      }



         /*
         if(flag_value == 2)
         {
          console.log(MonthlList);
         }
        else{
          async function get_cur_payroll_month (){
            try{
                let pool = await sql.connect(config);
                let payroll = await pool.request().query("select top 1 id,month,year,flag  from payroll_master where flag ='1'  and flag != 2 ");
                return payroll.recordsets;
            }
            catch(error){
                console.log(error);
            }
          }
            
        })
      }*/


         
        //})
    })
  }
});
//payroll_attendance list
router.post('/report/payroll_list',(req,res)=>{

  res.setHeader('Content-Type', 'text/html');

  

  var data = req.body;
  var attendance_data =[];
  var month = req.body.month;
//console.log(month)
  var payroll = month.split("-"); 
  var payroll_month = payroll[0];
  var payroll_year  = payroll[1];
  
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
  console.log(from_date);
   console.log(end_date);
  /*async function get_payroll_list() {
      try{
          let pool = await sql.connect(config);
          let payroll_data = await pool.request().query( `select IDCARDNO,CCODE,CNAME from Employee_Daily_Attendance where Shift_date between '2021-02-01' and '2021-02-28'  group by IDCARDNO,CCODE,CNAME order by CNAME`);
          return payroll_data.recordsets;
      }
      catch(error) {
          console.log(error)
      }
    }*/

    /*get_payroll_list().then(results=>{
      var check_idcard_details = results[0];

      for(j=0; j<check_idcard_details.length; j++){*/
        async function payroll_list_data() {
          try{
            //var IDCARDNO = check_idcard_details[j].IDCARDNO;
            //console.log(IDCARDNO)
            
              let pool = await sql.connect(config);
              let payroll_query =await pool.request().query( `select distinct b.IDCARDNO,count(b.IDCARDNO) as no_of_days,b.EMPCODE,b.CNAME,b.PO_NUM,b.Employee_Name
              from cpcl_employee_master a join Employee_Daily_Attendance b on(a.ECODE=b.IDCARDNO)
              where b.IDCARDNO in (select ECODE from cpcl_employee_master where ECODE!='') and  b.Shift_date between '${from_date}' and '${end_date}' 
              group by  b.IDCARDNO,b.EMPCODE,b.CNAME,PO_NUM,b.Employee_Name`);
                   
                            return payroll_query.recordsets;

              /* select distinct a.ECODE,a.CCODE,a.NEW_CODE,a.PRE_CODE,a.ENAME,a.WORK_ORDER_No,
              b.IDCARDNO,count(b.IDCARDNO) as no_of_days,b.EMPCODE,b.CNAME
              from cpcl_employee_master a join Employee_Daily_Attendance b on (a.NEW_CODE=b.EMPCODE)
              where a.NEW_CODE in (select EMPCODE from Employee_Daily_Attendance) and  b.Shift_date between '${from_date}' and '${end_date}' 
              group by a.ECODE,a.CCODE,a.NEW_CODE,a.PRE_CODE,a.ENAME,a.WORK_ORDER_No,b.IDCARDNO,b.EMPCODE,b.CNAME */
          }
          catch(error) {
              console.log(error)
          }
        }
        payroll_list_data().then(result=>{
          var PayrollData = result[0];
          //console.log(result[0]);
          //attendance_data.push(PayrollData);
          // console.log(attendance_data);
          //res.send(PayrollData);
          res.send(PayrollData);
        }); 
        //res.write('PayrollData');
 // }
  ///res.end();   
 // });
  
});





//payroll generate process
router.post('/payroll/generate',(req, res) => {
    async function payroll_generate(){
        try{
            let pool = await sql.connect(config);
            await pool.request().query(`update payroll_master SET flag ='2' where month='${req.body.id}'`);
        }
        catch(error){
            console.log(error);
        }
        console.log("Payroll Generated Successfully");
    } 
    payroll_generate();
     res.redirect('/pay_roll_generationnew'); 
});

//payroll_insert
router.post('/report/payroll_insert',(req,res)=>{
  res.setHeader('Content-Type', 'text/html');
  var data = req.body;
  var attendance_data =[];
  var month = req.body.month;

  
  var payroll = month.split("-"); 
  var payroll_month = payroll[0];
  var payroll_year  = payroll[1];
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
  
console.log()
        async function payroll_list_data() {
        try{
          console.log(from_date)
          console.log(end_date)
          console.log(payroll_month)
          console.log(payroll_year)
          let pool = await sql.connect(config);
           let payroll_query =await pool.request().query(`EXEC payroll_emp_salary '${from_date}','${end_date}','${payroll_month}','${payroll_year}'`);
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



//Pay Roll Delete
router.post('/payroll/delete',(req,res)=>{
  //console.log(req.body.month);
  //console.log(req.body.year);
  async function payroll_delete(){
    try{
      let pool = await sql.connect(config);
      //await pool.request().query(`delete from payroll_employee_salary_master where payroll_month =${req.body.month} and payroll_year =${req.body.year}`);
      await pool.request().query(`EXEC delete_payroll ${req.body.month},${req.body.year}`);
    }
    catch(error) {
      console.log(error);
    }
  }
  payroll_delete();
  res.send("Pay Roll");
});



module.exports = { payrollnew:router}