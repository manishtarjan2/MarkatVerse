"use client";

import React from 'react';
import UserTable from '../components/UserTable';

export default function CustomersPage() {
  return (
    <UserTable 
      title="Customers Management" 
      subtitle="View, edit, and moderate consumer and buyer accounts."
      allowedRoles={['buyer', 'elite', 'CONSUMER']}
    />
  );
}
