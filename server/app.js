const express = require('express')
const app = express()
let cors = require('cors')
const port = 3000
const employees = require('./routes/employees')

app.use(cors());

app.use("/employees", employees)

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`)
})