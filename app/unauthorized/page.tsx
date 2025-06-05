// app/unauthorized/page.tsx
import React from 'react';

const UnauthorizedPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have the necessary permissions to view this page.</p>
      <p>
        <a href="/">Go to Homepage</a>
      </p>
    </div>
  );
};

export default UnauthorizedPage;
