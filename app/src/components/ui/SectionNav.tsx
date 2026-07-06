import { useEffect, useState } from 'react';

interface Section {
  id: string;
  title: string;
}

export default function SectionNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const getScrollElement = () => document.querySelector('.panel.active') || document.querySelector('main') || window;
    
    const handleScroll = () => {
      const scrollElement = getScrollElement();
      // Calculate scroll position. If it's window, use scrollY. Otherwise use scrollTop.
      // Add an offset (e.g. 150) so sections trigger slightly before they hit the absolute top.
      const scrollPosition = (scrollElement === window ? window.scrollY : (scrollElement as HTMLElement).scrollTop) + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(sections[i].id);
          break;
        }
      }
    };
    
    const scrollElement = getScrollElement();
    scrollElement.addEventListener('scroll', handleScroll);
    // Trigger once on mount to set initial active section
    handleScroll();
    
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <nav className="section-nav">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sections.map((sec) => (
          <li key={sec.id}>
            <a 
              href={`#${sec.id}`} 
              className={activeId === sec.id ? 'active' : ''}
              style={{
                textDecoration: 'none',
                color: activeId === sec.id ? 'var(--green)' : 'var(--muted)',
                fontWeight: activeId === sec.id ? 600 : 400,
                display: 'block',
                padding: '4px 0',
                transition: 'color 0.2s',
              }}
            >
              {sec.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
