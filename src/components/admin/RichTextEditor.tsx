'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Image as ImageIcon, AlignRight, AlignCenter, AlignLeft, Heading1, Heading2, Loader2, Link as LinkIcon, Highlighter, Quote, Undo, Redo, Eraser, Palette } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const TooltipBtn = ({ onClick, isActive, title, disabled, children }: any) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`relative group p-2.5 md:p-2 rounded-lg transition-all duration-200 flex items-center justify-center shrink-0
      ${isActive ? 'bg-[#c61d70] text-white shadow-md' : 'text-[#77717b] hover:bg-[#f8f7fa] hover:text-[#28242b] active:bg-[#f8f7fa]'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    {children}
    <span className="hidden md:block absolute -bottom-8 right-1/2 translate-x-1/2 bg-[#28242b] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
      {title}
    </span>
  </button>
);

const MenuBar = ({ editor }: { editor: any }) => {
  const [uploading, setUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
          editor.chain().focus().setImage({ src: data.url }).run();
          toast.success('عکس با موفقیت درج شد');
        } else toast.error(data.message || 'خطا در آپلود');
      } catch { toast.error('خطای شبکه'); } finally { setUploading(false); }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('لینک را وارد کنید:', previousUrl);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[#e9e5eb] shadow-sm rounded-t-xl">
      <div className="flex items-center gap-1 p-2 overflow-x-auto md:overflow-visible md:flex-wrap scrollbar-hide">
        
        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().undo().run()} title="واگرد"><Undo size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().redo().run()} title="ازنو"><Redo size={18} /></TooltipBtn>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="ضخیم"><Bold size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="مورب"><Italic size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="زیرخط"><UnderlineIcon size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="خط‌خورده"><Strikethrough size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="هایلایت"><Highlighter size={18} /></TooltipBtn>
          
          <div className="relative shrink-0">
            <TooltipBtn onClick={() => setShowColorPicker(!showColorPicker)} title="رنگ متن"><Palette size={18} /></TooltipBtn>
            {showColorPicker && (
              <div className="absolute top-full right-0 mt-2 bg-white p-2 rounded-lg shadow-xl border border-[#e9e5eb] z-50 flex gap-1.5 flex-wrap w-32">
                {['#28242b', '#c61d70', '#2563eb', '#16a34a', '#d97706', '#dc2626'].map(c => (
                  <button key={c} type="button" onClick={() => { editor.chain().focus().setColor(c).run(); setShowColorPicker(false); }} className="w-7 h-7 rounded-md border border-gray-200" style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="تیتر اصلی"><Heading1 size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="تیتر فرعی"><Heading2 size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="نقل قول"><Quote size={18} /></TooltipBtn>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="لیست نقطه‌ای"><List size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="لیست شماره‌دار"><ListOrdered size={18} /></TooltipBtn>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="راست‌چین"><AlignRight size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="وسط‌چین"><AlignCenter size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="چپ‌چین"><AlignLeft size={18} /></TooltipBtn>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
          <TooltipBtn onClick={setLink} isActive={editor.isActive('link')} title="درج لینک"><LinkIcon size={18} /></TooltipBtn>
          <TooltipBtn onClick={addImage} disabled={uploading} title="درج عکس">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
          </TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="پاک کردن فرمت"><Eraser size={18} className="text-rose-500" /></TooltipBtn>
        </div>
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: true }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#c61d70] underline underline-offset-4' } }),
      Underline,
      Highlight.configure({ multicolor: true }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base max-w-full focus:outline-none min-h-[350px] md:min-h-[500px] p-3 md:p-8 text-[#28242b] leading-loose overflow-x-hidden',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="border border-[#e9e5eb] rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#c61d70]/20 focus-within:border-[#c61d70]/50 transition-all flex flex-col shadow-sm">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto max-h-[65vh] md:max-h-[600px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}