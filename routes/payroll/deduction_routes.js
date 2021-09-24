var dboperations = require('../../database/deduction_table');
const express = require('express');
const router = express.Router();

var config = require('../../database/dbconfig');
var sql = require('mssql');
const { request } = require('express');



deduction_data= {};

router.get('/deduction',(req, res)=>{
	var user_Id = req.session.userId, user_name = req.session.user_name;
	if(user_Id == null)
	{
		message = 'Wrong Credentials.';
		res.render('login.ejs',{message: message});
		return;
	}
  	else{

		dboperations.getDeductionDetails().then(result=>{
            deduction_data.user_Id = user_Id;
            deduction_data.user_name = user_name;
            var data = result[0]; 
            deduction_data.deduction_view = data;
			res.render('pay_roll/deduction',deduction_data);
    })

		
  }

});


Empdetails = {};
router.get('/deduction/add',(req,res)=>{
    var user_Id = req.session.userId, user_name = req.session.user_name;
    if(user_Id == null)
  {
      message = 'Wrong Credentials.';
      res.render('login.ejs',{message: message});
      return;
  }
  else{

      dboperations.getEmployeeDetails().then(result=>{
        Empdetails.user_Id = user_Id;
        Empdetails.user_name = user_name;
        var empDetailsCode = result[0]; 
		Empdetails.empDetailsCode = empDetailsCode;
          res.render('pay_roll/deduction_add',Empdetails);
  })
  } 
})




//Get Employee Name and WO Number
router.post('/employee_deduction/onchange',(req,res)=>{
    var ecode = req.body.ecode;

	//console.log(`select WORK_ORDER_No from cpcl_employee_master where ECODE = '${ecode}'`);

     async function get_employee_code() {
        try{
            let pool = await sql.connect(config);
            let cont = await pool.request().query( `select WORK_ORDER_No from cpcl_employee_master where ECODE = '${ecode}'`);
            return cont.recordsets;
        }
        catch(error) {
            console.log(error)
        }
    }
    get_employee_code().then(result=>{
        var EmpCodeDetails = result[0];
        console.log(EmpCodeDetails);
        res.send(EmpCodeDetails);
    })

})

router.post('/deduction/new',(req,res)=>{
	var payroll_month = req.body.payroll_month;
	var payroll_year = req.body.payroll_year;
	var deduction_date = req.body.deduction_date;
	var ecode = req.body.ecode;
	var work_order_no = req.body.work_order_no;
	var amount = req.body.amount;

	var emp_arr = ecode.split("-");

		 async function deduction_entry(){
			try{
				let pool = await sql.connect(config);
				let result1 = await pool.request().query(`INSERT INTO payroll_salary_deduction(payroll_month,payroll_year,date,id_card_no,name,workorder_no,advance_amount,status,created_by,created_on) VALUES ('${payroll_month}','${payroll_year}','${deduction_date}','${emp_arr[0]}','${emp_arr[1]}','${work_order_no}','${amount}',1,1,GETDATE())`)
				console.dir(result1)
			
			}
			catch(error){
				console.log(error);
			}
		}


		deduction_entry();
		res.redirect("/deduction");	
})



//deduction Edit View
router.get('/deduction_edit/:id',(req, res) => {
    var user_Id = req.session.userId, user_name = req.session.user_name;
    var deduction_id = req.params.id;

    async function deduction_edit(){
        try{
                let pool = await sql.connect(config);
                let products = await pool.request().query(`select * from payroll_salary_deduction where id = '${deduction_id}'`); 
                return products.recordsets;
            }
        catch(error){
            console.log(error);
        }
    }   

    deduction_edit().then(result=>{
        var Emp_edit_data = result[0];
        res.render('pay_roll/deduction_edit',{user_Id:user_Id,user_name:user_name,Emp_edit_data:Emp_edit_data});
       
    }) 
});



router.post('/deduction/update',(req,res)=>{
	
	var deduction_id = req.body.deduction_id;
	var payroll_month = req.body.payroll_month;
	var payroll_year = req.body.payroll_year;
	var deduction_date = req.body.deduction_date;
	var ecode = req.body.ecode;
	var amount = req.body.amount;
	var wonumber = req.body.wonumber;

	var emp_arr = ecode.split("-");

		 async function deduction_update(){
			try{
				let pool = await sql.connect(config);
				let result1 = await pool.request().query(`update payroll_salary_deduction set payroll_month='${payroll_month}',payroll_year='${payroll_year}',date='${deduction_date}',id_card_no='${emp_arr[0]}',name='${emp_arr[1]}',workorder_no='${wonumber}',advance_amount='${amount}',status=1 where id='${deduction_id}'`);
				console.dir(result1)
			
			}
			catch(error){
				console.log(error);
			}
		}


		deduction_update();
		res.redirect("/deduction");
})


router.get('/deduction_delete/:del_id',(req,res)=>{

	var del_id = req.params.del_id;

	async function delete_entry(){
		try{
			let pool = await sql.connect(config);
			let result1 = await pool.request().query(`delete from payroll_salary_deduction where id='${del_id}'`);
			console.dir(result1)
		
		}
		catch(error){
			console.log(error);
		}
	}

		delete_entry();
		res.redirect("/deduction");
})

module.exports = { deduction : router}