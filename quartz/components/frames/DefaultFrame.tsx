import { PageFrame, PageFrameProps } from "./types"
import HeaderConstructor from "../Header"

const Header = HeaderConstructor()

/**
 * The default page frame — three-column layout with left sidebar, center
 * content (header + body + afterBody), and right sidebar, followed by a footer.
 *
 * This is the original Quartz layout, extracted from renderPage.tsx.
 */
export const DefaultFrame: PageFrame = {
  name: "default",
  render({
    componentData,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer,
  }: PageFrameProps) {
    const isEnglish = componentData.fileData.frontmatter?.lang === "en"

    return (
      <>
        <div class="left sidebar">
          {left.map((BodyComponent, index) => (
            <>
              <BodyComponent {...componentData} />
              {index === 2 && (
                <nav class="bura-meta-nav" aria-label={isEnglish ? "Site information" : "Site bilgileri"}>
                  <a href={isEnglish ? "/en/on-bura/" : "/buraya-dair/"}>
                    {isEnglish ? "On Bura" : "Bura'ya dair"}
                  </a>
                  <a href={isEnglish ? "/" : "/en/"}>{isEnglish ? "Türkçe" : "English"}</a>
                </nav>
              )}
            </>
          ))}
        </div>
        <div class="center">
          <div class="page-header">
            <Header {...componentData}>
              {header.map((HeaderComponent) => (
                <HeaderComponent {...componentData} />
              ))}
            </Header>
            <div class="popover-hint">
              {beforeBody.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </div>
          </div>
          <Content {...componentData} />
          <hr />
          <div class="page-footer">
            {afterBody.map((BodyComponent) => (
              <BodyComponent {...componentData} />
            ))}
          </div>
        </div>
        <div class="right sidebar">
          {right.map((BodyComponent) => (
            <BodyComponent {...componentData} />
          ))}
        </div>
        {footer.map((FooterComponent) => (
          <FooterComponent {...componentData} />
        ))}
      </>
    )
  },
}
