export type RybbitCtaTracking = {
  id: string;
  location: string;
  destination: string;
};

export function toRybbitCtaId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

type RybbitCtaDomProps = {
  'data-rybbit-prop-cta-id': string;
  'data-rybbit-prop-cta-location': string;
  'data-rybbit-prop-cta-destination': string;
};

/**
 * Adds stable business identifiers to the real clickable element so Rybbit's
 * native button autocapture can be queried independently of visible copy.
 */
export function getRybbitCtaProps({
  id,
  location,
  destination,
}: RybbitCtaTracking): RybbitCtaDomProps {
  return {
    'data-rybbit-prop-cta-id': id,
    'data-rybbit-prop-cta-location': location,
    'data-rybbit-prop-cta-destination': destination,
  };
}
