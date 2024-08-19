const cors = require("cors");
const express = require("express");
const pool = require("./db");
const app = express();
const path = require("path");
require('dotenv').config();
const PORT = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "client/build")));
}

console.log(__dirname);
console.log(path.join(__dirname, "client/build"));

//Add Semesterly Data
//need to learn more about uploading data on the front end before

app.post('/uploadGrades', async (req, res) => {
    try {
        //console.log("/grades post initiated");
        const sheetTitle = Object.keys(req.body)[0];
        //console.log(sheetTitle);

        // Create the new table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${sheetTitle} (
                id SERIAL PRIMARY KEY,
                Name VARCHAR(255),
                SemesterGPA DECIMAL(3, 2),
                CumulativeGPA DECIMAL(3, 2)
            )
        `;
        await pool.query(createTableQuery);

        if (req.body) {
            req.body[sheetTitle].forEach((item, index) => {
                //console.log(`Object ${index + 1}:`, item);
                // Insert data into the new table
                const insertQuery = `
                    INSERT INTO ${sheetTitle} (Name, SemesterGPA, CumulativeGPA)
                    VALUES ($1, $2, $3)
                `;
                pool.query(insertQuery, [item.Name, item.SemesterGPA, item.CumulativeGPA]);
            });
        }

        res.status(200).send("Table created and data inserted successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



/* Used for testtest table
app.post('/grades', async(req, res) => {
    try {
        const { student_id, semester_gpa, cummaltive_gpa } = req.body;
        const newRow = await pool.query('INSERT INTO testtest (student_id, semester_gpa, cummaltive_gpa) VALUES ($1, $2, $3) RETURNING *',
      [student_id, semester_gpa, cummaltive_gpa]
    );
        res.json(newRow.rows);
        console.log(req.body);
    } catch (err) {
        console.error(err.message);
    }
})
*/

//Get Semesterly Data, used for semester bar chart
//need to make modular for all semester tables
app.post('/getGrades', async(req, res) => {
    try{
        console.log('/grades get initiated');
        const { tableName } = req.body;
        const getRows = await pool.query('SELECT semestergpa AS GPA, COUNT(*) AS Count FROM ' + tableName + ' GROUP BY semestergpa ORDER BY semestergpa');
        res.json(getRows.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//Get Top 10 Semesterly GPAs from recent semester, used for top 10 semesterly GPA's
//need to make modular for most recent semester table name
app.post('/topGradesSem', async(req, res) => {
    try {
        console.log('/topGradesSem initiated');
        const { tableName } = req.body;
        const query = 'SELECT * FROM ' + tableName + ' ORDER BY semestergpa DESC LIMIT 10';
        const getTopTen = await pool.query(query);
        res.json(getTopTen.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//Get Top 10 Cumulative GPAs from recent semester
app.post('/topGradesCum', async(req, res) => {
    try {
        const { tableName } = req.body;
        const query = 'SELECT * FROM ' + tableName + ' ORDER BY cumulativegpa DESC LIMIT 10';
        const getTopTen = await pool.query(query);
        res.json(getTopTen.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//Get the names of all tables stored in the sql database
app.get('/getTableNames', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      const tableNames = result.rows.map(row => row.table_name);
      res.json(tableNames);
    } catch (error) {
      console.error('Error fetching table names:', error);
      res.status(500).send('Server error');
    }
  });

//Get the name of the most recently created table in the SQL database, used for displaying the most recent semester table data
app.get('/getRecentTable', async (req, res) => {
    try {
      console.log('/getRecentTable intiated')
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      const tableNames = result.rows.map(row => row.table_name);
      res.json(tableNames[tableNames.length - 1]);
    } catch (error) {
      console.error('Error fetching table name:', error);
      res.status(500).send('Server error');
    }
  });

  //API call to verify password before displaying file upload
  app.post('/api/verify-password', (req, res) => {
    console.log('/api/verify-password initaiated');
    const { password } = req.body;
    if (password === process.env.UPLOAD_PASSWORD) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });

  //API call to return the name and average semesterGPA of each table for line chart
  app.get('/getAverageGPA', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        const tableNames = result.rows.map(row => row.table_name);

        const gpaPromises = tableNames.map(async (tableName) => {
            const gpaResult = await pool.query(`SELECT AVG(semestergpa) as average_gpa FROM ${tableName}`);
            return {
                semester: tableName,
                average_gpa: parseFloat(gpaResult.rows[0].average_gpa).toFixed(2)
            };
        });

        const gpaData = await Promise.all(gpaPromises);
        res.json(gpaData);
    } catch (error) {
        console.error('Error fetching average GPA:', error);
        res.status(500).send('Server error');
    }
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
  

app.listen(PORT, () => {
    console.log('App has started on port ${PORT}')
});
