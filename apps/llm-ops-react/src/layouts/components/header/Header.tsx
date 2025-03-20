import { ReactNode } from 'react';

type Props = {
  title: string;
  icon: ReactNode;
  actionButton: ReactNode;
  filterGroup: ReactNode;
  searchFilter: ReactNode;
};

const Header = ({
  title,
  icon,
  actionButton,
  filterGroup,
  searchFilter,
}: Props) => {
  return (
    <header className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-full flex items-center justify-center text-accent">
            {icon}
          </div>
          <h1 className="text-xl font-medium">{title}</h1>
        </div>
        {actionButton}
      </div>
      <div className="flex items-center justify-between">
        {filterGroup}
        {searchFilter}
      </div>
    </header>
  );
};

export default Header;
