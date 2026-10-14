# Bura — Teknik Rehber

Bu rehber 13 Ekim 2026 tarihinde gerçek proje dosyaları ile önceki çalışma notları karşılaştırılarak hazırlanmıştır. Kesinleştirilemeyen bilgiler açıkça belirtilmiştir.

## Projenin gerçek konumu

- Yerel proje: `C:\Users\mer\Desktop\Kitap-2026 denemeler\Kitap-2026`
- Canlı site: `https://buradayok.org`
- GitHub: `https://github.com/Merkany/bura.git`
- Görünen dal: `main`
- Altyapı: Quartz 4, Markdown/Obsidian, statik production build
- Kullanıcının normal akışı: Obsidian ile içerik, GitHub Desktop ile commit/push

İncelemede uzak depo ve dal okunabildi; fakat `git status --short` bu klasörü çalışma ağacı olarak algılamadı. `.git` mevcut olsa da nedeni kesinleşmedi.

## Klasör yapısı

```text
Kitap-2026/
├─ .github/                 GitHub iş akışları
├─ .obsidian/               Obsidian kasa ayarları
├─ .tmp-tools/              Geçici yerel önizleme araçları
├─ content/                 Yayımlanan Markdown içerikleri
│  ├─ en/lost-property/     İngilizce Kayıp Bürosu
│  ├─ kayip-burosu/         Türkçe Kayıp Bürosu
│  ├─ tasma/                Taşma ve özel metinler
│  ├─ robots.txt
│  └─ llms.txt
├─ public/                  Yeniden üretilebilen build çıktısı
├─ quartz/
│  ├─ components/           Bileşenler ve istemci betikleri
│  ├─ static/               Kalıcı görsel/video varlıkları
│  └─ styles/               Tasarım
├─ scripts/                 Build, akış ve test yardımcıları
├─ Şablonlar/               Obsidian içerik şablonları
├─ package.json
└─ quartz.config.default.yaml
```

`public/` kaynak değildir; kalıcı değişiklikler `content/`, `quartz/`, `scripts/` veya yapılandırmada yapılmalıdır.

## İçerikler

Normal Türkçe metinler `content/*.md` dosyalarıdır. Yeni metin şablonu `Şablonlar/Yeni Bura metni.md` dosyasındadır.

Başlıca frontmatter alanları:

- `title`: başlık
- `pageType`: özel sayfa türü
- `bolum`: bölüm/sıra
- `format`: görsel sunum biçimi
- `anahtar_kelime`
- `aliases`
- `socialImage`: sosyal paylaşım görseli

`socialImage` gerçek bir statik dosyayı göstermelidir. Yanlış klasör veya yalnız dosya adı geçmişte görselin bulunmamasına neden oldu.

Kayıp Bürosu:

- Türkçe: `content/kayip-burosu/`
- İngilizce: `content/en/lost-property/`
- Şablon: `Şablonlar/Yeni Kayıp Bürosu kaydı.md`

Her kayıt ayrı Markdown dosyası, kalıcı URL ve gerçek `<a href>` bağlantısı kullanır.

Taşma:

- `content/tasma/index.md`: `pageType: tasma-sky`
- `content/tasma/polaris.md`: `pageType: tasma-text`
- `quartz/static/yildun/index.html`: Yildun yıldızından açılan bağımsız statik deniz deneyimi

Eski `content/tasma/yildun.md` prototipi kaldırıldı. Yildun, Taşma içindeki Polaris'ten sonraki ikinci parlak yıldızdır ve `/static/yildun/` adresindeki paketlenmiş deneyimi açar.

## Yapılandırma ve build

`quartz.config.default.yaml` içinde görülen ayarlar:

- Başlık: Bura
- Dil: `tr-TR`
- Alan adı: `buradayok.org`
- SPA ve popover: açık
- Fontlar: Fraunces, Inter, JetBrains Mono
- Arama ve explorer: açık
- Sitemap/RSS ve Open Graph görsel üretimi: açık
- GoatCounter: `mer`

GoatCounter'ın “gereksiz veri toplama olmayacak” ilkesiyle uyumu yeniden değerlendirilmelidir.

`package.json` komutları:

- `npm run dev`: yerel sunucu
- `npm run build:site`: OG yaması + Quartz build + yayın akışı
- `npm run check:types`: tür kontrolü
- `npm test`: kontroller

Canlı deployment'ın kesin mekanizması bu incelemede doğrulanmadı.

## Ana teknik dosyalar

### `quartz/components/renderPage.tsx`

Ana sayfa, yazılar, Kayıp Bürosu, “Elden ele”, hava durumu/Bulut Makinesi, Taşma ve Polaris özel görünümlerinin merkezidir. Yildun artık bu bileşenden bağımsız bir statik sayfadır. Dosya çok sorumluluk taşır; koşulların sırası önemlidir.

### `quartz/components/Head.tsx`

Title, description, canonical, Open Graph, `og:url`, JSON-LD ve RSS autodiscovery üretir. Site kimliği “Bura, Merkan Aksoydan tarafından yapılmaktadır.” şeklindedir.

### `quartz/styles/custom.scss`

Bura'nın özel renk, tipografi, kart, paylaşım, Bulut Makinesi, Taşma, Polaris ve mobil stillerinin ana dosyasıdır. Yildun kendi stilini `quartz/static/yildun/index.html` içinde taşır.

### `quartz/components/tasmaData.ts`

Sabit takımyıldızı geometrisi ve yayımlanmış yıldız bağlantılarıdır. Polaris ve Yildun burada bağlıdır. Yıldızlar rastgele konumlandırılmamalıdır.

### `quartz/components/scripts/tasma.inline.ts`

Polaris etkileşimini ve metnin kod içindeki kopyasını içerir. Metin Markdown'da da vardır. Markdown'ı tek kaynak yapma denemesi özel yerleşimi bozduğu için geri alındı. Polaris metni değiştirilirse şimdilik iki yer de kontrol edilmelidir.

### Diğerleri

- `quartz/components/scripts/cloudMachine.inline.ts`: Bulut Makinesi etkileşimi
- `freeCloud` kodu: ana sayfadaki bağımsız bulut
- `quartz/components/scripts/story-ui.js`: canonical URL ile paylaşım
- `quartz/static/insan-misin/`: insan/emek kontrolü varlıkları; Taşma bu kontrolden hariçtir

## Medya

- `quartz/static/paylasim/`: sosyal görseller
- `quartz/static/bulutlar/`: 15 ayrı bulut
- `quartz/static/tasma/polaris-gol.jpg`
- `quartz/static/yildun/`: Yildun'un bağımsız sayfası; 94 fotoğrafın tam/küçük kopyaları, deniz videosu, ses, font ve denetleyici betiği

Dış kaynak klasörleri:

- `C:\Users\mer\Desktop\deniz`
- `C:\Users\mer\Desktop\deniz video`

Sayımda 94 fotoğraf bulundu; önceki notlarda 96 deniyordu. Eksik iki görsel belirsizdir. Kullanılan iki videonun nihai seçim olduğu da kesin değildir.

## Tasarım ve çalışma kuralları

- Dil edebî, sade, hafif tekinsiz ve elle yapılmış hissinde olmalı.
- Okunabilirlik efektlerden önce gelir.
- Mevcut renk, tipografi ve ritim korunmalı.
- Reklam, üyelik, ücretli içerik ve gereksiz veri toplama olmamalı.
- Her içerik kalıcı, paylaşılabilir URL'ye sahip olmalı.
- Masaüstü ve mobil birlikte düşünülmeli.
- İçindekiler ilk açılışta kapalı olmalı; site bölümleri kitap içindekilerine karışmamalı.
- “Elden ele” yazıların başında/sonunda, Kayıp Bürosu kayıtlarında ayrı ayrı çalışmalı.
- Sosyal kartlar düşük çözünürlüklü ekran görüntüsü olmamalı.
- Elle `socialImage` varsa o, yoksa otomatik görsel kullanılmalı.
- Bulut Makinesi 42 px hava şeridine sağdan asılıdır; gövdesi aşağı taşabilir.
- Makinenin tamamı tıklanabilir; hızlı tıklamalar engellenmez.
- Otomatik bulutlar sade 3–4, kullanıcı bulutları 15 assetin tamamından seçilir.
- Otomatik üretim son kararda 10–20 saniyedir.
- Durum mesajları yalnız bazı kullanıcı üretimlerinde görünür.
- Serbest ana sayfa bulutu makineden bağımsızdır ve `prefers-reduced-motion` durumunda gizlenir.
- Taşma gerçek/sabit takımyıldızı geometrisini kullanır; yalnız metni olan yıldız parlar.
- Taşma metinleri başlıksız olabilir ama URL ve paylaşım metadatası olmalıdır.

## Yapılan önemli değişiklikler

- İçindekiler kapalı başlangıç ve yalnız kitap metinleri.
- “Paylaş” yerine “Elden ele” ve sosyal seçenekler.
- Kayıp Bürosu için ayrı kayıt sayfaları ve paylaşım görselleri.
- Yazı/Kayıp Bürosu Obsidian şablonları.
- Sitemap, canonical, `og:url`, RSS ve `llms.txt` düzenlemeleri.
- Kayıp kayıtlarının sitemap'e ve gerçek bağlantılara eklenmesi.
- `/index` OG URL'lerinin düzeltilmesi.
- `bura-akis.xml` production üretimi.
- `/tags/` bölümünün sitemap/RSS'ten çıkarılması.
- Elle ve otomatik sosyal görsel desteği.
- Bulut Yapma Makinesi, 15 bulut ve serbest bulut.
- Taşma gökyüzü, Polaris ve `/static/yildun/` adresindeki paketlenmiş Yildun deneyimi.
- Taşma sayfalarında insan/emek kontrolünün kapatılması.

## Başarısız denemeler ve tekrar edilmemesi gerekenler

- Quartz logosu/genel site görseli/içerikle ilgisiz görseli sosyal kartta kullanmak.
- Düşük çözünürlüklü ekran görüntüsünü sosyal görsel yapmak.
- X/Facebook/Buffer önbelleğini yalnızca kod hatası sanmak.
- Buffer'ın siteyi kendiliğinden izleyip otomatik paylaşacağını varsaymak.
- Kullanıcı istemeden ayrı worktree/klasörde çalışıp GitHub Desktop ana kopyasından ayrılmak.
- Polaris'i doğrudan Markdown'dan besleyip özel sahneyi bozmak.
- Çalışmayan veya farklı sürece ait localhost portunu önizleme diye vermek.
- Başlık/dosya adı/alias/görünen başlığı istemeden farklılaştırmak.

### Yildun'un reddedilen ilk yönü

İlk prototip parlak mavi/sualtı videosu ve belirgin efekt demosu gibi göründü. Edebiyat sayfası duygusu oluşmadı.

Yeni yön: önce rahat okunan güçlü bir edebiyat sayfası; altta koyu, neredeyse siyah ve az hareket eden gerçekçi deniz; metni örtmeden kenardan geçen tek fotoğraf. Okur sayfanın zamanla su tarafından ele geçirildiğini hissetmeli. Final davranışına geçmeden önce açılışın ışık, renk, tipografi ve ölçeği onaylanmalı.

## Çalışan özellikler

Dosyalara göre uygulanmış görünenler:

- Quartz build
- Türkçe/İngilizce içerikler
- Normal yazı ve Kayıp Bürosu sayfaları
- Kalıcı kayıt linkleri
- “Elden ele”
- Canonical, OG, structured data
- Sitemap, robots, RSS, llms
- Obsidian şablonları
- Elle/otomatik sosyal görsel
- Hava durumu ve Bulut Makinesi
- 15 bulut ve bağımsız serbest bulut
- Taşma gökyüzü
- Polaris deneyimi
- Yildun bağımsız statik deniz deneyimi

Bunların canlıda son kaynakla yayımlandığı yalnız dosyalardan garanti edilemez; push ve deployment gerekir.

## Çözülmemiş konular

- 94/96 fotoğraf farkı.
- Nihai deniz videosu seçilmedi.
- Polaris metni iki yerde; senkronizasyon riski var.
- GoatCounter/gizlilik kararı belirsiz.
- Arama motoru ve sosyal ağ önbellekleri dış sistemlere bağlı.
- `git status` çalışma ağacı hatası açıklanmadı.
- `.tmp-tools/yildun-preview-server.mjs` geçici dosyasının Git durumu belirsiz.
- Yildun tarihiyle ilgili önceki build uyarısı yeniden kontrol edilmeli.
- Deployment mekanizması kesinleştirilmedi.

## Güvenli çalışma yöntemi

1. Gerçek proje kökünde çalış.
2. `public/` yerine kaynak dosyayı değiştir.
3. İçerik için Obsidian/`content/` kullan.
4. Özel sayfalarda `renderPage.tsx`, istemci betiği ve `custom.scss` birlikte kontrol edilir.
5. Paylaşımda canonical, `og:url`, `og:image`, canlı görsel ve platform önbelleği sırayla incelenir.
6. Yeni sayfaya URL, canonical, paylaşım metadatası ve gerekiyorsa sitemap/RSS verilir.
7. Production build, tür kontrolü ve ilgili testler çalıştırılır.
8. Yerelde onaylanmadan canlıya gönderilmez.
9. GitHub Desktop değişiklikleri kullanıcıya açıklanır; geçici dosyalar gönderilmez.
10. Kullanıcı istemedikçe ayrı worktree kullanılmaz.

Bu dosya proje değiştikçe güncellenmelidir.

