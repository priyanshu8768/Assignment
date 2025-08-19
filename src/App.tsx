import { useState } from 'react';
import { InputField } from './components/InputField/InputField';
import { DataTable } from './components/DataTable/DataTable';
import type { Column } from './components/DataTable/DataTable';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: Column<User>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
];

const initialData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

function App() {
  const [inputValue, setInputValue] = useState('');
  const [gmailValue, setGmailValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const loading = false;

  // Only keep selected rows that are present in the current table data
  const userRowId = initialData.length + 1;
  const isUserRowValid = inputValue.length >= 3 && /^\S+@gmail\.com$/.test(gmailValue);
  const currentTableData = [
    ...initialData,
    ...(isUserRowValid ? [{ id: userRowId, name: inputValue, email: gmailValue }] : [])
  ];
  // Remove any selected rows that are not in the current table
  if (selectedRows.some(sel => !currentTableData.find(row => row.id === sel.id))) {
    setSelectedRows(selectedRows.filter(sel => currentTableData.find(row => row.id === sel.id)));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100 animate-slide-up">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 tracking-tight">Welcome!</h2>
        <InputField
          label="Name"
          placeholder="Enter your name"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          helperText="Please enter your full name."
          variant="filled"
          size="md"
          invalid={inputValue.length > 0 && inputValue.length < 3}
          errorMessage={inputValue.length > 0 && inputValue.length < 3 ? 'Name must be at least 3 characters' : ''}
        />
        <div className="mt-4" />
        <InputField
          label="Gmail"
          placeholder="Enter your Gmail address"
          value={gmailValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGmailValue(e.target.value)}
          helperText="Please enter a valid Gmail address."
          variant="filled"
          size="md"
          invalid={gmailValue.length > 0 && !/^\S+@gmail\.com$/.test(gmailValue)}
          errorMessage={gmailValue.length > 0 && !/^\S+@gmail\.com$/.test(gmailValue) ? 'Please enter a valid Gmail address' : ''}
        />
      </div>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-gray-100 animate-slide-up delay-100">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">User Data Table</h2>
        <DataTable<User>
          data={
            [
              ...initialData,
              ...(inputValue.length >= 3 && /^\S+@gmail\.com$/.test(gmailValue)
                ? [{
                    id: initialData.length + 1,
                    name: inputValue,
                    email: gmailValue
                  }]
                : [])
            ]
          }
          columns={columns}
          loading={loading}
          selectable
          onRowSelect={setSelectedRows}
        />
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Selected Rows:</span> {
            (() => {
              // Only show unique, currently visible names
              const visibleIds = new Set(currentTableData.map(r => r.id));
              const uniqueNames = Array.from(
                new Set(
                  selectedRows
                    .filter(r => visibleIds.has(r.id))
                    .map(r => r.name)
                )
              );
              return uniqueNames.length > 0 ? uniqueNames.join(', ') : 'None';
            })()
          }
        </div>
      </div>
    </div>
  );
}

export default App;
