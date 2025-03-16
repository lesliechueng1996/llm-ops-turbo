import IconInput from '@/components/IconInput';
import { Eye, EyeOff, Lock, LockOpen } from 'lucide-react';
import { type ComponentProps, useState } from 'react';

type Props = Omit<
  ComponentProps<typeof IconInput>,
  'leftIcon' | 'rightIcon' | 'type' | 'onLeftIconClick' | 'onRightIconClick'
>;

const PasswordInput = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const leftIcon = showPassword ? LockOpen : Lock;
  const rightIcon = showPassword ? Eye : EyeOff;
  const inputType = showPassword ? 'text' : 'password';

  return (
    <IconInput
      {...props}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      type={inputType}
      onRightIconClick={() => setShowPassword(!showPassword)}
    />
  );
};

export default PasswordInput;
