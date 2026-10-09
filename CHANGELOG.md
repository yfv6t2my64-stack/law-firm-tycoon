# v0.5 → v0.6

## Eklenenler

- Çalışma yaklaşımı, ekip eğitimi, demirbaş yatırımları, süreli planlama oturumu ve danışmanlık sözleşmeleri.
- Bekleme süreli, isteğe bağlı dilekçe çalışması.
- İş yükü özeti, sıradaki departman hedefi, pasif gelir çarpanı ve kazanç kaynağı raporu.
- Yatırımın pasif net hıza etkisini gösteren bildirim ve dosya tamamlanma bildirimi.
- JSON yedek indirme/içe aktarım, önceki oturum yedeği ve bozuk birincil kayıtta sağlam kayıt arama.
- Otomatik testler, tekrar üretilebilir ekonomi koşuları ve raporlar.

## İyileştirilenler

- Saniyelik gelir ve giderlerde iki ondalık: başlangıç gideri artık yanlışlıkla ₺0 görünmez.
- Türkçe personel unvanları ve dört aşamalı iş/ticaret/şirket/tahkim süreçleri.
- 320 piksel mobil görünüm, sabit beşli menü, 44 piksel dokunma hedefleri, safe-area desteği.
- Azaltılmış animasyon ayarı gerçekten geçişleri devre dışı bırakır.
- Arayüz düğümleri korunarak güncellenir; periyodik yenileme odak ve kaydırmayı bozmaz.
- Yüksek hassasiyetli görev ilerlemesi okunaklı biçimde yuvarlanır.
- Kaynak kod state/ekonomi/dava/personel/yatırım/simülasyon/kayıt/UI modüllerine ayrıldı; bağımlılık eklenmedi.

## Düzeltmeler

- Kesirli canlı zaman ile çevrimdışı zaman aynı sabit saniyelik adımlarda işler; zaman kalanı kaydedilir.
- Dolan dosya yuvaları sonraki departmanları sürekli dışlamaz; yeni işler sırayla dağıtılır.
- Günlük görevler UTC yerine İstanbul gününe göre, gece yarısı sınırında yenilenir.
- Geçersiz/null dava, süre, ücret, mod ve sözleşme kayıtları simülasyonu bozamaz.
- Hatalı indeksler, yinelenen ödül/demirbaş/sözleşme ve etkinlik üst üste başlatmaları reddedilir.
- İçe aktarım hataları Türkçe gösterilir; geçersiz JSON mevcut oyunu değiştirmez.
- Görev ödülleri aylık gelir ve v0.6 gelir kırılımına dahil edilir.

## Korunanlar

Otomatik müvekkil ve dava akışı, temel fiyatlar ve maaşlar, ofis kirası, departman giderleri, sekiz saatlik çevrimdışı sınır, itibar, memnuniyet, terfi, kariyer/günlük görevler, aylık raporlar ve ses seçeneği. Eski v0.5 kayıt anahtarı silinmez. Dış oyunun kaynak kodu veya görsel varlıkları kullanılmadı. Kamuya açık yayımlama yapılmadı.
