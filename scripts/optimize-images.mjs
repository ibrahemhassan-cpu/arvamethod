// Re-encodes everything in public/images as lossy WebP capped to a sensible width.
// Usage: node scripts/optimize-images.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const dir = path.resolve('public/images')
const maxWidth = { 'body-session': 2200, 'path-landscape': 1800, 'logo-primary': 500, 'logo-primary@2x': 1000 }

for (const file of await readdir(dir)) {
  if (!file.endsWith('.webp')) continue
  const name = file.replace(/\.webp$/, '')
  const input = await readFile(path.join(dir, file))
  const isLogo = name.startsWith('logo')
  const quality = name === 'body-session' ? 84 : 74
  const width = maxWidth[name] ?? (name.startsWith('t-') ? 480 : 1200)
  const output = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp(isLogo ? { quality: 90, alphaQuality: 100, effort: 6 } : { quality, effort: 6, smartSubsample: true })
    .toBuffer()
  if (output.length < input.length) {
    await writeFile(path.join(dir, file), output)
    console.log(`${file}: ${(input.length / 1024).toFixed(0)} KB → ${(output.length / 1024).toFixed(0)} KB`)
  } else {
    console.log(`${file}: kept (${(input.length / 1024).toFixed(0)} KB)`)
  }
}
