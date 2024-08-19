import React, { useState } from 'react';
//jsonData must have a ."title" name of Sheet1


function FileUpload() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setJsonData(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.readAsText(file);
  };

  const handleUploadClick = async() => {
    /*console.log(jsonData.Sheet1);
    const sheetTitle = Object.keys(jsonData)[0];
    console.log(sheetTitle);
    if (jsonData) {
        jsonData[sheetTitle].forEach((item, index) => {
          console.log(`Object ${index + 1}:`, item);
        });
    }*/
    try {
        const response = await fetch('/uploadGrades', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
            });
    } catch (err) {
        console.error(err.message);
    }
  };

  return (
    <div>
      <h5>Hello, when uploading a file please make sure it is a JSON file with only 3 columns: Name, SemesterGPA, CumulativeGPA, in that exact order, please also make sure that there is only one sheet 
        on the xslx filein the fallowing form: spring2024 or fall2024, with the appropriate year stated. I recommend using https://kinoar.github.io/xlsx-to-json/ to convert your xslx file to JSON. If you do not follow these syntax, the upload will not work properly.
      </h5>
      <div>
        <input type="file" accept=".json" onChange={handleFileUpload} />
        <button onClick={handleUploadClick}>Upload</button>
      </div>
    </div>
  );
}

export default FileUpload;

