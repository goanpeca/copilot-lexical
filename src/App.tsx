/*
 * Copyright (c) 2025-2026 Datalayer, Inc.
 * MIT License
 */

import { useState } from 'react';
import { Button, ButtonGroup } from '@primer/react';
import { Box } from '@datalayer/primer-addons';
import { CopilotKit, useFrontendTool } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { JupyterReactTheme } from '@datalayer/jupyter-react';
import { LexicalProvider, Editor } from '@datalayer/jupyter-lexical';
import {
  ActionRegistrar,
  useLexicalToolActions,
} from './tools/adapters/copilotkit/lexicalHooks';

import '@datalayer/jupyter-lexical/style/index.css';
import '@copilotkit/react-ui/styles.css';
import './styles/lexical-theme.css';
import './styles/modal-overrides.css';
import './App.css';

// Fixed lexical document ID for tool registration
const LEXICAL_ID = 'copilot-lexical-document';

/**
 * Simple Lexical editor component
 * Note: LexicalStatePlugin is included internally by the Editor component
 */
function LexicalEditor() {
  return (
    <Box sx={{ padding: 3 }}>
      <Editor
        id={LEXICAL_ID}
        onSessionConnection={(session) => {
          console.log('Session changed:', session);
        }}
      />
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
      <JupyterReactTheme>
        <LexicalProvider lexicalId={LEXICAL_ID}>
          <LexicalEditor />
        </LexicalProvider>
      </JupyterReactTheme>
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
      {hasCopilotKey ? (
        <CopilotKit showDevConsole={true} publicApiKey={copilotKitKey}>
          <CopilotSidebar
            defaultOpen={true}
            labels={{
              title: 'Lexical AI Copilot',
              initial:
                'Hi! I can help you edit the Lexical document. Try asking me to insert content, format text, create headings, add code blocks, or manipulate the document.',
            }}
          >
            <LexicalWithTools />
          </CopilotSidebar>
        </CopilotKit>
      ) : (
        <JupyterReactTheme>
          <LexicalProvider lexicalId={LEXICAL_ID}>
            <Box sx={{ padding: 3 }}>
              <Editor
                id={LEXICAL_ID}
                onSessionConnection={(session) => {
                  console.log('Session changed:', session);
                }}
              />
            </Box>
          </LexicalProvider>
        </JupyterReactTheme>
      )}

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
