import { ALL_KEYS } from './all';

/**
 * Supported keys in "Volume" group
 * Copied on 07/03/2025 from https://github.com/containers/podman/blob/d1a3f96cbf08544093e9ad3acec1c28d858f707a/pkg/systemd/quadlet/quadlet.go
 */
export const VOLUMES_KEYS: Set<ALL_KEYS> = new Set<ALL_KEYS>([
  ALL_KEYS.KeyContainersConfModule,
  ALL_KEYS.KeyCopy,
  ALL_KEYS.KeyDevice,
  ALL_KEYS.KeyDriver,
  ALL_KEYS.KeyGlobalArgs,
  ALL_KEYS.KeyGroup,
  ALL_KEYS.KeyImage,
  ALL_KEYS.KeyLabel,
  ALL_KEYS.KeyOptions,
  ALL_KEYS.KeyPodmanArgs,
  ALL_KEYS.KeyServiceName,
  ALL_KEYS.KeyType,
  ALL_KEYS.KeyUser,
  ALL_KEYS.KeyVolumeName,
]);
