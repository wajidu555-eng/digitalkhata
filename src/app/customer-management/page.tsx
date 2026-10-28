import React from 'react';
import AppLayout from '@/components/AppLayout';
import CustomerWorkspace from './components/CustomerWorkspace';

export default function CustomerManagementPage() {
  return (
    <AppLayout>
      <CustomerWorkspace />
    </AppLayout>
  );
}