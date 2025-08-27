import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
} & React.ComponentProps<'select'>;

export default function Select({
  label,
  placeholder,
  options,
  className,
  ...props
}: SelectProps) {
  const inpId = props.id;
  const isReq = props.required;

  return (
    <div>
      {label && (
        <label htmlFor={inpId} className="block text-sm font-medium mb-1 dark:text-white">
          {label}{(isReq !== undefined && isReq === true) && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        id={inpId}
        name={inpId}
        data-hs-select={`{
          "placeholder": ${JSON.stringify(placeholder || 'Select options...')},
          "toggleTag": "<button type='button' aria-expanded='false'></button>",
          "toggleClasses": ${JSON.stringify(cn(
            "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-2 ps-3 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-300 rounded-lg text-start text-sm hover:border-gray-600 focus:outline-none focus:ring-gray-700",
            className
          ))},
          "dropdownClasses": "dropdown-classes z-50 w-full max-h-72 p-1 space-y-0.5 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
          "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-blue-50 rounded-lg focus:outline-none focus:bg-blue-100",
          "optionTemplate": "<div class='flex justify-between items-center w-full'><span data-title></span><span class='hidden hs-selected:block'><svg class='shrink-0 size-4 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><polyline points='20 6 9 17 4 12' /></svg></span></div>",
          "extraMarkup": "<div class='absolute top-1/2 end-3 -translate-y-1/2'><svg class='shrink-0 size-4 text-gray-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path d='M7 15l5 5 5-5M7 9l5-5 5 5'/></svg></div>"
        }`}
        className="hidden"
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
