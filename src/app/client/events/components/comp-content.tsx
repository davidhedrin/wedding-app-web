import { JSX } from "react";

type ContentCompProps = {
  tabContents: {
    id: string;
    content: JSX.Element;
  }[]
}

export default function ContentComponent({ tabContents }: ContentCompProps) {
  return (
    <>
      {tabContents.map((tab, index) => (
        <div
          key={tab.id}
          id={`${tab.id}-tab`}
          role="tabpanel"
          aria-labelledby={`${tab.id}-item`}
          className={index === 0 ? "" : "hidden"}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
