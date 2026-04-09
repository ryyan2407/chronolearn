type LoadingSpinnerProps = {
  label?: string;
};

export function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-300 border-t-amber-600" />
      {label ? <p className="text-sm text-slate-600">{label}</p> : null}
    </div>
  );
}
