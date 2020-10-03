const util = require("util");
const mysql = require("mysql");
const inquirer = require("inquirer");
// const { user, password } = require("../My-Employee-Tracker/config");
const connection = mysql.createConnection({
  host: "localhost",
  user: "employeeDB_admin",
  password: "EmployeeRecorder",
  database: "employees",
});

connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  inquirer
    .prompt({
      name: "employeeList",
      type: "list",
      message: "Would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Info",
        "View Departments",
        "Exit",
      ],
    })
    .then((answer) => {
      if (answer.employeeList === "View All Employees") {
        viewAllEmployees();
      } else if (answer.employeeList === "Add Employee") {
        addEmployeePrompt();
      } else if (answer.employeeList === "Update Employee Info") {
        updateEmployee();
      } else if (answer.employeeList === "View Departments") {
        viewDepartments();
      } else if (answer.employeeList === "Exit") {
        connection.end();
      }
    });
}

function addEmployeePrompt() {
  console.log("Working");
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is your name?",
      },
      {
        name: "id",
        type: "input",
        message: "What is your id number",
      },
    ])
    .then(() => {
      start();
    });
}

function viewAllEmployees() {
  console.log("Working!");
  start();
}

function updateEmployee() {
  console.log("Working!");
  start();
}

function viewDepartments() {
  console.log("Working!");
  start();
}
connection.query = util.promisify(connection.query);

module.exports = connection;
