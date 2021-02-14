
function getMonthNo(month){
    month = month.toLocaleLowerCase().trim();
    if(month === 'january'){
        return "01";
    }
    else if(month === 'february'){
        return "02";
    }
    else if(month === 'march'){
        return "03";
    }
    else if(month === 'April'){
        return "04";
    }
    else if(month === 'may'){
        return "05";
    }
    else if(month === 'june'){
        return "06";
    }
    else if(month === 'july'){
        return "07";
    }
    else if(month === 'august'){
        return "08";
    }
    else if(month === 'september'){
        return "09";
    }
    else if(month === 'october'){
        return "10";
    }
    else if(month === 'november'){
        return "11";
    }
    else if(month === 'december'){
        return "12";
    }
    else{
        return "00";
    }
}

module.exports.getMonthNo = getMonthNo;