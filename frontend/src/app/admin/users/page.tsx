"use client";

import React from 'react';
import UserTable from './components/UserTable';

export default function AdminUsersPage() {
  return (
    <UserTable 
      title="All Users Management" 
      subtitle="View, edit, and moderate all users across the platform."
    />
  );
}
