const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbcon = require('../dbconnection/dbcon');
const monthModule = require('../modules/month');

// all querys
let employeeCountQuery = "select count(*) as count_no from employees where staff_id = ?";
let employeeQuery = "select employee_id, concat(first_name,' ',middle_name,' ',last_name) as employee, "
+"(select name from banks where bank_id = e.bank_id) as bank, account_no "
+"from employees e  where staff_id = ?";

let payrollQurey = "select "
+"(select name from pay_elements where pay_element_id = p.pay_element_id) as name, "
+"amount "
+"from payrolls p where employee_id = ? and year = ? and month_no = ?  order by name";

let levelQuery = "select (select name from levels where level_id = p.level_id) as level from payrolls p "
+"where employee_id = ? and year = ? and month_no = ?";

let bankQuery = "select name from banks where bank_id = ?";

let deductionQuery = "select (select name from pay_element_deduction_types where pay_element_deduction_type_id = e.pay_element_deduction_type_id) as name, "
+"amount "
+"from employee_pay_element_deductions e "
+"where employee_id = ? and (CAST( ? AS DATE) between start_date and end_date)";

router.get('/', function(req, res){
    res.send(`Hello World`);
});

router.post('/', function(req,res){
    let year = req.body.year;
    let month = req.body.month;
    let staffId = req.body.staff_id;
    //Check if all field was provided
    if(year == undefined || month == undefined || staffId == undefined){
        res.json({message : "Please provide year, month and staff_id"});
    }
    else{
        let empRow = "";
        let levelRow = "";
        let count = "";
        let monthNo = monthModule.getMonthNo(month);
        let array = [];
        if(typeof(year) == 'number'){
            dbcon.getConnection(function(err, con){
                if(!err){
                    //Check if staff_id exist
                    con.query(employeeCountQuery, [staffId], function(err, empCount){
                        if(!err){
                            Object.keys(empCount).forEach(function(key){
                                count = empCount[key];
                            });
                            if(count.count_no >= 1){
                                // get employee info
                                con.query(employeeQuery, [staffId], function(err, empResult){
                                    if(!err){
                                        Object.keys(empResult).forEach(function(key){
                                        empRow = empResult[key];
                                        });
                                        array = [empRow.employee_id, year, monthNo];
                                        //get employee payroll info
                                        con.query(payrollQurey, array, function(err, pay_element){
                                            if(!err){
                                                // get employee level
                                                con.query(levelQuery, [empRow.employee_id, year, monthNo], function(err, levelResult){
                                                    if(!err){
                                                        Object.keys(levelResult).forEach(function(key){
                                                            levelRow = levelResult[key];
                                                        });
                                                        //Get deduction values
                                                        let date = year+"-"+monthNo+"-07";
                                                        con.query(deductionQuery, [empRow.employee_id, date], function(err, deduction){
                                                            con.release();
                                                            if(!err){
                                                                let obj = {
                                                                    "employee_id" : empRow.employee_id,
                                                                    "month_no" : monthNo,
                                                                    "employee" : empRow.employee,
                                                                    "staff_id" : staffId,
                                                                    "level" : levelRow.level,
                                                                    "bank_name" : empRow.bank,
                                                                    "account_number" : empRow.account_no,
                                                                    "year" : year,
                                                                    "month" : month,
                                                                    pay_element,
                                                                    deduction
                                                                };
                                                                res.json(obj);
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
                                            else{
                                                res.json({message : err});
                                            }
                                        })
                                    }
                                    else{
                                        res.json({message : err});
                                    }
                                });
                            }
                            else{
                                res.json({message : "staff_id does not exist"});
                            }
                        }
                        else{
                            res.json({message : err});
                        }
                    });
                   
                }
                else{
                    res.json({ error : err});
                }
            });
        }
        else{
            res.json({error : "year must be numeric value"});
        }
    }
   
});


module.exports = router;