/*
 * Copyright (c) 2025-2026 Datalayer, Inc.
 * MIT License
 */

import 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-objectivec';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';

import { useState, useEffect, useRef } from 'react';
import { Button, ButtonGroup } from '@primer/react';
import { Box } from '@datalayer/primer-addons';
import { $getRoot, $createParagraphNode } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { registerCodeHighlighting } from '@lexical/code';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { CopilotKit, useFrontendTool } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { JupyterReactTheme } from '@datalayer/jupyter-react';
import {
  ComponentPickerMenuPlugin,
  JupyterCellPlugin,
  JupyterInputOutputPlugin,
  DraggableBlockPlugin,
  ImagesPlugin,
  HorizontalRulePlugin,
  EquationsPlugin,
  YouTubePlugin,
  ExcalidrawPlugin,
  CollapsiblePlugin,
  AutoLinkPlugin,
  AutoEmbedPlugin,
  LexicalConfigProvider,
  LexicalStatePlugin,
  ToolbarPlugin,
  ToolbarContext,
  FloatingTextFormatToolbarPlugin,
  CodeActionMenuPlugin,
  ListMaxIndentLevelPlugin,
  TableCellResizerPlugin,
  TablePlugin,
  CommentsProvider,
} from '@datalayer/jupyter-lexical';
import {
  ActionRegistrar,
  useLexicalToolActions,
} from './tools/adapters/copilotkit/lexicalHooks';
import { editorConfig } from './editorConfig';

import '@datalayer/jupyter-lexical/style/index.css';
import '@copilotkit/react-ui/styles.css';
import './styles/lexical-theme.css';
import './styles/modal-overrides.css';
import './App.css';

// Fixed lexical document ID for tool registration
const LEXICAL_ID = 'copilot-lexical-document';

/**
 * Lexical plugin for loading initial content into the editor.
 */
function LoadContentPlugin({ content }: { content?: string }) {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!content || !isFirstRender.current) {
      return;
    }

    isFirstRender.current = false;
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && parsed.root) {
        const editorState = editor.parseEditorState(content);
        editor.setEditorState(editorState, {
          tag: 'history-merge',
        });
      } else {
        throw new Error('Invalid Lexical editor state format');
      }
    } catch {
      editor.update(
        () => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          root.append(paragraph);
        },
        {
          tag: 'history-merge',
        },
      );
    }
  }, [content, editor]);

  return null;
}

/**
 * Lexical plugin for code syntax highlighting.
 */
function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
}

/**
 * Wrapper component for kernel-dependent plugins.
 */
function KernelPluginsInner() {
  return (
    <>
      <ComponentPickerMenuPlugin kernel={undefined} />
      <JupyterInputOutputPlugin kernel={undefined} />
    </>
  );
}

/**
 * Inner component with access to LexicalComposerContext
 */
function LexicalEditorInner() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [_isLinkEditMode, setIsLinkEditMode] = useState(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <>
      <ToolbarPlugin
        editor={editor}
        activeEditor={activeEditor}
        setActiveEditor={setActiveEditor}
        setIsLinkEditMode={setIsLinkEditMode}
      />
      <div className="lexical-editor-inner" ref={onRef}>
        {/* CRITICAL: LexicalStatePlugin registers the adapter in the store */}
        <LexicalStatePlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="lexical-editor-content"
              aria-label="Lexical Editor"
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={() => {}} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <TablePlugin />
        <TableCellResizerPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <LoadContentPlugin content={undefined} />
        <CodeHighlightPlugin />
        <ImagesPlugin captionsEnabled={false} />
        <HorizontalRulePlugin />
        <EquationsPlugin />
        <YouTubePlugin />
        <ExcalidrawPlugin />
        <CollapsiblePlugin />
        <AutoEmbedPlugin />
        <JupyterCellPlugin />
        {/* Wrap kernel plugins with JupyterReactTheme provider */}
        <JupyterReactTheme>
          <KernelPluginsInner />
        </JupyterReactTheme>
        {floatingAnchorElem && (
          <>
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            <FloatingTextFormatToolbarPlugin
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
          </>
        )}
      </div>
    </>
  );
}

/**
 * Lexical UI component with full LexicalComposer setup
 */
function LexicalUI(): JSX.Element {

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'border.default',
        borderRadius: 2,
        padding: 3,
        backgroundColor: 'canvas.default',
        minHeight: '600px',
      }}
    >
      <LexicalConfigProvider lexicalId={LEXICAL_ID} serviceManager={undefined}>
        <ToolbarContext>
          <LexicalComposer initialConfig={editorConfig}>
            <CommentsProvider>
              <LexicalEditorInner />
            </CommentsProvider>
          </LexicalComposer>
        </ToolbarContext>
      </LexicalConfigProvider>
    </Box>
  );
}

/**
 * Component that wraps the Lexical editor with CopilotKit tool registration.
 * MUST be inside CopilotKit context for tool registration to work.
 */
function LexicalWithTools() {
  // Get all Lexical tool actions for this document
  const actions = useLexicalToolActions(LEXICAL_ID);

  return (
    <>
      {/* Register each action with CopilotKit using ActionRegistrar component */}
      {actions.map((action, i) => (
        <ActionRegistrar
          key={action.name || i}
          action={action}
          useFrontendTool={useFrontendTool}
        />
      ))}
      <LexicalUI />
    </>
  );
}

/**
 * Main App component combining Lexical editor with CopilotKit
 */
function App() {
  // Get initial state from URL or localStorage
  const getInitialKernelState = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const kernelParam = urlParams.get('kernel');
    if (kernelParam !== null) {
      return kernelParam === 'true';
    }
    const stored = localStorage.getItem('hasKernel');
    return stored === 'true';
  };

  const [hasKernel, setHasKernel] = useState(getInitialKernelState);

  const toggleKernel = (newValue: boolean) => {
    setHasKernel(newValue);
    localStorage.setItem('hasKernel', String(newValue));
    const url = new URL(window.location.href);
    url.searchParams.set('kernel', String(newValue));
    window.history.pushState({}, '', url);
  };

  const copilotKitKey = import.meta.env.VITE_COPILOT_KIT_API_KEY;
  const hasCopilotKey = !!copilotKitKey;

  return (
    <div className="app-container">
      {/* Header */}
      <Box
        sx={{
          padding: 3,
          borderBottom: '1px solid',
          borderColor: 'border.default',
          backgroundColor: 'canvas.subtle',
        }}
      >
        <h1>Jupyter UI ❤️ Lexical + CopilotKit</h1>
        {!hasCopilotKey && (
          <Box
            sx={{
              padding: 2,
              marginTop: 2,
              backgroundColor: 'attention.subtle',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'attention.emphasis',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px' }}>
              ⚠️ CopilotKit API key not found. Create a <code>.env</code> file
              with <code>VITE_COPILOT_KIT_API_KEY</code> to enable AI features.
            </p>
          </Box>
        )}
        <ButtonGroup>
          <Button
            variant={!hasKernel ? 'primary' : 'default'}
            onClick={() => toggleKernel(false)}
          >
            Without Runtime
          </Button>
          <Button
            variant={hasKernel ? 'primary' : 'default'}
            onClick={() => toggleKernel(true)}
          >
            With Runtime
          </Button>
        </ButtonGroup>
      </Box>

      {/* Main content with CopilotKit sidebar */}
      <JupyterReactTheme>
        {hasCopilotKey ? (
          <CopilotKit showDevConsole={true} publicApiKey={copilotKitKey}>
            <CopilotSidebar
              defaultOpen={true}
              labels={{
                title: 'Lexical AI Copilot',
                initial:
                  'Hi! I can help you edit the Lexical document.\n\nTry asking:\n• What tools do you have?\n• Insert an example YouTube video\n• Insert a table with three letter words\n• Add a heading and some sample text',
              }}
              clickOutsideToClose={false}
              instructions="You are an AI assistant helping users edit a Lexical document. You can insert various types of content including text, code blocks, tables, images, YouTube videos, and Jupyter cells."
            >
              <Box sx={{ padding: 3 }}>
                <LexicalWithTools />
              </Box>
            </CopilotSidebar>
          </CopilotKit>
        ) : (
          <Box sx={{ padding: 3 }}>
            <LexicalUI />
          </Box>
        )}
      </JupyterReactTheme>

      {/* Footer */}
      <Box
        sx={{
          padding: 3,
          borderTop: '1px solid',
          borderColor: 'border.default',
          backgroundColor: 'canvas.subtle',
          textAlign: 'center',
        }}
      >
        <p>
          Built by{' '}
          <a
            href="https://datalayer.ai"
            target="_blank"
            rel="noreferrer"
          >
            Datalayer, Inc.
          </a>
        </p>
        <p>
          <a
            href="https://github.com/datalayer/copilot-lexical"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repository
          </a>
        </p>
      </Box>
    </div>
  );
}

export default App;
