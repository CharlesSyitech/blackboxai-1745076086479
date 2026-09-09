import { existsSync } from "node:fs"
import { join } from "node:path"
import { declaredAssets } from "@/content/assets"

/**
 * Which declared assets actually exist, resolved once on the server.
 *
 * Pages ask this rather than the filesystem, and never the browser: a client
 * probing for a file would flash a broken image before deciding. The set is
 * computed at build time, so a page that ships without an asset simply omits
 * that plane.
 */
const publicDir = join(process.cwd(), "public")

const present = new Set(declaredAssets.filter((path) => existsSync(join(publicDir, path))))

export function hasAsset(path: string): boolean {
  return present.has(path)
}

/** True once every hero plane has been supplied — the layered opening. */
export function heroAssetsComplete(paths: string[]): boolean {
  return paths.every((path) => present.has(path))
}
