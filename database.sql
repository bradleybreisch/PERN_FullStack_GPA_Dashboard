--CREATE DATABASE grades;

--CREATE TABLE spring24(
--    student_ID int NOT NULL,
--    semester_GPA int NOT NULL,
--    cummaltive_GPA int NOT NULL
--);

--CREATE TABLE testtest(
--    student_ID int NOT NULL,
--    semester_GPA float NOT NULL,
--    cummaltive_GPA float NOT NULL
--);

CREATE TABLE IF NOT EXISTS test (
                id SERIAL PRIMARY KEY,
                Name VARCHAR(255),
                SemesterGPA DECIMAL(3, 2),
                CumulativeGPA DECIMAL(3, 2)
            );