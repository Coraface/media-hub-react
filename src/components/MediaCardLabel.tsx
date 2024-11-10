interface MediaInfo {
  label: string;
  value: string | number;
}

export default function MediaCardLabel({ label, value }: MediaInfo) {
  return (
    <div>
      <span className="text-2xl font-semibold text-gray-400">{label}</span>
      <p className="text-lg text-gray-300">{value}</p>
    </div>
  );
}
