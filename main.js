(function() {
  require('./fill-defaults');

  var rounder = 5;
  var targetRemainder = Math.trunc(rounder / 2);

  module.exports = function(list, currRounder = 5) {
    rounder = currRounder;
    targetRemainder = Math.trunc(rounder / 2);
    list = Object.keys(list).map(function(name, i) {
      return {
        name: name,
        worth: Math.round(list[name] * 100),
        remainder: Math.round((list[name] * 100) % rounder),
        index: i,
        _i: i
      }
    });

    var packages = [];

    while (list.length > 0) {
      var pack = getPack(list, 0);
      list = list.filter((item, index) => pack.indexOfKey(index, "index") < 0).map(function(item, index) {
        item.index = index;
        return item;
      });
      pack = pack.map(function(item) {
        delete item.index;
        delete item.remainder;
        return item;
      });
      var price = 0;
      pack.forEach(function(item) {
        price += item.worth;
      });
      pack = pack.map((item) => {
        item.worth = item.worth / 100;
        return item;
      });
      var currPackage = {
        list: pack,
        price: price / 100,
        costs: (price - getRemainder(price, rounder)) / 100
      }
      packages.push(currPackage);
    }
    var price = 0;
    var costs = 0;
    packages.forEach(function(pack) {
      price += pack.price;
      costs += pack.costs;
    });
    var result = {
      packages: packages,
      price: price,
      costs: costs
    };
    result.save = Math.round((result.price - result.costs) * 100) / 100;
    return result;
  }
  function getPack(list, index) {
    // Generating best package combination
    var maxSize = 3;
    // Clone the targetb remainder to set it down if we need a new level
    var currTargetRemainder = targetRemainder;
    // If the combination is not possible with this aim of remaindment, substrate the required remainder with 1
    while (!combination && currTargetRemainder >= 0) {
      var combination = combineItemWithList([list[index]], list, currTargetRemainder, maxSize, function(item, list) {
        var count = 0;
        list.forEach(function(item) {
          count += item.worth;
        });
        // Fallback for the case that 'item' is null (When the combination algorith checks the list without any additional item for fullfilling the requirements)
        if (!item) {
          item = {
            worth: 0
          };
        }
        return getRemainder(count + item.worth, rounder) == currTargetRemainder;
      });
      currTargetRemainder--;
    }
    if (!combination) {
      var combination = [list[index]];
    }
    return combination;
  }
  function combineItemWithList(itemList, list, remainder, max, check) {
    var pushed = false;
    var founded = null;
    var count = 0;
    var indexes = [];
    itemList.forEach(function(item) {
      count += item.worth;
      indexes.push(item.index);
    });
    if (check(null, itemList)) {
      founded = itemList;
    }
    for (var i = 0; i < list.length; i++) {
      // If item doesn't exist already in itemList, the list would not be longer than maximum and there was no found for this level (e.g 2)
      if (itemList.indexOfKey(i, "index") < 0 && itemList.length < max && !founded) {
        // Check wether the remainder of the existing list worth and the new item worth divided trough 5 is the needed remainder
        if (check(list[i], itemList)) {
          // Push the founded item to the existing list
          itemList.push(list[i]);
          // Set the founded return to the completed list
          founded = itemList;
        }
      }
    }
    // If there was no solution on this level (e.g 2), use this level in any kind of combvination and try to find a combination one level higher (e.g 3)
    // !! Please note that the 'level' means the length of the list that is putted into as argument plus the new item the loop is trying in this moment
    if (!founded) {
      for (var i = 0; i < list.length; i++) {
        if (indexes.indexOf(i) < 0 && itemList.length < max && !founded) {
          // If list isn't touched by this loop, push the new item and set 'pushed' to true
          if (!pushed) {
            itemList.push(list[i]);
            pushed = true;
          }
          // If list is already touched, just overwrite the last item
          else {
            itemList[itemList.length - 1] = list[i];
          }
          founded = combineItemWithList(itemList, list, remainder, max, check);
        }
      }
    }
    return founded;
  }
  const getRemainder = (number, divisor) => number % divisor;



})();


Array.prototype.indexOfKey = function(value, key, start = 0, exclude = []) {
  for (var i = start; i < this.length; i++) {
    if (this[i][key] === value && exclude.indexOf(i) < 0) {
      return i;
    }
  }
  return -1;
}
