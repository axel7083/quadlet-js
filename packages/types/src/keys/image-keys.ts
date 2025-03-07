import { ALL_KEYS } from './all';

/**
 * Supported keys in "Image" group
 * Copied on 07/03/2025 from https://github.com/containers/podman/blob/d1a3f96cbf08544093e9ad3acec1c28d858f707a/pkg/systemd/quadlet/quadlet.go
 */
export const IMAGE_KEYS: Set<ALL_KEYS> = new Set<ALL_KEYS>([
  ALL_KEYS.KeyAllTags,
  ALL_KEYS.KeyArch,
  ALL_KEYS.KeyAuthFile,
  ALL_KEYS.KeyCertDir,
  ALL_KEYS.KeyContainersConfModule,
  ALL_KEYS.KeyCreds,
  ALL_KEYS.KeyDecryptionKey,
  ALL_KEYS.KeyGlobalArgs,
  ALL_KEYS.KeyImage,
  ALL_KEYS.KeyImageTag,
  ALL_KEYS.KeyOS,
  ALL_KEYS.KeyPodmanArgs,
  ALL_KEYS.KeyServiceName,
  ALL_KEYS.KeyTLSVerify,
  ALL_KEYS.KeyVariant,
]);
