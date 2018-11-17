CREATE TABLE users (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    uuid VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    registrationdate DATETIME NOT NULL,
    lastlogin DATETIME,
    PRIMARY KEY (id)
);