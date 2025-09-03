import { Editor } from '@tiptap/react';
import { Toggle } from '../ui/toggle';

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null
  };

  const Options = [
    {
      icon: <i className='text-muted bx bx-bold text-lg'></i>,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
    },
    {
      icon: <i className='text-muted bx bx-italic text-lg'></i>,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
    },
    {
      icon: <i className='text-muted bx bx-strikethrough text-lg'></i>,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
    },
    {
      icon: <i className='text-muted bx bx-heading text-xl'></i>,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon:  <i className='text-muted bx bx-heading text-lg'></i>,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon:  <i className='text-muted bx bx-heading text-base'></i>,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon:  <i className='text-muted bx bx-heading text-sm'></i>,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      preesed: editor.isActive("heading", { level: 4 }),
    },
    {
      icon: <i className='text-muted bx bx-align-left text-lg'></i>,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <i className='text-muted bx bx-align-middle text-lg'></i>,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <i className='text-muted bx bx-align-right text-lg'></i>,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <i className='text-muted bx bx-list-ul text-xl'></i>,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
    },
    {
      icon: <i className='text-muted bx bx-list-ol text-xl'></i>,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
    },
  ];

  return (
    <div className="p-1 pt-0 space-x-2 z-50">
      {
        Options.map((x, i) => (
          <Toggle className="h-6 w-6" key={i} pressed={x.preesed} onPressedChange={x.onClick}>
            {x.icon}
          </Toggle>
        ))
      }
    </div>
  )
}
