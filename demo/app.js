const splitProcurements = require("../");

var myList = {
  "Article 1": 49.99,
  "Article 2": 38.96,
  "Article 3": 25.98,
  "Article 4": 78.97,
  "Article 5": 15.95,
  "Article 6": 90.50,
  "Article 7": 55.01
};


var newProcurement = splitProcurements(myList, 5);

console.log(newProcurement);

// #f44747 #e83131
