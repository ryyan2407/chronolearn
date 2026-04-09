type ProgressProps = {
  value: number;
};

export function Progress({ value }: ProgressProps) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
