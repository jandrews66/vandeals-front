import DOMPurify from 'dompurify';

// Helper function to decode HTML entities
function decodeHtmlEntities(text) {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent || doc.documentElement.innerText;
}

// Reusable component to render sanitized HTML
export default function SanitizedHtml({ htmlContent }) {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(decodeHtmlEntities(htmlContent))
            }}
        />
    );
}
