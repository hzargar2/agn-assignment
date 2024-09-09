var express = require('express');
var router = express.Router();
const {parse} = require("csv-parse/sync");

//read csv file
const fs = require('fs')
const fileContents = fs.readFileSync('./test_data.csv').toString();

/* GET users listing. */
router.get('/', function(req, res, next) {

  const records = parse(fileContents, {
    columns: true,
    skip_empty_lines: true
  });

  res.send({employees: records});
});

module.exports = router;
