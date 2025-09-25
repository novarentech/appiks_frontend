"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SerializedEditorState } from "lexical";
import { $getRoot } from "lexical";
import { useEffect } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { editorTheme } from "@/components/editor/themes/EditorTheme";
import { nodes } from "@/components/blocks/editor-00/nodes"; // Adjust path as needed

// Content loader component to set the editor state
function ContentLoader({ content }: { content: string | SerializedEditorState | undefined }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!content) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      try {
        let parsedContent: SerializedEditorState;
        
        if (typeof content === 'string') {
          parsedContent = JSON.parse(content);
        } else {
          parsedContent = content;
        }

        if (parsedContent && parsedContent.root) {
          // Use the same method as your editor to parse state
          const editorState = editor.parseEditorState(parsedContent);
          editor.setEditorState(editorState);
        }
      } catch (error) {
        console.error('Error loading Lexical content:', error)
      }
    });
  }, [content, editor]);

  return null;
}

export function LexicalViewer({
  content,
  className = "",
}: {
  content: string | SerializedEditorState | undefined;
  className?: string;
}) {
  const editorConfig: InitialConfigType = {
    namespace: "LexicalViewer",
    theme: editorTheme, // Same theme as your editor
    nodes, // Same nodes as your editor
    editable: false, // Make it read-only
    onError: (error: Error) => {
      console.error("Lexical Viewer error:", error);
    },
  };

  return (
    <div className={`bg-background overflow-hidden ${className}`}>
      <LexicalComposer initialConfig={editorConfig}>
        <TooltipProvider>
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="outline-none px-4 py-6 min-h-[200px] prose prose-lg max-w-none focus:outline-none"
                  style={{ 
                    minHeight: 'auto',
                    resize: 'none'
                  }}
                />
              }
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ContentLoader content={content} />
          </div>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

// Alternative: Simpler viewer without the wrapper styling
export function SimpleLexicalViewer({
  content,
  className = "",
}: {
  content: string | SerializedEditorState | undefined;
  className?: string;
}) {
  const editorConfig: InitialConfigType = {
    namespace: "SimpleLexicalViewer", 
    theme: editorTheme,
    nodes,
    editable: false,
    onError: (error: Error) => {
      console.error("Simple Lexical Viewer error:", error);
    },
  };

  if (!content) {
    return (
      <div className={`text-gray-500 italic py-8 text-center ${className}`}>
        No content available
      </div>
    );
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={`lexical-viewer ${className}`}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="outline-none focus:outline-none prose prose-lg max-w-none"
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ContentLoader content={content} />
      </div>
    </LexicalComposer>
  );
}