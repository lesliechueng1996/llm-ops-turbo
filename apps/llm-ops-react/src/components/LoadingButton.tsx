import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof Button> & {
  isLoading?: boolean;
  text: string;
};

const LoadingButton = ({ text, isLoading = false, ...props }: Props) => {
  return (
    <Button {...props} disabled={isLoading}>
      {isLoading && <Loader2 className="animate-spin" />}
      {text}
    </Button>
  );
};

export default LoadingButton;
