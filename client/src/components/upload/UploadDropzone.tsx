import { useRef, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type UploadDropzoneProps = {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  isPending?: boolean;
};

export function UploadDropzone({ onFileSelect, selectedFile, isPending }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileSelect(event.target.files?.[0] ?? null);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    onFileSelect(event.dataTransfer.files?.[0] ?? null);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Upload PDF material</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label
          className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-slate-900">Drop a chapter PDF or click to browse</p>
            <p className="text-sm text-slate-600">Choose a PDF from your device or drag one into this area. Files up to 10 MB are supported.</p>
          </div>
          <input
            accept="application/pdf"
            className="hidden"
            ref={inputRef}
            type="file"
            onChange={handleChange}
          />
          <Button type="button" variant="outline" onClick={handleBrowseClick}>
            Choose file
          </Button>
        </label>
        {selectedFile ? <p className="text-sm text-slate-600">Selected: {selectedFile.name}</p> : null}
        {isPending ? <p className="text-sm text-amber-700">Uploading and parsing PDF...</p> : null}
      </CardContent>
    </Card>
  );
}
