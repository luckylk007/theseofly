import React, { useEffect, useState, useRef } from 'react';

interface TextEditorProps {
  value?: string;
  onEditorChange?: (content: string) => void;
  height?: number;
}

/**
 * Self-hosted TinyMCE Rich Text Editor (Manual Initialization)
 * 
 * This version manually loads the TinyMCE script and initializes it on a textarea.
 * This is often more reliable than the React wrapper for complex self-hosted setups.
 */
const TextEditor: React.FC<TextEditorProps> = ({ 
  value = '', 
  onEditorChange,
  height = 500 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadTinyMCE = async () => {
      if ((window as any).tinymce) {
        initEditor();
        return;
      }

      const script = document.createElement('script');
      script.src = '/tinymce/tinymce.min.js';
      script.onload = () => {
        if (mounted) initEditor();
      };
      document.head.appendChild(script);
    };

    const initEditor = () => {
      if (!textareaRef.current) return;

      (window as any).tinymce.init({
        target: textareaRef.current,
        height: height,
        menubar: true,
        branding: false,
        promotion: false,
        license_key: 'gpl',
        base_url: '/tinymce',
        suffix: '.min',
        plugins: ['link', 'image', 'lists', 'table', 'code', 'wordcount', 'fullscreen'],
        toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link image table | code fullscreen',
        skin: 'oxide',
        content_css: 'default',
        setup: (editor: any) => {
          editorRef.current = editor;
          editor.on('init', () => {
            setIsReady(true);
            editor.setContent(value);
          });
          editor.on('Change KeyUp Undo Redo', () => {
            if (onEditorChange) {
              onEditorChange(editor.getContent());
            }
          });
        },
        content_style: `
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #334155; padding: 20px; }
          img { max-width: 100%; height: auto; border-radius: 8px; }
        `
      });
    };

    loadTinyMCE();

    return () => {
      mounted = false;
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  // Sync external value changes to the editor
  useEffect(() => {
    if (editorRef.current && isReady) {
      const currentContent = editorRef.current.getContent();
      if (value !== currentContent) {
        editorRef.current.setContent(value || '');
      }
    }
  }, [value, isReady]);

  return (
    <div className="tinymce-manual-wrapper border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {!isReady && (
        <div 
          className="flex items-center justify-center bg-slate-50 text-slate-400 text-sm italic" 
          style={{ height }}
        >
          Initializing TinyMCE...
        </div>
      )}
      <textarea 
        ref={textareaRef} 
        style={{ visibility: isReady ? 'visible' : 'hidden', height: isReady ? 'auto' : 0 }}
      />
    </div>
  );
};

export default TextEditor;
