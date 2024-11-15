import React from 'react';
import DOMPurify from 'dompurify';

export default function SanitizedHtml({ htmlContent }) {
  console.log("Raw HTML Content:", htmlContent); // Log raw content
  
  const sanitizedContent = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: ['p', 'br', 'ul', 'li', 'strong', 'em', 'a'], // Allow p, br, ul, li, strong, em, a tags
  });
  console.log("Sanitized HTML:", sanitizedContent); // Log sanitized content

  return (
    <div
      className="description-content"
      dangerouslySetInnerHTML={{
        __html: sanitizedContent,
      }}
    />
  );
}
