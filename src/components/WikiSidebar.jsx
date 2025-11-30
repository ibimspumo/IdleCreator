import React from 'react';

const markdownFilesContext = import.meta.glob('../wiki/*.md', { eager: true });

const getFileNames = () => {
  return Object.keys(markdownFilesContext).map(path => {
    const parts = path.split('/');
    return parts[parts.length - 1];
  }).sort();
};

const WikiSidebar = ({ onArticleSelect, selectedArticle }) => {
  const fileNames = getFileNames();

  return (
    <div className="wiki-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Wiki Artikel</span>
      </div>
      <ul className="wiki-article-list">
        {fileNames.map(fileName => (
          <li key={fileName}>
            <button
              className={`wiki-article-item ${selectedArticle === fileName ? 'active' : ''}`}
              onClick={() => onArticleSelect(fileName)}
            >
              {fileName.replace('.md', '')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WikiSidebar;
