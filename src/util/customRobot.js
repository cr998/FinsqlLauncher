var robot = require("robotjs");


const customRobot = {
    typeString : function (text){
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        
        for (const char of text) {
            if (specialChars.test(char)){
                robot.typeString(char)
            }else{
                robot.keyTap(char)
            }
        }
    }
}

module.exports = {...robot,...customRobot};