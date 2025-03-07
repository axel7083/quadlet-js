import { ALL_KEYS } from './all';

/**
 * Supported keys in "Quadlet" group
 * Copied on 07/03/2025 from https://github.com/containers/podman/blob/d1a3f96cbf08544093e9ad3acec1c28d858f707a/pkg/systemd/quadlet/quadlet.go
 */
export const QUADLET_KEYS: Set<ALL_KEYS> = new Set<ALL_KEYS>([ALL_KEYS.KeyDefaultDependencies]);
