import React, { createContext, useContext, useState } from "react";

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
};

// Create and export the context
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Custom hook to use the menu context
const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

// MenuProvider component
const MenuProvider: React.FC<{
  children: React.ReactNode;
  entries: MenuEntry[];
}> = ({ children, entries }) => {
  return (
    <MenuContext.Provider value={{ entries }}>{children}</MenuContext.Provider>
  );
};

// MenuEntryComponent that can render arbitrary components
const MenuEntryComponent: React.FC<{ entry: MenuEntry }> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div onClick={handleToggle}>
        {entry.component ? entry.component : entry.name}
      </div>
      {isExpanded && entry.children && (
        <div style={{ paddingLeft: "20px" }}>
          {entry.children.map((child) => (
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
      {entries.map((entry) => (
        <MenuEntryComponent key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

// Example usage with some arbitrary components
const App: React.FC = () => {
  const initialEntries: MenuEntry[] = [
    {
      id: "1",
      name: "Main Section",
      children: [
        {
          id: "1-1",
          name: "Subsection 1",
          component: <input type="text" placeholder="Enter text here" />,
        },
        {
          id: "1-2",
          name: "Subsection 2",
          component: (
            <img src="https://picsum.photos/200" alt="An example" />
          ),
        },
      ],
    },
    {
      id: "2",
      name: "Another Section",
      children: [
        {
          id: "2-1",
          name: "button",
          component: <button>Click Me!</button>,
        },
      ],
    },
    {
      id: "3",
      name: "list",
      children: [
        {
          id: "3-1",
          name: "list items",
          component: (
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ul>
          ),
        },
      ],
    },
  ];

  return (
    <MenuProvider entries={initialEntries}>
      <MenuComponent />
    </MenuProvider>
  );
};

export default App;
