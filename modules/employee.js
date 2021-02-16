const express = require('express');
const mysql = require('mysql');
const dbcon = require('../dbconnection/dbcon');


function getEmployeeName(staffId){
    let row = null;
    let query = "select * "
    +"from employees where staff_id = ?";
    let array = [staffId];
    dbcon.getConnection(function(err, con){
        if(!err){
            con.query(query, array, function(err, resultSet, fields){
                con.release();
                if(!err){
                    Object.keys(resultSet).forEach(function(key) {
                        row =resultSet[key];
                        
                    });
                    console.log(row.first_name);
                }
                else{
                   return "error";
                }
            });
        }
        else{
            return "error";
        }
    });
}



module.exports.getEmployeeName = getEmployeeName;

