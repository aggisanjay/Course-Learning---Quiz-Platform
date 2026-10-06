import React, { useMemo } from 'react';
import { marked } from 'marked';

// Configure marked with GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

export const MarkdownViewer = ({ content = '', className = '' }) => {
  const htmlContent = useMemo(() => {
    if (!content) return '';
    try {
      return marked.parse(content);
    } catch (e) {
      console.error('Error parsing markdown:', e);
      return content;
    }
  }, [content]);

  return (
    <div
      className={`markdown-content text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownViewer;
