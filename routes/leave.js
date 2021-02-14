const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbcon = require('../dbconnection/dbcon');
const months = require('../modules/month');

let query = "select leave_id, "
+"(select concat(first_name,' ',middle_name,' ',last_name,' (',staff_id,')') as employee from employees where employee_id = l.employee_id) as employee, "
+"(select name from departments where department_id = l.department_id) as department, "
+"(select concat(first_name,' ',middle_name,' ',last_name,' (',staff_id,')') as supervisor from employees where employee_id = l.supervisor_id) as supervisor, "
+"(select name from leave_types where leave_type_id = l.leave_type_id) as leave_type, start_date, end_date, resumption_date, "
+"no_of_days, comment, inline_with_leave_plan, with_pay, "
+"(select name from leave_statues where leave_status_id = l.leave_status_id) as leave_status, "
+ "created_at, updated_at "
+"from leaves l where leave_status_id = (select leave_status_id from leave_statues where code = 'approved') ";


//========================================WITH PAY START============================================
//get all leave withpay
router.get('/withpay', function(req, res){
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query +"and lower(with_pay) = ? order by start_date asc";
            con.query(addQuery, ['yes'], function(err, result){
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

// get leaves by leave Id
router.get('/withpay/:leaveId', function(req, res){
    let leaveId = req.params.leaveId;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query +"and lower(with_pay) = ? and leave_id = ? order by start_date asc";
            con.query(addQuery, ['yes', leaveId], function(err, result){
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

//get leave by year
router.get('/withpay/year/:year', function(req, res){
    let year = req.params.year;
    let yearLength = year.length;
    if(yearLength > 4 || yearLength < 4){
        res.json({ error : "invalid year value"});
    }
    else{
        //get database connection
        dbcon.getConnection(function(err, con){
            if(!err){
                let date = `${year}%`;
                let addQuery = query +"and lower(with_pay) = ? and start_date like ? "
                +"order by start_date asc";
                con.query(addQuery, ['yes', date], function(err, result){
                    //release database connection
                    con.release();
                    if(!err){
                        res.json({result})
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


// get leave by year, month 
router.post('/withpay', function(req, res){
    let year = req.body.year;
    let yearLength = year.length;
    let month = req.body.month;

    //validate year
    if(yearLength > 4 || yearLength < 4){
        res.json({error : "Invalid year value"});
    }
    else if(typeof(year) != 'number'){
        res.json({error : "Please provide a numeric value for year"});
    }
    else{
        dbcon.getConnection(function(err, con){
            if(!err){
                let addQuery = "";
                let array = "";
                let date = "";
                if(year != null && month != null){
                    date =`${year}-${months.getMonthNo(month)}-%`;
                    addQuery = query+"and lower(with_pay) = ? and start_date like ? "
                    +"order by start_date asc";
                    array = ['yes', date];
                }
                else if(year != null){
                    date =`${year}%`;
                    addQuery = query + "and lower(with_pay) = ? and start_date like ? "
                    +"order by start_date asc";
                    array = ['yes', date];
                }
                else{
                    res.json({error : "Invalid json input"});
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
    }
});
//==========================================WITH PAY END===============================================

//==========================================WITHOUT PAY START===========================================
//get all leave withpay
router.get('/withoutpay', function(req, res){
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query +"and lower(with_pay) = ? order by start_date asc";
            con.query(addQuery, ['no'], function(err, result){
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

// get leaves by leave Id
router.get('/withoutpay/:leaveId', function(req, res){
    let leaveId = req.params.leaveId;
    dbcon.getConnection(function(err, con){
        if(!err){
            let addQuery = query +"and lower(with_pay) = ? and leave_id = ? order by start_date asc";
            con.query(addQuery, ['no', leaveId], function(err, result){
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

//get leave by year
router.get('/withoutpay/year/:year', function(req, res){
    let year = req.params.year;
    let yearLength = year.length;
    if(yearLength > 4 || yearLength < 4){
        res.json({ error : "invalid year value"});
    }
    else{
        //get database connection
        dbcon.getConnection(function(err, con){
            if(!err){
                let date = `${year}%`;
                let addQuery = query +"and lower(with_pay) = ? and start_date like ? "
                +"order by start_date asc";
                con.query(addQuery, ['no', date], function(err, result){
                    //release database connection
                    con.release();
                    if(!err){
                        res.json({result})
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


// get leave by year, month 
router.post('/withoutpay', function(req, res){
    let year = req.body.year;
    let yearLength = year.length;
    let month = req.body.month;

    //validate year
    if(yearLength > 4 || yearLength < 4){
        res.json({error : "Invalid year value"});
    }
    else if(typeof(year) != 'number'){
        res.json({error : "Please provide a numeric value for year"});
    }
    else{
        dbcon.getConnection(function(err, con){
            if(!err){
                let addQuery = "";
                let array = "";
                let date = "";
                if(year != null && month != null){
                    date =`${year}-${months.getMonthNo(month)}-%`;
                    addQuery = query+"and lower(with_pay) = ? and start_date like ? "
                    +"order by start_date asc";
                    array = ['no', date];
                }
                else if(year != null){
                    date =`${year}%`;
                    addQuery = query + "and lower(with_pay) = ? and start_date like ? "
                    +"order by start_date asc";
                    array = ['no', date];
                }
                else{
                    res.json({error : "Invalid json input"});
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
    }
});

module.exports = router;