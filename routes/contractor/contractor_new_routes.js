const express = require("express");
const router = express.Router();
var config = require("../../database/dbconfig");
var sql = require("mssql");

var dboperations = require("../../database/contractor/cpcl_contractor_table");

//Contractor View
router.get("/contractornew", (req, res, next) => {
  var user_Id = req.session.userId,
    user_name = req.session.user_name;
  if (user_Id == null) {
    message = "Wrong Credentials.";
    res.render("login.ejs", { message: message });
    return;
  } 
  
  else {


    dboperations.contractor_data().then((result) => {
      var data = result[0];
      console.table(data);

      

      var netflix = "VMAS001";
      async function getcontractor() {
        try {
          let pool = await sql.connect(config);
          let avilablecount = await pool
            .request()
            .query(
              `SELECT top 1 substring(contractor_code,3,6)as ccode from new_contractor_master order by id desc `
            );

          return avilablecount.recordsets;
        } catch (error) {
          console.log(err);
        }
      }
      // cccode = [];
      getcontractor().then((result) => {
        var contractor = result[0];
        let ccodes = contractor[0].ccode;
        let ccode = ++ccodes;
        var char = "CT";
        console.log(char);
        console.log(ccode);
        res.render("contractor_master/contractornew", {
          user_Id: user_Id,
          user_name: user_name,
          data,
          ccode,
          char,
        });
      });
    });
  }
  
});

module.exports = {
  contractor_new_page: router,
};
