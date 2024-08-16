import React, { useState, useEffect } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function RenderBarCharts() {
  const [gradesData, setGradesData] = useState([]);
  const [tableNames, setTableNames] = useState([]);

  // API call to get all table names
  const getTableNames = async () => {
    try {
      const response = await fetch('http://localhost:5000/getTableNames');
      const tables = await response.json();
      setTableNames(tables);
    } catch (err) {
      console.error(err.message);
    }
  };

  // API call to get the data from a specific table
  const getGrades = async (tableName) => {
    try {
      const response = await fetch('http://localhost:5000/getGrades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'tableName': tableName
        })
      });

      const jsonData = await response.json();
      return jsonData;
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getTableNames();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchGradesData = async () => {
      const allGradesData = await Promise.all(
        tableNames.map(async (tableName) => {
          const grades = await getGrades(tableName);
          return { tableName, grades };
        })
      );
      setGradesData(allGradesData);
    };

    if (tableNames.length > 0) {
      fetchGradesData();
    }
  }, [tableNames]);

  return (
    <div className="scroll-container">
      {gradesData.reverse().map(({ tableName, grades }) => {
        const sortedData = grades.sort((a, b) => a.GPA - b.GPA);
        return (
          <div key={tableName} className="chart-container">
            <h2>Semesterly GPA {tableName}</h2>
            <BarChart width={700} height={300} data={sortedData} margin={{ top: 6, right: 30, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gpa" label={{ value: 'GPA', position: 'insideBottom', offset: -10 }} />
              <YAxis type="number" domain={[0, 20]} label={{ value: 'Member Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </div>
        );
      })}
    </div>
  );
}

export default RenderBarCharts;
