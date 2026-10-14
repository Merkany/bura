import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname } from "path"

const cleanYildunPath = "tasma/yildun"
const redirectToCleanYildun = `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/tasma/yildun/"><link rel="canonical" href="https://buradayok.org/tasma/yildun/"><title>Yönlendiriliyor</title><a href="/tasma/yildun/">Yildun'a git</a>`

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
    const outputStaticPath = joinSegments(argv.output, "static")
    await fs.promises.mkdir(outputStaticPath, { recursive: true })
    for (const fp of fps) {
      const src = joinSegments(staticPath, fp) as FilePath
      const isYildun = fp === cleanYildunPath || fp.startsWith(`${cleanYildunPath}/`)
      const dest = joinSegments(isYildun ? argv.output : outputStaticPath, fp) as FilePath
      await fs.promises.mkdir(dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }
    const formerYildunIndex = joinSegments(outputStaticPath, cleanYildunPath, "index.html") as FilePath
    await fs.promises.mkdir(dirname(formerYildunIndex), { recursive: true })
    await fs.promises.writeFile(formerYildunIndex, redirectToCleanYildun)
    yield formerYildunIndex
  },
  async *partialEmit() {},
})
