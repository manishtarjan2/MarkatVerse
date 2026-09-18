"use client";

import React from 'react';
import UserTable from '../components/UserTable';

export default function StaffPage() {
  return (
    <UserTable 
      title="Staff Management" 
      subtitle="View, edit, and moderate internal staff and admin accounts."
      allowedRoles={['super_admin', 'catalog_admin', 'onboarding_admin', 'support_admin', 'ADMIN']}
    />
  );
}
