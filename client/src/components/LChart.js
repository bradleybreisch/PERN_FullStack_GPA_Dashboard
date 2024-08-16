import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function RenderLineChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/getAverageGPA')
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(item => ({
                    Semester: item.semester,
                    GPA: parseFloat(item.average_gpa)
                }));
                //console.log(formattedData);
                setData(formattedData);
            })
            .catch(error => console.error('Error fetching GPA data:', error));
    }, []);

    return (
        <div>
            <h2>Historic Chapter GPA Average</h2>
            <LineChart width={700} height={300} data={data} margin={{ top: 6, right: 30, bottom: 10, left: 0 }}>
                <Line type="monotone" dataKey="GPA" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="Semester" label={{ value: 'Semester', position: 'insideBottom', offset: -10 }} />
                <YAxis type="number" domain={[3, 4]} label={{ value: 'Chapter GPA', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
            </LineChart>
        </div>
    );
}

export default RenderLineChart;
