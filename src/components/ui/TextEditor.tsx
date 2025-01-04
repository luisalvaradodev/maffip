import React from 'react';

export function TextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded-md"
    />
  );
}
