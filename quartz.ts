import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"
import { buraSocialImage } from "./quartz/util/buraSocialImage"

componentRegistry.setOptionOverrides("@quartz-community/og-image", {
  colorScheme: "lightMode",
  width: 1200,
  height: 630,
  excludeRoot: false,
  imageStructure: buraSocialImage,
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
