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
            <Label
              htmlFor={input.key}
              className="text-sm leading-none font-medium"
            >
              {input.label}
            </Label>
            <p className="text-muted-foreground mt-2 text-sm leading-5">
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
          <Label
            htmlFor={input.key}
            className="text-sm leading-none font-medium"
          >
            {input.required && <span className="text-red-600">*</span>}
            {input.label}
          </Label>
          <Select
            value={String(value)}
            onValueChange={(val) => setFormValue(input.key, val)}
          >
            <SelectTrigger id={input.key} className="h-10 rounded-[8px]">
              <SelectValue placeholder={`Select ${input.label}`} />
            </SelectTrigger>
            <SelectContent className="[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {input.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-sm leading-5">
            {input.description}
          </p>
        </div>
      );

    case 'number':
      return (
        <div className="flex flex-col gap-2">
          <Label
            htmlFor={input.key}
            className="text-sm leading-none font-medium"
          >
            {input.required && <span className="text-red-600">*</span>}
            {input.label}
          </Label>
          <Input
            id={input.key}
            type="number"
            value={String(value)}
            onChange={(e) => setFormValue(input.key, e.target.value)}
            className="h-10 rounded-[8px]"
          />
          <p className="text-muted-foreground text-sm leading-5">
            {input.description}
          </p>
        </div>
      );

    case 'string':
    default:
      return (
        <div className="flex flex-col gap-2">
          <Label
            htmlFor={input.key}
            className="text-sm leading-none font-medium"
          >
            {input.required && <span className="text-red-600">*</span>}
            {input.label}
          </Label>
          <Input
            id={input.key}
            type="text"
            value={String(value)}
            onChange={(e) => setFormValue(input.key, e.target.value)}
            placeholder={input.default}
            className="h-10 rounded-[8px]"
          />
          <p className="text-muted-foreground text-sm leading-5">
            {input.description}
          </p>
        </div>
      );
  }
}

export function TemplateForm() {
  const { inputs } = useDeployModal();

  if (inputs.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-center">
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
