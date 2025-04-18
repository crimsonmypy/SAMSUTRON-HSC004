// components/Header.jsx
import React from 'react';

function Header() {
  return (
    <header className="bg-gray-800 border-b border-orange-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">Urocheck Analyzer</h1>
          <p className="text-sm text-gray-400">Professional Urine Analysis Tool</p>
        </div>
      </div>
    </header>
  );
}

export default Header;