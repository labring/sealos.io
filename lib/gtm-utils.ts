/**
 * Utility function to safely serialize data for GTM tracking
 * Removes circular references and non-serializable values
 */
export function sanitizeForGTM(data: Record<string, any>): Record<string, any> {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    try {
      // Skip functions, DOM elements, and other non-serializable values
      if (
        value === null ||
        value === undefined ||
        typeof value === 'function' ||
        (typeof value === 'object' &&
          value.constructor &&
          (value.constructor.name.includes('Element') ||
            value.constructor.name.includes('Event') ||
            value.constructor.name.includes('Fiber') ||
            value.constructor.name.includes('React')))
      ) {
        continue;
      }

      // Test if the value can be JSON serialized
      JSON.stringify(value);
      result[key] = value;
    } catch (error) {
      // Skip values that can't be serialized
      continue;
    }
  }

  return result;
}
