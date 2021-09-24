var dboperations = require('../../database/attendance/attendance_in_out_table');
var cont = require('../../database/contractor/employee_master_table');
const express = require('express');
const router = express.Router();

var config = require('../../database/dbconfig');
var sql = require('mssql');
const { response } = require('express');


 



router.get('/a_in_out',(req, res)=>{
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
          res.render('attendance/attendance_in_out',condetails);
  })
    }
});
  
  
router.post('/contractor_attendance',(req,res)=>{
  
  var data                    = req.body;
  //console.log(data);
  var ccodeName               = req.body.contractor_code.split("-",1);
  var ccode                   = ccodeName[0];
 
  var from_date               = req.body.from_date;
  var to_date                 = req.body.to_date;

  async function getwork() {
    console.log(1)
    try{
        let pool = await sql.connect(config);
       
          let employee_attendance = await pool.request().query( `select id ,CCODE ,CNAME ,EMPCODE ,IDCARDNO ,Employee_Name ,
          format(Shift_date,'dd-MM-yyyy')as Shift_date,[Shift] ,[IN] ,Out ,Gate ,PO_NUM ,Status from Employee_Daily_Attendance 
          where CCODE='${ccode}' and Shift_date between '${from_date}' and '${to_date}' 
          order by Employee_Name,Shift_date,EMPCODE,PO_NUM`);
          return employee_attendance.recordsets;
      }
    catch(error) {
        console.log(error)
    }
}
async function all() {
  console.log('all')
  try{
      let pool = await sql.connect(config);
        let all_attendacne = await pool.request().query( `select id ,CCODE ,CNAME ,EMPCODE ,IDCARDNO ,Employee_Name ,
        format(Shift_date,'dd-MM-yyyy')as Shift_date,[Shift] ,[IN] ,Out ,Gate ,PO_NUM ,Status from Employee_Daily_Attendance 
        where Shift_date between '${from_date}' and '${to_date}' 
        order by EMPCODE,Employee_Name,PO_NUM`);
        return all_attendacne.recordsets;
    }
  catch(error) {
      console.log(error)
  }
}
getwork().then(result=>{
  var attendance_details = result[0];
 console.log(attendance_details);
      if(attendance_details.length==0){        
        all().then(result=>{
            var AllAttendance = result[0];
            res.send(AllAttendance); 
        }) 
      }else{
          //var attendance_details = result[0];
          res.send(attendance_details);
      }
}) 
});

//attendance Delete
router.post('/attendance/delete',(req,res)=>{
  
  var ccodeName               = req.body.contractor_code.split("-",1);
  var ccode                   = ccodeName[0];
 
  var from_date               = req.body.from_date;
  var to_date                 = req.body.to_date;

  async function att_delete(){
    try{
      let pool = await sql.connect(config);
      //await pool.request().query(`delete from payroll_employee_salary_master where payroll_month =${req.body.month} and payroll_year =${req.body.year}`);
      await pool.request().query(`EXEC attendacance_payroll ${req.body.ccode},${req.body.from_date},${req.body.to_date}`);
    }
    catch(error) {
      console.log(error);
    }
  }
  att_delete();
  res.send("Attendacne Deleted");
});



module.exports = { attendanceinout : router}