const {existsSync} = require('fs')
let dev = [], stage = [], production = [];

if (existsSync('./local.json')){
    dev = require('./local.json');
};

if (existsSync('./stage.json')){
    stage = require('./stage.json');
};

if (existsSync('./stage.json')){
    production = require('./production.json');
};

let tablesArray = [];
let missingTablesProduction = [];

let missingColumnProd = {}; // table = > column

let devMap = {};

let stageMap = {};

let prodMap = {};

for (let item of dev){
    if (!devMap[item.TABLE_NAME]){
        devMap[item.TABLE_NAME] = {};
    };

    devMap[item.TABLE_NAME][item.COLUMN_NAME] = 1;
    tablesArray.push(item.TABLE_NAME);
};

for (let item of stage){
    if (!stageMap[item.TABLE_NAME]){
        stageMap[item.TABLE_NAME] = {};
    };

    stageMap[item.TABLE_NAME][item.COLUMN_NAME] = 1;
    tablesArray.push(item.TABLE_NAME);
};

for (let item of production){
    if (!prodMap[item.TABLE_NAME]){
        prodMap[item.TABLE_NAME] = {};
    };

    prodMap[item.TABLE_NAME][item.COLUMN_NAME] = 1;
    tablesArray.push(item.TABLE_NAME);
};

tablesArray = Array.from(new Set(tablesArray));

for (let table in stageMap){
    if (!prodMap[table]){
        // DROPSHIP specific
        if (table.toLowerCase().endsWith('_new')){
            continue;
        };

        missingTablesProduction.push(table);
        continue;
    };

    for (let column in stageMap[table]){
        if (!prodMap[table][column]){

            if(!missingColumnProd[table]){
                missingColumnProd[table] = [];
            };

            missingColumnProd[table].push(column);
        };
    };
};

const base = {
    dev: false,
    stage: false,
    prod: false
};

let tableMap = {};
for (let table of tablesArray){
    tableMap[table] = {
        ...base
    };
    if (devMap[table]){
        tableMap[table].dev = undefined;
    };
    if (stageMap[table]){
        tableMap[table].stage = undefined;
    };
    if (prodMap[table]){
        tableMap[table].prod = undefined;
    };
};
console.log('Missing Tables');
console.table(tableMap);

console.log ('\nMissingRows');
for (let table of tablesArray){
    let colMap = {};

    if (devMap[table]){
        for (let col in devMap[table]){
            if (!colMap[col]){
                colMap[col] = {...base};
            };

            colMap[col].dev = undefined;
        };
        
        for (let col in stageMap[table]){
            if (!colMap[col]){
                colMap[col] = {...base};
            };

            colMap[col].stage = undefined;
        };
        for (let col in prodMap[table]){
            if (!colMap[col]){
                colMap[col] = {...base};
            };

            colMap[col].prod = undefined;
        };

    };

    for (col in colMap){
        if (colMap[col].dev !== colMap[col].stage || colMap[col].stage !== colMap[col].prod){
            console.log(table);
            console.table(colMap);
            break;
        };
    };
};

// compare three per row