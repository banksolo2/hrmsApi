const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbcon = require('../dbconnection/dbcon');
const months = require('../modules/month');

let withPay =['yes', 'no'];
//Leave with pay report
router.post('/leave/withpay', function(req, res){
    let year = req.body.year;
    let leaveType = req.body.leave_type;
    if(year == undefined){
        res.json({error : "Please provide year"});
    }
    else if(typeof(year) != 'number'){
        res.json({ error : "Please provide a numeric value for year"});
    }
    else if(leaveType == undefined){
        res.json({ error : "Please provide leave type"});
    }
    else{
        //get database connection from the pool
        dbcon.getConnection(function(err, con){
            let query = `select concat(first_name,' ',middle_name,' ',last_name,' (',staff_id,')') as employee, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-01-%') as January, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-02-%') as February, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-03-%') as March, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-04-%') as April, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-05-%') as May, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-06-%') as June, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-07-%') as July, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-08-%') as August, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-09-%') as September, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-10-%') as October, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-11-%') as November, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-12-%') as December, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[0]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-%') as leave_days_taken `
            +`from employees e order by first_name asc`;
            if(!err){
                con.query(query, function(err, result){
                    con.release();
                    if(!err){
                        res.json({result, year : year});
                    }
                    else{
                        res.json({message : err});
                    }
                });
            }
            else{
                res.json({message : err});
            }
        });
    }
});

//Leave without pay 
router.post('/leave/withoutpay', function(req, res){
    let year = req.body.year;
    let leaveType = req.body.leave_type;
    if(year == undefined){
        res.json({error : "Please provide year"});
    }
    else if(typeof(year) != 'number'){
        res.json({ error : "Please provide a numeric value for year"});
    }
    else if(leaveType == undefined){
        res.json({ error: "Please provide leave type"});
    }
    else{
        //get connection
        dbcon.getConnection(function(err, con){
            if(!err){
                let query = `select concat(first_name,' ',middle_name,' ',last_name,' (',staff_id,')') as employee, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-01-%') as January, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-02-%') as February, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-03-%') as March, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-04-%') as April, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-05-%') as May, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-06-%') as June, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-07-%') as July, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-08-%') as August, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-09-%') as September, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-10-%') as October, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-11-%') as November, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-12-%') as December, `
            +`(select IFNULL(sum(no_of_days), 0) from leaves where lower(with_pay) = '${withPay[1]}' `
            +`and leave_type_id = (select IFNULL(leave_type_id, 0) from leave_types where lower(name) = '${leaveType}') `
            +`and employee_id = e.employee_id and leave_status_id = (select leave_status_id from leave_statues where `
            +`code = 'approved') and start_date like '${year}-%') as leave_days_taken `
            +`from employees e order by first_name asc`;

            con.query(query, function(err, result){
                con.release();
                if(!err){
                    res.json({result, year : year});
                }
                else{
                    res.json({ message : err});
                }
            });
            }
            else{
                res.json({message : err});
            }
        });
    }
});


module.exports = router;