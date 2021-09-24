var config = require('../dbconfig');
var sql = require ('mssql');

async function get_employee_master(){
    try{
    let pool = await sql.connect(config);
    let product = await pool.request().query("SELECT top 100 * FROM cpcl_employee_master where status!=''");
    return product.recordsets;
    }
    catch(error){
    console.log(error);
    }
}
async function get_employee_transfer_master(){
    try{
    let pool = await sql.connect(config);
    let product = await pool.request().query("SELECT * FROM cpcl_transfer_detail WHERE STATUS='2'");
    return product.recordsets;
    }
    catch(error){
    console.log(error);
    }
}


async function get_contractor_code(){
    try{
    let pool = await sql.connect(config);
    let product = await pool.request().query("select contractor_code ,CONCAT(contractor_code,'-',contractor_name) as CODE_NAME from [cpcl_contractor_master] where status='1' order by id asc");
    return product.recordsets;
    }
    catch(error){
    console.log(error);
    }
}
async function get_work_order_no(){
    try{
    let pool = await sql.connect(config);
    let product = await pool.request().query("select * from cpcl_work_order_master where WO_TO_DATE>=getdate()");
    return product.recordsets;
    }
    catch(error){
    console.log(error);
    }
}



module.exports ={ 
    get_employee_master,
    get_contractor_code,
    get_work_order_no,
    get_employee_transfer_master
 }