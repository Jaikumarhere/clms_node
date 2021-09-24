var dboperations = require('../../database/payroll_table');
const express = require('express');
const router = express.Router();

var config = require('../../database/dbconfig');
var sql = require('mssql');

var cont = require('../../database/contractor/employee_master_table');



router.get('/attendance',(req, res)=>{
    condetails = {}
	 var user_Id = req.session.userId, user_name = req.session.user_name;
	  if(user_Id == null)
    {
		message = 'Wrong Credentials.';
        res.render('login.ejs',{message: message});
		return;
    }
    else{
		
        cont.get_contractor_code().then(result=>{
            condetails.user_Id = user_Id;
            condetails.user_name = user_name;
            var conDetailsCode = result[0]; 
            condetails.conDetailsCode = conDetailsCode;
            //console.log(condetails);
            //res.render('attendance/attendance_in_out',condetails);
            res.render('attendance/attendance',condetails);
      })
    }
});
	
router.post('/attendance/new',(req,res,next)=>{
    var contractor   = req.body.contractor_code.split("-",1);
    var ccode       = contractor[0];
    //console.log(ccode);
    var from_date   = req.body.from_date;
    var to_date     = req.body.to_date;
    
    //console.log(contractor);
    //console.log(from_date);
    //console.log(to_date);

    async function getAllAttendanceValues(){
        try{
            let pool = await sql.connect(config);
            let a_attendance_details = await pool.request().query(`
            select name,shift_name,case when ECOUNT IS NULL then 0 else ECOUNT end as ECOUNT  from (select g.name,s.shift_name,s.from_time,s.to_time,CONVERT(VARCHAR(8), DATEADD(HOUR,+3,s.from_time), 108)

            'end_time' from cpcl_gate_master g cross join cpcl_shift_master s where s.id = 1)a 

            left join

            (select gate, count(EMPCODE) as ECOUNT from Employee_Daily_Attendance where Shift_date between

            '${from_date}' and '${to_date}' and [IN] between '06:15' and '07:30' group by gate)b on a.name=b.gate

            union

            select name,shift_name,case when ECOUNT IS NULL then 0 else ECOUNT end as ECOUNT  from (select g.name,s.shift_name,s.from_time,s.to_time,CONVERT(VARCHAR(8), DATEADD(HOUR,+3,s.from_time), 108)

            'end_time' from cpcl_gate_master g cross join cpcl_shift_master s where s.id = 2)a 

            left join

            (select gate,count(EMPCODE) as ECOUNT from Employee_Daily_Attendance where Shift_date between

            '${from_date}' and '${to_date}' and [IN] between '07:30' and '14:15' group by gate)b on a.name=b.gate

            union

            select name,shift_name,case when ECOUNT IS NULL then 0 else ECOUNT end as ECOUNT  from (select g.name,s.shift_name,s.from_time,s.to_time,CONVERT(VARCHAR(8), DATEADD(HOUR,+3,s.from_time), 108)

            'end_time' from cpcl_gate_master g cross join cpcl_shift_master s where s.id = 3)a 

            left join

            (select gate,count(EMPCODE) as ECOUNT from Employee_Daily_Attendance where Shift_date between

            '${from_date}' and '${to_date}' and [IN] between '14.15' and '22.15' group by gate)b on a.name=b.gate

            union

            select name,shift_name,case when ECOUNT IS NULL then 0 else ECOUNT end as ECOUNT  from (select g.name,s.shift_name,s.from_time,s.to_time,CONVERT(VARCHAR(8), DATEADD(HOUR,+3,s.from_time), 108)

            'end_time' from cpcl_gate_master g cross join cpcl_shift_master s where s.id = 4)a 

            left join

            (select gate,count(EMPCODE) as ECOUNT from Employee_Daily_Attendance where Shift_date between

            '${from_date}' and '${to_date}' and [IN] between '22.15' and '6.15' group by gate)b on a.name=b.gate`);
            return a_attendance_details.recordsets;
        }
        catch(error){
            console.log(error);
        }
    }
    async function getattendanceValues(){
        try{
            let pool = await sql.connect(config);
            let attendance_details = await pool.request().query(`
            select name,shift_name,case when ECOUNT IS NULL then 0 else ECOUNT end as ECOUNT  from 
                (select g.name,s.shift_name,s.from_time,s.to_time,CONVERT(VARCHAR(8), DATEADD(HOUR,+3,s.from_time), 108)

                'end_time' from cpcl_gate_master g cross join cpcl_shift_master s where s.id = 1)a 

                left join

                (select gate, count(EMPCODE) as ECOUNT from Employee_Daily_Attendance where CCODE='${ccode}' and Shift_date between

                '${from_date}' and '${to_date}' and [IN] between '06:15' and '07:30' group by gate)b on a.name=b.gate

                union

                select name,shift_name,case when ECOUNT IS NULL then 0 else ECOUNT end as ECOUNT  from (select g.name,s.shift_name,s.from_time,s.to_time,CONVERT(VARCHAR(8), DATEADD(HOUR,+3,s.from_time), 108)

                'end_time' from cpcl_gate_master g cross join cpcl_shift_master s where s.id = 2)a 

                left join

                (select gate,count(EMPCODE) as ECOUNT from Employee_Daily_Attendance where CCODE='${ccode}' and Shift_date between

                '${from_date}' and '${to_date}' and [IN] between '07:30' and '14:15' group by gate)b on a.name=b.gate

                union

                select name,shift_name,case when ECOUNT IS NULL then 0 else ECOUNT end as ECOUNT  from (select g.name,s.shift_name,s.from_time,s.to_time,CONVERT(VARCHAR(8), DATEADD(HOUR,+3,s.from_time), 108)

                'end_time' from cpcl_gate_master g cross join cpcl_shift_master s where s.id = 3)a 

                left join

                (select gate,count(EMPCODE) as ECOUNT from Employee_Daily_Attendance where CCODE='${ccode}' and Shift_date between

                '${from_date}' and '${to_date}' and [IN] between '14.15' and '22.15' group by gate)b on a.name=b.gate

                union

                select name,shift_name,case when ECOUNT IS NULL then 0 else ECOUNT end as ECOUNT  from (select g.name,s.shift_name,s.from_time,s.to_time,CONVERT(VARCHAR(8), DATEADD(HOUR,+3,s.from_time), 108)

                'end_time' from cpcl_gate_master g cross join cpcl_shift_master s where s.id = 4)a 

                left join

                (select gate,count(EMPCODE) as ECOUNT from Employee_Daily_Attendance where CCODE='${ccode}' and Shift_date between

                '${from_date}' and '${to_date}' and [IN] between '22.15' and '6.15' group by gate)b on a.name=b.gate`);
            return attendance_details.recordsets;
        }
        catch(error){
            console.log(error);
        }
    }

    if(ccode == 0){
        getAllAttendanceValues().then(result=>{
            var attAllData = result[0];
            //console.log(attAllData);
            res.send(attAllData);
        })
    }else{
        getattendanceValues().then(result=>{
            var attData = result[0];
            //console.log(attData);
            res.send(attData);
        })
    }   
});








module.exports = {

    getUserAddress: (req, res) => {
        var selecteduser = req.query.selectedId;

        let sql = "SELECT * FROM regions WHERE client_id = '" + selecteduser + "'";
        let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.send(rows);
    });


     }
}


module.exports = { attendance:router}