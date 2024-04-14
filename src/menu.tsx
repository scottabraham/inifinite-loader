import React, { createContext, useContext, useState } from 'react';

// Define the MenuEntry type with an optional component property
type MenuEntry = {
  id: string;
  name: string;
  children?: MenuEntry[];
  component?: React.ReactNode;
};

// Define the context type
type MenuContextType = {
  entries: MenuEntry[];
  toggleExpand: (id: string) => void;
};

// Create and export the context
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Custom hook to use the menu context
const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

// MenuProvider component
const MenuProvider: React.FC<{ children: React.ReactNode; entries: MenuEntry[] }> = ({ children, entries }) => {
  const [menuEntries, setMenuEntries] = useState(entries);

  const toggleExpand = (id: string) => {
    setMenuEntries(prevEntries =>
      prevEntries.map(entry => {
        if (entry.id === id) {
          return { ...entry, children: entry.children ? entry.children : [] };
        } else if (entry.children) {
          return { ...entry, children: entry.children.map(subentry => (subentry.id === id ? { ...subentry, children: subentry.children ? subentry.children : [] } : subentry)) };
        }
        return entry;
      })
    );
  };

  return (
    <MenuContext.Provider value={{ entries: menuEntries, toggleExpand }}>
      {children}
    </MenuContext.Provider>
  );
};

// MenuEntryComponent that can render arbitrary components
const MenuEntryComponent: React.FC<{ entry: MenuEntry }> = ({ entry }) => {
  const { toggleExpand } = useMenu();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (entry.children && entry.children.length > 0) {
      toggleExpand(entry.id);
    }
  };

  return (
    <div>
      <div onClick={handleToggle}>
        {entry.component ? entry.component : entry.name}
      </div>
      {isExpanded && entry.children && (
        <div style={{ paddingLeft: '20px' }}>
          {entry.children.map(child => (
            <MenuEntryComponent key={child.id} entry={child} />
          ))}
        </div>
      )}
    </div>
  );
};

// MenuComponent that renders the whole menu structure
const MenuComponent: React.FC = () => {
  const { entries } = useMenu();
  return (
    <div>
      {entries.map(entry => (
        <MenuEntryComponent key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

// Example usage with some arbitrary components
const App: React.FC = () => {
  const initialEntries: MenuEntry[] = [
    {
      id: '1',
      name: 'Main Section',
      children: [
        {
          id: '1-1',
          name: 'Subsection 1',
          component: <input type="text" placeholder="Enter text here" />
        },
        {
          id: '1-2',
          name: 'Subsection 2',
          component: <img src="https://example.com/example.jpg" alt="An example" />
        }
      ]
    },
    {
      id: '2',
      name: 'Another Section',
      component: <button>Click Me!</button>
    }
  ];

  return (
    <MenuProvider entries={initialEntries}>
      <MenuComponent />
    </MenuProvider>
  );
};

export default App;
