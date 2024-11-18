import React from 'react';
import DOMPurify from 'dompurify';

export default function SanitizedHtml({ htmlContent }) {  
  const sanitizedContent = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: ['p', 'br', 'ul', 'li', 'strong', 'em', 'a'], // Allow p, br, ul, li, strong, em, a tags
  });

  return (
    <div
      className="description-content"
      dangerouslySetInnerHTML={{
        __html: sanitizedContent,
      }}
    />
  );
}
