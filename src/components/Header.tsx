import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

const Header = () => {
  const [isNamesVisible, setIsNamesVisible] = useState(false);

  const groupMembers = [
    'ARMEELA',
    'MARYAM MURTAZA',
    'KAINAT ZAHID',
    'IQRA ZUBAIR',
    'AREESHA BATOOL',
    'ESHA WAHAB',
    'USAMA HASSAN',
    'AYESHA SHAFIQ'
  ];

  const toggleNamesVisibility = () => {
    setIsNamesVisible(!isNamesVisible);
  };

  return (
    <header className="bg-gradient-to-r from-violet-700 to-violet-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0 flex flex-col items-center sm:items-start">
          <div 
            onClick={toggleNamesVisibility} 
            className="text-2xl font-bold cursor-pointer hover:text-violet-300 transition-colors"
            aria-expanded={isNamesVisible}
            aria-controls="group-members-list"
          >
            Group 2
          </div>
          <div className="text-xs text-white/80 mt-1">
            Patient Link Scan System
          </div>
          {isNamesVisible && (
            <ul id="group-members-list" className="mt-2 ml-1 text-sm text-white/90 list-disc list-inside bg-violet-600 p-2 rounded">
              {groupMembers.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          )}
        </div>
        <nav className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="ghost" className="text-white hover:bg-violet-700">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:bg-violet-700">
            <Link to="/records">Patient Records</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:bg-violet-700">
            <Link to="/register">Register Patient</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:bg-violet-700">
            <Link to="/scan">Scan Barcode</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
