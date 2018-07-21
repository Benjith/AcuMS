create table company_tbl(
	companyId int primary key AUTO_INCREMENT,
    companyName varchar(100),
    city varchar(100),
    email varchar(200),
    phone varchar(50),
    mobile varchar(50),
    description varchar(500),
    entryDate datetime DEFAULT CURRENT_TIMESTAMP()
);

create TABLE user_tbl(
	userId int primary key AUTO_INCREMENT,
    companyId int REFERENCES company_tbl(companyId),
    fullName varchar(100),
    email varchar(200),
    mobile varchar(50),
    userType varchar(20),
    userName varchar(50),
    password varchar(50),
    isActive bit default true,
    entryDate datetime default CURRENT_TIMESTAMP
);

