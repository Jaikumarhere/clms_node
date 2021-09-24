var config = require('../dbconfig');
var sql = require ('mssql');


async function attendanceReport() {
    try{
        let pool = await sql.connect(config);
        let attendanceData = await pool.request().query(`select contractor_code ,CONCAT(contractor_code,'-',contractor_name) as 
        CODE_NAME from cpcl_contractor_master where  status='1' and  contractor_name in 
        (select CNAME from cpcl_work_order_master group by CNAME)  order by contractor_name`);
        /*select CCODE ,CONCAT(CCODE,'-',CNAME) as 
        CODE_NAME from Cpcl_Contract_Master where CNAME in 
        (select CNAME from cpcl_work_order_master group by CNAME) order by CNAME*/

        return attendanceData.recordsets;
    }catch(err){
        console.log(err)
    }
}


module.exports = { attendanceReport }
