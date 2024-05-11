export function ensureEnvPresent(needed: string[]) {
  const missing = needed.reduce((acc, envName) => {
    if (!process.env[envName]) acc.add(envName);
    return acc;
  }, new Set<string>());

  return Array.from(missing);
}
