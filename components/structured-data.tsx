import { StructuredData, generateStructuredDataScript } from '@/lib/utils/structured-data';

interface StructuredDataProps {
  data: StructuredData | StructuredData[];
}

/**
 * Component to render structured data as JSON-LD script tags
 * This helps search engines understand the content and context of the page
 */
export function StructuredDataComponent({ data }: StructuredDataProps) {
  const jsonLd = generateStructuredDataScript(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}

export default StructuredDataComponent;
