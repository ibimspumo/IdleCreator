import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const markdownFiles = import.meta.glob('../wiki/*.md', { as: 'raw', eager: true });


const WikiPage = ({ markdownFileName }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMarkdownContent('');

    if (!markdownFileName) {
      setLoading(false);
      return;
    }

    const fullPath = `../wiki/${markdownFileName}`;
    if (markdownFiles[fullPath]) {
      setMarkdownContent(markdownFiles[fullPath]);
      setLoading(false);
    } else {
      setError(new Error(`Markdown file "${markdownFileName}" not found.`));
      setLoading(false);
    }
  }, [markdownFileName]);

  if (loading) {
    return <div className="wiki-content">Loading wiki content...</div>;
  }

  if (error) {
    return <div className="wiki-content">Error: {error.message}</div>;
  }

  if (!markdownContent) {
    return <div className="wiki-content">No wiki content selected.</div>;
  }

  return (
    <div className="wiki-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          p: 'p', // Use default p component
          h1: 'h1', // Use default h1 component
          h2: 'h2', // Use default h2 component
          li: 'li', // Use default li component
          ul: 'ul', // Use default ul component
          ol: 'ol', // Use default ol component
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default WikiPage;