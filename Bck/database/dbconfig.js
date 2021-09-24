const config = {
    server:'192.168.200.90',
    user:'sa',
    password:'Mykeyin@123',
    port :1433,
    database:'CLMS',
    options:{
        encrypt:true,
        trustedConnection:true,
        enableArithPort:true,
        enableArithAbort: true,
        instancename:'VRIDDHI-SERVER'

    }
    
}

module.exports = config;
