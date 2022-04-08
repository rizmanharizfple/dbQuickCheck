const data = require('./compareTwo.json');

// schema name => table name => row name => row details obj
let schemaMap = {};
for (let item of data){
    if (!schemaMap[item.TABLE_SCHEMA]){
        schemaMap[item.TABLE_SCHEMA] = {};
    };

    if (!schemaMap[item.TABLE_SCHEMA][item.TABLE_NAME]){
        schemaMap[item.TABLE_SCHEMA][item.TABLE_NAME] = {};
    };

    schemaMap[item.TABLE_SCHEMA][item.TABLE_NAME][item.COLUMN_NAME] = item
};

let schemasArray = Object.keys(schemaMap);
if (schemasArray.length !== 2){
    throw ('Must have only two schemas');
};

let totalTables = [];
let comparisonObj = {};
for (let schema in schemaMap){
    comparisonObj[schema] = {};
    totalTables = totalTables.concat(Object.keys(schemaMap[schema]));
};
totalTables.sort();
totalTables = Array.from(new Set(totalTables));

let tablesArray = {};

for (let table of totalTables){
    tablesArray[table] = {};
    for (let schema in comparisonObj){
        if (!schemaMap[schema].hasOwnProperty(table)){
            tablesArray[table][schema] = false;
        }
    };
};

console.table(tablesArray)

// go through each table, compare both columns
for (let table of totalTables){
    let colArray = [];
    for (let schema in schemaMap){
        if (schemaMap[schema][table]){
            colArray = colArray.concat(Object.keys(schemaMap[schema][table]));
        };
    };
    colArray = Array.from(new Set(colArray));
    colArray.sort();

    let colMap = {};
    for (let column of colArray){
        colMap[column] = {};
        for (let schema in schemaMap){
            try {
                if (schemaMap[schema][table]){
                    if (schemaMap[schema][table][column]){
                        colMap[column][schema] = schemaMap[schema][table][column].DATA_TYPE                        
                    }
                }
            } catch {
                // do nothing
            };
        };

        if (colMap[column][schemasArray[0]] != colMap[column][schemasArray[1]]){
            colMap[column].valueMatch = false;
        };
    };

    // check if need to print
    for (let column in colMap){
        if (colMap[column].valueMatch === false){
            console.log(table);
            console.table(colMap);
            console.log('\n\n');
            break;
        };
    };
    
};