const express = require('express');
const router = express.Router();
var dboperations = require('../../database/contractor/employee_master_table');


var config = require('../../database/dbconfig');
var sql = require('mssql');


//Add Employee 
router.post('/employee/transfer',(req,res,next)=>{
    var data = req.body;
   
    var CCODE = req.body.ccode;
    console.log(CCODE)
    var ECODE = req.body.ecode;
    console.log(ECODE)
	var ENAME = req.body.employee_name;
    var PRE_PO_NO = req.body.work_order_no;
    var CUR_PO_NO = req.body.transfer_to;

    var WO_CCODE     = req.body.transfer_ccode;
    var WO_CNAME     = req.body.transfer_cname;
    //var WO_DATE      = req.body.work_order_todate;
    var WO_FROM_DATE = req.body.old_wo_from;
    var WO_TO_DATE   = req.body.old_wo_to;
    
    //console.log(data);
    async function getOldEmpDetails() {
        try{
            let pool = await sql.connect(config);
            let pcode = await pool.request().query(`select * from cpcl_employee_master where CCODE ='${CCODE}' and NEW_CODE='${ECODE}'`);
            return pcode.recordsets;
        }
        catch(error) {
            console.log(error)
        }
    }


    async function getPrefixCode() {
        try{
            let pool = await sql.connect(config);
            let pcode = await pool.request().query(`select prefix_code from cpcl_contractor_master where contractor_code ='${req.body.transfer_ccode}'`);
            return pcode.recordsets;
        }
        catch(error) {
            console.log(error)
        }
    }

    async function getEmpCodeCount() {
        try {
            let pool = await sql.connect(config);
            let avilablecount = await pool.request().query(`SELECT FORMAT(emp_count, '0000') as availableCount from (SELECT count(CCODE) as emp_count FROM cpcl_employee_master 
			where CCODE = '${req.body.transfer_ccode}')a`);
            return avilablecount.recordsets;
        } catch(error) {
            console.log(err);
        }
    }
    async function getEmpPrefixCodeCount() {
        try{
            let pool = await sql.connect(config);
            let pcode = await pool.request().query(`Select NEW_CODE from cpcl_employee_master where CCODE ='${req.body.transfer_ccode}' order by NEW_CODE desc`);
            return pcode.recordsets;
        }
        catch(error) {
            console.log(error)
        }
    }
    // get new idcard no 
    async function getCardCount() {
        try {
            let pool = await sql.connect(config);
            let avilablecount = await pool.request().query(`select max(ECODE)+1 as card_count from  cpcl_employee_master`);
            return avilablecount.recordsets;
        } catch(error) {
            console.log(err);
        }
    }
    getCardCount().then(result=>{
        var card_count = result[0];
        var newcardno  = card_count[0].card_count;
        console.log(newcardno);
    getEmpPrefixCodeCount().then(result=>{
        var newempdetails = result[0];
        var oldcode = newempdetails[0].NEW_CODE;
        console.log(oldcode);
        var num = oldcode.match(/\d+/g);
        var value = ++num[0];
    
       var  lennum = value.toString().length;
       if(lennum =='1'){
           var emcode='000'+value; 
       }else if(lennum =='2'){
           var emcode='00'+value;
       }else if(lennum =='3'){
           var emcode='0'+value;
        }
        //console.log(emcode)
        
     
    getPrefixCode().then(result=>{
        var preficcode = result[0];
        
       var npreficcode = preficcode[0].prefix_code;
       var transECode = npreficcode +emcode;
       
    //getEmpCodeCount().then(result=>{
       // var count = result[0];
       // var ncount = count[0].availableCount;
       //console.log(ncount)
        //var transECode = npreficcode +emcode;
       // console.log(transECode);
  
       getOldEmpDetails().then(result=>{
        var oldempdetails = result[0];
       
        //console.log(oldempdetails)
        /*var ccodeName               = req.body.ccode.split("-",1);
        var ccode                   = ccodeName[0];*/
        //var ccode                   = oldempdetails[0].CCODE;
        var emp_name                = oldempdetails[0].ENAME;
        //var work_order_no           = oldempdetails[0].WORK_ORDER_No;
        var workorder_date          = oldempdetails[0].WORK_OR_DATE;
        var card_number             = oldempdetails[0].ECODE;
        var old_emp_number          = oldempdetails[0].PRE_CODE;
        var emp_code                = oldempdetails[0].NEW_CODE;
        //var wo_val_from             = oldempdetails[0].WO_FROM;
        //var wo_val_to               = oldempdetails[0].WO_TO;
        //var ci_name                 = req.body.ci_name;
        var Father                  = oldempdetails[0].FATHER;
        //var Husband               = req.body.Husband;
        var designation             = oldempdetails[0].DESIGNATION;
        var dob                     = oldempdetails[0].DOB;
        var Engaged_Date            = oldempdetails[0].ENGAGED_DATE;
        var gender                  = oldempdetails[0].GENDER;
        var mstatus                 = oldempdetails[0].MARITAL_STATUS;
        var Present_address         = oldempdetails[0].PRE_ADDRESS;
        var permanent_address       = oldempdetails[0].PERMANENT_ADDRESS;
        var phone_no                = oldempdetails[0].PHONE_NO;
        var email_id                = oldempdetails[0].EMAIL_ID;
       // var emergency             = req.body.emergency;
        var Emergency_Mobile_Number = oldempdetails[0].MOBILE_NO;
        var nominee_name            = oldempdetails[0].NOMINEE_NAME;
        var nominee_relation        = oldempdetails[0].NOMINEE_RELATION;
        var nominee_dob             = oldempdetails[0].NOMINEE_DOB;
        var category                = oldempdetails[0].Catogery;
        var wage_per_day            = oldempdetails[0].WAGE;
        var Incentive_per_day       = oldempdetails[0].INCENTIVE;
        var Allowance_per_day       = oldempdetails[0].ALLOWANCE;
        var Any_other_wages         = oldempdetails[0].OTHERS;
        var uan                     = oldempdetails[0].UAN;
        var ESI_no                  = oldempdetails[0].ESI;
        var Aadhar_card_no          = oldempdetails[0].AADHAR;
        var Identical_mark1         = oldempdetails[0].IDENTY_MARK;
        var Bank_name               = oldempdetails[0].BANK_NAME;
        var Account_no              = oldempdetails[0].ACCOUNT_NO;
        var ifsc_code               = oldempdetails[0].ifsc_code;
        var Blood_grp               = oldempdetails[0].BLOOD_GROUP;
        var Entry_gate              = oldempdetails[0].ENTRY_GATE;
        var Work_spot               = oldempdetails[0].WROK_SPOT;
        var Area_of_work            = oldempdetails[0].AREA_OF_WORK;
        var area_of_place           = oldempdetails[0].area_of_place;
        var pass_val_from           = oldempdetails[0].PASS_VALID_FROM;
        var pass_val_to             = oldempdetails[0].PASS_VALID_TO;
        var safety_training_from    = oldempdetails[0].SAFETY_TRAINING_FROM;
        var safety_training_to      = oldempdetails[0].SAFETY_TRAINING_TO;
        var payroll                 = oldempdetails[0].payroll;
        var esi_eligible            = oldempdetails[0].esi_eligible;
        var pf_eligible             = oldempdetails[0].pf_eligible;
        var state                   = oldempdetails[0].STATE;
        var status                  = oldempdetails[0].STATUS;
        

        var date = new Date();
        var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("T")[0];
        //console.log(dateString);
        console.log(CCODE)
        console.log(ENAME)
        console.log(emp_code)
        console.log(card_number)
        console.log(newcardno)
        console.log(PRE_PO_NO)
        console.log(WO_FROM_DATE)
        console.log(WO_TO_DATE)

   async function getTransferValues(){
    try{
        let pool = await sql.connect(config);
        await pool.request().query(`insert into cpcl_transfer_detail ([DATE],CCODE,ENAME,EMP_CODE,PRE_ECODE,NEW_ECODE,PRE_PO_NO, CUR_PO_NO,FROM_DATE,TO_DATE, STATUS,CREATED_BY,CREATED_ON) 
        values (GETDATE(),'${CCODE}','${ENAME}','${emp_code}','${card_number}','${newcardno}','${PRE_PO_NO}','${CUR_PO_NO}','${WO_FROM_DATE}','${WO_TO_DATE}','2','1','${dateString}')`,function(err,result){
        if (err) throw err;
        console.log(result);
        });
        }

        catch(error){
        console.log(error);
        }
       //inserting tranfer Employee details details
        try{
            let pool = await sql.connect(config);
             await pool.request().query(`insert into cpcl_employee_master (CCODE,ENAME,WORK_ORDER_No,WORK_OR_DATE,NEW_CODE,PRE_CODE,ECODE,
                WO_FROM,WO_TO,FATHER,DESIGNATION,DOB,ENGAGED_DATE,GENDER,MARITAL_STATUS,PRE_ADDRESS,PERMANENT_ADDRESS,PHONE_NO,
                EMAIL_ID,MOBILE_NO,NOMINEE_NAME,NOMINEE_RELATION,NOMINEE_DOB,Catogery,WAGE,INCENTIVE,ALLOWANCE,OTHERS,UAN,ESI,
                AADHAR,IDENTY_MARK,BANK_NAME,ACCOUNT_NO,ifsc_code,BLOOD_GROUP,ENTRY_GATE,WROK_SPOT,AREA_OF_WORK,area_of_place,
                PASS_VALID_FROM,PASS_VALID_TO,SAFETY_TRAINING_FROM,SAFETY_TRAINING_TO,payroll,esi_eligible,pf_eligible,STATE,STATUS,CREATED_ON) 

                values ('${WO_CCODE}','${emp_name}','${CUR_PO_NO}','${workorder_date}','${transECode}','${old_emp_number}',
                '${newcardno}','${WO_FROM_DATE}','${WO_TO_DATE}','${Father}','${designation}','${dob}',
                '${Engaged_Date}','${gender}','${mstatus}','${Present_address}','${permanent_address}','${phone_no}',
                '${email_id}','${Emergency_Mobile_Number}','${nominee_name}','${nominee_relation}','${nominee_dob}','${category}',
                '${wage_per_day}','${Incentive_per_day}','${Allowance_per_day}','${Any_other_wages}',
                '${uan}','${ESI_no}','${Aadhar_card_no}','${Identical_mark1}','${Bank_name}','${Account_no}','${ifsc_code}',
                '${Blood_grp}','${Entry_gate}','${Work_spot}','${Area_of_work}','${area_of_place}','${pass_val_from}',
                '${pass_val_to}','${safety_training_from}','${safety_training_to}','${payroll}','${esi_eligible}','${pf_eligible}',
                '${state}','${status}','${dateString}')`,function(err,result){
                 //console.log("Employee successfully inserted");
                 if (err) throw err;
                 //console.log(result);
                 });
        }
        catch(error){
            console.log(error);
        }



        //Updating  tranfer Employee details status only
        try{
            let pool = await sql.connect(config);
            await pool.request().query(`update cpcl_employee_master set STATUS ='2' WHERE NEW_CODE ='${ECODE}'`,function(err,result){
                if (err) throw err;
                //console.log(result);
                });
            }
    
            catch(error){
            console.log(error);
            }



        /*try{
            let pool = await sql.connect(config);
            await pool.request().query(`update cpcl_employee_master set CCODE ='${CCODE}',ENAME ='${ENAME}',NEW_CODE ='${transECode}',WO_FROM='${WO_FROM_DATE}',WO_TO=GETDATE(), WORK_ORDER_No='${CUR_PO_NO}' WHERE NEW_CODE ='${ECODE}'`,function(err,result){
                if (err) throw err;
                //console.log(result);
                });
            }
    
            catch(error){
            console.log(error);
            }*/

    }
    getTransferValues();
//});
});
});
});
});
    res.redirect("/employeetransfernew");
});


// transfer View
transfer = {};
router.get('/employeetransfernew',(req,res,next)=>{
	 var user_Id = req.session.userId, user_name = req.session.user_name;
	  if(user_Id == null)
    {
		message = 'Wrong Credentials.';
        res.render('login.ejs',{message: message});
		return;
    }
    else{
		dboperations.get_employee_transfer_master().then(result=>{
            transfer.user_Id = user_Id;
            transfer.user_name = user_name;
            var data = result[0]; 
            transfer.view = data;
            res.render('contractor_master/employeetransfernew',transfer);
    })
    } 
}); 

wodetails = {};
  router.get('/employee/employee_transfer',(req,res)=>{
    var user_Id = req.session.userId, user_name = req.session.user_name;
    //console.log(ecode);
    if(user_Id == null)
  {
      message = 'Wrong Credentials.';
      res.render('login.ejs',{message: message});
      return;
  }
  else{

    dboperations.get_work_order_no().then(result=>{
        wodetails.user_Id = user_Id;
        wodetails.user_name = user_name;
        var woDetailsCode = result[0]; 
        wodetails.woDetailsCode = woDetailsCode;
       // console.table(wodetails);
        res.render('contractor_master/employee_transfer',wodetails);
    })
  
  } 

})


//Get Employee Name and WO Number
router.post('/employee_transfer/employee/onchange',(req,res)=>{
    //console.log("test");
    var ecode = req.body.ecode;
    //console.log(ecode);
    async function get_employee_code() {
        try{
            let pool = await sql.connect(config);
            let cont = await pool.request().query( `select CCODE,ECODE,ENAME,WORK_ORDER_No from cpcl_employee_master where NEW_CODE = '${ecode}'`);
            return cont.recordsets;
        }
        catch(error) {
            console.log(error)
        }
    }
    get_employee_code().then(result=>{
        var EmpCodeDetails = result[0];
        //console.log(EmpCodeDetails);
        res.send(EmpCodeDetails);
    })
})

// Get CCODE,CNAME,WO_FROM_DATE,WO_TO_DATE
router.post('/employee/check_workorder_details/onchange',(req,res)=>{
    var WONO = req.body.WONO;
    //console.log(WONO);
    async function check_new_po_code_details() {
        try{
            let pool = await sql.connect(config);
            let cont = await pool.request().query(`select CCODE,CNAME,WO_FROM_DATE,WO_TO_DATE from cpcl_work_order_master where WORK_ORDER = '${WONO}'`);
           
            return cont.recordsets;

        }
        catch(error) {
            console.log(error)
        }
    }
    check_new_po_code_details().then(result=>{

        var checkWODetails = result[0];
       // console.log(checkWODetails);
        res.send(checkWODetails); 
    })
}) 

module.exports = { transfer:router }