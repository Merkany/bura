# Taşma / Küçük Ayı Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Taşma’nın Küçük Ayı gökyüzünü ve Polaris’e bağlı ilk başlıksız deneysel metni Bura’ya eklemek.

**Architecture:** Quartz’ın mevcut sayfa üretiminde iki özel `pageType` kullanılır: gökyüzü için `tasma-sky`, metin için `tasma-text`. Takımyıldızı verisi test edilebilir ayrı bir modülde, etkileşim ayrı tarayıcı betiğinde, görünüm mevcut özel stil dosyasında tutulur.

**Tech Stack:** TypeScript/Preact, Quartz, SVG, SCSS, tarayıcı DOM API’leri.

**Spec:** `docs/superpowers/specs/2026-10-10-tasma-kucuk-ayi-design.md`

## Global Constraints

- Görünür ve paylaşım başlığında “Metin ve Göl” kullanılmayacak.
- Konum, Ankara, tarih, saat ve coğrafi bilgi yayımlanmayacak.
- Shift+R ve `#sifirla` bulunmayacak.
- Kullanıcının mevcut kaydedilmemiş dosyalarına dokunulmayacak.
- Canlıya gönderim yapılmayacak.

## Review Focus

- Başlıksız içerik boş veya bozuk metadata üretmemeli.
- Polaris dışında hiçbir sönük yıldız bağlantı veya tıklama alanı olmamalı.
- SPA geçişinden sonra metin etkileşimi iki kez bağlanmamalı.
- Mobil sürgü parmakla kullanılabilmeli ve metni örtmemeli.
- Yerel ilerleme bozuksa sayfa temiz başlangıç yapmalı.

---

### Task 1: Taşma içerik ve yıldız verisi

**Files:**
- Create: `quartz/components/tasmaData.ts`
- Create: `content/tasma/index.md`
- Create: `content/tasma/polaris.md`
- Modify: `content/index.md`
- Test: `scripts/tasma.test.mjs`

- [ ] Testte yedi Küçük Ayı yıldızını, Polaris bağlantısını ve ana sayfa değişimini tarif et.
- [ ] Testi çalıştırıp eksik dosyalar nedeniyle başarısız olduğunu doğrula.
- [ ] İçerik ve veri dosyalarını ekle.
- [ ] Testin geçtiğini doğrula.

### Task 2: Gökyüzü ve başlıksız metin bileşenleri

**Files:**
- Modify: `quartz/components/renderPage.tsx`
- Modify: `quartz/components/Head.tsx`
- Modify: `quartz/styles/custom.scss`
- Test: `scripts/tasma.test.mjs`

- [ ] Teste SVG gökyüzü, gerçek bağlantı, görünür başlığın yokluğu ve metadata beklentilerini ekle.
- [ ] Testin başarısız olduğunu doğrula.
- [ ] İki sayfa türünün bileşenlerini ve görünümünü ekle.
- [ ] Testin geçtiğini doğrula.

### Task 3: Göl etkileşimi ve asset

**Files:**
- Create: `quartz/static/tasma/polaris-gol.jpg`
- Create: `quartz/components/scripts/tasma.inline.ts`
- Modify: `quartz/plugins/emitters/componentResources.ts`
- Test: `scripts/tasma.test.mjs`

- [ ] Teste asset, etkileşim kaydı, klavye desteği ve yasak sıfırlama yollarını ekle.
- [ ] Testin başarısız olduğunu doğrula.
- [ ] Kaynak görseli çıkar ve etkileşimi Bura DOM’una uyarla.
- [ ] Testin geçtiğini doğrula.

### Task 4: Production doğrulaması

**Files:**
- Verify: `public/tasma/index.html`
- Verify: `public/tasma/polaris/index.html`

- [ ] Tüm testleri ve tip kontrolünü çalıştır.
- [ ] Production build çalıştır.
- [ ] Çıktıda canonical, metadata, yedi yıldız, Polaris bağlantısı ve başlıksız metni doğrula.
- [ ] Masaüstü ve mobil yerel önizlemeyi görsel olarak kontrol et.
