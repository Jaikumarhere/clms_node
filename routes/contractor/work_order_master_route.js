const { request } = require('express');
const express = require('express');
const router = express.Router();
const { reset } = require('nodemon');
var db_operations = require('../../database/contractor/work_order_table');

var sql = require("mssql");
var config = require('../../database/dbconfig');

//Initial route
router.get('/workordernew',(req,res,next)=>{
	 var user_Id = req.session.userId, user_name = req.session.user_name;
	  if(user_Id == null)
    {
		message = 'Wrong Credentials.';
        res.render('login.ejs',{message: message});
		return;
    }
    else{
		db_operations.get_workOrder().then(result=>{
            var data = result[0]; 
            res.render('contractor_master/workordernew',{user_Id:user_Id,user_name:user_name,data})
        })
    }  
});

var obj = {};

router.get('/workordernew/add', function (req, res) {
    var user_Id = req.session.userId, user_name = req.session.user_name;
	  if(user_Id == null)
    {
		message = 'Wrong Credentials.';
        res.render('login.ejs',{message: message});
		return;
    }
    else{
        db_operations.get_contractor_code().then(result=>{
            var name = "please select ccode";
            var code = result[0];
            obj.codename =  result[0];
            obj.user_Id = user_Id;
            obj.user_name = user_name;
            db_operations.get_engineer_incharge_code().then(result=>{
                obj.engcode =  result[0];
                //res.send(obj.engcode);
                res.render('contractor_master/workordernew_form',obj);
            });
        });
    } 
});


//Work_Order Insert
router.post('/workordernew/add',(req,res,next)=>{

       // console.log(req.body);

        async function getWorkOrderValues(){
            try{
                let pool = await sql.connect(config);

                let main_ccode = req.body.Contractor_Code;

                
                await pool.request().query(`insert into cpcl_work_order_master_table_format (Contractor_Code,Vendor_No,subContractor_one,subContractor_two,subContractor_three,EIC_PRNO,Engineer_In_Charge,Department,Work_order_no,Work_order_date,Contract_Duration,CLRA,ISMW,Wo_to_date,Contractor_Value,extra_workman,clra_rcno,scope,clra_rc_str,clra_lic_no,clra_period_from,clra_period_to,clra_workmen,ismw_rcno,ismw_rc_str,ismw_lic_no,ismw_period_from,ismw_period_to,ismw_workmen,Total_Workmen,STATUS,CREATED_BY)VALUES('${req.body.Contractor_Code}','${req.body.Vendor_No}','${req.body.subContractor_one}','${req.body.subContractor_two}','${req.body.subContractor_three}','${req.body.EIC_PRNO}','${req.body.Engineer_In_Charge}','${req.body.Department}','${req.body.Work_order_no}','${req.body.Work_order_date}','${req.body.Contract_Duration}','${req.body.CLRA}','${req.body.ISMW}','${req.body.Wo_to_date}','${req.body.Contractor_Value}','${req.body.extra_workman}','${req.body.clra_rcno}','${req.body.scope}','${req.body.clra_rc_str}','${req.body.clra_lic_no}','${req.body.clra_period_from}','${req.body.clra_period_to}','${req.body.clra_workmen}','${req.body.ismw_rcno}','${req.body.ismw_rc_str}','${req.body.ismw_lic_no}','${req.body.ismw_period_from}','${req.body.ismw_period_to}','${req.body.ismw_workmen}','${req.body.Total_Workmen}','1','1')`,(err,result)=>{


                        if(err) throw err;

                   
                });  
                
                console.log(sql);
            }
            catch(error){
                console.log(error);
            }
        }
       getWorkOrderValues();
       res.redirect("/workordernew")

});


//workorder edit

router.get('/work_edit/:shiftid',(req,res) => {

    const shiftId = req.params.shiftid;

    async function workOrderUpdate(){
        try{
                let pool = await sql.connect(config);
                let products = await pool.request().query(`select * from cpcl_work_order_master_table_format where id = ${shiftId}`); 
                return products.recordsets;
            }
        catch(error){
            console.log(error);
        }
    }

    console.log(workOrderUpdate());

   
    var workOrder = {};
    var user_Id = req.session.userId, user_name = req.session.user_name;
    workOrder.user_Id = user_Id;
	workOrder.user_name = user_name;


    workOrderUpdate().then(result=>{
        var work_edit_data = result[0];


        workOrder.work_edit_data = work_edit_data;

        res.render('contractor_master/workorderedit',workOrder);

       
    })
});




//WorkOrder update process
 router.post('/workordernew/update',(req, res) => {
    var data = req.body;

    console.log(data);


    // res.redirect('/workordernew'); 
});

//Work_order_no Save
router.post('/workorder_no/save',(req,res)=>{
    var wor_order_no = req.body.wo_number;
    async function check_workorder_no(){
        try
        {
           let pool = await sql.connect(config);  
           let eicnumber = await pool.request().query(`
           select WORK_ORDER from cpcl_work_order_master where WORK_ORDER = '${wor_order_no}'`); 
            return eicnumber.recordsets;   
        }
        catch(error){
            console.log(error);
        }
    }

    check_workorder_no().then(result=>{
        var check_workorder_count = result[0];
       console.log(check_workorder_count)
        res.send(check_workorder_count);
    });


})

//get eic pro number
router.post('/get/eic_name',(req,res)=>{
    async function getEicProNumber(){
        try{
                let pool = await sql.connect(config);
                let eicnumber = await pool.request().query(`select name,department from cpcl_engineer_master where EIC_PRNO = '${req.body.eicnumber}'`); 
                return eicnumber.recordsets;
            }
        catch(error){
            console.log(error);
        }
    }  
    getEicProNumber().then(result=>{
        var eicProNumber = result[0];
        //console.log(eicProNumber)
        res.send(eicProNumber);
    });
})

module.exports = { routes:router}