// Move the mouse across the screen as a sine wave.
var robot = require("./util/customRobot");
const { windowManager } = require("node-window-manager");

let fin_UserID = "";
let fin_Password = "";
let fin_proccessNumber = 0;

function launch_nav_finsql(
    finsqlPath,
    DatabaseInstance,
    DatabaseName,
    ntauthentication,
    UserID,
    Password,
    ...customParamsToFinsqlExe
) {

    //Validating types
    if (typeof finsqlPath != 'string') { throw new Error("Argument finsqlPath must be 'string'") }
    if (typeof DatabaseInstance != 'string') { throw new Error("Argument DatabaseInstance must be 'string'") }
    if (typeof DatabaseName != 'string') { throw new Error("Argument DatabaseName must be 'string'") };
    if (typeof ntauthentication != 'boolean') { throw new Error("Argument ntauthentication must be 'boolean'") }
    if (typeof UserID != 'string') { throw new Error("Argument UserID must be 'string'") }
    if (typeof Password != 'string') { throw new Error("Argument Password must be 'string'") }

    let cmdParamsObject = {};
    cmdParamsObject.database = DatabaseName
    cmdParamsObject.servername = DatabaseInstance
    cmdParamsObject.ntauthentication = + ntauthentication;
    cmdParamsObject = { ...cmdParamsObject, ...customParamsToFinsqlExe };

    let cmdParamArray = [];
    for (const key of Object.keys(cmdParamsObject)) {
        const value = cmdParamsObject[key];
        cmdParamArray.push(`${key}="${value}"`);
    }
    let cmdParamsString = "\"" + finsqlPath + "\" " + cmdParamArray.join(',');

    if (!cmdParamsObject.ntauthentication) {
        fin_UserID = UserID;
        fin_Password = Password;
        windowManager.addListener('window-activated', passwordTypingInFinsql);
    }
    fin_proccessNumber = windowManager.createProcess(finsqlPath, cmdParamsString);
}

function passwordTypingInFinsql(eventWindow) {
    if (fin_proccessNumber != eventWindow.processId) {
        console.log('bak')
        return;
    }

    setTimeout(() => {
        robot.setKeyboardDelay(1);
        eventWindow.bringToTop();

        robot.typeString(fin_UserID)
        robot.keyTap('tab');
        robot.typeString(fin_Password);
        robot.keyTap('tab');

        //Enter database
        robot.keyTap('enter');

        windowManager.removeAllListeners();
    }, 150)
}

launch_nav_finsql(
    "C:\\Program Files (x86)\\Microsoft Dynamics NAV\\80\\RoleTailored Client\\finsql.exe",
    "CR998",
    "Demo Database NAV (8-0)",
    false,
    "lider",
    "mhk2725"
)
                                             