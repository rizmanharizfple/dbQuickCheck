# dbQuickCheck
## quickly check db structure readiness (compare table structure between dev, staging, production);
1. Run the following query in your db for local, dev and staging
```
select TABLE_NAME, COLUMN_NAME from information_schema.columns
where table_schema = 'tablename'
order by table_name,ordinal_position;
```
2. Save files as `local.json`, `stage.json` and `production.json` respectively.
3. run `npm run start` to generate the report.

## quickly compare two separate db structures
1. Run the following query in your db
```
select * from information_schema.columns
where table_schema IN ('firstSchemaName','secondSchemaName')
order by table_schema, table_name,ordinal_position
```
2. Save file as `compareTwo.json`.
3. run `npm run compare` to generate the report