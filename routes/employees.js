const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbcon = require('../dbconnection/dbcon');

// All employee query
let query = 'select employee_id, title, first_name, middle_name, last_name, email, staff_id, upper(name_initials) as name_initials, '
            +'(select name from genders where gender_id = e.gender_id) as gender, '
            +'(select name from employee_status where employee_status_id = e.employee_status_id) as employee_status, '
            +'date_of_employment, (select name from states where state_id = e.state_id) as state, mobile_number, '
            +'(select name from departments where department_id = e.department_id) as department, '
            +'(select name from levels where level_id = e.level_id) as level, '
            +'(select name from branches where branch_id = e.branch_id) as branch, '
            +'(select name from companies where company_id = e.company_id) as company, current_address '
            +'from employees e';
// get all employess
router.get('/', function(req, res){
    dbcon.getConnection(function(err, con){
        if(!err){
            
            con.query(query, function(err, result){
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

//get employee by id
router.get('/id/:id', function(req, res){
    let employeeId = req.params.id;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query + ' where employee_id = ?';
            con.query(addQuery, [employeeId], function(err, result){
                con.release();
                if(!err){
                    res.json({ result});
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

//get employee by email
router.get('/email/:email', function(req, res){
    let email = req.params.email.toLowerCase();
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query + ' where lower(email) = ?';
            con.query(addQuery, [email], function(err, result){
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
            res.json({ message : err });
        }
    });
});

//get employee by staff Id
router.get('/staffid/:staffId', function(req, res){
    let staffId = req.params.staffId;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query + ' where staff_id = ?';
            con.query(addQuery, [staffId], function(err, result){
                con.release();
                if(!err){
                    res.json({result});
                }
                else{
                    res.json({message : err})
                }
            });
        }
        else{
            res.json({message : err});
        }
    });
});


module.exports = router;