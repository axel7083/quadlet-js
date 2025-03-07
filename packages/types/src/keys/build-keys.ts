import { ALL_KEYS } from './all';

/**
 * Supported keys in "Build" group
 * Copied on 07/03/2025 from https://github.com/containers/podman/blob/d1a3f96cbf08544093e9ad3acec1c28d858f707a/pkg/systemd/quadlet/quadlet.go
 */
export const BUILD_KEYS: Set<ALL_KEYS> = new Set<ALL_KEYS>([
  ALL_KEYS.KeyAnnotation,
  ALL_KEYS.KeyArch,
  ALL_KEYS.KeyAuthFile,
  ALL_KEYS.KeyContainersConfModule,
  ALL_KEYS.KeyDNS,
  ALL_KEYS.KeyDNSOption,
  ALL_KEYS.KeyDNSSearch,
  ALL_KEYS.KeyEnvironment,
  ALL_KEYS.KeyFile,
  ALL_KEYS.KeyForceRM,
  ALL_KEYS.KeyGlobalArgs,
  ALL_KEYS.KeyGroupAdd,
  ALL_KEYS.KeyImageTag,
  ALL_KEYS.KeyLabel,
  ALL_KEYS.KeyNetwork,
  ALL_KEYS.KeyPodmanArgs,
  ALL_KEYS.KeyPull,
  ALL_KEYS.KeySecret,
  ALL_KEYS.KeyServiceName,
  ALL_KEYS.KeySetWorkingDirectory,
  ALL_KEYS.KeyTarget,
  ALL_KEYS.KeyTLSVerify,
  ALL_KEYS.KeyVariant,
  ALL_KEYS.KeyVolume,
]);
