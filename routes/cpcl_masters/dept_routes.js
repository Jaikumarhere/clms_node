var dboperations = require('../../database/department_table');
const express = require('express');
const router = express.Router();

var config = require('../../database/dbconfig');
var sql = require('mssql');


 
//department table view query
router.get('/department',(req, res)=>{
	 var user_Id = req.session.userId, user_name = req.session.user_name;
	  if(user_Id == null)
    {
		message = 'Wrong Credentials.';
        res.render('login.ejs',{message: message});
		return;
    }
    else
	{
		dboperations.getDeptvalues().then(result =>{                
		var data = result[0];
		res.render('menu_master/department',{user_Id:user_Id,user_name:user_name,data:data});
		})
    } 
    
});

//New Enginner Creation process
router.post('/department/new',(req,res)=>{
    
   
	var department = req.body.department;
	
	var username = req.body.username;
    var password = req.body.password;
	var status = req.body.status;

	
    async function getDeptvalues(){
        try{
            let pool = await sql.connect(config);
             await pool.request().query("insert into cpcl_department_master (department,user_name,password,status,created_by,created_on) values ('"+department+"','"+username+"','"+password+"','"+status+"','1',GETDATE())",(req,res)=>{
                 console.log("successfully inserted");
             });
        }
        catch(error){
            console.log(error);
        }
    }
    getDeptvalues();
	res.redirect("/department");
	 
});

//department  data edit page   
router.get('/department_edit/:departmentId',(req, res) => {

    const departmentId = req.params.departmentId;

    async function Engineupdate(){
        try{
                let pool = await sql.connect(config);
                let products = await pool.request().query(`select * from cpcl_department_master where id = ${departmentId}`); 
                return products.recordsets;
            }
        catch(error){
            console.log(error);
        }
    }   

    var user_Id = req.session.userId, user_name = req.session.user_name;

    Engineupdate().then(result=>{
        var department_edit_data = result[0];
        res.render('menu_master/departmentedit',{user_Id:user_Id,user_name:user_name,department_edit_data:department_edit_data});
    })


});

//department update process
router.post('/deptupdate',(req, res) => {
    var data = req.body;
    console.table(data);

    async function depatupdate(){
        try{
            let pool = await sql.connect(config);
            let products = await pool.request().query(`update cpcl_department_master SET department='${req.body.department}',user_name='${req.body.username}',password='${req.body.password}',status ='${req.body.status}',created_by= 1,created_on= GETDATE() where id ='${req.body.id}'`); 
            //console.log("update cpcl_department_master SET department='${req.body.department}',user_name='${req.body.username}',password='${req.body.password}',status ='${req.body.status}','1',GETDATE() where id ='${req.body.id}'");

            return products.recordsets;
        }
        catch(error){
            console.log(error);
        }
        console.log("department Updated Successfully");
    } 

    depatupdate();

    res.redirect('/department');
});






module.exports = { department : router}


