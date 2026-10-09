# Law Firm Tycoon v0.7

Türkçe hukuk bürosu yönetim oyunu. Dosyalar otomatik açılır ve tamamlanır; hukukçular gelir üretir, maaş ve kira giderleri kasadan düşer.

## Oyna

[Oyunu aç](https://yfv6t2my64-stack.github.io/law-firm-tycoon/)

Yerel kullanım için `index.html` dosyasını tarayıcıda aç. Kod, stiller ve görseller dosyanın içindedir; harici bağımlılık yoktur.

## v0.7

12 ofis, 20 demirbaş, kişisel bütçe, 18 otomobil, 15 konut, Happy Hour ve beş seçenekli hukuk soruları içerir. Gelir, gider ve son durum (gelir − gider) saniye başına gösterilir; tamamlanan dosya ücretleri ayrıca eklenir.

## Kaynak ve doğrulama

Node.js 20 veya üzeriyle:

```sh
npm run build
npm test
```

`src/` kaynakları `source-order.json` sırasıyla birleştirilir. Derleme kökteki `index.html` ve `dist/index.html` dosyalarını üretir. GitHub Pages `main` dalının kökünden sunulur. Yayın öncesinde mevcut 51 otomatik test geçti.

Bu depo, mevcut v0.7 projesinin yayın kopyasıdır. Tarayıcıdan kaydedilmiş v0.7 dosyasının JavaScript koduyla eşleşmesi doğrulanmıştır. Yerel kaynak proje değiştirilmemiştir.

## Kayıt taşıma

Kayıtlar tarayıcının localStorage alanındadır. Yerel dosya veya localhost kayıtları GitHub Pages'e kendiliğinden taşınmaz. Eski oyunda **Profil → Yedeği indir**, yeni adreste **Profil → İçe aktar** seçeneklerini kullan. Eski kaydı sıfırlamadan önce yedeğini sakla.

Hukuki içerik oyun amacıyla sadeleştirilmiştir; hukuki danışmanlık değildir.
