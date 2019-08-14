// need to be able to do the following
// 1. hash a number that the user provides
// 2. update bloom filter
// 3. update page to show new bloom filter

// this IIFS controls all hashing operations
var hashController = (function() {
  // need to do the following
  // 1. convery from string to int
  var nonce = 20;
  var convertToInt = function(usrInpt) {
    return Number(usrInpt);
  };

  // 2. convert base 10 to base 2
  // remains as string since it needs to be split into an array
  var decToBinary = function(decNum) {
    return parseInt(decNum,10).toString(2);
  };
  // 3. convert binary to array of odd and even indicies
  // 3(cont). convert even and off arrays to numbers
  var splitBinary = function(binNum) {
    var arrays = {
      even: [],
      odd: []
    };

    for (var i = 0; i < binNum.length; i++) {
      i%2 === 0? arrays.even.push(Number(binNum[i])): arrays.odd.push(Number(binNum[i]));

    }
    return arrays;
  };


  // 4. convert arrays to base 10 numbers modulo 20
  var returnToDec = function(element) {
    var elem = element.join('');
    var hash = Number(parseInt(elem,2).toString(10));
    return hash;
  };

  var hashNumbers= {
    hash1: -1,
    hash2: -1
  };
  // 5. make resulting numbers globally available
  return {

    // oddEvenHash: function(){
    //   return hashNumbers;
    // },

    // public function to return the hash of a given number
    getHash: function(el) {
      var dec, binNum, binNums;
      dec = convertToInt(el);
      binNum = decToBinary(dec);
      binNums = splitBinary(binNum);
      hashNumbers.hash1 = returnToDec(binNums.even)%nonce;
      hashNumbers.hash2 = returnToDec(binNums.odd)%nonce;
      return hashNumbers;
    }

  };
})();

//This IIFS creates and edits the bloom filter
var bloomController = (function() {
  var bloomFilter;
  // 1. function to create initial filter
  var createBloomFilter = function() {
    // this function creates a filter 20 items long, eventually want to add ability to specify length
    bloomFilter = [];
    for (var i = 0; i < 20; i++) {
      bloomFilter.push(0);
    }
    return bloomFilter;
  };

  bloomFilter = createBloomFilter();
// all public after this line
  return {
    // 2. check for bloomFilter Collisions
    checkForCollissions: function(hash1, hash2) {
      return bloomFilter[hash1] === 1 && bloomFilter[hash2] === 1;
    },
    // 3. function to update filter
    updateBloomFilter: function(hash1, hash2) {
      bloomFilter[hash1] = 1;
      bloomFilter[hash2] = 1;
    },

    getBloomFilter: function() {
      return bloomFilter;
    }

  };
  // 4. function to return filter
})();

//This IIFS controlls and updates the GUI and webpage
var guiController = (function(hshCtrl, blmCtrl) {
  // 1. collect reletive HTML classes
  var DOMItems = {
    filterDisp: '.filterDisplay',
    usrInput: '.itemInput',
    button: '.activateButton',
    collision: '.result'
  };

  var newBloomFilterDisp = function() {
    document.querySelector(DOMItems.filterDisp).innerHTML = "<p>"+displayElements.bloomFilter.toString()+"</p>";
  };

  var updateCollision = function(collide) {
    var update = document.querySelector(DOMItems.collision);
    collide ? update.innerHTML = "<p>this is a collision!</p>" : update.innerHTML = "<p> no collision </p>";
    collide ? console.log('in filter') : console.log('not in filter');

  };

  var initializeEvents = function() {
    document.querySelector(DOMItems.button).addEventListener('click', getHash);
    newBloomFilterDisp();
  };

  var displayElements = {
    bloomFilter: blmCtrl.getBloomFilter(),
    hashes: {
      hash1: -1,
      hash2: -1
    }
  };

// calls hash function from the hash controller
  var getHash = function() {
    var disp = displayElements.hashes;
    var number = document.querySelector('.inputClass').value;
    disp.hash1 = hshCtrl.getHash(number).hash1;
    disp.hash2 = hshCtrl.getHash(number).hash2;
    console.log(disp.hash1);
    console.log(disp.hash2);
    collided = blmCtrl.checkForCollissions(disp.hash1, disp.hash2);
    blmCtrl.updateBloomFilter(disp.hash1, disp.hash2);
    newBloomFilterDisp()
    updateCollision(collided);

    // return hashes;
  };

  var displayHash = function() {
    console.log(displayElements.bloomFilter);
    console.log(displayElements.hashes);
  };

  return {
    initialize: function() {
      initializeEvents();
      // displayHash();
      console.log(displayElements.bloomFilter);
      // console.log(displayElements.hashes.hash1);

    },

  };
})(hashController, bloomController);

guiController.initialize();
// guiController.update()
