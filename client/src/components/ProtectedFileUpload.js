import React, { useState } from 'react';
import Password from './Password';
import FileUpload from './FileUpload'; // Your existing upload component

const ProtectedFileUpload = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //const correctPassword = process.env.REACT_APP_UPLOAD_PASSWORD; // Store your password securely

  const handlePasswordSubmit = async(password) => {
    const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

    const result = await response.json();
        if (result.success) {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

  return (
    <div className="protected-file-upload">
      {isAuthenticated ? (
        <FileUpload />
      ) : (
        <Password onPasswordSubmit={handlePasswordSubmit} />
      )}
    </div>
  );
};

export default ProtectedFileUpload;

