import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  mandatory?: boolean | undefined;
} & React.ComponentProps<'select'>;

export default function Select({
  label,
  placeholder,
  options,
  mandatory,
  className,
  ...props
}: SelectProps) {
  const inpId = props.id;
  return (
    <div>
      {label && (
        <label htmlFor={inpId} className="block text-sm font-medium mb-1 dark:text-white">
          {label}{(mandatory !== undefined && mandatory === true) && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        id={inpId}
        name={inpId}
        className={cn(
          "p-2 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        <option value="">{placeholder || 'Select options...'}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
