const express = require('express');
const router = express.Router();
var config = require('../../database/dbconfig');
var sql = require('mssql');

var dboperations = require('../../database/contractor/cpcl_contractor_table');


//new contractor create

router.post('/contractor/newcontractor',(req,res,next)=>{
    console.log('hi');
    console.log(req.body);
    
    var date = new Date();


    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
    .toISOString()
    .split("T")[0];
    var contractor_code=req.body.Contractor_Code;
    var contractor_name=req.body.Contractor_Name;
    var prefix_code=req.body.prefix_code;
    var email=req.body.email;
    var status=0;
    var username=contractor_code;
    var password="12345";
    async function insertnewcontractor(){
        try{
            let pool=await sql.connect(config);
            await pool.request().query(`insert into new_contractor_master (contractor_code ,contractor_name,prefix_code,email,
                status,created_on,user_name,password)
            values('${contractor_code}','${contractor_name}','${prefix_code}','${email}','${status}','${dateString}','${contractor_code}','${password}')`,(req,res)=>{
    
            console.log("successfully inserted");
            })
        }
    catch(error)
    {
        console.log(error);
    }
       }
       insertnewcontractor();
       res.redirect("/contractornew");

      
    
})

//Contractor Insert
router.post('/contractor/new',(req,res,next)=>{

   var contractor_code      =   req.body.Contractor_Code;
   var prefix_code          =   req.body.Prefix_Code;
   //var contractor_code = prefix_code +- contractor_no;
   //console.log(contractor_code);
   var contractor_name      =   req.body.Contractor_Name;
   var address              =   req.body.Address;
   var proprietor           =   req.body.proprietor;
   var owner                =   req.body.owner;
   var name                 =   req.body.name;
   var partner              =   req.body.partner;
   var contractor_mail      =   req.body.Contractor_Email;
   var ESI_Code_No          =   req.body.ESI_Code_No;
   var PF_Code_No           =   req.body.PF_Code_No;
   var Contractor_PAN_No    =   req.body.Contractor_PAN_No;
   var Contractor_LIN       =   req.body.Contractor_LIN;
   var Mobile_No            =   req.body.Mobile_No;
   var Name_of_person       =   req.body.Name_of_person;
   var compliance_Mail_id   =   req.body.compliance_Mail_id;
   var hr_department        =   req.body.hr_department;
   var status               =   req.body.status;
   var username             =   req.body.username;
   var password             =   req.body.Password;
   var Principle_wo_no      =   req.body.Principle_wo_no;

  //Date
  var date = new Date();
  var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
  .toISOString()
  .split("T")[0];

   async function insertcontractor(){
    try{
        let pool=await sql.connect(config);
        pool.request().query(`insert into cpcl_contractor_master (contractor_code ,contractor_name, address,prefix_code,proprietor,
            name,contractor_mail,ESI_Code_No,PF_Code_No,Contractor_PAN_No,Contractor_LIN,Mobile_No,Name_of_person,compliance_Mail_id,
            status,created_on,user_name,password)
        values('${contractor_code}','${contractor_name}','${address}','${prefix_code}','${proprietor}','${name}',
        '${contractor_mail}','${ESI_Code_No}','${PF_Code_No}','${Contractor_PAN_No}','${Contractor_LIN}','${Mobile_No}',
        '${Name_of_person}','${compliance_Mail_id}','${status}','${dateString}','${username}','${password}')`,(req,res)=>{

        })
    }
    catch(error)
    {
        console.log(error);
    }
   }
   insertcontractor();
   res.redirect("/contractornew");

});

//Contractor edit
router.get('contractor_edit/:contractorid',(req,res)=>{
    const cid = res.params.contractorid;
    async function contractorupdate(){
        try{
                let pool = await sql.connect(config);
                let products = await pool.request().query(`select * from new_contractor_master where id = ${cid}`); 
                return products.recordsets;
            }
        catch(error){
            console.log(error);
        }
    }   
    var user_Id = req.session.userId, user_name = req.session.user_name;
    contractorupdate().then(result=>{
        var con_edit_data = result[0];
        res.render('contractor_master/contractoredit',{user_Id:user_Id,user_name:user_name,con_edit_data:con_edit_data});
    })
    
});


//Edit View
router.get('/contractor_edit/:contractorid',(req, res) => {

    const cid = req.params.contractorid;

    async function contractorupdate(){
        try{
                let pool = await sql.connect(config);
                let products = await pool.request().query(`select * from new_contractor_master where id = ${cid}`); 
                return products.recordsets;
            }
        catch(error){
            console.log(error);
        }
    }    

    var user_Id = req.session.userId, user_name = req.session.user_name;

    contractorupdate().then(result=>{
        var con_edit_data = result[0];
        res.render('contractor_master/contractoredit',{user_Id:user_Id,user_name:user_name,con_edit_data:con_edit_data});
    })

});



//Contractor update process
router.post('/contractornew/update',(req, res) => {

    /* var date = new Date();
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
    .toISOString()
    .split("T")[0]; */

    async function contractornewupdate(){
        try{
            let pool = await sql.connect(config);

            await pool.request().query(`update new_contractor_master SET 
            preferntial_bidder ='${req.body.pre_bidder}',
            preference_category ='${req.body.pre_category}',
            reg_no ='${req.body.reg_number}',
            reg_address ='${req.body.reg_address}',
            partners ='${req.body.director_name}',
            city ='${req.body.city}',
            state ='${req.body.state}',
            postal_code ='${req.body.postal_code}',
            pan_no ='${req.body.pannumber}',
            tan_no ='${req.body.tan_number}',
            establish_year ='${req.body.company_year}',
            business_nature ='${req.body.business_nature}',
            legal_status ='${req.body.legal_status}',
            com_category ='${req.body.category}',
            title ='${req.body.title}',
            contact_name ='${req.body.con_name}',
            dob ='${req.body.dob}',
            email ='${req.body.email}',
            desgination ='${req.body.designation}',
            phone ='${req.body.phone}',
            mobile ='${req.body.mobile}',
            date_reg ='${req.body.reg_date}',
            dsc ='${req.body.sign_certificate}',
            dsc_Expiry ='${req.body.dsc_expiry}' where id='${req.body.id}'`);
        }
        catch(error){
            console.log(error);
        }
    } 

    contractornewupdate();

    res.redirect('/contractornew');     
});

//check Prefix code duplicate
router.post('/contractor/onchange',(req,res)=>{
    //console.log("test");
    var prefixcode = req.body.prefixcode;
    console.log(prefixcode);
    async function get_con_prefixcode() {
        try{
            let pool = await sql.connect(config);
            let cont = await pool.request().query( `select prefix_code from cpcl_contractor_master where prefix_code = '${prefixcode}'`);
            return cont.recordsets;
        }
        catch(error) {
            console.log(error)
        }
    }
    get_con_prefixcode().then(result=>{
        var prefixdetails = result[0];
        console.log(prefixdetails);
        res.send(prefixdetails);
    })
})




module.exports = { 
	contractor:router	
}