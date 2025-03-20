import FormFooter from '@/components/FormFooter';
import ImageUpload, { ImageUploadRef } from '@/components/ImageUpload';
import LabelWrap from '@/components/LabelWrap';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useSpaceCreateModal from '@/stores/space-create-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: '名称不能为空' })
    .max(100, { message: '名称不能超过100个字符' }),
  description: z.string().max(2000, { message: '描述不能超过2000个字符' }),
});

type BasicForm = z.infer<typeof formSchema>;

type DatasetForm = BasicForm & {
  icon: string;
};

type Props = {
  defaultValues: DatasetForm;
  onSubmit: (data: DatasetForm) => void;
};

const DatasetForm = ({ defaultValues, onSubmit }: Props) => {
  const { closeModal } = useSpaceCreateModal();
  const uploadRef = useRef<ImageUploadRef>(null);

  const form = useForm<BasicForm>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: BasicForm) => {
    // const icon = await uploadRef.current?.uploadImage();
    onSubmit({ ...data, icon: '' });
  };

  const handleCancel = () => {
    form.reset();
    closeModal();
  };

  return (
    <div className="space-y-8">
      <LabelWrap label="知识库图标" htmlFor="icon" required>
        <ImageUpload
          id="icon"
          ref={uploadRef}
          alt="知识库图标"
          imageUrl={defaultValues.icon}
          required
        />
      </LabelWrap>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 px-1"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required-label">知识库名称</FormLabel>
                <FormControl>
                  <Input
                    placeholder="知识库名称不能为空"
                    {...field}
                    maxLength={100}
                  />
                </FormControl>
                <FormDescription>{field.value.length}/100</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>知识库描述</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="输入知识库内容的描述"
                    {...field}
                    maxLength={2000}
                  />
                </FormControl>
                <FormDescription>{field.value.length}/2000</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormFooter onCancel={handleCancel} />
        </form>
      </Form>
    </div>
  );
};

export default DatasetForm;
