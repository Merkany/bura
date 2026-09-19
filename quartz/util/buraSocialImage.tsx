import type { SocialImageOptions } from "@quartz-community/og-image"

type CardFormat = "tot-raporu" | "eposta" | "arama" | "kayip-form"

const ink = "#17151b"
const paper = "#f4efe3"
const red = "#b84f3d"
const yellow = "#d7a83e"
const muted = "#77716a"

const base: Record<string, string | number> = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  padding: "58px 66px 52px",
  backgroundColor: paper,
  color: ink,
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

function binary(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split("")
    .map((character) => character.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ")
}

function Signature({ bolum }: { bolum: string }) {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        left: "66px",
        right: "66px",
        bottom: "43px",
        alignItems: "flex-end",
        justifyContent: "space-between",
        fontSize: "20px",
        letterSpacing: "0.08em",
      }}
    >
      <span style={{ display: "flex", fontWeight: 700 }}>bura / {bolum}</span>
      <span style={{ display: "flex", color: muted, fontSize: "14px", letterSpacing: "0.04em" }}>
        buradayok.org
      </span>
    </div>
  )
}

function Code({ value, centered = false }: { value: string; centered?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        left: "66px",
        right: "66px",
        bottom: "82px",
        justifyContent: centered ? "center" : "flex-start",
        color: muted,
        fontSize: "13px",
        letterSpacing: "0.08em",
      }}
    >
      {value}
    </div>
  )
}

function ReportCard({ title, bolum, code }: { title: string; bolum: string; code: string }) {
  const splitAt = Math.max(1, Math.min(title.length - 1, Math.floor(title.length * 0.56)))
  return (
    <div style={base}>
      <div
        style={{
          display: "flex",
          alignSelf: "flex-end",
          padding: "10px 18px",
          border: `4px solid ${red}`,
          color: red,
          fontSize: "22px",
          fontWeight: 800,
          letterSpacing: "0.12em",
          transform: "rotate(-3deg)",
        }}
      >
        SAPMA RAPORU · ONAYSIZ
      </div>
      <div style={{ display: "flex", marginTop: "34px", gap: "26px", fontSize: "21px" }}>
        <span style={{ display: "flex", color: muted }}>Form No</span>
        <span style={{ display: "flex" }}>| {bolum} / TOT</span>
      </div>
      <div style={{ display: "flex", marginTop: "18px", gap: "26px", fontSize: "21px" }}>
        <span style={{ display: "flex", color: muted }}>Açıklama</span>
        <span style={{ display: "flex" }}>| ██████████████</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "68px",
          fontSize: "60px",
          fontWeight: 800,
          lineHeight: 1.02,
        }}
      >
        <span style={{ display: "flex" }}>{title.slice(0, splitAt)}</span>
        <span style={{ display: "flex", transform: "translateY(-5px)" }}>
          {title.slice(splitAt)}
        </span>
      </div>
      <div style={{ display: "flex", marginTop: "34px", color: red, fontSize: "20px" }}>
        durum: kapatılmadı
      </div>
      <Code value={code} />
      <Signature bolum={bolum} />
    </div>
  )
}

function EmailCard({ title, bolum, code }: { title: string; bolum: string; code: string }) {
  return (
    <div style={base}>
      <div style={{ display: "flex", fontSize: "23px", color: muted }}>Kimden: —</div>
      <div style={{ display: "flex", marginTop: "18px", fontSize: "23px" }}>Konu: {title}</div>
      <div
        style={{
          display: "flex",
          height: "2px",
          marginTop: "28px",
          backgroundColor: ink,
          opacity: 0.18,
        }}
      />
      <div style={{ display: "flex", marginTop: "55px", fontSize: "53px", fontWeight: 800 }}>
        okundu bilgisi&nbsp;
        <span style={{ display: "flex", transform: "translateY(6px)", color: red }}>istenmedi</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "40px",
          maxWidth: "940px",
          color: muted,
          fontSize: "20px",
          lineHeight: 1.5,
        }}
      >
        mesai saatleri dışında gönderilmiştir · yanıt beklenmemektedir ama beklenmektedir
      </div>
      <div style={{ display: "flex", marginTop: "46px", color: yellow, fontSize: "20px" }}>
        1 ek ........
      </div>
      <Code value={code} />
      <Signature bolum={bolum} />
    </div>
  )
}

function CallCard({ title, bolum, code }: { title: string; bolum: string; code: string }) {
  return (
    <div style={{ ...base, alignItems: "center", textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          marginTop: "6px",
          color: muted,
          fontSize: "23px",
          letterSpacing: "0.18em",
        }}
      >
        GELEN ARAMA
      </div>
      <div
        style={{
          display: "flex",
          position: "relative",
          marginTop: "64px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            color: red,
            fontSize: "66px",
            fontWeight: 800,
            transform: "translate(3px, 2px)",
            opacity: 0.9,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            color: ink,
            fontSize: "66px",
            fontWeight: 800,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "45px",
          color: yellow,
          fontSize: "32px",
          letterSpacing: "0.6em",
        }}
      >
        • • •
      </div>
      <div style={{ display: "flex", marginTop: "30px", fontSize: "27px" }}>süre: 00:0_</div>
      <div style={{ display: "flex", marginTop: "18px", color: muted, fontSize: "18px" }}>
        bekleme müziği: telifsiz
      </div>
      <Code value={code} centered />
      <Signature bolum={bolum} />
    </div>
  )
}

function LostCard({
  bolum,
  code,
  lost,
  place,
}: {
  bolum: string
  code: string
  lost: string
  place: string
}) {
  const row = (label: string, value: string, valueColor = ink) => (
    <div
      style={{
        display: "flex",
        padding: "22px 0",
        borderBottom: `2px solid ${ink}22`,
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          display: "flex",
          width: "390px",
          color: muted,
          fontSize: "18px",
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </span>
      <span
        style={{ display: "flex", flex: 1, color: valueColor, fontSize: "38px", fontWeight: 700 }}
      >
        {value}
      </span>
    </div>
  )
  return (
    <div style={base}>
      {row("KAYIP", lost)}
      {row("SON GÖRÜLDÜĞÜ YER", place)}
      {row("BULUNMA İHTİMALİ", "düşük", red)}
      {row("PİYASA DEĞERİ", "hesaplanamadı")}
      <div style={{ display: "flex", marginTop: "22px", color: red, fontSize: "18px" }}>
        satılık değildir
      </div>
      <Code value={code} />
      <Signature bolum={bolum} />
    </div>
  )
}

function GenericCard({ title, code }: { title: string; code: string }) {
  return (
    <div style={base}>
      <div style={{ display: "flex", color: red, fontSize: "22px", letterSpacing: "0.18em" }}>
        BURA
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "118px",
          maxWidth: "1040px",
          fontSize: "68px",
          fontWeight: 800,
          lineHeight: 1.06,
        }}
      >
        {title}
      </div>
      <Code value={code} />
      <Signature bolum="—" />
    </div>
  )
}

export const buraSocialImage: SocialImageOptions["imageStructure"] = ({
  title,
  fonts,
  fileData,
}) => {
  const frontmatter = fileData.frontmatter ?? {}
  const isLossRecord = String(fileData.slug ?? "").startsWith("kayip-burosu/")
  const rawFormat = isLossRecord ? "kayip-form" : frontmatter.format
  const format = typeof rawFormat === "string" ? (rawFormat as CardFormat) : undefined
  const bolum = String(frontmatter.bolum ?? frontmatter.kayit ?? "—").padStart(2, "0")
  const keyword = text(
    frontmatter.anahtar_kelime ?? frontmatter.kategori,
    title.split(/\s+/)[0] ?? "bura",
  )
  const code = binary(keyword)
  const sharedStyle: Record<string, string | number> = {
    width: "100%",
    height: "100%",
    display: "flex",
    fontFamily: fonts[1]?.name ?? "monospace",
  }

  if (format === "eposta")
    return (
      <div style={sharedStyle}>
        <EmailCard title={title} bolum={bolum} code={code} />
      </div>
    )
  if (format === "arama")
    return (
      <div style={sharedStyle}>
        <CallCard title={title} bolum={bolum} code={code} />
      </div>
    )
  if (format === "kayip-form") {
    return (
      <div style={sharedStyle}>
        <LostCard
          bolum={bolum}
          code={code}
          lost={text(frontmatter.kayip, title)}
          place={text(frontmatter.son_gorulen_yer ?? frontmatter.bulunduguYer, "—")}
        />
      </div>
    )
  }
  if (format === "tot-raporu") {
    return (
      <div style={sharedStyle}>
        <ReportCard title={title} bolum={bolum} code={code} />
      </div>
    )
  }
  return (
    <div style={sharedStyle}>
      <GenericCard title={title} code={code} />
    </div>
  )
}
