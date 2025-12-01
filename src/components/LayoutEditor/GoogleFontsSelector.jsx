import { useState, useEffect } from 'react';

const GOOGLE_FONTS_API_KEY = 'AIzaSyDcJWI7OlmBv6j8nWkQPp0l7YhDxJT_vQU'; // Public demo key
const POPULAR_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Nunito',
  'Playfair Display',
  'Merriweather'
];

export function GoogleFontsSelector({ value = 'Inter', onChange }) {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadGoogleFonts();
  }, []);

  const loadGoogleFonts = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`
      );
      const data = await response.json();

      if (data.items) {
        // Get top 200 fonts sorted by popularity
        setFonts(data.items.slice(0, 200));
      }
    } catch (error) {
      console.error('Failed to load Google Fonts:', error);
      // Fallback to popular fonts if API fails
      setFonts(POPULAR_FONTS.map(family => ({ family })));
    } finally {
      setLoading(false);
    }
  };

  const loadFont = (fontFamily) => {
    // Dynamically load font from Google Fonts
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
    link.rel = 'stylesheet';

    // Check if already loaded
    const existing = document.querySelector(`link[href*="${fontFamily.replace(/ /g, '+')}"]`);
    if (!existing) {
      document.head.appendChild(link);
    }
  };

  const handleFontSelect = (fontFamily) => {
    loadFont(fontFamily);
    onChange(fontFamily);
    setIsOpen(false);
  };

  const filteredFonts = fonts.filter(font =>
    font.family.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract current font family from value
  const currentFont = value?.replace(/['"]/g, '').split(',')[0] || 'Inter';

  return (
    <div className="google-fonts-selector">
      <div
        className="font-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-preview" style={{ fontFamily: currentFont }}>
          {currentFont}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <>
          <div className="font-selector-overlay" onClick={() => setIsOpen(false)} />
          <div className="font-selector-dropdown">
            <input
              type="text"
              className="font-search"
              placeholder="Search fonts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />

            <div className="font-list">
              {loading ? (
                <div className="font-loading">Loading fonts...</div>
              ) : (
                <>
                  {/* Popular Fonts Section */}
                  {!searchTerm && (
                    <>
                      <div className="font-section-label">Popular Fonts</div>
                      {POPULAR_FONTS.map(fontFamily => (
                        <div
                          key={fontFamily}
                          className={`font-option ${currentFont === fontFamily ? 'selected' : ''}`}
                          onClick={() => handleFontSelect(fontFamily)}
                          style={{ fontFamily }}
                        >
                          {fontFamily}
                        </div>
                      ))}
                      <div className="font-section-label">All Fonts</div>
                    </>
                  )}

                  {/* All Fonts or Search Results */}
                  {filteredFonts.map((font) => {
                    // Skip if already in popular fonts and not searching
                    if (!searchTerm && POPULAR_FONTS.includes(font.family)) {
                      return null;
                    }

                    return (
                      <div
                        key={font.family}
                        className={`font-option ${currentFont === font.family ? 'selected' : ''}`}
                        onClick={() => handleFontSelect(font.family)}
                        onMouseEnter={() => loadFont(font.family)}
                        style={{ fontFamily: font.family }}
                      >
                        {font.family}
                      </div>
                    );
                  })}

                  {filteredFonts.length === 0 && (
                    <div className="font-no-results">No fonts found</div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
