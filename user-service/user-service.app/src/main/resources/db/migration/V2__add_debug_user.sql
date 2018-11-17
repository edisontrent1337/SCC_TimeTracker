-- adds a user with name 'admin' and password 'password' automatically to the database on launch of application
-- FIXME IMPORTANT: undo this operation in future migrations when development concluded.'
INSERT INTO users VALUES (1,'11111111-1111-1111-1111-111111111111', 'admin', '$2a$10$J6j.9ZaFvspUSUNEsk7RG.ML5gmWyBdErpL0GtCf8/4nZCvIyIPTm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE name = VALUES(name);
