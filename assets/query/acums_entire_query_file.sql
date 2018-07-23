create table company_tbl(
	companyId int primary key AUTO_INCREMENT,
    companyName varchar(100),
    city varchar(100),
    email varchar(200),
    phone varchar(50),
    mobile varchar(50),
    description varchar(500),
    entryDate datetime DEFAULT CURRENT_TIMESTAMP
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

create table doctor_tbl(
    doctorId int primary key AUTO_INCREMENT,
    companyId int references company_tbl(companyId),
    fullName varchar(100),
    address varchar(500),
    email varchar(200),
    mobile varchar(50),
    licenceNo varchar(100),
    specialization varchar(100),
    category varchar(100),
    serviceCharge decimal(18,2),
    description varchar(500),
    entryDate datetime DEFAULT CURRENT_TIMESTAMP
);

create table patient_tbl(
    patientId int primary key AUTO_INCREMENT,
    companyId int REFERENCES company_tbl(companyId),
    patientCode varchar(15),
    patientName varchar(100),
    mobile varchar(50),
    age varchar(5),
    place varchar(100),
    address varchar(500),
    email varchar(200),
    entryDate datetime default CURRENT_TIMESTAMP
);


create table diagnosis_tbl(
	diagnosisId int primary key AUTO_INCREMENT,
    companyId int REFERENCES company_tbl(companyId),
    prefix varchar(10) default 'DG',
    diagnosisCode int,
    diagnosisDate date,
    patientId int references patient_tbl(patientId),
    doctorId int REFERENCES doctor_tbl(doctorId),
	diagnosisDetails varchar(1000),
    medicineDetails varchar(1000),
    accupunctureChannel varchar(200),
    status varchar(50),--Booked, Open, Closed
    description varchar(500),
    entryDate datetime default CURRENT_TIMESTAMP
);

alter table patient_tbl add patientCodeOld varchar(15);