import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

// TinyMCE Core
import tinymce from 'tinymce/tinymce';

// TinyMCE Theme
import 'tinymce/themes/silver';

// TinyMCE Icons
import 'tinymce/icons/default';

// TinyMCE Plugins - Manually imported as required
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/code';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/fullscreen';

// Note: We do NOT import tinymce/skins/... CSS here because it causes 
// build errors with lightningcss due to modern CSS selectors.
// TinyMCE loads these skins automatically via the 'base_url' configuration.

// Ensure tinymce is available globally for plugins and themes
if (typeof window !== 'undefined') {
  (window as any).tinymce = tinymce;
}

interface TextEditorProps {
  initialValue?: string;
  value?: string;
  onEditorChange?: (content: string) => void;
  height?: number;
}

/**
 * Self-hosted TinyMCE Rich Text Editor Component
 * 
 * Features:
 * - Completely self-hosted (no Tiny Cloud API or CDN)
 * - WordPress-style classic editor toolbar
 * - Responsive UI and modern styling
 * - Full plugin set (Links, Images, Tables, Code, etc.)
 */
const TextEditor: React.FC<TextEditorProps> = ({ 
  initialValue = '', 
  value, 
  onEditorChange,
  height = 500 
}) => {
  const editorRef = useRef<any>(null);

  const handleInit = (evt: any, editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="tinymce-editor-container border rounded-md overflow-hidden">
      <Editor
        onInit={handleInit}
        initialValue={initialValue}
        value={value}
        onEditorChange={onEditorChange}
        // Using bundled version, but telling it where to find assets like skins
        init={{
          height: height,
          menubar: true,
          branding: false,
          promotion: false,
          
          // Important for self-hosting: tell TinyMCE where to load additional assets
          base_url: '/tinymce',
          suffix: '.min',
          
          // Plugins configuration
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
