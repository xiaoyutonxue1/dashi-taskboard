import { accessSync, constants } from "node:fs";
import os from "node:os";
import path from "node:path";

const WINDOWS_EXECUTABLE_EXTENSIONS = [".exe", ".cmd", ".bat", ".com"];

function executableFile(candidate) {
  try {
    accessSync(candidate, constants.X_OK);
    return candidate;
  } catch {
    return null;
  }
}

function executableOnPath(env, platform) {
  for (const directory of (env.PATH || "").split(path.delimiter)) {
    if (!directory) continue;
    const candidates = platform === "win32"
      ? WINDOWS_EXECUTABLE_EXTENSIONS.map(
          (extension) => path.join(directory, `codex${extension}`),
        )
      : [path.join(directory, "codex")];
    for (const candidate of candidates) {
      const resolved = executableFile(candidate);
      if (resolved) return resolved;
    }
  }
  return null;
}

export function codexExecutableInApp(appPath) {
  return path.join(appPath, "Contents", "Resources", "codex");
}

export function resolveCodexExecutable({
  explicit = process.env.CODEX_EXECUTABLE,
  appPath,
  env = process.env,
  platform = process.platform,
  homeDirectory = os.homedir(),
} = {}) {
  if (typeof explicit === "string" && explicit.trim()) return explicit.trim();

  if (appPath) {
    const bundled = executableFile(codexExecutableInApp(appPath));
    if (bundled) return bundled;
  }

  const installedCli = executableOnPath(env, platform);
  if (installedCli) return installedCli;

  if (platform === "darwin") {
    for (const applicationDirectory of ["/Applications", path.join(homeDirectory, "Applications")]) {
      for (const applicationName of ["ChatGPT.app", "Codex.app"]) {
        const bundled = executableFile(codexExecutableInApp(
          path.join(applicationDirectory, applicationName),
        ));
        if (bundled) return bundled;
      }
    }
  }

  return "codex";
}
