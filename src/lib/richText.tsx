import { Fragment } from "react";

const renderInlineBold = (text: string) => {
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

/**
 * Renders plain text where `**word**` segments become <strong> (semibold).
 * Intentionally not full markdown/HTML — keeps the backoffice textarea safe
 * (no injected tags) while still letting editors highlight a few words.
 */
export const renderBoldText = (text: string) => {
  return renderInlineBold(text);
};

/**
 * Renders `:::destacado ... :::` blocks as editorial callouts in activity
 * descriptions. The marker is inserted by the backoffice toolbar, so editors
 * can create the same visual hierarchy without allowing arbitrary HTML.
 */
export const renderActivityDescription = (text: string) => {
  const parts = text.split(/(:::\s*destacado\n[\s\S]*?\n:::)/g);
  return parts.map((part, i) => {
    const match = part.match(/^:::\s*destacado\n([\s\S]*?)\n:::\s*$/);
    if (match) {
      return (
        <div key={i} className="my-5 border-l-4 border-foreground bg-muted px-5 py-4 text-foreground">
          {renderInlineBold(match[1])}
        </div>
      );
    }
    return <Fragment key={i}>{renderInlineBold(part)}</Fragment>;
  });
};

export const stripActivityDescriptionMarkup = (text: string) =>
  text.replace(/:::\s*destacado\n([\s\S]*?)\n:::/g, "$1");
