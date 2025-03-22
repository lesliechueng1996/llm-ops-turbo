import LabelWrap from '@/components/LabelWrap';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn, handleKeyUpAsClick } from '@/lib/utils';
import { Dispatch, FocusEventHandler, SetStateAction, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const chunkSizeValidator = z
  .string()
  .regex(/^\d{3}$/)
  .transform(Number);

const chunkOverlapValidator = z
  .string()
  .regex(/^\d{2}$/)
  .transform(Number);

export type SplitSettingsRule =
  | {
      processType: 'automatic';
    }
  | {
      processType: 'custom';
      rule: {
        preProcessRule: Array<{
          id: 'remove-extra-space' | 'remove-url-and-email';
          enabled: boolean;
        }>;
        segment: {
          separators: string;
          chunkSize: number;
          chunkOverlap: number;
        };
      };
    };

type Props = {
  rule: SplitSettingsRule;
  onChange: Dispatch<SetStateAction<SplitSettingsRule>>;
};

const defaultCustomSettings: SplitSettingsRule = {
  processType: 'custom',
  rule: {
    preProcessRule: [
      {
        id: 'remove-extra-space',
        enabled: false,
      },
      {
        id: 'remove-url-and-email',
        enabled: false,
      },
    ],
    segment: {
      separators: '\\n',
      chunkSize: 500,
      chunkOverlap: 50,
    },
  },
};

const SplitSettings = ({ rule, onChange }: Props) => {
  const [chunkSize, setChunkSize] = useState(() => {
    if (rule.processType === 'custom') {
      return String(rule.rule.segment.chunkSize);
    }
    return String(defaultCustomSettings.rule.segment.chunkSize);
  });
  const [chunkOverlap, setChunkOverlap] = useState(() => {
    if (rule.processType === 'custom') {
      return String(rule.rule.segment.chunkOverlap);
    }
    return String(defaultCustomSettings.rule.segment.chunkOverlap);
  });

  const updateSeparators = (separators: string) => {
    onChange((data) => {
      if (data.processType === 'custom') {
        return {
          ...data,
          rule: {
            ...data.rule,
            segment: { ...data.rule.segment, separators },
          },
        };
      }
      return data;
    });
  };

  const updateProcessType = (processType: SplitSettingsRule['processType']) => {
    if (processType === rule.processType) {
      return;
    }
    if (processType === 'custom') {
      onChange({
        ...defaultCustomSettings,
      });
    } else {
      onChange({
        processType,
      });
    }
  };

  const updateChunkSize = (chunkSize: number) => {
    onChange((data) => {
      if (data.processType === 'custom') {
        return {
          ...data,
          rule: { ...data.rule, segment: { ...data.rule.segment, chunkSize } },
        };
      }
      return data;
    });
  };

  const updateChunkOverlap = (chunkOverlap: number) => {
    onChange((data) => {
      if (data.processType === 'custom') {
        return {
          ...data,
          rule: {
            ...data.rule,
            segment: { ...data.rule.segment, chunkOverlap },
          },
        };
      }
      return data;
    });
  };

  const handleChunkSizeChange: FocusEventHandler<HTMLInputElement> = (e) => {
    if (rule.processType !== 'custom') {
      return;
    }

    const value = e.target.value;
    const result = chunkSizeValidator.safeParse(value);
    if (result.success) {
      updateChunkSize(result.data);
    } else {
      toast.error('请输入100-1000的整数作为分段最大长度');
      setChunkSize(String(rule.rule.segment.chunkSize));
    }
  };

  const handleChunkOverlapChange: FocusEventHandler<HTMLInputElement> = (e) => {
    if (rule.processType !== 'custom') {
      return;
    }

    const value = e.target.value;
    const result = chunkOverlapValidator.safeParse(value);
    if (result.success) {
      updateChunkOverlap(result.data);
    } else {
      toast.error('请输入0-100的整数作为分段重叠长度');
      setChunkOverlap(String(rule.rule.segment.chunkOverlap));
    }
  };

  const handlePreProcessRuleChange = (id: string) => (checked: boolean) => {
    onChange((data) => {
      if (data.processType !== 'custom') {
        return data;
      }
      return {
        ...data,
        rule: {
          ...data.rule,
          preProcessRule: data.rule.preProcessRule.map((item) => ({
            ...item,
            enabled: item.id === id ? checked : item.enabled,
          })),
        },
      };
    });
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'flex flex-col items-start gap-2.5 w-full py-4 px-5 bg-background rounded-lg border',
          'hover:border-primary',
          rule.processType === 'automatic' && 'border-primary',
        )}
        onClick={() => updateProcessType('automatic')}
        onKeyUp={handleKeyUpAsClick}
      >
        <h2 className="text-sm font-bold">自动分段与清洗</h2>
        <p className="text-sm text-muted-foreground">自动分段与预处理规则</p>
      </div>
      <div
        className={cn(
          'flex flex-col items-start gap-2.5 w-full py-4 px-5 bg-background rounded-lg border',
          'hover:border-primary',
          rule.processType === 'custom' && 'border-primary',
        )}
        onClick={() => updateProcessType('custom')}
        onKeyUp={handleKeyUpAsClick}
      >
        <h2 className="text-sm font-bold">自定义</h2>
        <p className="text-sm text-muted-foreground">
          自定义分段规则、分段长度与预处理规则
        </p>
        {rule.processType === 'custom' && (
          <>
            <Separator className="mb-4" />
            <div className="w-full space-y-4">
              <LabelWrap label="分段标识符" required>
                <Input
                  className="w-full"
                  value={rule.rule.segment.separators}
                  placeholder="请输入分段标识符，如果有多个标识符，请使用英文逗号进行分割"
                  onChange={(e) => updateSeparators(e.target.value)}
                />
              </LabelWrap>
              <LabelWrap label="分段最大长度" required>
                <Input
                  type="number"
                  className="w-full"
                  value={chunkSize}
                  placeholder="请输入100 - 1000的数值"
                  onChange={(e) => setChunkSize(e.target.value)}
                  onBlur={handleChunkSizeChange}
                />
              </LabelWrap>
              <LabelWrap label="分段重叠长度" required>
                <Input
                  type="number"
                  className="w-full"
                  value={chunkOverlap}
                  placeholder="请输入0-100的数值"
                  onChange={(e) => setChunkOverlap(e.target.value)}
                  onBlur={handleChunkOverlapChange}
                />
              </LabelWrap>
              <div>
                <h3 className="text-sm mb-3">文本预处理规则</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remove-extra-space"
                      checked={
                        rule.rule.preProcessRule.find(
                          (item) => item.id === 'remove-extra-space',
                        )?.enabled
                      }
                      onCheckedChange={handlePreProcessRuleChange(
                        'remove-extra-space',
                      )}
                    />
                    <Label
                      htmlFor="remove-extra-space"
                      className="text-xs text-muted-foreground leading-none"
                    >
                      替换掉连续的空格、换行符和制表符
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remove-url-and-email"
                      checked={
                        rule.rule.preProcessRule.find(
                          (item) => item.id === 'remove-url-and-email',
                        )?.enabled
                      }
                      onCheckedChange={handlePreProcessRuleChange(
                        'remove-url-and-email',
                      )}
                    />
                    <label
                      htmlFor="remove-url-and-email"
                      className="text-xs text-muted-foreground leading-none"
                    >
                      删除所有 URL 和电子邮件地址
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SplitSettings;
