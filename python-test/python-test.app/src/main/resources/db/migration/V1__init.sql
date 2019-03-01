CREATE TABLE test_results (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    martriculation_number int(20) NOT NULL,
    creation_date DATETIME NOT NULL,
    answers VARCHAR(255) NOT NULL,
    uuid VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE correct_answers (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    creation_date DATETIME NOT NULL,
    answers VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

