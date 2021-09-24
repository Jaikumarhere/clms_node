 var config = require('../dbconfig');
var sql = require ('mssql');

async function get_workOrder(){
    try{
            let pool = await sql.connect(config);

            /* let product = await pool.request().query("select wom.id,wom.CCODE,WORK_ORDER,WO_FROM_DATE,WO_TO_DATE,CDURATION,a.licence_no as alicence,a.period_from as afrom,a.period_to as ato,a.workmen as awman,b.licence_no as blicence,b.period_from as bfrom,b.period_to as bto,b.workmen as bwam,WORKMEN_TOT,CNAME,VENDOR_NO,CVALUE,DURATION,EIC_PRNO,EIC,JOB_DESC,DEPARTMENT,EMPLOYEE_COUNT,CLRA,ISMW,EXCESS_CLRA_COUNT,EXCESS_CLRA_CONT_COUNT,STATUS from cpcl_work_order_master wom left join clra a on wom.WORK_ORDER=a.workorder_no left join ismw b on wom.WORK_ORDER=b.workorder_no"); */

            let product = await pool.request().query("SELECT * FROM cpcl_work_order_master_table_format");
            return product.recordsets;

    }
    catch(error){
        console.log(error);
    }
}

async function get_contractor_code(){
    try{
            let pool = await sql.connect(config);
            let product = await pool.request().query("select contractor_code ,CONCAT(contractor_code,'-',contractor_name) as CODE_NAME from [cpcl_contractor_master]where status='1' order by id asc");
            return product.recordsets;
    }
    catch(error){
        console.log(error);
    }
} 

async function get_engineer_incharge_code(){
    try{
            let pool = await sql.connect(config);
            let product = await pool.request().query(" select EIC_PRNO from cpcl_engineer_master where status='1' ");
            return product.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

module.exports ={ 
    get_workOrder,
    get_contractor_code,
    get_engineer_incharge_code

}