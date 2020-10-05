const util = require("util");
const mysql = require("mysql");
const inquirer = require("inquirer");
var figlet = require("figlet");
const cTable = require("console.table");
//the const below is connected to the config.js that goes along with keeping your username and password separated you'll need to add the config.js to your .gitignore so no one can see your information
const { user, password } = require("./config");
const connection = mysql.createConnection({
  host: "localhost",
  // you place the key words from the const above into the user and password portion of the connection const
  user: user,
  password: password,
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
        "Remove Employee",
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
      } else if (answer.employeeList === "Remove Employee") {
        deleteEmployee();
      } else if (answer.employeeList === "Exit") {
        connection.end();
      }
    });
}

function addEmployeePrompt() {
  console.log("Let's Add Some Folks:");
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
  console.log("The Gang's All Here:");
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
  console.log("Let's Switch it up!");
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

function deleteEmployee() {
  console.log("We'll Miss You, sad face:");
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
      ])
      .then((answers) => {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].id === answers.choice) {
            chosenItem = results[i];
          }
        }
        connection.query("DELETE FROM employee_info WHERE ?", [
          {
            id: chosenItem.id,
          },
        ]);
        connection.query("DELETE FROM roles WHERE ?", [
          {
            id: chosenItem.id,
          },
        ]);
        connection.query("DELETE FROM department WHERE ?", [
          {
            id: chosenItem.id,
          },
        ]);
        start();
      });
  });
}

function viewDepartments() {
  console.log("Where do I go?");
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
}
connection.query = util.promisify(connection.query);

module.exports = connection;
