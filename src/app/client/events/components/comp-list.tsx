type ListCompProps = {
  tabs: {
    id: string;
    label: string;
    icon: string;
  }[];
}

export default function ListComponent({ tabs }: ListCompProps) {
  return (
    <nav
      className="flex flex-wrap justify-center sm:flex-col gap-2"
      aria-label="Tabs"
      role="tablist"
      aria-orientation="vertical"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          id={`${tab.id}-item`}
          aria-selected={index === 0 ? "true" : "false"}
          data-hs-tab={`#${tab.id}-tab`}
          aria-controls={`${tab.id}-tab`}
          className={`
            hs-tab-active:border-blue-500
            hs-tab-active:text-blue-600
            py-2 pe-3 inline-flex items-center gap-x-2
            border-b-2 sm:border-b-0 sm:border-e-2 border-transparent
            text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden
            ${index === 0 ? "active" : ""}
          `}
          role="tab"
        >
          <i className={`${tab.icon} text-lg`}></i>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
