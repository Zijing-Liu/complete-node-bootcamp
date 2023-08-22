const fs = require('fs');
const superagent = require('superagent');
// construct a new promise

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could find that file 😢');
      resolve(data);
    });
  }).catch((err) => {
    console.log(err.message);
  });
};

//build promises in node.js
const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('dog-image.txt', data, (err) => {
      if (err) reject('Couldn write into file');
      resolve('success');
    });
  });
};

//Ayschronous function, async await always go together
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    writeFilePro('dog-image.txt', res.body.message);
    console.log('Random dog saved to file!');
  } catch (err) {
    console.log(err.message);
    throw err;
  }
  return '2: ready 😀😀😀';
};
console.log('1: Will get the doc pics!');
// use the then method to get the return value of the promise
getDogPic().then((x) => {
  console.log(x);
  console.log('3: Done getting dog pics!');
});

(async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    writeFilePro('dog-image.txt', res.body.message);
    console.log('Random dog saved to file!');
  } catch (err) {
    console.log(err.message);
  }
})();

// chain each handler using promises
// readFilePro(`${__dirname}/dog.txt`)
//   // three status of promise: pending, fullfilled, rejected
//   // then only handles the fullfilled promises, only gets called if the promise was successful
//   .then((data) => {
//     console.log(`Bread: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePro('dog-image.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog saved to file!');
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Bread: ${data}`);
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     // three status of promise: pending, fullfilled, rejected
//     // then only handles the fullfilled promises, only gets called if the promise was successful
//     .then((res) => {
//       console.log(res.body.message);
//       fs.writeFile('dog-image.txt', res.body.message, (err) => {
//         console.log('file written');
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });
