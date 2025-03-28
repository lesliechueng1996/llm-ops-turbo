import { ComponentProps, ReactNode } from 'react';
import Header from './components/header/Header';

type Props = {
  children: ReactNode;
} & ComponentProps<typeof Header>;

const HeaderLayout = ({ children, ...rest }: Props) => {
  return (
    <div className="px-6 py-5 space-y-6">
      <Header {...rest} />
      <div>{children}</div>
    </div>
  );
};

export default HeaderLayout;
