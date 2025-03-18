import ImageUpload from '@/components/ImageUpload';
import LabelWrap from '@/components/LabelWrap';
import useAccountStore from '@/stores/account';
import EditableField from './EditableField';
import { updateAvatar, updateName, updatePassword } from '@/apis/account';
import { useState } from 'react';
import {
  UpdatePasswordReqSchema,
  UpdateNameReqSchema,
  UpdateAvatarReqSchema,
} from '@repo/lib-api-schema';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http';

const AccountSetting = () => {
  const { email, avatar, name, setName, setAvatar } = useAccountStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleNameSave = async (value: string) => {
    if (value === name) {
      return;
    }
    const result = UpdateNameReqSchema.safeParse({
      name: value,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    const oldName = name;
    setName(value);

    try {
      setIsLoading(true);
      await updateName(value);
      toast.success('昵称更新成功');
    } catch (error) {
      setName(oldName);
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('昵称更新失败');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async (value: string) => {
    const result = UpdatePasswordReqSchema.safeParse({
      password: value,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      setIsLoading(true);
      await updatePassword(value);
      toast.success('密码更新成功');
    } catch (error) {
      toast.error('密码更新失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (url: string | null) => {
    if (!url) {
      toast.error('上传头像失败');
      return;
    }

    const result = UpdateAvatarReqSchema.safeParse({
      avatar: url,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      await updateAvatar(url);
      setAvatar(url);
      toast.success('头像更新成功');
    } catch (error) {
      toast.error('头像更新失败');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold">账号设置</h1>

      <div className="space-y-6">
        <LabelWrap label="账号头像" htmlFor="avatar" required>
          <ImageUpload
            id="avatar"
            alt="账号头像"
            imageUrl={avatar}
            required
            className=" rounded-full"
            onAutoUpload={handleAvatarUpload}
          />
        </LabelWrap>

        <LabelWrap label="账号昵称" htmlFor="name" required>
          <EditableField
            id="name"
            value={name}
            displayValue={name}
            type="text"
            isLoading={isLoading}
            onSave={handleNameSave}
          />
        </LabelWrap>

        <LabelWrap label="账号密码" htmlFor="password" required>
          <EditableField
            id="password"
            value={'123'}
            displayValue={'********'}
            type="password"
            isLoading={isLoading}
            onSave={handlePasswordSave}
          />
        </LabelWrap>

        <LabelWrap label="绑定邮箱" htmlFor="email" required>
          <span className="text-sm text-muted-foreground">{email}</span>
        </LabelWrap>
      </div>
    </div>
  );
};

export default AccountSetting;
