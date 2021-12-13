let stage = require('./stage.json');
let production = require('./production.json');

let missingTablesProduction = [];

let missingColumnProd = {}; // table = > column

let stageMap = {};

let prodMap = {};

for (let item of stage){
    if (!stageMap[item.TABLE_NAME]){
        stageMap[item.TABLE_NAME] = {};
    };

    stageMap[item.TABLE_NAME][item.COLUMN_NAME] = 1;
};

for (let item of production){
    if (!prodMap[item.TABLE_NAME]){
        prodMap[item.TABLE_NAME] = {};
    };

    prodMap[item.TABLE_NAME][item.COLUMN_NAME] = 1;
};


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


console.log('>>>Missing Tables');
for (let item of missingTablesProduction){
    console.log(item);
};

console.log('\n\n\n\n');

console.log('>>>Missing Columns');
for (let table in missingColumnProd){
    console.log(`Table: ${table}`);
    for (let item of (missingColumnProd[table])){
        console.log('\t',item);
    };
    console.log('\n')
};