<script lang="ts">
import MonacoEditor from './editor/MonacoEditor.svelte';
import { QuadletType } from '@quadlet/types';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

let quadlet: QuadletType = $state(QuadletType.CONTAINER);
let uri: Uri = $derived(Uri.file(`demo.${quadlet.toLowerCase()}`));

function getContent(type: QuadletType) {
    switch (type) {
        case QuadletType.CONTAINER:
            return '# Container Quadlet Example\n[Container]\nImage=nginx\nAnnotation=foo=bar'
        case QuadletType.IMAGE:
            return '# Image Quadlet Example\n[Image]\nImage=nginx'
        case QuadletType.POD:
            return '# Pod Quadlet Example\n[Pod]\nPodName=dummy'
        case QuadletType.VOLUME:
            return '# Volume Quadlet Example\n[Volume]\nVolumeName=dummy-volume'
        case QuadletType.NETWORK:
            return '# Network Quadlet Example\n[Network]\nNetworkName=dummy-network'
        case QuadletType.KUBE:
            return '# Kube Quadlet Example\n[Kube]\nYaml=example.yaml'
        case QuadletType.BUILD:
            return '# Build Quadlet Example\n[Build]\nFile=Containerfile'
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
