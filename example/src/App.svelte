<script lang="ts">
import MonacoEditor from './editor/MonacoEditor.svelte';
import { QuadletType } from '@quadlet/types';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

let quadlet: QuadletType = $state(QuadletType.CONTAINER);
let uri: Uri = $state(Uri.file(`demo.${quadlet.toLowerCase()}`));

function getContent(type: QuadletType) {
    switch (type) {
        case QuadletType.CONTAINER:
            return '# Container Quadlet Example\n[Container]\nImage=nginx'
        case QuadletType.IMAGE:
        case QuadletType.POD:
        case QuadletType.VOLUME:
        case QuadletType.NETWORK:
        case QuadletType.KUBE:
        case QuadletType.BUILD:
            return 'unsupported';
    }
}
</script>

<main>
    <header>
        <select bind:value={quadlet}>
            {#each Object.values(QuadletType) as quadletType (quadletType)}
                <option value={quadletType}>{quadletType}</option>
            {/each}
        </select>
    </header>
    {#key quadlet}
        <MonacoEditor language='quadlet' uri={uri} content={getContent(quadlet)}/>
    {/key}
</main>
