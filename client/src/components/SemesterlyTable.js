import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
//using AG Grid https://www.ag-grid.com/react-data-grid/getting-started/ React Library for Data Tables


//Used for AG Grid columnDefs
const columnDefs = [
    {field: 'name'},
    {field: 'semestergpa'},
    {field: 'cumulativegpa'}
];
function RenderSemesterlyDataTable() {
    
    //used to hold retrived data from /topGradesSem api call
    const [grades, setGrades] = useState([]);
    const [tableName, setTableName] = useState("");
    
    //calls /topGradesSem api
    //need to make modular by being able to pass down table name to correclate with the latest semester
    const getGrades = async (tableName) => {
        try {
            console.log('Cumulative Table get Grades Initiated');
            const response = await fetch('http://localhost:5000/topGradesSem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tableName })
            });
            const jsonData = await response.json();
            setGrades(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getTableName = async () => {
        try {
            console.log('Cumulative Table get table Name Initiated');
            const response = await fetch('http://localhost:5000/getRecentTable');
            const title = await response.json();
            setTableName(title);
            console.log(title);
            return title;
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const title = await getTableName();
            if (title) {
                getGrades(title);
            }
        };

        fetchData();
    }, []);
    return(
        // wrapping container with theme & size
        <div>
        <h2>Top 10 Semester GPA's from {tableName}</h2>
        <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: 500, width: 700}} // the Data Grid will fill the size of the parent container
        >
            <AgGridReact
                rowData={grades}
                columnDefs={columnDefs}/>
        </div>
        </div>
    );
}

export default RenderSemesterlyDataTable;