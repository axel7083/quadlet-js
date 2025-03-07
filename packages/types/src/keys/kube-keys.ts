import { ALL_KEYS } from './all';

/**
 * Supported keys in "Kube" group
 * Copied on 07/03/2025 from https://github.com/containers/podman/blob/d1a3f96cbf08544093e9ad3acec1c28d858f707a/pkg/systemd/quadlet/quadlet.go
 */
export const KUBE_KEYS: Set<ALL_KEYS> = new Set<ALL_KEYS>([
  ALL_KEYS.KeyAutoUpdate,
  ALL_KEYS.KeyConfigMap,
  ALL_KEYS.KeyContainersConfModule,
  ALL_KEYS.KeyExitCodePropagation,
  ALL_KEYS.KeyGlobalArgs,
  ALL_KEYS.KeyKubeDownForce,
  ALL_KEYS.KeyLogDriver,
  ALL_KEYS.KeyLogOpt,
  ALL_KEYS.KeyNetwork,
  ALL_KEYS.KeyPodmanArgs,
  ALL_KEYS.KeyPublishPort,
  ALL_KEYS.KeyRemapGid,
  ALL_KEYS.KeyRemapUid,
  ALL_KEYS.KeyRemapUidSize,
  ALL_KEYS.KeyRemapUsers,
  ALL_KEYS.KeyServiceName,
  ALL_KEYS.KeySetWorkingDirectory,
  ALL_KEYS.KeyUserNS,
  ALL_KEYS.KeyYaml,
]);
