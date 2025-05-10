import React from 'react';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  markdownContent: string;
}

const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ title, lastUpdated, markdownContent }) => {
  // Basic styling for now, can be enhanced
  const preStyle: React.CSSProperties = {
    whiteSpace: 'pre-wrap', // Preserves whitespace and newlines
    wordWrap: 'break-word', // Breaks long lines
    fontFamily: 'monospace', // Or your preferred font for markdown
    padding: '20px',
    border: '1px solid #ccc', // Optional: for visual separation
    borderRadius: '8px',
    backgroundColor: 'rgba(var(--songworld-card-rgb), 0.5)', // Use theme color with opacity
    color: 'var(--songworld-text-color)', // Use theme text color
    maxHeight: '70vh',
    overflowY: 'auto',
    tabSize: 4,
  };
  
  // A more structured approach for rendering headers and paragraphs for better styling.
  // This is a simplified parser. For full markdown support, a library like react-markdown is recommended.
  const renderMarkdown = (md: string) => {
    return md.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold my-4 text-songworld-light-primary dark:text-songworld-dark-primary">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold my-3 text-songworld-light-primary dark:text-songworld-dark-primary">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold my-2 text-songworld-light-primary dark:text-songworld-dark-primary">{line.substring(4)}</h3>;
      } else if (line.startsWith('* ')) {
        return <li key={index} className="ml-6 list-disc">{line.substring(2)}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="my-2 leading-relaxed">{line}</p>;
    });
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-2 text-center text-songworld-light-accent dark:text-songworld-dark-accent">{title}</h1>
      <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-8">Last Updated: {lastUpdated}</p>
      
      <div className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto bg-slate-100 dark:bg-slate-800 p-8 rounded-xl shadow-2xl text-songworld-light-text dark:text-songworld-dark-text">
        {renderMarkdown(markdownContent)}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 