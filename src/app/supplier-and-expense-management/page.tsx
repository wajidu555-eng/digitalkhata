import React from 'react';
import AppLayout from '@/components/AppLayout';
import PayablesWorkspace from './components/PayablesWorkspace';

export default function SupplierAndExpenseManagementPage() {
  return (
    <AppLayout>
      <PayablesWorkspace />
    </AppLayout>
  );
}