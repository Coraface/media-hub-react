interface SectionProps<T> {
  title: string;
  data: T[];
  placeholderText: string;
  renderItem: (item: T, index: number) => React.ReactNode;
}

const Section = <T,>({
  title,
  data,
  placeholderText,
  renderItem,
}: SectionProps<T>) => {
  const renderedItems = () => {
    if (data) {
      if (data.length >= 6) {
        // Render only the first 6 items
        return data.slice(0, 6).map((item, index) => renderItem(item, index));
      } else if (data.length > 0 && data.length < 6) {
        // Render items and add invisible cards based on the last item
        return (
          <>
            {data.map((item, index) => renderItem(item, index))}
            {Array.from({ length: 6 - data.length }).map((_, index) => (
              <div key={`invisible-${index}`} className="invisible">
                {renderItem(data[data.length - 1], data.length + index)}
              </div>
            ))}
          </>
        );
      } else {
        // No data, show placeholder
        return <p className="col-span-full text-gray-600">{placeholderText}</p>;
      }
    }
  };

  return (
    <section className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
      <div className="flex flex-row flex-wrap justify-between gap-4">
        {renderedItems()}
      </div>
    </section>
  );
};

export default Section;
