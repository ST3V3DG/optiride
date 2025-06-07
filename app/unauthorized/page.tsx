// app/unauthorized/page.tsx
import Link from 'next/link';
import React from 'react';

const UnauthorizedPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have the necessary permissions to view this page.</p>
      <p>
        <Link href="/">Go to Homepage</Link>
      </p>
    </div>
  );
};

export default UnauthorizedPage;
