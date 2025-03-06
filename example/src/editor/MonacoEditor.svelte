<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import './monaco';
import type { HTMLAttributes } from 'svelte/elements';

interface Props extends HTMLAttributes<HTMLElement> {
  content: string;
  language: string;
  readOnly?: boolean;
  noMinimap?: boolean;
  uri?: Monaco.Uri,
  onChange?: (content: string) => void;
}

let {
  content = $bindable(),
  language,
  readOnly = false,
  onChange,
  uri,
  noMinimap,
  ...restProps
}: Props = $props();

let editorInstance: Monaco.editor.IStandaloneCodeEditor;
let editorContainer: HTMLElement;

onMount(async () => {
  // solution from https://github.com/vitejs/vite/discussions/1791#discussioncomment-9281911
  import('monaco-editor/esm/vs/editor/editor.api')
    .then(monaco => {
        const model = editor.createModel(content, language, uri);
      editorInstance = monaco.editor.create(editorContainer, {
          model: model,
        language: language,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        readOnly: readOnly,
        minimap: {
          enabled: !noMinimap,
        },
      });

      editorInstance.onDidChangeModelContent(() => {
        content = editorInstance.getValue();
        onChange?.(content);
      });

      monaco.editor.colorizeElement(editorContainer, {})
    })
    .catch(console.error);
});

onDestroy(() => {
  editorInstance?.dispose();
});
</script>

<div style="min-height: 100%" {...restProps} bind:this={editorContainer}></div>
