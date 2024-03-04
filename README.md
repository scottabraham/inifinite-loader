import React, { useState, useEffect, useRef, useCallback } from 'react';

// Custom hook using IntersectionObserver for infinite scrolling
const useInfiniteScroll = (loadMoreItems: () => void) => {
  const observer = useRef<IntersectionObserver>();
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 1.0 }
    );

    const currentObserver = observer.current;
    const currentAnchor = anchorRef.current;
    if (currentAnchor) {
      currentObserver.observe(currentAnchor);
    }

    return () => {
      if (currentAnchor) {
        currentObserver.unobserve(currentAnchor);
      }
    };
  }, [loadMoreItems]);

  return anchorRef;
};

// Component for rendering the list of items
const TableComponent: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <table>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Component responsible for managing data fetching and state
const QueryComponent: React.FC = () => {
  const [items, setItems] = useState<string[]>(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));

  const loadMoreItems = useCallback(() => {
    setItems(prevItems => [
      ...prevItems,
      ...Array.from({ length: 20 }, (_, i) => `Item ${prevItems.length + i + 1}`),
    ]);
  }, [setItems]);

  const anchorRef = useInfiniteScroll(loadMoreItems);

  return (
    <div style={{ overflowY: 'auto', height: '400px' }}>
      <TableComponent items={items} />
      {/* Anchor element for IntersectionObserver */}
      <div ref={anchorRef} style={{ height: '1px' }} />
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Infinite Scroll with IntersectionObserver</h1>
      <QueryComponent />
    </div>
  );
};

export default App;
