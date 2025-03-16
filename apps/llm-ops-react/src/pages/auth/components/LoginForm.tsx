import { credentialLogin } from '@/apis/auth';
import IconInput from '@/components/IconInput';
import LoadingButton from '@/components/LoadingButton';
import PasswordInput from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { ApiError, baseUrl } from '@/lib/http';
import { emailSchema, passwordSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

type FormValue = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: FormValue) => {
    try {
      setLoginLoading(true);
      await credentialLogin(data);

      toast.success('登录成功');
      navigate('/', { replace: true });
    } catch (e) {
      toast.error((e as ApiError).message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGithubClick = async () => {
    try {
      setLoginLoading(true);
      window.location.href = `${baseUrl}/oauth/github`;
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-w-80">
      <h1 className="text-2xl font-bold text-start">登录 LLMOps AppBuilder</h1>
      <p className="text-muted-foreground mb-8">高效开发你的AI原生应用</p>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <IconInput
                    placeholder="登录账号"
                    {...field}
                    leftIcon={User}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput placeholder="账号密码" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            text="登录"
            className="w-full"
            isLoading={loginLoading}
          />
        </form>
      </Form>
      <Separator className="my-7" />
      <Button
        className="w-full"
        variant="secondary"
        disabled={loginLoading}
        onClick={handleGithubClick}
      >
        <SiGithub title="Github" size={16} /> Github
      </Button>
    </div>
  );
};

export default LoginForm;
