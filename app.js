const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const dbcon = require('./dbconnection/dbcon');
const bodyParser = require('body-parser');
require('dotenv/config'); 

// Get port number
const port = process.env.PORT || 9000;

//middleware 
app.use(cors());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());


//Import routes
const payrolls = require('./routes/payrolls');
const employees = require('./routes/employees');
const leave = require('./routes/leave');
const deductions = require('./routes/deductions');
const reports = require('./routes/reports');
const payslips = require('./routes/payslips');

app.use('/payrolls', payrolls);
app.use('/employees', employees);
app.use('/leave', leave);
app.use('/deductions', deductions);
app.use('/reports', reports);
app.use('/payslips', payslips);



app.get('/', function(req, res){
    res.send("Hello World");
});



//Listen to port
app.listen(port, function(){
    console.log(`Listening to port ${port}`);
});