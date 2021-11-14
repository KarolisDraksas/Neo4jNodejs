var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
const exp = require('constants');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
//var session = driver.session();
var session_main = driver.session({
    database: 'maindb',
    defaultAccessMode: neo4j.session.WRITE
  })
var sessiondb11 = driver.session({
    database: 'dbms1-1',
    defaultAccessMode: neo4j.session.WRITE
  })
var sessiondb12 = driver.session({
    database: 'dbms1-2',
    defaultAccessMode: neo4j.session.WRITE
  })
  var sessiondb21 = driver.session({
    database: 'dbms2-1',
    defaultAccessMode: neo4j.session.WRITE
  })
  var sessiondb22 = driver.session({
    database: 'dbms2-2',
    defaultAccessMode: neo4j.session.WRITE
  });

  //const testObject = { labels: ['Category'], CategoryName: "name of category", Description: "description test"}
  const testObject = { labels: ['Customer'], CustomerID: "FRANK", ContactTitle: "test"}


app.get('/', async function(req, res){

    
   // if (testObject.labels[0] === 'Category' || testObject.labels[0]==='Product' || testObject.labels[0]==='Supplier')
   /* const result = await session_main.run('MATCH (n:Category) RETURN n LIMIT 25');

    result.records.forEach(function(record){
    const singleRecord = record;

    const node = singleRecord.get(0);
    console.log(node);
    });*/
    const aaa = await session_main.run('MATCH n = (a)-->(b) WHERE a.CategoryID="3" AND b.CategoryID="3" RETURN nodes(n)');
    aaa.records.forEach(function(record){
      const singleRecord = record;
  
      const node = singleRecord.get(0);
      console.log(node);
      console.log(node[0].properties.QuantityPerUnit)
      });
    const resultREduce = await session_main.run('MATCH n = (a)-->(b) WHERE a.CategoryID="3" AND b.CategoryID="3" RETURN reduce(totalQuantity = 0, p IN nodes(n) | totalQuantity + p.properties.QuantityPerUnit) AS reduction');
    //const resultREduce = await session_main.run('MATCH (n:Product) USING n AS list RETURN reduce(totalQuantity = 0, n IN list | totalQuantity + n.QuantityPerUnit) AS reduction');

    console.log(resultREduce);
    resultREduce.records.forEach(function(record){
    const singleRecord = record;

    const node = singleRecord.get(0);
    console.log(node);
    });

   
   if (testObject.labels[0] === 'Customer'){
    const update = await sessiondb21.run("MATCH (cus:Customer {CustomerID: $customerID}) SET cus.ContactTitle = 'updated contact title' RETURN cus", {customerID: testObject.CustomerID}).catch(function(err){console.log(err);});
    const update2 = await sessiondb22.run("MATCH (cus:Customer {CustomerID: $customerID}) SET cus.ContactTitle = 'updated contact title' RETURN cus", {customerID: testObject.CustomerID}).catch(function(err){console.log(err);});;

    update.records.forEach(function(record){

    const singleRecord = record ;

    const node = singleRecord.get(0);
    console.log(node);
   })
  };

    /*
    const result2 = await session_main.run('MATCH (n:Customer) RETURN n LIMIT 25').catch(function(err){console.log(err);};
    result2.records.forEach(function(record){
    const singleRecord = record ;
    const node = singleRecord.get(0);
    console.log(node);
    });

    const create = await sessiondb11.run("CREATE (cat:Category {CategoryName: 'testCategory2', Description: 'description of test category'})").catch(function(err){console.log(err);});;
    create.records.forEach(function(record){
    
    const singleRecord = record ;

    const node = singleRecord.get(0);
    console.log(node);
    });
    const update = await sessiondb11.run("MATCH (cat:Category {CategoryName: 'testCategory2'}) SET cat.Description = 'updated test description' RETURN cat").catch(function(err){console.log(err);});;
    update.records.forEach(function(record){

    const singleRecord = record ;

    const node = singleRecord.get(0);
    console.log(node);
    });

    const deleteCategory = await sessiondb11.run("MATCH (cat:Category {CategoryName: 'testCategory'}) DELETE cat").catch(function(err){console.log(err);});;
    */
    //const resultapoc = await session_main.run('CALL apoc.help("apoc.map.fromNodes")').catch(function(err){console.log(err);});
    const resultapoc = await session_main.run('RETURN apoc.map.fromNodes("Category", "CategoryID")').catch(function(err){console.log(err);});

    //const resultapoc = await session_main.run('CALL apoc.map.fromNodes("Category", "CategoryID") AS map RETURN apoc.map.get(map, "CategoryID") AS output;').catch(function(err){console.log(err);});

    //console.log(resultapoc);
    resultapoc.records.forEach(function(record){

      const singleRecord = record ;
  
      const node = singleRecord.get(0);
      console.log(node);
      });

    sessiondb11.close();
    session_main.close();
    driver.close();
    res.send('session run');

});




app.listen(3000);

console.log('Server started on Port 3000');

module.exports = app
 