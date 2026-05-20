import React, { useState } from 'react';
import TextEditor from '../components/TextEditor';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function EditorDemo() {
  const [content, setContent] = useState<string>('<h2>Welcome to the Self-hosted TinyMCE Editor!</h2><p>This editor is running completely offline using locally served assets.</p>');

  const handleSave = () => {
    console.log('Saved Content:', content);
    alert('Content saved to console!');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">TinyMCE Self-hosted Demo</h1>
        <p className="text-muted-foreground">
          A fully functional rich text editor without Tiny Cloud API dependency.
        </p>
      </div>

      <Card className="p-4 bg-white shadow-sm border">
        <TextEditor 
          value={content} 
          onEditorChange={(newContent) => setContent(newContent)}
          height={600}
        />
      </Card>

      <div className="flex justify-between items-center bg-muted p-4 rounded-lg border">
        <div>
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Preview (Raw HTML)</h3>
          <pre className="mt-2 p-2 bg-black text-green-400 rounded text-xs overflow-auto max-h-40">
            {content}
          </pre>
        </div>
        <Button onClick={handleSave} size="lg">
          Save Content
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Features Included:</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Self-hosted assets (Skins, Icons, Themes)</li>
            <li>WordPress Classic Editor style toolbar</li>
            <li>Rich Text & Heading support</li>
            <li>Tables & Link management</li>
            <li>Image insertion</li>
            <li>Word Count plugin</li>
            <li>Code View for HTML editing</li>
            <li>Fullscreen mode</li>
            <li>Mobile responsive layout</li>
          </ul>
        </Card>
        
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Technical Implementation:</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Uses <code>@tinymce/tinymce-react</code></li>
            <li>Assets served from <code>/public/tinymce</code></li>
            <li>No API Key or CDN required</li>
            <li>Vite-compatible bundling</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
