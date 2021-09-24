const express = require('express');
const router = express.Router();
var dboperations = require('../../database/contractor/employee_master_table');


var config = require('../../database/dbconfig');
var sql = require('mssql');


// Employee View
employee = {};
router.get('/changerequestlist',(req,res)=>{
	 var user_Id = req.session.userId, user_name = req.session.user_name;
	  if(user_Id == null)
    {
		message = 'Wrong Credentials.';
        res.render('login.ejs',{message: message});
		return;
    }
    else{
		dboperations.get_employee_master().then(result=>{
            employee.user_Id = user_Id;
            employee.user_name = user_name;
            var data = result[0]; 
            employee.view = data;
            res.render('contractor_master/changerequestlist',employee);
    })
    } 
}); 


//Employee Edit View
router.get('/changereq_Edit/:empid',(req, res) => {
    var user_Id = req.session.userId, user_name = req.session.user_name;
    var emp_id = req.params.empid;
    //console.log(emp_id);
    async function employeeupdate(){
        try{
                let pool = await sql.connect(config);
                let products = await pool.request().query(`select * from cpcl_employee_master where id = ${emp_id}`); 
                return products.recordsets;
            }
        catch(error){
            console.log(error);
        }
    }   

    employeeupdate().then(result=>{
        var Emp_edit_data = result[0];
        res.render('contractor_master/changereq_edit',{user_Id:user_Id,user_name:user_name,Emp_edit_data:Emp_edit_data});
       
    }) 
});

//Employee update process
router.post('/changereq/update',(req, res) => {
    var data = req.body;
    //console.table(data);
    //Date
    var date = new Date();
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
    //console.log(dateString);
    async function employeeupdate(){
        var check_type=req.body.check_type;
        //console.log(check_type);
        var requertvalue =check_type.toString();
        //console.log(requertvalue);
        try{
            let pool = await sql.connect(config);
            await pool.request().query(`update cpcl_employee_master SET 
            DESIGNATION             =   '${req.body.designation}',
            EXISTING_DESIGNATION    =   '${req.body.old_designation}',
            WROK_SPOT               =   '${req.body.Work_spot}',
            EXT_WROK_SPOT           =   '${req.body.old_Work_spot}',
            AREA_OF_WORK            =   '${req.body.Area_of_work}',
            EXT_AREA_OF_WORK        =   '${req.body.old_Area_of_work}',
            area_of_place           =   '${req.body.area_of_place}', 
            ext_area_of_place       =   '${req.body.AREAOFPLACE}', 
            request_type            =   '${requertvalue}', 
            change_request_status   =   'REQUEST', 
            MODIFIED_ON             =   '${dateString}'  
            where id ='${req.body.id}'`); 
        }
        catch(error){
            console.log(error);
        }
        //console.log("Employee Updated Successfully");
    } 

    employeeupdate();
     res.redirect('/changerequestlist'); 
});





module.exports = { changereq:router }