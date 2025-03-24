import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileBarChart2, Plus, Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

type Props = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
};

const UploadFile = ({ files, setFiles }: Props) => {
  const {
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        ['.pptx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/*': [],
    },
    onDropRejected: (fileRejections) => {
      const fileNames = fileRejections.map((file) => file.file.name);
      toast.error(`文件${fileNames.join(',')}不支持上传`);
    },
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setFiles((prevFiles) => {
        if (prevFiles.length + acceptedFiles.length > 10) {
          toast.error('最多可上传10个文件');
          return prevFiles;
        }

        const newFiles = acceptedFiles.filter((file) =>
          prevFiles.every((f) => f.name !== file.name),
        );
        return [...prevFiles, ...newFiles];
      });
    }
  }, [acceptedFiles, setFiles]);

  const handleDelete = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          'dropzone w-full h-40 flex flex-col gap-2 rounded-lg bg-background border-2 border-dashed border-muted-foreground items-center justify-center cursor-pointer',
          isFocused && 'border-primary',
          isDragAccept && 'border-green-700',
          isDragReject && 'border-red-700',
        )}
      >
        <input {...getInputProps()} />
        <Plus className="size-4 text-foreground" />
        <p className="text-muted-foreground">点击或拖拽文件到此处上传</p>
        <p className="text-muted-foreground">
          支持PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX以及所有文本文件(TXT、MD、CSV等)
        </p>
        <p className="text-muted-foreground">
          最多可上传10个文件,每个文件不超过10MB
        </p>
      </div>
      <ul className="space-y-3">
        {files.map((file) => (
          <li key={file.name + file.size} className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary py-2 px-2.5 bg-background w-full">
              <FileBarChart2 size={16} />
              <span>{file.name}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => handleDelete(file)}
            >
              <Trash2 size={16} />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadFile;
