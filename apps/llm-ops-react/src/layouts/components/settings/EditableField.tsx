import PasswordInput from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Pencil } from 'lucide-react';
import { FocusEvent, KeyboardEvent, useState } from 'react';
import { useBoolean } from 'usehooks-ts';

type Props = {
  id: string;
  value: string;
  displayValue: string;
  type: 'text' | 'password';
  placeholder?: string;
  isLoading?: boolean;
  onSave: (value: string) => void;
};

const EditableField = ({
  id,
  value,
  displayValue,
  type,
  placeholder,
  isLoading = false,
  onSave,
}: Props) => {
  const {
    value: isEditing,
    setTrue: startEditing,
    setFalse: stopEditing,
  } = useBoolean(false);
  const [text, setText] = useState(type === 'password' ? '' : value);

  const handleSave = () => {
    stopEditing();
    onSave(text);
    setText(type === 'password' ? '' : value);
  };

  const handleCancel = () => {
    stopEditing();
    setText(type === 'password' ? '' : value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (!e.relatedTarget || !(e.relatedTarget instanceof HTMLButtonElement)) {
      handleCancel();
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
      return;
    }
  };

  return (
    <div className="w-full">
      {!isEditing ? (
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">{displayValue}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={startEditing}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <Pencil size={16} />
            )}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 w-full">
          {type === 'text' ? (
            <Input
              type={type}
              id={id}
              value={text}
              placeholder={placeholder}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
            />
          ) : (
            <PasswordInput
              id={id}
              value={text}
              placeholder={placeholder}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
            />
          )}
          <Button variant="secondary" type="button" onClick={handleCancel}>
            取消
          </Button>
          <Button type="button" onClick={handleSave}>
            保存
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
