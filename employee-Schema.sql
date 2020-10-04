drop DATABASE if not EXISTS employees;
CREATE DATABASE employees;
use employees;
create table employee_info
(
    id int
    auto_increment not null,
first_name varchar
    (30) null,
last_name varchar
    (30) null,
role_id int, 
manager_name varchar
    (30),
    primary key
    (id)
);

    create table department
    (
        id int
        auto_increment not null,
name varchar
        (30) null,
 department_id int,
primary key
        (id)
);

        create table roles
        (
            id int
            auto_increment not null,
title varchar
            (30) null,
salary decimal,
department_id int,
primary key
            (id)
);