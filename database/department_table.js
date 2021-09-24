var config = require('./dbconfig');

var sql = require('mssql');


async function getDeptvalues(){
    try{
            let pool = await sql.connect(config);
            let products = await pool.request().query("select * from cpcl_department_master");
            return products.recordsets;
    }
    catch(error){
        console.log(error);
    }
}





module.exports = {
    getDeptvalues
}

