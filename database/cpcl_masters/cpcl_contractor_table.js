var config = require('../dbconfig');

var sql = require ('mssql');


async function contractor_data(){
    try{
            let pool = await sql.connect(config);
            let products = await pool.request().query("SELECT * FROM cpcl_contractor_master ");
            return products.recordsets;
    }
    catch(error){
        console.log(error);
    }
}






module.exports = { contractor_data }