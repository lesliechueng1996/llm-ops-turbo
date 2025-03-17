import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useState } from 'react';
import AccountSettings from './AccountSettings';
import ChannelSettings from './ChannelSettings';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SettingsModal = ({ open, onOpenChange }: Props) => {
  const [activeTab, setActiveTab] = useState<'account' | 'channel'>('account');

  const handleTabClick = (tab: 'account' | 'channel') => () => {
    setActiveTab(tab);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-4xl md:max-w-3xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
          <VisuallyHidden asChild>
            <DialogDescription>设置账号信息与发布渠道</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <div className="w-full flex min-h-[500px] max-h-[600px]">
          <div className="w-1/4 py-3 pr-6 space-y-1.5">
            <button
              type="button"
              className={cn(
                'block w-full text-left py-2 px-3 text-sm rounded-lg hover:bg-muted transition-all cursor-pointer',
                activeTab === 'account' ? 'bg-muted' : '',
              )}
              onClick={handleTabClick('account')}
            >
              账号设置
            </button>
            <button
              type="button"
              className={cn(
                'block w-full text-left py-2 px-3 text-sm rounded-lg hover:bg-muted transition-all cursor-pointer',
                activeTab === 'channel' ? 'bg-muted' : '',
              )}
              onClick={handleTabClick('channel')}
            >
              发布渠道
            </button>
          </div>
          <Separator orientation="vertical" className="h-full" />
          <div className="w-3/4 pl-6 py-3">
            {activeTab === 'account' ? (
              <AccountSettings />
            ) : (
              <ChannelSettings />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
