var config = require('./dbconfig');

var sql = require('mssql');

async function getDeductionDetails(){
    try{
    let pool = await sql.connect(config);
    let product = await pool.request().query("select * from payroll_salary_deduction order by id desc");
    return product.recordsets;
    }
    catch(error){
    console.log(error);
    }
}

async function getEmployeeDetails(){
    try{
    let pool = await sql.connect(config);
    let product = await pool.request().query("select * from cpcl_employee_master order by id desc");
        return product.recordsets;
    }
    catch(error){
    console.log(error);
    }
}



module.exports ={     getDeductionDetails,getEmployeeDetails }
