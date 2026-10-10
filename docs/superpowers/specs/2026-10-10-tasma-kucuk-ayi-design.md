# Taşma / Küçük Ayı Tasarımı

## Amaç

“Bunları Düşünmesem Yeriydi” bölümünün yerini, zamanla gerçek takımyıldızları üzerinden büyüyecek “Taşma” alır. İlk sürüm yalnızca Küçük Ayı’yı ve Polaris’e bağlanan ilk başlıksız metni yayıma hazırlar.

## Gökyüzü

- Küçük Ayı’nın yedi ana yıldızı astronomik sağ açıklık ve dik açıklık değerlerinden aynı izdüşümle yerleştirilir.
- Takımyıldızı çizgileri sabittir; rastgele yıldız kullanılmaz.
- Polaris yayımlanmış metne sahip olduğu için parlak ve gerçek bir bağlantıdır.
- Diğer yıldızlar görünür fakat sönük ve etkileşimsizdir.
- SVG kullanılır; en-boy oranı telefonda ve masaüstünde korunur.
- Veri yapısı daha sonra başka gerçek takımyıldızları eklemeye uygundur.

## İlk metin

- Kalıcı adres `/tasma/polaris/` olur.
- Sayfada görünür başlık bulunmaz.
- Tarayıcı ve paylaşım başlığı “Taşma — Bura” olur; “Metin ve Göl” hiçbir yerde kullanılmaz.
- Kaynak HTML’deki göl görseli ayrı bir yerel asset olarak çıkarılır.
- Sarı halka, fotoğrafın açılması ve metnin kelime kelime görünür hâle gelmesi korunur.
- Shift+R ve `#sifirla` davranışları kaldırılır.
- İlerleme yalnızca localStorage’da tutulur ve dışarı gönderilmez.
- Klavye, dokunma ve düz metne geçiş erişilebilirliği korunur.
- Bura’ya dönüş bağlantısı görünür olur; sayfa dili Türkçedir.
- Konum, Ankara, tarih, saat ve coğrafi bilgi sayfada, metadata’da veya paylaşım kartında bulunmaz.

## Siteye bağlanma

- Ana sayfadaki eski bölüm bağlantısı “Taşma” ile değiştirilir.
- Eski bölümün adresi alias ile `/tasma/`ya yönlendirilir.
- Taşma sayfaları mevcut hava durumu, bulut makinesi ve Kayıp Bürosu katmanlarını göstermez; deneyimin gökyüzü ve göl düzeni bozulmaz.
- Mevcut diğer bölümlerin dosyaları ve davranışları değiştirilmez.

## Görsel dil

- Taşma gökyüzü Bura’nın koyu zemin, kırık beyaz ve sıcak vurgu renklerinden türetilir.
- Polaris metni kaynak deneyimin renk ilişkisini korur, fakat renk değişkenleri Bura’nın açık/koyu temasıyla eşleştirilir.
- Hareket azaltma tercihi geçişleri kapatır.

## Doğrulama

- Veri testi Küçük Ayı’nın yedi yıldızını, sabit çizgilerini ve yalnızca Polaris’in bağlantılı olduğunu doğrular.
- Entegrasyon testi ana sayfa bağlantısını, kalıcı adresi, başlıksız görünümü, metadata’yı ve sıfırlama yollarının yokluğunu doğrular.
- Production build çıktısı masaüstü ve mobil ölçülerde görsel olarak kontrol edilir.
