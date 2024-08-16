import React, { useState } from 'react';

const Password = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="password-form">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password for JSON Upload"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Password;

