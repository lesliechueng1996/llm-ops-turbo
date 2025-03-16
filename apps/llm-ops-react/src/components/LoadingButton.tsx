import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof Button> & {
  isLoading?: boolean;
  text: string;
};

const LoadingButton = ({ text, isLoading = false, ...props }: Props) => {
  return (
    <Button {...props} disabled={isLoading}>
      {isLoading && <LoaderCircle className="animate-spin" />}
      {text}
    </Button>
  );
};

export default LoadingButton;
