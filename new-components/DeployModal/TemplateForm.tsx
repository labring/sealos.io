'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TemplateInput } from '@/hooks/use-template-source';
import { useDeployModal } from './DeployModalContext';

interface TemplateFormFieldProps {
  input: TemplateInput;
}

function TemplateFormField({ input }: TemplateFormFieldProps) {
  const { formData, setFormValue } = useDeployModal();
  const value = formData[input.key];

  switch (input.type) {
    case 'boolean':
      return (
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Label htmlFor={input.key} className="text-sm font-medium text-foreground">
              {input.label}
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              {input.description}
            </p>
          </div>
          <Switch
            id={input.key}
            checked={value === true || value === 'true'}
            onCheckedChange={(checked) => setFormValue(input.key, checked)}
          />
        </div>
      );

    case 'choice':
      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor={input.key} className="text-sm font-medium text-foreground">
            {input.label}
            {input.required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          <Select
            value={String(value)}
            onValueChange={(val) => setFormValue(input.key, val)}
          >
            <SelectTrigger id={input.key} className="bg-foreground/5">
              <SelectValue placeholder={`Select ${input.label}`} />
            </SelectTrigger>
            <SelectContent>
              {input.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{input.description}</p>
        </div>
      );

    case 'number':
      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor={input.key} className="text-sm font-medium text-foreground">
            {input.label}
            {input.required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          <Input
            id={input.key}
            type="number"
            value={String(value)}
            onChange={(e) => setFormValue(input.key, e.target.value)}
            className="bg-foreground/5"
          />
          <p className="text-xs text-muted-foreground">{input.description}</p>
        </div>
      );

    case 'string':
    default:
      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor={input.key} className="text-sm font-medium text-foreground">
            {input.label}
            {input.required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          <Input
            id={input.key}
            type="text"
            value={String(value)}
            onChange={(e) => setFormValue(input.key, e.target.value)}
            placeholder={input.default}
            className="bg-foreground/5"
          />
          <p className="text-xs text-muted-foreground">{input.description}</p>
        </div>
      );
  }
}

export function TemplateForm() {
  const { inputs } = useDeployModal();

  if (inputs.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        No configuration required. Click deploy to continue.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {inputs.map((input) => (
        <TemplateFormField key={input.key} input={input} />
      ))}
    </div>
  );
}
