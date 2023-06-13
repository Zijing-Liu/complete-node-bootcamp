// 1. firstly impor the core modules
const fs = require('fs');
const http = require('http');
const url = require('url');
// 2. require the third-party modules
const slugify = require('slugify');
// 3. require the self-created modules from the local files
const replaceTemplate = require('./modules/replaceTemplate');
const { toUnicode } = require('punycode');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { low: true }));
console.log(slugs);

// read the template HTML files and store them in constant variables
const temOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);

const temCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const temProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

///////////////////////////////////////////////////////////
// SERVER
const server = http.createServer((req, res) => {
  // console.log(url.parse(req.url, true));
  // const obj = url.parse(req.url, true);
  // const pathname = obj.pathname;

  const parseUrl = new URL(req.url, 'http://127.0.0.1:8000/');
  const param = parseUrl.searchParams;
  const pathName = parseUrl.pathname;

  // const pathName = req.url;
  // ############################## Overview Page
  if (pathName === '/overview' || pathName === '/') {
    // loop through the dataObj, use map to replace the placeholders in tempCard and save the output as an array
    // join the array into a string
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(temCard, el))
      .join('');

    const overView = temOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(overView);

    // ############################## Product Page
  } else if (pathName === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const index = param.get('id');
    const product = dataObj[index];

    const output = replaceTemplate(temProduct, product);
    param.set('id', slugs[index]);
    parseUrl.searchParams = param;
    console.log(param);
    res.end(output);

    // ############################## API Page
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);

    // ##############################404 Page
    TODO;
  } else {
    res.writeHead(404, {
      'Context-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});
//standarded ip address of localhost
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});

///////////////////////////////////////////////////////////
// Routing

///////////////////////////////////////////////////////////
// FILES

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR 🤯");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written 😀");
//       });
//     });
//   });
// });

// console.log("Will read the code");
