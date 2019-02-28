CREATE TABLE achievements (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    activity_uuid VARCHAR(255) NOT NULL,
    owner_uuid VARCHAR(255) NOT NULL,
    uuid VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    from_date DATETIME,
    to_date DATETIME,
    duration bigint(20),
    progress FLOAT (20,10),
    PRIMARY KEY (id)
);