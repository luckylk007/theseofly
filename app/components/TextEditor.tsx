import React, { useEffect, useState, useRef, useCallback } from 'react';

interface TextEditorProps {
  value?: string;
  onEditorChange?: (content: string) => void;
  height?: number;
}

/**
 * Self-hosted TinyMCE Rich Text Editor (Manual Initialization)
 * 
 * This version manually loads the TinyMCE script and initializes it on a textarea.
 * It is SSR-safe (only runs in the browser) and supports multiple instances on
 * the same page by using unique editor IDs.
 */
const TextEditor: React.FC<TextEditorProps> = ({ 
  value = '', 
  onEditorChange,
  height = 500 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const editorIdRef = useRef<string>(`tinymce-editor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
  // Store the latest value in a ref so the setup callback always reads the current one
  const latestValueRef = useRef(value);
  latestValueRef.current = value;

  // Store latest onEditorChange in a ref to avoid stale closures
  const onEditorChangeRef = useRef(onEditorChange);
  onEditorChangeRef.current = onEditorChange;

  const initEditor = useCallback(() => {
    if (!textareaRef.current || !mountedRef.current) return;
    if (typeof window === 'undefined' || !(window as any).tinymce) return;

    const tinymce = (window as any).tinymce;

    // Remove any existing editor on this textarea first
    const existing = tinymce.get(editorIdRef.current);
    if (existing) {
      try {
        tinymce.remove(existing);
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    tinymce.init({
      target: textareaRef.current,
      id: editorIdRef.current,
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
          if (!mountedRef.current) {
            // Component unmounted before editor finished initializing
            try { tinymce.remove(editor); } catch (e) { /* ignore */ }
            return;
          }
          setIsReady(true);
          setHasError(false);
          // Use the ref to get the latest value
          editor.setContent(latestValueRef.current || '');
        });

        editor.on('Change KeyUp Undo Redo', () => {
          if (onEditorChangeRef.current) {
            onEditorChangeRef.current(editor.getContent());
          }
        });
      },
      content_style: `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #334155; padding: 20px; }
        img { max-width: 100%; height: auto; border-radius: 8px; }
      `
    }).catch((err: any) => {
      console.error('TinyMCE init failed:', err);
      if (mountedRef.current) {
        setHasError(true);
      }
    });
  }, [height]);

  useEffect(() => {
    // Guard against SSR — only run in browser
    if (typeof window === 'undefined') return;

    mountedRef.current = true;

    const loadTinyMCE = () => {
      // Script already loaded
      if ((window as any).tinymce) {
        initEditor();
        return;
      }

      // Check if script tag is already in DOM (another instance is loading it)
      const existingScript = document.querySelector('script[src="/tinymce/tinymce.min.js"]');
      if (existingScript) {
        // Wait for the existing script to finish loading
        existingScript.addEventListener('load', () => {
          if (mountedRef.current) initEditor();
        });
        // In case it already loaded between checks
        if ((window as any).tinymce && mountedRef.current) {
          initEditor();
        }
        return;
      }

      const script = document.createElement('script');
      script.src = '/tinymce/tinymce.min.js';
      script.async = true;
      script.onload = () => {
        if (mountedRef.current) initEditor();
      };
      script.onerror = () => {
        console.error('Failed to load TinyMCE script from /tinymce/tinymce.min.js');
        if (mountedRef.current) setHasError(true);
      };
      document.head.appendChild(script);
    };

    loadTinyMCE();

    return () => {
      mountedRef.current = false;
      const editor = editorRef.current;
      if (editor) {
        try {
          const tinymce = (window as any).tinymce;
          if (tinymce) {
            tinymce.remove(editor);
          }
        } catch (e) {
          // Fallback: try destroy
          try { editor.destroy(); } catch (_e) { /* ignore */ }
        }
        editorRef.current = null;
      }
      setIsReady(false);
    };
  }, [initEditor]);

  // Sync external value changes to the editor
  useEffect(() => {
    if (editorRef.current && isReady) {
      const currentContent = editorRef.current.getContent();
      if (value !== currentContent) {
        editorRef.current.setContent(value || '');
      }
    }
  }, [value, isReady]);

  // Render nothing during SSR
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="tinymce-manual-wrapper border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {hasError && (
        <div 
          className="flex flex-col items-center justify-center bg-red-50 text-red-500 text-sm gap-2 p-6" 
          style={{ minHeight: height }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Failed to load the editor. Please refresh the page.</span>
          <button
            className="mt-2 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
            onClick={() => {
              setHasError(false);
              initEditor();
            }}
          >
            Retry
          </button>
        </div>
      )}
      {!isReady && !hasError && (
        <div 
          className="flex items-center justify-center bg-slate-50 text-slate-400 text-sm italic gap-2" 
          style={{ height }}
        >
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Initializing Editor...
        </div>
      )}
      <textarea 
        ref={textareaRef} 
        id={editorIdRef.current}
        style={{ visibility: isReady ? 'visible' : 'hidden', height: isReady ? 'auto' : 0 }}
      />
    </div>
  );
};

export default TextEditor;
