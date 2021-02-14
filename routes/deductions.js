const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbcon = require('../dbconnection/dbcon');
const months = require('../modules/month');

//query statement
let query = "select employee_pay_element_deduction_id, "
+"(select concat(first_name, ' ', middle_name, ' ', last_name, ' (', staff_id, ')') as employee from employees where employee_id = d.employee_id ) as employee, "
+"(select name from pay_element_deduction_types where pay_element_deduction_type_id = d.pay_element_deduction_type_id) as pay_element_deduction_type, "
+"amount, start_date, end_date, created_at, updated_at "
+"from employee_pay_element_deductions d";

//routes
//get all deductions
router.get('/', function(req, res){
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query +" order by start_date asc, employee asc";
            con.query(addQuery, function(err, result){
                con.release();
                if(!err){
                    res.json({result});
                }
                else{
                    res.json({ message : err});
                }
            });
        }
        else{
            res.json({ message : err });
        }
    });
});

//get deduction
router.get('/:employeePayElementDeductionId', function(req, res){
    let employeePayElementDeductionId = req.params.employeePayElementDeductionId;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query +" where employee_pay_element_deduction_id = ? order by start_date asc";
            con.query(addQuery, [employeePayElementDeductionId], function(err, result){
                con.release();
                if(!err){
                    res.json({result});
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
});

//get deduction by staff ID
router.get('/staffid/:staffId', function(req, res){
    let staffId = req.params.staffId;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query +" where employee_id = (select employee_id from employees where staff_id = ?) "
            +" order by start_date asc";
            con.query(addQuery, [staffId], function(err, result){
                con.release();
                if(!err){
                    res.json({result});
                }
                else{
                    res.json({message : err});
                }
            });
        }
        else{
            res.json({ message : err});
        }
    });
});

// get deduction by month and year
router.post('/', function(req, res){
    let month = req.body.month;
    let year = req.body.year;
    let staffId = req.body.staffId;
    let date = year+"-"+months.getMonthNo(month)+"-05";
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = "";
            let array = [];
            if(staffId == null){
                addQuery = query + " where ? between start_date and end_date";
                array = [date];
            }
            else{
                addQuery = query + " where employee_id = (select employee_id from employees where staff_id = ?) "
                +"and (? between start_date and end_date)";
                array = [staffId, date];
            }
            con.query(addQuery, array, function(err, result){
                con.release();
                if(!err){
                    res.json({result});
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
});


module.exports = router;