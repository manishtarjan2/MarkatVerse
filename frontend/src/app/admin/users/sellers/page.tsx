"use client";

import React from 'react';
import UserTable from '../components/UserTable';

export default function SellersPage() {
  return (
    <UserTable 
      title="Sellers Management" 
      subtitle="View, edit, and moderate business and seller accounts."
      allowedRoles={['business', 'SELLER']}
    />
  );
}
