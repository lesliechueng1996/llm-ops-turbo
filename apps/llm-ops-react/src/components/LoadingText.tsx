import { LoaderCircle } from 'lucide-react';

type Props = {
  text: string;
};

const LoadingText = ({ text }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <LoaderCircle className="animate-spin" />
      {text}
    </div>
  );
};

export default LoadingText;
