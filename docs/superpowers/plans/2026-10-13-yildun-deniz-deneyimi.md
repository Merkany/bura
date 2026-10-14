# Yildun Deniz Deneyimi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Küçük Ayı'daki Yildun yıldızından açılan; okuma ilerlemesi, düşen deniz fotoğrafları ve yükselen video deniziyle çalışan erişilebilir bir Taşma sayfası oluşturmak.

**Architecture:** Yeni `tasma-sea` sayfa türü mevcut Taşma kabuğundan ayrı bir Preact görünümü, ayrı istemci betiği ve sınırlı CSS alanı kullanacak. Deniz HTML video katmanında, fotoğraflar bağımsız DOM öğelerinde çalışacak; başlangıç okuma ilerlemesine, final ayrı bir zaman çizelgesine bağlanacak. Kaynak fotoğraf ve videolar hazırlama betiğiyle `quartz/static/tasma/yildun/` altına kopyalanıp manifestten okunacak.

**Tech Stack:** Quartz 5, TypeScript, Preact, SCSS, tarayıcı `<video>`/`<dialog>` API'leri, Node.js test runner, Sharp.

**Spec:** `docs/superpowers/specs/2026-10-13-yoklugun-cografyasi-design.md`

## Global Constraints

- Kalıcı adres `/tasma/yildun/`; bağlı yıldız `umi-2`, görünür yıldız adı `Yildun`.
- Mevcut `/bu-ulkede-deniz-yok/`, Polaris deneyimi ve diğer yıldızların konumları değişmeyecek.
- “06. Bu Ülkede Deniz Yok” ilk prototipte yalnızca geçici metin kaynağı olacak.
- Video sessiz oynayacak; kullanıcı takibi, hesap, analitik veya ağ isteği eklenmeyecek.
- Kaynak medya dosyaları değiştirilmeyecek; site için kopyalar üretilecek.
- `prefers-reduced-motion` durumunda metin ve arşiv eksiksiz erişilebilir kalacak.
- Commit ve push kullanıcı tarafından GitHub Desktop ile yapılacak.

## Review Focus

- Video oynatmanın engellendiği veya dosyanın yüklenmediği tarayıcıda metin ve yedek deniz görüntüsü kalmalı.
- Hızlı kaydırmada aynı fotoğraf eşiği iki kez tetiklenmemeli ve final yalnızca bir kez başlamalı.
- Mobil dar ekranda fotoğraflar metni kapatmamalı, yatay taşma oluşturmamalı.
- Açık fotoğraf diyaloğu kapanınca fotoğrafın düşüş konumu korunmalı ve klavye odağı geri dönmeli.
- Hareket azaltma tercihinde otomatik düşüş, video hareketi ve yükselen deniz devre dışı kalmalı.

---

### Task 1: Medya hazırlama ve manifest

**Files:**
- Create: `scripts/prepare-yildun-assets.mjs`
- Create: `quartz/static/tasma/yildun/photos/` (üretilen web kopyaları)
- Create: `quartz/static/tasma/yildun/videos/` (seçilen video kopyaları)
- Create: `quartz/static/tasma/yildun/media.json`
- Test: `scripts/yildun.test.mjs`

**Interfaces:**
- Produces: `media.json` içinde `{ photos: YildunPhoto[], videos: YildunVideo[], fallbackImage: string }`.
- `YildunPhoto`: `{ id: string, src: string, width: number, height: number, alt: string }`.
- `YildunVideo`: `{ src: string, media?: string }`.

- [ ] **Step 1: Kaynak klasörleri ve eksik numaraları doğrulayan başarısız testi yaz**

Test, fotoğraf listesinin dosya sisteminden üretildiğini, 94 mevcut görselin sıralandığını ve sabit “96” varsayımı bulunmadığını denetlesin.

- [ ] **Step 2: Testi çalıştır ve hazırlama betiği olmadığı için başarısız olduğunu doğrula**

Run: `node --test scripts/yildun.test.mjs`

- [ ] **Step 3: `prepare-yildun-assets.mjs` betiğini yaz**

Betik fotoğrafları orantıyı koruyarak web boyutuna küçültsün, seçilen küçük video dosyalarını kopyalasın ve manifesti deterministik sırayla üretsin. Kaynaklar yoksa anlaşılır hata versin; mevcut kaynakları değiştirmesin.

- [ ] **Step 4: Medya betiğini ve testi çalıştır**

Run: `node scripts/prepare-yildun-assets.mjs && node --test scripts/yildun.test.mjs`

Expected: 94 fotoğraf manifestte; tüm çıktı dosyaları sıfırdan büyük; yalnızca seçilen video kopyaları mevcut.

### Task 2: Yildun yıldızı ve içerik sayfası

**Files:**
- Modify: `quartz/components/tasmaData.ts`
- Create: `content/tasma/yildun.md`
- Modify: `scripts/tasma.test.mjs`

**Interfaces:**
- Produces: `umi-2` yıldızında `name: "Yildun"`, `href: "/tasma/yildun"`.
- Produces: frontmatter `pageType: tasma-sea`, `star: yildun`, `constellation: ursa-minor`.

- [ ] **Step 1: Yildun bağlantısı ve yeni sayfa türü için başarısız testleri yaz**

Test iki parlak bağlantılı yıldız bulunduğunu, ikinci bağlantının `/tasma/yildun` olduğunu ve Polaris verisinin değişmediğini denetlesin.

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

Run: `node --test scripts/tasma.test.mjs`

- [ ] **Step 3: Yıldız verisini ve geçici Markdown içeriğini ekle**

`yildun.md`, geçici olarak mevcut 06 metninin bir kopyasını taşısın; özgün 06 dosyasını içe aktarmasın veya değiştirmesin.

- [ ] **Step 4: Taşma testlerini çalıştır**

Run: `node --test scripts/tasma.test.mjs`

Expected: Polaris ve Yildun bağlantıları geçer; diğer yıldızlar bağlantısız kalır.

### Task 3: Deniz sayfasının sunucu tarafı görünümü

**Files:**
- Create: `quartz/components/YildunSea.tsx`
- Modify: `quartz/components/renderPage.tsx`
- Modify: `quartz/components/Head.tsx`
- Modify: `scripts/yildun.test.mjs`

**Interfaces:**
- Consumes: Task 1 `media.json`, Task 2 `pageType: tasma-sea`.
- Produces: `[data-yildun-sea]`, `[data-yildun-text]`, `[data-yildun-ocean]`, `[data-yildun-photo-layer]`, `<dialog data-yildun-dialog>`, `/tasma/yildun/#arsiv`.

- [ ] **Step 1: Oluşması gereken semantik HTML için başarısız testi yaz**

Test metin makalesi, sessiz video, fotoğraf katmanı, erişilebilir diyalog, arşiv bağlantısı ve ana sayfa bağlantısını arasın.

- [ ] **Step 2: Testin yeni görünüm bulunmadığı için başarısız olduğunu doğrula**

Run: `node --test scripts/yildun.test.mjs`

- [ ] **Step 3: `YildunSea` bileşenini ekle ve `tasma-sea` yönlendirmesini bağla**

Markdown gövdesini görünür metin sütununda render et; medya manifestini veri olarak sayfaya geçir. `isTasma` kapsamına yeni sayfa türünü dahil et ki mevcut hava şeridi ve yan sütunlar eklenmesin.

- [ ] **Step 4: Başlık ve structured data kimliğini yeni sayfa türüne uyarla**

Görünür eser adı kesinleşene kadar sosyal başlık `Yildun — Taşma — Bura`, canonical `https://buradayok.org/tasma/yildun/` olsun.

- [ ] **Step 5: Bileşen testlerini çalıştır**

Run: `node --test scripts/yildun.test.mjs scripts/tasma.test.mjs`

### Task 4: Okuma ilerlemesi ve bağımsız fotoğraf düşüşleri

**Files:**
- Create: `quartz/components/scripts/yildun.inline.ts`
- Modify: `quartz/plugins/emitters/componentResources.ts`
- Modify: `scripts/yildun.test.mjs`

**Interfaces:**
- Produces: `setupYildunSea()`; her fotoğraf için durum `{ id, progress, paused, side, speed }`.
- Consumes: `[data-yildun-sea]` içindeki manifest ve DOM kancaları.

- [ ] **Step 1: Kaydırma eşikleri, tekil üretim ve temizleme davranışı için başarısız statik testleri yaz**

Test `nav`/`render` kaydını, `AbortController` temizliğini, tetiklenen kimlik kümesini ve her fotoğrafın kendi zaman başlangıcını denetlesin.

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

- [ ] **Step 3: Okuma ilerlemesini 0–1 aralığında hesapla ve seyrek eşikleri uygula**

Fotoğraflar dönüşümlü ama rastlantısal sağ/sol kenardan doğsun; merkezi metin güvenli alanına girmesin. Eşik tekrarları engellensin.

- [ ] **Step 4: Fotoğraf tıklama/dokunma diyaloğunu ekle**

Açılırken ilgili fotoğrafı durdur, kapanırken aynı ilerleme değerinden devam ettir ve odağı açan öğeye döndür.

- [ ] **Step 5: Su temasında çözülme durumunu ekle**

Fotoğraf kendi geometrisi ile görünür su çizgisini kestiğinde `is-dissolving` durumuna geçsin ve bitince DOM'dan kaldırılsın.

- [ ] **Step 6: Betik testlerini çalıştır**

Run: `node --test scripts/yildun.test.mjs`

### Task 5: Deniz, final zaman çizelgesi ve hareket azaltma

**Files:**
- Modify: `quartz/components/scripts/yildun.inline.ts`
- Modify: `quartz/styles/custom.scss`
- Modify: `scripts/yildun.test.mjs`

**Interfaces:**
- Produces: sınıflar `is-final-running`, `is-submerged`, `is-finale`; CSS değişkeni `--yildun-water-level`.

- [ ] **Step 1: Finalin yalnızca bir kez başlaması ve reduced-motion davranışı için başarısız testleri yaz**

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

- [ ] **Step 3: Sessiz video katmanını ve yumuşak klip geçişini uygula**

Otomatik oynatma başarısızsa yedek görseli koru; kullanıcıya hata arayüzü gösterme.

- [ ] **Step 4: Metnin son eşiğinde kendi zamanıyla ilerleyen finali uygula**

Fotoğraf sıklığını artır, su seviyesini yükselt, metni su altında bırak ve sonunda “Bu ülkede deniz yok.” cümlesini göster.

- [ ] **Step 5: Reduced-motion kolunu uygula**

Video ve otomatik hareket çalışmasın; fotoğraflar sakin seçki olarak kalsın; metin ve final cümlesi normal belgede erişilebilir olsun.

- [ ] **Step 6: Masaüstü ve mobil stillerini tamamla**

Metin sütunu okunaklı kalsın; mobilde düşen görsel sayısı ve boyutu azalsın; yatay taşma oluşmasın.

- [ ] **Step 7: Testleri çalıştır**

Run: `node --test scripts/yildun.test.mjs scripts/tasma.test.mjs`

### Task 6: Arşiv ve production doğrulaması

**Files:**
- Modify: `quartz/components/YildunSea.tsx`
- Modify: `quartz/styles/custom.scss`
- Modify: `scripts/yildun.test.mjs`
- Modify: `scripts/discoverability.test.mjs`

**Interfaces:**
- Consumes: Task 1 manifestindeki tüm fotoğraflar.
- Produces: `#arsiv` içinde tam metin ve bulunan bütün fotoğraflar; canonical ve sitemap girdisi.

- [ ] **Step 1: Arşiv bütünlüğü ve discoverability için başarısız production testlerini yaz**

Test build HTML'inde 94 benzersiz fotoğraf, tam geçici metin, `/tasma/yildun/` canonical değeri, sitemap girdisi ve yıldızdan gerçek `<a href>` bağlantısı arasın.

- [ ] **Step 2: Testi build öncesinde çalıştır ve beklenen eksikleri doğrula**

- [ ] **Step 3: Arşiv görünümünü tamamla**

Galeri normal belge akışında çalışsın; JavaScript kapalıyken fotoğraflara ve metne erişilebilsin.

- [ ] **Step 4: Tür, birim ve production build kontrollerini çalıştır**

Run: `npm run check:types`

Run: `node --test scripts/tasma.test.mjs scripts/yildun.test.mjs`

Run: `npm run build:site`

Run: `node --test scripts/discoverability.test.mjs scripts/yildun.test.mjs`

Expected: tüm kontroller geçer; `public/tasma/yildun/index.html`, medya dosyaları, canonical ve sitemap girdisi mevcuttur.

- [ ] **Step 5: Gerçek tarayıcıda masaüstü ve mobil davranışı doğrula**

Kontrol: seyrek ilk fotoğraflar, dokununca durma/büyüme, kapanınca devam, su temasında çözülme, tek seferlik final, arşiv, video yedeği ve reduced-motion.

