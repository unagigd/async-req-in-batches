const request = (val, timeFactor = 3) => {
  console.log('start', val);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
       console.log('end', val);
    }, timeFactor * 1000)
  })
}

function chunkArray(myArray, chunk_size) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}

const inputArray = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
  10, 11, 12
];

const chunks = chunkArray(inputArray, 3);
const chunksIterator = chunks[Symbol.iterator]();

function consumeIterator(iterator) {  
  function step(collected = []) {
    const { value, done } = iterator.next();
    
    if (value !== undefined) {
      const requestPromises = value.map(id => request(id, id%2))
      
      return Promise.all(requestPromises).then(val => {
        console.log('chunk', val);
        return step([
          ...collected,
          val
        ]);
      });
    } else {
      console.log('collected', collected)
      return Promise.resolve(collected);
    }
     //console.log('all', collected);  
    
  }
  
  return new Promise(resolve => {
    step().then(res => {
      //console.log('x', res);
      resolve(res)
    })
    
  }); 
}

const finalValue = consumeIterator(chunksIterator);
finalValue.then(res => console.log('rest', res))


