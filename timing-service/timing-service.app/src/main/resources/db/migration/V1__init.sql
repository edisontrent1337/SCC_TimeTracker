CREATE TABLE activities (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    uuid VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    creation_date DATETIME NOT NULL,
    modification_date DATETIME NOT NULL,
    owner_uuid VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE activity_records (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    activity_uuid VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    minutes bigint(20),
    PRIMARY KEY (id)
);