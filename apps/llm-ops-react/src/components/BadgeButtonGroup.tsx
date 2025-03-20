import BadgeButton from './BadgeButton';

type Props = {
  badges: Array<{
    key: string;
    label: string;
  }>;
  activeKey: string;
  onChange: (key: string) => void;
};

const BadgeButtonGroup = ({ badges, activeKey, onChange }: Props) => {
  return (
    <div className="flex gap-1">
      {badges.map((badge) => (
        <BadgeButton
          key={badge.key}
          label={badge.label}
          isActive={activeKey === badge.key}
          onClick={() => onChange(badge.key)}
        />
      ))}
    </div>
  );
};

export default BadgeButtonGroup;
