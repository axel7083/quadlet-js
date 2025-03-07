import { ALL_KEYS } from './all';

/**
 * Supported keys in "Pod" group
 * Copied on 07/03/2025 from https://github.com/containers/podman/blob/d1a3f96cbf08544093e9ad3acec1c28d858f707a/pkg/systemd/quadlet/quadlet.go
 */
export const POD_KEYS: Set<ALL_KEYS> = new Set<ALL_KEYS>([
  ALL_KEYS.KeyAddHost,
  ALL_KEYS.KeyContainersConfModule,
  ALL_KEYS.KeyDNS,
  ALL_KEYS.KeyDNSOption,
  ALL_KEYS.KeyDNSSearch,
  ALL_KEYS.KeyGIDMap,
  ALL_KEYS.KeyGlobalArgs,
  ALL_KEYS.KeyIP,
  ALL_KEYS.KeyIP6,
  ALL_KEYS.KeyNetwork,
  ALL_KEYS.KeyNetworkAlias,
  ALL_KEYS.KeyPodName,
  ALL_KEYS.KeyPodmanArgs,
  ALL_KEYS.KeyPublishPort,
  ALL_KEYS.KeyRemapGid,
  ALL_KEYS.KeyRemapUid,
  ALL_KEYS.KeyRemapUidSize,
  ALL_KEYS.KeyRemapUsers,
  ALL_KEYS.KeyServiceName,
  ALL_KEYS.KeyShmSize,
  ALL_KEYS.KeySubGIDMap,
  ALL_KEYS.KeySubUIDMap,
  ALL_KEYS.KeyUIDMap,
  ALL_KEYS.KeyUserNS,
  ALL_KEYS.KeyVolume,
]);
