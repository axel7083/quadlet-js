import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { configureMonacoYaml } from '@quadlet/monaco';
import YamlWorker from '@quadlet/monaco/yaml.worker?worker';


self.MonacoEnvironment = {
  getWorker(_: string, label: string): Worker {
    switch (label) {
      case 'editorWorkerService':
        return new EditorWorker();
      case 'quadlet':
        console.log('[MonacoEnvironment] instantiating YamlWorker');
        return new YamlWorker();
      default:
        throw new Error(`cannot identify which worker to instance: unknown label ${label}`);
    }
  },
};

configureMonacoYaml(monaco);

monaco.languages.typescript?.typescriptDefaults?.setEagerModelSync(true);
