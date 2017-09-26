# Centify

**Centify** is a procurements splitter.

This module splits your procurements into different parts to avoid losing money with rounding.

Please make sure that it's just a joke and not useful in any way because it will cost a lot of time to split your procurement into so many parts. It's just an idea with an interesting algorithm behind it.

## Install

```bash
npm install centify
```

## API

```javascript
const centify = require("centify");


var myList = {
  "Article 1": 49.99,
  "Article 2": 38.96,
  "Article 3": 25.98,
  "Article 4": 78.97,
  "Article 5": 15.95,
  "Article 6": 90.50,
  "Article 7": 55.01
};


// 5 is the round reference
var newProcurement = centify(myList, 5);

console.log(newProcurement);
```
