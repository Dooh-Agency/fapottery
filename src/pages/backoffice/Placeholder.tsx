interface PlaceholderProps {
  title: string;
  description: string;
}

const Placeholder = ({ title, description }: PlaceholderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="font-serif text-2xl">{title}</h1>
      <p className="text-muted-foreground font-sans text-sm">{description}</p>
    </div>
  );
};

export default Placeholder;
