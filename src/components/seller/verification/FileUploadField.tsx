
import React from 'react';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface FileUploadFieldProps {
  label: string;
  icon: LucideIcon;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  icon: Icon,
  file,
  onChange,
  accept = "image/*",
  required = false
}) => {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Icon className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">
              {file ? file.name : `Upload ${label}`}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            required={required}
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploadField;
