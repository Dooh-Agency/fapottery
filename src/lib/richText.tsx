import { Fragment } from "react";

const renderLinks = (text: string, keyPrefix: string) => {
  const parts = text.split(/(https?:\/\/[^\s<]+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const trailing = part.match(/[),.;!?]+$/)?.[0] ?? "";
      const href = trailing ? part.slice(0, -trailing.length) : part;
      return (
        <Fragment key={`${keyPrefix}-${i}`}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
            {href}
          </a>
          {trailing}
        </Fragment>
      );
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
};

const renderInlineBold = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold">
          {renderLinks(part.slice(2, -2), `bold-${i}`)}
        </strong>
      );
    }
    return <Fragment key={i}>{renderLinks(part, `text-${i}`)}</Fragment>;
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
 * Full http(s) URLs are rendered as safe, clickable external links.
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
