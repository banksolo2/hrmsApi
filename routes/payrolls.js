const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbcon = require('../dbconnection/dbcon');

let query = "select payroll_id, "
+"(select concat(first_name, ' ', middle_name, ' ', last_name, ' (', staff_id, ')') as employee from employees where employee_id = p.employee_id) as employee, "
+"(select name from levels where level_id = p.level_id) level, "
+"(select name from pay_elements where pay_element_id = p.pay_element_id) as pay_element, amount, "
+"(select name from months where no = p.month_no) as month, year, created_at, updated_at "
+"from payrolls p";
// get all payroll
router.get('/', function(req, res){
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query + " order by year asc, month_no asc, employee asc";
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

// get payroll by id
router.get('/:payrollId', function(req, res){
    let payrollId = req.params.payrollId;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query + " where payroll_id = ?";
            con.query(addQuery, [payrollId], function(err, result){
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
            res.json({ message : err});
        }
    });
});

//get employee payroll history by employee Id
router.get('/employeeid/:employeeId', function(req, res){
    let employeeId = req.params.employeeId;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query + ' where employee_id = ? order by year asc, month_no asc, pay_element asc';
            con.query(addQuery, [employeeId], function(err, result){
                con.release();
                if(!err){
                    res.json({result});
                }
                else{
                    res.json({ message : err });
                }
            });
        }
        else{
            res.json({ message : err});
        }
    });
});

//get employee payroll history by staff Id
router.get('/staffid/:staffId', function(req, res){
    let staffId = req.params.staffId;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query + " where employee_id = (select employee_id from employees where staff_id = ?) "
            +"order by year asc, month_no asc, pay_element asc";
            con.query(addQuery, [staffId], function(err, result){
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

router.post('/', function(req, res){
    let month = req.body.month;
    month = month.toLowerCase();
    let year = req.body.year;
    let employeeId = req.body.employee_id;
    let staffId = req.body.staff_id;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = "";
            if(employeeId == null && staffId == null){
                addQuery = query + " where month_no = (select no from months where lower(name) = ?) and "
                +"year = ?  order by employee asc";
                con.query(addQuery, [month, year], function(err, result){
                    con.release();
                    if(!err){
                        res.json({result});
                    }
                    else{
                        res.json({ message : err});
                    }
                });
            }
            else if(employeeId != null){
                addQuery = query + " where month_no = (select no from months where lower(name) = ?) and "
                +"year = ?  and employee_id = ? order by employee asc";
                con.query(addQuery, [month, year, employeeId], function(err, result){
                    con.release();
                    if(!err){
                        res.json({result});
                    }
                    else{
                        res.json({messsage : err});
                    }
                });
            }
            else{
                addQuery = query + " where month_no = (select no from months where lower(name) = ?) and "
                +"year = ? and employee_id = (select employee_id from employees where staff_id = ? ) "  
                +"order by employee asc";
                con.query(addQuery, [month, year, staffId], function(err, result){
                    con.release();
                    if(!err){
                        res.json({result});
                    }
                    else{
                        res.json({message : err});
                    }
                });
            }
        }
        else{
            res.json({ message : err});
        }
    });
});


module.exports = router;