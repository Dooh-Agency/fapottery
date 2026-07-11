import { Fragment } from "react";

/**
 * Renders plain text where `**word**` segments become <strong> (semibold).
 * Intentionally not full markdown/HTML — keeps the backoffice textarea safe
 * (no injected tags) while still letting editors highlight a few words.
 */
export const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
};
