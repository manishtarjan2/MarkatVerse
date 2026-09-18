"use client";

import React from 'react';
import UserTable from '../components/UserTable';

export default function DeliveryPartnersPage() {
  return (
    <UserTable 
      title="Delivery Partners" 
      subtitle="View, edit, and moderate delivery partner accounts."
      allowedRoles={['delivery']}
    />
  );
}
