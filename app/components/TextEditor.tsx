import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TextEditorProps {
  initialValue?: string;
  value?: string;
  onEditorChange?: (content: string) => void;
  height?: number;
}

/**
 * Self-hosted TinyMCE Rich Text Editor Component (SSR Safe)
 * 
 * This component loads TinyMCE dynamically from the /public/tinymce folder.
 * It avoids top-level imports of TinyMCE core to prevent SSR crashes.
 */
const TextEditor: React.FC<TextEditorProps> = ({ 
  initialValue = '', 
  value, 
  onEditorChange,
  height = 500 
}) => {
  const editorRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  // Only render on the client to ensure SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInit = (evt: any, editor: any) => {
    editorRef.current = editor;
  };

  if (!mounted) {
    return (
      <div 
        className="tinymce-placeholder border rounded-md bg-slate-50 flex items-center justify-center" 
        style={{ height }}
      >
        <span className="text-slate-400 text-sm italic">Loading editor...</span>
      </div>
    );
  }

  return (
    <div className="tinymce-editor-container border rounded-md overflow-hidden bg-white">
      <Editor
        onInit={handleInit}
        initialValue={initialValue}
        value={value}
        onEditorChange={onEditorChange}
        // Load TinyMCE from the public folder
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        init={{
          height: height,
          menubar: true,
          branding: false,
          promotion: false,
          
          // These point to the assets in the /public/tinymce folder
          base_url: '/tinymce',
          suffix: '.min',
          
          // Plugins configuration (must be present in /public/tinymce/plugins)
          plugins: [
            'link', 'image', 'lists', 'table', 'code', 'wordcount', 'fullscreen'
          ],
          
          // Toolbar configuration - WordPress Classic Style
          toolbar: 
            'undo redo | blocks | bold italic underline | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist | link image table | code fullscreen',
          
          // Skin & Content Styling
          skin: 'oxide',
          content_css: 'default',
          
          // Responsive settings
          mobile: {
            menubar: true,
            toolbar_mode: 'sliding'
          },
          
          // UI appearance
          resize: true,
          statusbar: true,
          elementpath: true,
          
          // Custom content styles
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              font-size: 16px; 
              line-height: 1.6;
              color: #333;
              margin: 1rem;
            }
            img { max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; }
          `,

          // Editor behaviors
          image_advtab: true,
          image_caption: true,
          toolbar_sticky: true,
          contextmenu: 'link image table',
          
          // Disable cloud-based features
          help_accessibility: false,
        }}
      />
    </div>
  );
};

export default TextEditor;
