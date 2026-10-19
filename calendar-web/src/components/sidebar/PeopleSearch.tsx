import React, { useState } from 'react';
import { Search, UserCheck, UserPlus, Check } from 'lucide-react';
import { MOCK_CONTACTS } from '../../data/mockData';
import { useCalendar } from '../../context/CalendarContext';

export const PeopleSearch: React.FC = () => {
  const { activeOverlaidPeople, togglePersonOverlay } = useCalendar();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredContacts = MOCK_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-3 py-2">
      <div className="relative mb-2">
        <div className="flex items-center w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-2.5 py-1.5 border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-gray-700 transition-all">
          <Search className="w-3.5 h-3.5 text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for people"
            className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Contact Pills / List */}
      <div className="space-y-1">
        {(searchTerm || isFocused ? filteredContacts : MOCK_CONTACTS).map(person => {
          const isOverlaid = activeOverlaidPeople.includes(person.id);

          return (
            <button
              key={person.id}
              type="button"
              onClick={() => togglePersonOverlay(person.id)}
              className={`w-full flex items-center justify-between p-1.5 rounded-xl text-left text-xs transition-colors ${
                isOverlaid
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: person.color }}
                >
                  {person.name.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="font-medium truncate leading-tight">{person.name}</p>
                  <p className="text-[10px] text-gray-400 truncate leading-tight">{person.role}</p>
                </div>
              </div>

              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 ${
                  isOverlaid
                    ? 'border-transparent text-white'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}
                style={{ backgroundColor: isOverlaid ? person.color : undefined }}
              >
                {isOverlaid && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
