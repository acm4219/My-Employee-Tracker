const util = require("util");
const mysql = require("mysql");
const inquirer = require("inquirer");
var figlet = require("figlet");
const cTable = require("console.table");
// const { user, password } = require("../My-Employee-Tracker/config");
const connection = mysql.createConnection({
  host: "localhost",
  user: "employeeDB_admin",
  password: "EmployeeRecorder",
  database: "employees",
});
figlet("Employee Tracker", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
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
        name: "firstName",
        type: "input",
        message: "What is your first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is your last name?",
      },
      {
        name: "roleId",
        type: "input",
        message: "What is your id number?",
      },
      {
        name: "manager",
        type: "input",
        message: "What is your Manager's Name?",
      },
      {
        name: "title",
        type: "input",
        message: "What is your Title?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is your Salary?",
      },
      {
        name: "departmentId",
        type: "input",
        message: "What is your Department's Id?",
      },
      {
        name: "departmentName",
        type: "input",
        message: "What is your Department name?",
      },
    ])
    .then((answers) => {
      connection.query("INSERT INTO employee_info SET ?", {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: answers.roleId,
        manager_name: answers.manager,
      });
      connection.query("INSERT INTO roles SET ?", {
        title: answers.title,
        salary: answers.salary,
        department_id: answers.departmentId,
      });
      connection.query("INSERT INTO department SET ?", {
        name: answers.departmentName,
        department_id: answers.departmentId,
      });
      start();
    });
}

function viewAllEmployees() {
  console.log("Working!");
  connection.query(
    "SELECT * FROM employee_info INNER JOIN roles ON employee_info.id = roles.id",
    function (err, results) {
      if (err) throw err;
      console.table(results);
      start();
    }
  );
}

function updateEmployee() {
  console.log("Working!");
  connection.query("SELECT * FROM employee_info", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          message: "Which Employee Record will you change?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].id);
            }
            return choiceArray;
          },
        },
        {
          name: "firstName",
          type: "input",
          message: "What is your first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is your last name?",
        },
        {
          name: "roleId",
          type: "input",
          message: "What is your id number?",
        },
        {
          name: "manager",
          type: "input",
          message: "What is your Manager's Name?",
        },
        {
          name: "title",
          type: "input",
          message: "What is your Title?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is your Salary?",
        },
        {
          name: "departmentId",
          type: "input",
          message: "What is your Department's Id?",
        },
        {
          name: "departmentName",
          type: "input",
          message: "What is your Department name?",
        },
      ])
      .then((answers) => {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].id === answers.choice) {
            chosenItem = results[i];
          }
        }
        connection.query("UPDATE employee_info SET ? WHERE ?", [
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: answers.roleId,
            manager_name: answers.manager,
          },
          {
            id: chosenItem.id,
          },
        ]);
        connection.query("UPDATE roles SET ? WHERE ?", [
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.departmentId,
          },
          {
            id: chosenItem.id,
          },
        ]);
        connection.query("UPDATE department SET ? WHERE ?", [
          {
            name: answers.departmentName,
            department_id: answers.departmentId,
          },
          {
            id: chosenItem.id,
          },
        ]);
        start();
      });
  });
}
function viewDepartments() {
  console.log("Working!");
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
}
connection.query = util.promisify(connection.query);

module.exports = connection;
