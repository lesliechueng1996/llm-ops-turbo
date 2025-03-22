import { ChevronLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { defineStepper } from '@stepperize/react';
import { Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UploadFile from './components/UploadFile';
import SplitSettings, { SplitSettingsRule } from './components/SplitSettings';
import DataProcess from './components/DataProcess';
import { toast } from 'sonner';

const { useStepper, steps, utils } = defineStepper(
  {
    id: 'upload-file',
    title: '上传',
    description: '上传文件',
  },
  {
    id: 'split-settings',
    title: '分段设置',
    description: '设置分段方式',
  },
  {
    id: 'data-process',
    title: '数据处理',
    description: '处理数据',
  },
);

const BatchFilePage = () => {
  const { id } = useParams();
  const stepper = useStepper();

  const currentIndex = utils.getIndex(stepper.current.id);

  const [files, setFiles] = useState<File[]>([]);
  const [splitSettingsRule, setSplitSettingsRule] = useState<SplitSettingsRule>(
    {
      processType: 'automatic',
    },
  );

  const handleNext = () => {
    if (stepper.current.id === 'upload-file' && files.length === 0) {
      toast.error('请上传文件');
      return;
    }
    stepper.next();
  };

  return (
    <div className="px-3 py-1 h-full flex flex-col">
      <header className="shrink-0 min-h-0 flex items-center gap-3 py-4">
        <Link to={`/space/dataset/${id}/document`}>
          <ChevronLeft className="size-4" />
        </Link>
        <h1 className="text-lg font-bold">添加文件</h1>
      </header>
      <nav aria-label="Steps" className="shrink-0 min-h-0 group py-2 mb-10">
        <ol
          className="flex items-center justify-between gap-2 w-xl mx-auto"
          aria-orientation="horizontal"
        >
          {stepper.all.map((step, index, array) => (
            <Fragment key={step.id}>
              <li className="flex items-center gap-4 flex-shrink-0">
                <Button
                  type="button"
                  role="tab"
                  variant={index <= currentIndex ? 'default' : 'outline'}
                  aria-current={
                    stepper.current.id === step.id ? 'step' : undefined
                  }
                  aria-posinset={index + 1}
                  aria-setsize={steps.length}
                  aria-selected={stepper.current.id === step.id}
                  className="flex size-10 items-center justify-center rounded-full cursor-default"
                >
                  {index + 1}
                </Button>
                <span className="text-sm font-medium">{step.title}</span>
              </li>
              {index < array.length - 1 && (
                <Separator
                  className={`flex-1 ${
                    index < currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </Fragment>
          ))}
        </ol>
      </nav>
      <div className="grow overflow-auto px-8">
        {stepper.switch({
          'upload-file': () => <UploadFile files={files} setFiles={setFiles} />,
          'split-settings': () => (
            <SplitSettings
              rule={splitSettingsRule}
              onChange={setSplitSettingsRule}
            />
          ),
          'data-process': () => <DataProcess />,
        })}
      </div>
      <div className="shrink-0 min-h-0 flex justify-end items-center gap-4 py-3">
        {stepper.isLast ? (
          <span className="text-sm text-muted-foreground">
            点击确认不影响数据处理，处理完毕后可进行引用
          </span>
        ) : stepper.isFirst ? null : (
          <Button
            variant="outline"
            onClick={stepper.prev}
            disabled={stepper.isFirst}
          >
            上一步
          </Button>
        )}
        <Button onClick={handleNext}>
          {stepper.isLast ? '确认' : '下一步'}
        </Button>
      </div>
    </div>
  );
};

export default BatchFilePage;
