const fs = require("fs");
const path = require("path");
const Fnsql = require("../classes/Finsql");
const { getFileProperties } = require('get-file-properties')

const getAllFiles = function(dirPath) {
    if (!fs.existsSync(dirPath)){
        return [];
    }
    
    const files = fs.readdirSync(dirPath)

    let arrayOfFiles = []

    files.forEach(function(file) {
        const _path = path.join(dirPath, file);
        if (fs.statSync(_path).isDirectory()) {
            arrayOfFiles = [...arrayOfFiles,...getAllFiles(_path)]
        } else {
            arrayOfFiles.push(_path)
        }
    })

    return arrayOfFiles;
}

async function scanInstalledFinsql(folders2scan) {
    if( folders2scan == undefined || folders.length == 0 ){
        folders2scan = [
            path.join(process.env["PROGRAMFILES(X86)"], "\\Microsoft Dynamics NAV"),
            path.join(process.env["PROGRAMFILES(X86)"], "\\Microsoft Dynamics 365 Business Central")
        ]
    }

    let all_files = [];
    for (const folder of folders2scan) {
        all_files = [...all_files,...getAllFiles(folder)]
    }
    
    const filtering = all_files.filter( (file)=>{
        return file.endsWith("finsql.exe")
    }).map( async (file)=>{
        let file_properties = await getFileProperties(file);
        return {
            path : file,
            version: file_properties.Version              
        }
    })

    return Promise.all(filtering);
}

module.exports = scanInstalledFinsql;