var config = require("../database/dbconfig");
var sql = require("mssql");

exports.login_check = (req, res) => {
var sess = req.session;
if (req.method == "POST") {
var post = req.body;
var name = post.Username;
var pass = post.Password;

usernamepromise = () => {
    return new Promise((resolve, reject) => {
    // connect to your database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();

        request.input("inputField1", sql.VarChar, name);

        // query to the database and get the records
        request.query(
        "select user_id,role_id,full_name,password from user_master where role_id in (1,2) and user_name = @inputField1 and status=1",
        function (err, recordset) {
            if (err) {
            return reject(err);
            }
            // send records as a response
            return resolve(recordset);
        }
        );
    });
    });
};

async function sequentialQueries() {
    const result = await usernamepromise();
    if (result["recordset"].length > 0) {
    if (pass == result["recordset"][0].password) {
        req.session.userId = result["recordset"][0].user_id;
        req.session.user_name = result["recordset"][0].full_name;
        req.session.cont_code = "CON-001";
        //console.log(req.session.userId+req.session.user_name)
        res.redirect("/home");
    } else {
        message = "Incorrect Password...";
        res.render("login", { message: message });
    }
    } else {
    message = "Incorrect Username...";
    res.render("login", { message: message });
    }
}

sequentialQueries();
}
};

exports.main_page = function (req, res) {
var user_Id = req.session.userId;
var user_name = req.session.user_name;
var con_code = req.session.cont_code;
if (user_Id == null) {
message = "Wrong Credentials.";
res.render("login", { message: message });
return;
} else {
res.render("home", {
    user_Id: user_Id,
    user_name: user_name,
    con_code: con_code,
});
}
};
