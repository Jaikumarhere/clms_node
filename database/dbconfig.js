const config = {
    server:'192.168.200.91',
    user:'sqladmin',
    password:'Bdevlop!@2021#',
    port :1433,
    database:'CLMS_91',
    options:{
        encrypt:true,
        trustedConnection:true,
        enableArithPort:true,
        enableArithAbort: true,
        instancename:'BSPLNEWASSETSRV\SQLEXPRESS'

    }
   
}

module.exports = config;
