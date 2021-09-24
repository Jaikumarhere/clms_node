var config = require('../database/dbconfig');
var sql = require ('mssql');


async function getpayrollValues(){
    try{
        let pool = await sql.connect(config);
        let payroll = await pool.request().query("select EMPCODE,Employee_Name,COUNT(EMPCODE) as work_Days,PO_NUM,CCODE,CNAME from employee_attendance_jan  where Shift_date>'2020-12-31' group by EMPCODE,Employee_Name,PO_NUM,PO_NUM,CCODE,CNAME");
        return payroll.recordsets;
    }
    catch(error){
        console.log(error);
    }
}
//contractor List fetch query
async function payroll_contract_data (){
    try{
        let pool = await sql.connect(config);
        let payroll = await pool.request().query("select contractor_code,contractor_name from cpcl_contractor_master where contractor_code in  (select CCODE from cpcl_work_order_master group by CCODE) and status='1' order by contractor_name");
        return payroll.recordsets;
    }
    catch(error){
        console.log(error);
    }
}
//month and year list fetch query
async function get_month_data (){
    try{
        let pool = await sql.connect(config);
        let payroll = await pool.request().query("select month as MONTH, year as YEAR from payroll_master order by month desc");
        return payroll.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

//month and year list fetch query
async function get_payroll_month (){
    try{
        let pool = await sql.connect(config);
        let payroll = await pool.request().query("select top 1 id,month,year,flag  from payroll_master where flag ='2'");
        return payroll.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

//close payroll month query
async function get_payroll_close (){
    try{
        let pool = await sql.connect(config);
        let payroll = await pool.request().query(" select id,month,year,flag  from payroll_master where flag ='2' ");
        return payroll.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {  
    getpayrollValues,
    payroll_contract_data,
    get_month_data,
    get_payroll_month,
    get_payroll_close
 }