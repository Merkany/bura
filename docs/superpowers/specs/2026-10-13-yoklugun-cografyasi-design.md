# Yokluğun Coğrafyası — Tasarım Belgesi

## Amaç

Taşma gökyüzünde Küçük Ayı'nın Polaris'ten sonraki yıldızını aydınlatan, okuma ile ilerleyen ayrı bir edebî deneyim oluşturmak. İlk prototipte mevcut “06. Bu Ülkede Deniz Yok” metni yalnızca geçici içerik olarak kullanılacak. Mevcut yazı ve URL değiştirilmeden kalacak; nihai metin daha sonra yeni sayfaya aktarılacak.

## Sayfa ve yıldız bağlantısı

- Yeni kalıcı adres: `/tasma/yildun/`.
- Küçük Ayı'daki `umi-2` yıldızı gerçek adı **Yildun** ile parlak ve bağlantılı olacak.
- Polaris sayfası ve mevcut Taşma davranışı değişmeyecek.
- Yeni sayfa kendine ait başlık, canonical URL ve sosyal paylaşım bilgileri taşıyacak.

## Görsel yapı

Sayfa üç bağımsız katmandan oluşacak:

1. Ortada rahat okunan, dar bir metin sütunu.
2. Ekranın altında sessiz video kullanan gerçekçi deniz katmanı.
3. Metnin sağ ve sol kenarlarından geçen fotoğraf katmanı.

Deniz için `C:\Users\mer\Desktop\deniz video` içindeki uygun videolar kullanılacak. Yatay videolar masaüstünde ana deniz görüntüsünü, uygun dikey videolar mobilde veya yükselme aşamasında destek görüntüsünü sağlayabilir. Birden fazla video kullanılırsa sert kesme yerine uzun ve yumuşak geçiş yapılacak. Videolar sessiz, otomatik ve döngülü çalışacak.

Fotoğraflar `C:\Users\mer\Desktop\deniz` klasöründen alınacak. Kaynak dosyalar değiştirilmeden site için optimize edilmiş kopyalar üretilecek. Görsel oranları korunacak.

## Dramaturji

### 1. Okuma

- Sayfa metinle açılır; deniz ekranın altında sakin biçimde görünür.
- İlk fotoğraflar zamanlayıcıyla değil, okuma ilerlemesiyle ortaya çıkar.
- Fotoğraflar seyrek ve geniş görünür; metin sütununun ortasını kapatmaz.
- Her fotoğraf doğduğu anda kendi düşüş süresini başlatır.

### 2. Fotoğraf etkileşimi

- Düşen fotoğrafa tıklanınca veya dokunulunca fotoğraf büyür ve düşüşü durur.
- Büyütülmüş görüntü kapatıldığında aynı fotoğraf kaldığı noktadan düşmeye devam eder.
- Fotoğraf suya değdiğinde rengi çözülür, saydamlaşır ve kaybolur.
- Aynı anda görünen fotoğraf sayısı okumanın başında düşük tutulur.

### 3. Eşik ve final

- Metnin son bölümünde fotoğraf gelişleri sıklaşır.
- Bu eşikten sonra sahne yalnızca kaydırmaya bağlı kalmaz; zaman kendi kendine ilerler.
- Deniz yavaşça yükselir, önce fotoğrafları, sonra metni ve ekranı kaplar.
- Finalde denizle birlikte yalnızca “Bu ülkede deniz yok.” cümlesi kalır.
- Final animasyonu bir kez başlayan kesintisiz bir sahne olarak çalışır.

## Arşiv

Ana deneyimden erişilebilen ayrı bir Arşiv görünümü olacak. Burada:

- mevcut bütün deniz fotoğrafları normal bir galeri içinde görülebilecek,
- tam metin animasyonsuz ve kesintisiz okunabilecek,
- klavye ve ekran okuyucu kullanımı korunacak,
- fotoğraflar anlamlı sıra ve erişilebilir açıklamalarla sunulacak.

Klasörde şu anda 94 fotoğraf bulunduğu için arşiv başlığı sabit olarak “96 fotoğraf” demeyecek. Eksik iki fotoğraf daha sonra eklendiğinde otomatik olarak listeye girebilecek bir veri yapısı kullanılacak.

## Teknik yaklaşım

- Yeni deneyim ayrı bir `pageType` ve ayrı bileşenlerle izole edilecek.
- Deniz, HTML `<video>` katmanı olarak çalışacak.
- Fotoğraflar erişilebilir HTML öğeleri olacak; hareketleri CSS ve küçük bir istemci betiği yönetecek.
- Okuma ilerlemesi tek bir 0–1 değerine dönüştürülecek. Fotoğraf eşikleri bu değer üzerinden tetiklenecek.
- Final başladıktan sonra ayrı bir zaman çizelgesi devreye girecek.
- Görsel büyütme, düşüş durumunu koruyan tek bir diyalog üzerinden yapılacak.
- Sayfa yenilendiğinde deneyim başlangıca dönecek; kullanıcı takibi, hesap, kayıt veya analitik eklenmeyecek.

## Mobil ve performans

- Mobilde fotoğraflar metnin iki dar kenarına sığdırılmayacak; daha seyrek ve daha küçük gösterilecek.
- Deniz videosu ekran oranına göre kırpılabilir ancak gerilmez.
- Aynı anda çalışan video sayısı ve görünür fotoğraf sayısı sınırlandırılacak.
- Fotoğraf kopyaları web için küçültülecek; kaynak dosyalar korunacak.
- Video yüklenemezse sakin bir deniz görseli yedek olarak gösterilecek ve metin okunabilir kalacak.

## Erişilebilirlik

- `prefers-reduced-motion` etkinse düşüş, çözülme ve yükselen deniz animasyonları çalışmayacak.
- Bu durumda metin normal biçimde okunacak, fotoğraflar sakin bir seçki olarak gösterilecek ve final cümlesi erişilebilir kalacak.
- Diyalog klavyeyle açılıp kapanabilecek; odak açıldığı öğeye geri dönecek.
- Otomatik video sessiz olacak ve bilgi taşımayacak.

## Değişmeyecek alanlar

- Mevcut `/bu-ulkede-deniz-yok/` sayfası.
- Polaris'in özel sayfası ve davranışı.
- Taşma'daki diğer yıldızların konumu.
- Bura'nın genel sayfa düzeni ve diğer bölümleri.

## İlk prototipin kabul ölçütleri

- `umi-2` yıldızı yeni sayfaya gider.
- Geçici metin rahat okunur ve mevcut 06 sayfasından bağımsızdır.
- Deniz videosu masaüstü ve mobilde sessiz çalışır.
- İlk fotoğraflar okuma ilerlemesine bağlı olarak kenarlardan düşer.
- Fotoğraf büyütülünce durur, kapatılınca devam eder.
- Suya ulaşan fotoğraf görsel olarak çözülüp kaybolur.
- Finalde deniz yükselir ve “Bu ülkede deniz yok.” cümlesi görünür.
- Arşiv görünümünde bulunan bütün fotoğraflar ve tam geçici metin erişilebilir.
- Hareket azaltma tercihinde sayfa okunabilir ve işlevsel kalır.

