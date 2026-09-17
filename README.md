# Bura

Türkçe öykü sitesi. Quartz 5 ile Markdown dosyalarından üretilir.

## Yerel çalışma

Node.js 22 veya üzeri ve npm 10.9.2 veya üzeri gerekir.
İlk kurulumda `npm ci` çalıştırın. Bağımlılıklar zaten kuruluysa tekrar gerekmez.

- `npm run dev`: siteyi derler, http://localhost:8080 adresinde açılabilir hale getirir ve dosya değişikliklerini izler. Durdurmak için Ctrl+C.
- `npm run build:site`: yayın dosyalarını `public` klasöründe üretir.
- `npm run check:types`: TypeScript kontrolü.
- `npm test`: mevcut otomatik testler.

Komutları bu README dosyasının bulunduğu proje klasöründe çalıştırın.

## Dosyalar

- `content/`: yayımlanan öyküler; `index.md` ana sayfadır.
- `quartz.config.default.yaml`: mevcut etkin site, tema, eklenti ve yerleşim ayarları. `quartz.config.yaml` oluşturulursa öncelik o dosyaya geçer.
- `quartz/styles/custom.scss`: özel görünüm kuralları.
- `quartz/components/Head.tsx`: sayfa başlığı bilgileri ve özel font bağlantıları.
- `quartz/i18n/locales/tr-TR.ts`: Türkçe arayüz metinleri.
- `public/`: otomatik üretilir; doğrudan düzenlemeyin.
- `docs/`: Quartz altyapısının belgeleri; sitenin öykü içeriği değildir.

## Yayın

GitHub deposu: https://github.com/Merkany/bura

Yapılandırılmış site adresi: https://merkany.github.io/bura/

`.github/workflows/gh-pages-deploy.yml`, `main` dalına gönderilen değişiklikleri GitHub Pages için derleyip yayımlar. Yerel düzenleme tek başına yayına çıkmaz. GitHub deposunda Pages kaynağının GitHub Actions olarak seçilmiş olması gerekir.

## Mevcut durum

Altı öykü ve başlık içeren bir ana sayfa vardır. İçerik ve tasarımın sonraki yönü ayrıca kararlaştırılacaktır.
