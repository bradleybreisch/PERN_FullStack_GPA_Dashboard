import React from 'react';
import Navbar from "./components/Navbar";
import RenderBarChart from "./components/BChart";
import RenderLineChart from "./components/LChart";
import RenderSemesterlyDataTable from "./components/SemesterlyTable";
import RenderCumulativeDataTable from './components/CumulativeTable';
import ProtectedFileUpload from './components/ProtectedFileUpload';

function App() {
  return (
    <div>
      <Navbar />
      <div className='center'>
        <div id='semesterly-data-table'>
          <RenderSemesterlyDataTable className='center' />
        </div>
        <div id='cumulative-data-table'>
          <RenderCumulativeDataTable className='center' />
        </div>
        <div id='line-chart'>
          <RenderLineChart className='center' />
        </div>
        <div id='bar-chart'>
          <RenderBarChart className='center' />
        </div>
        <div id='file-upload'>
          <ProtectedFileUpload />
        </div>
        <h7>Bradley Breisch</h7>
      </div>
    </div>
  );
}

export default App;


