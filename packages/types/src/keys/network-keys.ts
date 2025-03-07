import { ALL_KEYS } from './all';

/**
 * Supported keys in "Network" group
 * Copied on 07/03/2025 from https://github.com/containers/podman/blob/d1a3f96cbf08544093e9ad3acec1c28d858f707a/pkg/systemd/quadlet/quadlet.go
 */
export const NETWORK_KEYS: Set<ALL_KEYS> = new Set<ALL_KEYS>([
  ALL_KEYS.KeyLabel,
  ALL_KEYS.KeyDNS,
  ALL_KEYS.KeyContainersConfModule,
  ALL_KEYS.KeyGlobalArgs,
  ALL_KEYS.KeyDisableDNS,
  ALL_KEYS.KeyDriver,
  ALL_KEYS.KeyGateway,
  ALL_KEYS.KeyIPAMDriver,
  ALL_KEYS.KeyIPRange,
  ALL_KEYS.KeyIPv6,
  ALL_KEYS.KeyInternal,
  ALL_KEYS.KeyNetworkName,
  ALL_KEYS.KeyOptions,
  ALL_KEYS.KeyServiceName,
  ALL_KEYS.KeySubnet,
  ALL_KEYS.KeyPodmanArgs,
]);
