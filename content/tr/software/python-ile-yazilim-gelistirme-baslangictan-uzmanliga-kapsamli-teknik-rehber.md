---
title: "Python ile Yazılım Geliştirme — Başlangıçtan Uzmanlığa Kapsamlı Teknik Rehber"
date: 2026-06-25
type: "software"
draft: false
math: true
description: "Python öğrenmek isteyenlere başlangıçtan uzmanlığa uzanan, kod örnekleriyle desteklenmiş pratik bir yol haritasıdır. Her seviyeden geliştirici için veri bilimi, web ve yapay zekaya kadar geniş bir kapsam sunmaktadır."
featured_image: "/images/software/python-ile-yazilim-gelistirme-baslangictan-uzmanliga-kapsamli-teknik-rehber.png"
tags: ["software", "yazilim", "python", "yazilim-gelistirme", "python-gelistirme", "python-dersleri", "pandas", "numpy", "yazilim-dili", "kodlama", "veri-bilimi"]
---

Python, 1991 yılında Guido van Rossum tarafından yayımlanan ve bugün dünyanın en yaygın kullanılan programlama dillerinden biri haline gelen bir dil. TIOBE endeksinde sürekli olarak ilk üçte yer alıyor; veri bilimi, web geliştirme, otomasyon, yapay zeka gibi birbirinden farklı alanlarda fiilen endüstri standardı konumunda. Bu popülariteyi sağlayan şeyin sözdizimiyle başlamak doğru olur: Python, İngilizce'ye yakın, okunabilir bir yapıya sahip. Ama bu sadelik, dilin altında yatan gücü gizlemez. C uzantılarıyla entegrasyon, asenkron programlama desteği, kapsamlı standart kütüphane ve devasa ekosistem — bunların tamamı Python'u gerçek anlamda çok katmanlı bir dil yapıyor.

{{< figure src="/images/software/python-ile-yazilim-gelistirme-baslangictan-uzmanliga-kapsamli-teknik-rehber.png" alt="Python ile Yazılım Geliştirme — Başlangıçtan Uzmanlığa Kapsamlı Teknik Rehber" width="1200" caption="Şekil 1: Python ile Yazılım Geliştirme — Başlangıçtan Uzmanlığa Kapsamlı Teknik Rehber" >}}

---
## Bölüm 1 — Kurulum, Ortam ve İlk Adımlar

### Python Sürüm Yönetimi

Python kurulumu için doğrudan python.org üzerinden indirme yapılabilir. Ancak profesyonel kullanımda birden fazla Python sürümüyle çalışmak zorunlu hale gelir. Bunun için `pyenv` aracı son derece kullanışlı:

```bash
# pyenv kurulumu (Linux/macOS)
curl https://pyenv.run | bash

# Kullanılabilir Python sürümlerini listele
pyenv install --list

# Belirli bir sürümü kur
pyenv install 3.12.3

# Global sürüm belirle
pyenv global 3.12.3

# Proje bazlı sürüm belirle
pyenv local 3.11.8
```

Windows kullanıcıları için `pyenv-win` paketi aynı işlevi görür.

### Sanal Ortam Yönetimi

Her proje kendi bağımlılıklarını izole bir ortamda taşımalıdır. Python'un yerleşik `venv` modülü bu iş için yeterlidir:

```bash
# Sanal ortam oluştur
python -m venv .venv

# Aktifleştir (Linux/macOS)
source .venv/bin/activate

# Aktifleştir (Windows)
.venv\Scripts\activate

# Bağımlılıkları dondur
pip freeze > requirements.txt

# Ortamı yeniden kur
pip install -r requirements.txt
```

Daha gelişmiş bağımlılık yönetimi için `poetry` veya `uv` tercih edilebilir. `uv`, Rust ile yazılmış ve son derece hızlı bir paket yöneticisi olarak öne çıkıyor:

```bash
# uv kurulumu
pip install uv

# Yeni proje oluştur
uv init myproject
cd myproject

# Paket ekle
uv add requests pandas

# Projeyi çalıştır
uv run python main.py
```

### IDE Seçimi

**VS Code** hafif ve genişletilebilir yapısıyla yaygın tercih. Python eklentisi, Pylance dil sunucusu ve Jupyter notebook desteği birlikte kullanıldığında güçlü bir ortam oluşuyor.

**PyCharm** ise tam özellikli bir IDE. Kod tamamlama, hata ayıklama, yeniden düzenleme araçları ve proje yönetimi entegre geliyor.

**Jupyter Notebook / JupyterLab**, özellikle veri analizi ve araştırma amaçlı çalışmalar için vazgeçilmez. Hücre bazlı çalıştırma modeli, adım adım keşif için idealdir:

```bash
pip install jupyterlab
jupyter lab
```

---

## Bölüm 2 — Temel Sözdizimi ve Veri Tipleri

### Değişkenler ve Dinamik Tipleme

Python dinamik olarak tiplendirilmiş bir dil; değişkenlere tip bildirimi yapmak zorunlu değil. Ancak Python 3.5'ten itibaren gelen tip ipuçları (type hints) okunabilirliği artırıyor ve statik analiz araçları için zemin hazırlıyor:

```python
# Temel atamalar
ad: str = "Ahmet"
yas: int = 28
maas: float = 12500.75
aktif: bool = True

# Çoklu atama
x, y, z = 10, 20, 30

# Değer takası — C/Java'dan farklı olarak geçici değişken gerekmez
x, y = y, x

# Sabit benzeri değişkenler (Python'da gerçek sabit yok, konvansiyon büyük harf)
MAX_BAGLANTI: int = 100
PI: float = 3.14159265358979
```

### Sayısal Tipler ve Aritmetik

```python
# int — sınırsız boyut
buyuk_sayi = 10 ** 100  # googol

# float — IEEE 754 çift duyarlıklı
import sys
print(sys.float_info.max)  # 1.7976931348623157e+308

# complex
z = 3 + 4j
print(abs(z))  # 5.0 — Pisagor teoremi

# Bölme operatörleri
print(7 / 2)   # 3.5  — gerçek bölme
print(7 // 2)  # 3    — tamsayı bölme
print(7 % 2)   # 1    — mod
print(2 ** 10) # 1024 — üs

# Ondalık hassasiyet için decimal modülü
from decimal import Decimal, getcontext
getcontext().prec = 50
sonuc = Decimal("1") / Decimal("3")
print(sonuc)  # 0.33333333333333333333333333333333333333333333333333
```

### String İşlemleri

String'ler Python'da immutable (değiştirilemez) dizilerdir. Zengin metot kümesi ve f-string desteğiyle son derece kullanışlıdır:

```python
metin = "Python Programlama"

# Temel işlemler
print(metin.upper())          # PYTHON PROGRAMLAMA
print(metin.lower())          # python programlama
print(metin.split())          # ['Python', 'Programlama']
print(metin.replace("P", "p")) # python programlama
print(metin.strip())          # baştaki ve sondaki boşlukları temizle
print(metin.startswith("Py")) # True
print(len(metin))             # 18

# İndeksleme ve dilimleme
print(metin[0])     # P
print(metin[-1])    # a
print(metin[0:6])   # Python
print(metin[::2])   # Pto rgalm  (her ikinci karakter)
print(metin[::-1])  # amalmargorP nohtyP  (ters çevir)

# f-string (Python 3.6+) — en önerilen yöntem
isim = "Zeynep"
puan = 97.5
print(f"Öğrenci: {isim}, Puan: {puan:.2f}")  # Öğrenci: Zeynep, Puan: 97.50

# f-string içinde ifade
print(f"Kare: {puan ** 2:.0f}")  # Kare: 9506

# Çok satırlı string
sql = """
    SELECT *
    FROM kullanicilar
    WHERE aktif = TRUE
    ORDER BY kayit_tarihi DESC
"""
```

### Koşullu İfadeler

```python
sicaklik = 28

if sicaklik > 35:
    print("Çok sıcak")
elif sicaklik > 25:
    print("Sıcak")
elif sicaklik > 15:
    print("Ilık")
else:
    print("Soğuk")

# Ternary ifade (tek satırlık koşul)
durum = "sıcak" if sicaklik > 25 else "soğuk"

# match-case (Python 3.10+) — switch benzeri yapı
http_kodu = 404

match http_kodu:
    case 200:
        mesaj = "Başarılı"
    case 301 | 302:
        mesaj = "Yönlendirme"
    case 404:
        mesaj = "Bulunamadı"
    case 500:
        mesaj = "Sunucu Hatası"
    case _:
        mesaj = "Bilinmeyen"

print(mesaj)
```

### Döngüler

```python
# for — iterable üzerinde yineleme
meyveler = ["elma", "armut", "kiraz", "üzüm"]

for meyve in meyveler:
    print(meyve)

# enumerate — indeks ve değer birlikte
for i, meyve in enumerate(meyveler, start=1):
    print(f"{i}. {meyve}")

# range
for i in range(1, 11, 2):  # 1'den 10'a, 2'şer artarak
    print(i)  # 1, 3, 5, 7, 9

# while
sayac = 0
while sayac < 5:
    print(sayac)
    sayac += 1

# break ve continue
for n in range(20):
    if n % 2 == 0:
        continue   # çift sayıları atla
    if n > 15:
        break      # 15'ten büyük olunca dur
    print(n)       # 1, 3, 5, 7, 9, 11, 13, 15

# else bloğu (döngü tamamlanırsa çalışır, break ile durmazsa)
for n in range(5):
    if n == 10:
        break
else:
    print("Döngü tamamlandı, break çalışmadı")
```

---

## Bölüm 3 — Veri Yapıları

### Listeler

Liste, Python'un en temel koleksiyon tipidir. Heterojen veri tutabilir ve değiştirilebilir (mutable):

```python
# Liste oluşturma
sayilar = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
karisik = [42, "Python", 3.14, True, None]

# Temel metotlar
sayilar.append(7)          # sona ekle
sayilar.insert(0, 0)       # belirli indekse ekle
sayilar.remove(1)          # ilk bulunan 1'i sil
cikarilan = sayilar.pop()  # son elemanı çıkar ve döndür
sayilar.sort()             # sırala (yerinde)
sirali = sorted(sayilar)   # yeni sıralı liste döndür
sayilar.reverse()          # ters çevir
print(sayilar.count(5))    # 5'in kaç kez geçtiği
print(sayilar.index(9))    # 9'un indeksi

# Dilimleme
ilk_uc = sayilar[:3]
son_uc = sayilar[-3:]
ters = sayilar[::-1]

# Liste birleştirme
a = [1, 2, 3]
b = [4, 5, 6]
c = a + b            # yeni liste
a.extend(b)          # a'ya b'yi ekle

# Kopyalama — dikkat!
kopya_yanlis = sayilar       # referans kopyası (aynı nesneye işaret)
kopya_dogru = sayilar.copy() # yüzeysel kopya
derin_kopya = sayilar[:]     # dilimleme ile kopya

import copy
derin = copy.deepcopy(karisik)  # iç içe nesneler için derin kopya
```

### Demetler (Tuples)

Demetler immutable'dır. Değiştirilemezlik, veri bütünlüğü gerektiren senaryolarda ve dictionary anahtarı olarak kullanımda avantaj sağlar:

```python
koordinat = (41.0082, 28.9784)  # İstanbul koordinatları
rgb = (255, 128, 0)

# Parantez olmadan da demet oluşur
nokta = 10, 20

# Tek elemanlı demet — virgül zorunlu
tekli = (42,)

# Demet açma (unpacking)
enlem, boylam = koordinat
r, g, b = rgb

# Genişletilmiş açma (Python 3+)
ilk, *orta, son = [1, 2, 3, 4, 5]
print(ilk)   # 1
print(orta)  # [2, 3, 4]
print(son)   # 5

# namedtuple — okunabilirliği artırır
from collections import namedtuple

Nokta = namedtuple("Nokta", ["x", "y", "z"])
p = Nokta(1, 2, 3)
print(p.x, p.y, p.z)   # 1 2 3
print(p._asdict())       # {'x': 1, 'y': 2, 'z': 3}

# dataclass ile daha modern alternatif (Python 3.7+)
from dataclasses import dataclass

@dataclass(frozen=True)  # frozen=True ile immutable
class Koordinat:
    enlem: float
    boylam: float
    yukseklik: float = 0.0

ist = Koordinat(41.0082, 28.9784, 50)
print(ist)
```

### Sözlükler (Dictionaries)

Python 3.7'den itibaren sözlükler ekleme sırasını korur. Hash tablosu üzerine inşa edilmiştir ve arama O(1) karmaşıklığındadır:

```python
# Sözlük oluşturma
kisi = {
    "ad": "Mehmet",
    "yas": 32,
    "sehir": "İstanbul",
    "beceriler": ["Python", "SQL", "Docker"]
}

# Erişim
print(kisi["ad"])                     # KeyError riski var
print(kisi.get("email", "Yok"))       # güvenli erişim, varsayılan değer

# Güncelleme
kisi["email"] = "mehmet@example.com"
kisi.update({"tel": "0555...", "yas": 33})

# Silme
del kisi["tel"]
cikarilan = kisi.pop("email", None)   # yoksa None döner

# Yineleme
for anahtar in kisi:
    print(anahtar)

for deger in kisi.values():
    print(deger)

for anahtar, deger in kisi.items():
    print(f"{anahtar}: {deger}")

# dict comprehension
kareler = {n: n**2 for n in range(1, 11)}
# {1: 1, 2: 4, 3: 9, ...}

# İç içe sözlükler
veritabani = {
    "kullanici1": {"ad": "Ali", "rol": "admin"},
    "kullanici2": {"ad": "Veli", "rol": "user"},
}

# defaultdict — eksik anahtarlarda varsayılan değer üretir
from collections import defaultdict

kelime_sayaci = defaultdict(int)
metin = "python java python c++ python java"
for kelime in metin.split():
    kelime_sayaci[kelime] += 1

print(dict(kelime_sayaci))
# {'python': 3, 'java': 2, 'c++': 1}

# Counter — frekans analizi için
from collections import Counter
sayac = Counter(metin.split())
print(sayac.most_common(2))  # [('python', 3), ('java', 2)]
```

### Kümeler (Sets)

Küme, benzersiz elemanlardan oluşan ve matematiksel küme operasyonlarını destekleyen bir yapıdır:

```python
a = {1, 2, 3, 4, 5}
b = {3, 4, 5, 6, 7}

print(a | b)    # birleşim: {1, 2, 3, 4, 5, 6, 7}
print(a & b)    # kesişim: {3, 4, 5}
print(a - b)    # fark: {1, 2}
print(a ^ b)    # simetrik fark: {1, 2, 6, 7}
print(a <= b)   # a, b'nin alt kümesi mi?

# Tekrar eden elemanları temizle
liste = [1, 2, 2, 3, 3, 3, 4]
benzersiz = list(set(liste))

# frozenset — değiştirilemez küme, sözlük anahtarı olabilir
fs = frozenset([1, 2, 3])
sozluk = {fs: "sabit küme"}
```

---

## Bölüm 4 — Fonksiyonlar ve Modülerlik

### Fonksiyon Tanımlama

```python
def topla(a: int, b: int) -> int:
    """İki sayının toplamını döndürür."""
    return a + b

# Varsayılan parametre değerleri
def selamlama(isim: str, dil: str = "tr") -> str:
    mesajlar = {
        "tr": f"Merhaba, {isim}!",
        "en": f"Hello, {isim}!",
        "de": f"Hallo, {isim}!"
    }
    return mesajlar.get(dil, mesajlar["tr"])

# *args — değişken sayıda konumsal argüman
def ortalama(*sayilar: float) -> float:
    if not sayilar:
        return 0.0
    return sum(sayilar) / len(sayilar)

print(ortalama(10, 20, 30, 40))  # 25.0

# **kwargs — değişken sayıda anahtar-değer argümanı
def profil_olustur(isim: str, **bilgiler) -> dict:
    return {"isim": isim, **bilgiler}

profil = profil_olustur("Fatma", yas=25, sehir="Ankara", meslek="Mühendis")

# Birden fazla değer döndürme (aslında tuple döner)
def min_max(liste: list) -> tuple[float, float]:
    return min(liste), max(liste)

kucuk, buyuk = min_max([3, 1, 4, 1, 5, 9, 2, 6])
```

### Kapsam (Scope)

Python'da LEGB kuralı geçerlidir: Local → Enclosing → Global → Built-in

```python
x = "global"

def dis_fonksiyon():
    x = "enclosing"

    def ic_fonksiyon():
        nonlocal x       # enclosing kapsamındaki x'i değiştir
        x = "lokal"
        print(x)         # lokal

    ic_fonksiyon()
    print(x)             # lokal (nonlocal etkiledi)

def global_degistir():
    global x
    x = "değişti"

dis_fonksiyon()
global_degistir()
print(x)                 # değişti
```

### Lambda Fonksiyonları

```python
# Tek satırlık anonim fonksiyon
kare = lambda x: x ** 2
topla = lambda a, b: a + b

# Fonksiyon argümanı olarak kullanım
sayilar = [5, 2, 8, 1, 9, 3]
sirali = sorted(sayilar, key=lambda x: -x)  # azalan sıra

# Sözlük sıralama
kisiler = [
    {"ad": "Ahmet", "yas": 30},
    {"ad": "Fatma", "yas": 25},
    {"ad": "Mehmet", "yas": 35}
]
yasa_gore = sorted(kisiler, key=lambda k: k["yas"])

# map, filter, reduce
kareler = list(map(lambda x: x**2, range(1, 6)))
# [1, 4, 9, 16, 25]

ciftler = list(filter(lambda x: x % 2 == 0, range(10)))
# [0, 2, 4, 6, 8]

from functools import reduce
carpim = reduce(lambda x, y: x * y, range(1, 6))
# 120 — faktöriyel
```

### Modüller ve Paketler

```python
# Standart kütüphane örnekleri

import math
print(math.sqrt(144))     # 12.0
print(math.pi)            # 3.141592653589793
print(math.log(1000, 10)) # 3.0
print(math.factorial(10)) # 3628800

import random
random.seed(42)            # tekrarlanabilir sonuçlar için
print(random.randint(1, 100))
print(random.choice(["elma", "armut", "kiraz"]))
random.shuffle(liste := [1, 2, 3, 4, 5])

from datetime import datetime, timedelta, date

simdi = datetime.now()
print(simdi.strftime("%d.%m.%Y %H:%M:%S"))

bir_hafta_sonra = simdi + timedelta(weeks=1)
dogum_gunu = date(1990, 5, 15)
bugun = date.today()
yas = (bugun - dogum_gunu).days // 365

import os
import pathlib

# Çalışma dizini
print(os.getcwd())

# Path işlemleri — pathlib önerilen yöntem
p = pathlib.Path.home() / "Documents" / "proje"
p.mkdir(parents=True, exist_ok=True)

# Dosya listesi
for dosya in pathlib.Path(".").glob("**/*.py"):
    print(dosya)
```

---

## Bölüm 5 — İleri Seviye Konular

### Hata Yönetimi

```python
# Temel yapı
try:
    sonuc = 10 / 0
except ZeroDivisionError as hata:
    print(f"Sıfıra bölme hatası: {hata}")
except (TypeError, ValueError) as hata:
    print(f"Tip veya değer hatası: {hata}")
except Exception as hata:
    print(f"Beklenmedik hata: {type(hata).__name__}: {hata}")
else:
    print("Hata olmadı, sonuç:", sonuc)
finally:
    print("Bu her zaman çalışır — temizlik işlemleri")

# Özel istisna sınıfı
class VeriDogrulamaHatasi(ValueError):
    def __init__(self, alan: str, deger, mesaj: str = ""):
        self.alan = alan
        self.deger = deger
        super().__init__(mesaj or f"{alan} için geçersiz değer: {deger}")

def yas_dogrula(yas: int) -> None:
    if not isinstance(yas, int):
        raise VeriDogrulamaHatasi("yas", yas, "Yaş tamsayı olmalı")
    if yas < 0 or yas > 150:
        raise VeriDogrulamaHatasi("yas", yas, "Yaş 0-150 aralığında olmalı")

try:
    yas_dogrula(-5)
except VeriDogrulamaHatasi as e:
    print(f"[{e.alan}] {e}")

# Context manager ile kaynak yönetimi
class BaglantiyiYonet:
    def __enter__(self):
        print("Bağlantı açıldı")
        return self

    def __exit__(self, tur, deger, traceback):
        print("Bağlantı kapatıldı")
        return False  # True dönerse istisna bastırılır

with BaglantiyiYonet() as baglanti:
    print("İşlem yapılıyor...")
```

### Dosya İşlemleri

```python
# Metin dosyası yazma
with open("veri.txt", "w", encoding="utf-8") as f:
    f.write("Birinci satır\n")
    f.writelines(["İkinci satır\n", "Üçüncü satır\n"])

# Okuma
with open("veri.txt", "r", encoding="utf-8") as f:
    icerik = f.read()            # tamamını oku
    f.seek(0)
    satirlar = f.readlines()     # liste olarak satırlar
    f.seek(0)
    for satir in f:              # satır satır yinele (büyük dosyalar için)
        print(satir.strip())

# Ekleme modu
with open("log.txt", "a", encoding="utf-8") as f:
    from datetime import datetime
    f.write(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] Sistem başlatıldı\n")

# JSON işlemleri
import json

veri = {
    "kullanicilar": [
        {"id": 1, "ad": "Ali", "rol": "admin"},
        {"id": 2, "ad": "Veli", "rol": "user"}
    ]
}

# Yazma
with open("kullanicilar.json", "w", encoding="utf-8") as f:
    json.dump(veri, f, ensure_ascii=False, indent=2)

# Okuma
with open("kullanicilar.json", "r", encoding="utf-8") as f:
    yuklenen = json.load(f)

# CSV işlemleri
import csv

basliklar = ["ad", "soyad", "email", "yas"]
satirlar = [
    ["Ali", "Kaya", "ali@example.com", 30],
    ["Fatma", "Demir", "fatma@example.com", 25]
]

with open("kisiler.csv", "w", newline="", encoding="utf-8") as f:
    yazar = csv.writer(f)
    yazar.writerow(basliklar)
    yazar.writerows(satirlar)

with open("kisiler.csv", "r", encoding="utf-8") as f:
    okuyucu = csv.DictReader(f)
    for satir in okuyucu:
        print(satir["ad"], satir["email"])
```

### List Comprehensions ve Generator Expressions

```python
# List comprehension
kareler = [x**2 for x in range(1, 11)]
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# Filtreli comprehension
cift_kareler = [x**2 for x in range(1, 11) if x % 2 == 0]
# [4, 16, 36, 64, 100]

# İç içe comprehension
matris = [[i * j for j in range(1, 5)] for i in range(1, 5)]

# Dict comprehension
kelime_uzunluklari = {kelime: len(kelime) for kelime in ["python", "java", "rust", "go"]}
# {'python': 6, 'java': 4, 'rust': 4, 'go': 2}

# Set comprehension
benzersiz_uzunluklar = {len(k) for k in ["ali", "veli", "ay", "is"]}
# {2, 3, 4}

# Generator expression — belleğe yüklemez, talep üzerine üretir
toplam = sum(x**2 for x in range(1, 1000001))  # bellekte tek sayı tutar
```

### Iterator ve Generator

```python
# Manuel iterator
class Sayac:
    def __init__(self, baslangic: int, bitis: int):
        self.mevcut = baslangic
        self.bitis = bitis

    def __iter__(self):
        return self

    def __next__(self):
        if self.mevcut >= self.bitis:
            raise StopIteration
        deger = self.mevcut
        self.mevcut += 1
        return deger

for n in Sayac(1, 6):
    print(n)  # 1 2 3 4 5

# Generator fonksiyonu
def fibonacci(n: int):
    """n adet Fibonacci sayısı üretir."""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for sayi in fibonacci(10):
    print(sayi, end=" ")
# 0 1 1 2 3 5 8 13 21 34

# Sonsuz generator
def sonsuz_artis(baslangic: int = 0, adim: int = 1):
    n = baslangic
    while True:
        yield n
        n += adim

# itertools ile kullan
import itertools

gen = sonsuz_artis(0, 5)
ilk_10 = list(itertools.islice(gen, 10))
# [0, 5, 10, 15, 20, 25, 30, 35, 40, 45]

# itertools kütüphanesi
import itertools

# Permütasyon ve kombinasyon
print(list(itertools.permutations([1, 2, 3], 2)))
print(list(itertools.combinations([1, 2, 3, 4], 2)))

# Gruplama
veriler = [
    ("A", 1), ("A", 2), ("B", 3), ("B", 4), ("C", 5)
]
veriler.sort(key=lambda x: x[0])
for grup, elemanlar in itertools.groupby(veriler, key=lambda x: x[0]):
    print(grup, list(elemanlar))
```

### Dekoratörler

```python
import functools
import time

# Temel dekoratör
def zamanlayici(fonksiyon):
    @functools.wraps(fonksiyon)
    def sarmalayici(*args, **kwargs):
        baslangic = time.perf_counter()
        sonuc = fonksiyon(*args, **kwargs)
        bitis = time.perf_counter()
        print(f"{fonksiyon.__name__} — {bitis - baslangic:.4f}s")
        return sonuc
    return sarmalayici

@zamanlayici
def agir_hesaplama(n: int) -> int:
    return sum(i**2 for i in range(n))

sonuc = agir_hesaplama(1000000)

# Parametre alan dekoratör
def tekrar_dene(maks_deneme: int = 3, bekleme: float = 1.0):
    def dekoratör(fonksiyon):
        @functools.wraps(fonksiyon)
        def sarmalayici(*args, **kwargs):
            hatalar = []
            for deneme in range(maks_deneme):
                try:
                    return fonksiyon(*args, **kwargs)
                except Exception as hata:
                    hatalar.append(hata)
                    if deneme < maks_deneme - 1:
                        time.sleep(bekleme)
            raise Exception(f"{maks_deneme} deneme başarısız: {hatalar[-1]}")
        return sarmalayici
    return dekoratör

@tekrar_dene(maks_deneme=3, bekleme=0.5)
def api_cagri(url: str) -> dict:
    import urllib.request
    with urllib.request.urlopen(url) as resp:
        return json.loads(resp.read())

# Önbellekleme (memoization)
@functools.lru_cache(maxsize=128)
def fib_rekürsif(n: int) -> int:
    if n < 2:
        return n
    return fib_rekürsif(n - 1) + fib_rekürsif(n - 2)

print(fib_rekürsif(50))  # Önbellek olmadan çok yavaş olurdu
print(fib_rekürsif.cache_info())  # CacheInfo(hits=48, misses=51, ...)
```

---

## Bölüm 6 — Nesne Yönelimli Programlama

### Sınıflar ve Nesneler

```python
from dataclasses import dataclass, field
from typing import ClassVar

class BankaHesabi:
    """Basit banka hesabı implementasyonu."""

    # Sınıf değişkeni — tüm örneklerde ortak
    faiz_orani: ClassVar[float] = 0.03

    def __init__(self, sahip: str, iban: str, bakiye: float = 0.0):
        self._sahip = sahip          # "korumalı" (convention)
        self.__iban = iban           # "özel" (name mangling)
        self._bakiye = bakiye
        self._islem_gecmisi: list = []

    # Property — kontrollü erişim
    @property
    def bakiye(self) -> float:
        return self._bakiye

    @property
    def sahip(self) -> str:
        return self._sahip

    # Metotlar
    def para_yatir(self, miktar: float) -> None:
        if miktar <= 0:
            raise ValueError("Yatırılacak miktar pozitif olmalı")
        self._bakiye += miktar
        self._islem_gecmisi.append(f"Yatırma: +{miktar:.2f} TL")

    def para_cek(self, miktar: float) -> None:
        if miktar <= 0:
            raise ValueError("Çekilecek miktar pozitif olmalı")
        if miktar > self._bakiye:
            raise ValueError("Yetersiz bakiye")
        self._bakiye -= miktar
        self._islem_gecmisi.append(f"Çekme: -{miktar:.2f} TL")

    def faiz_uygula(self) -> None:
        faiz = self._bakiye * self.faiz_orani
        self._bakiye += faiz
        self._islem_gecmisi.append(f"Faiz: +{faiz:.2f} TL")

    # Dunder (magic) metotlar
    def __str__(self) -> str:
        return f"BankaHesabi({self._sahip}, {self._bakiye:.2f} TL)"

    def __repr__(self) -> str:
        return f"BankaHesabi(sahip={self._sahip!r}, bakiye={self._bakiye})"

    def __len__(self) -> int:
        return len(self._islem_gecmisi)

    @classmethod
    def faiz_guncelle(cls, yeni_oran: float) -> None:
        cls.faiz_orani = yeni_oran

    @staticmethod
    def iban_dogrula(iban: str) -> bool:
        return iban.startswith("TR") and len(iban) == 26


hesap = BankaHesabi("Ahmet Yılmaz", "TR123456789012345678901234")
hesap.para_yatir(10000)
hesap.faiz_uygula()
print(hesap)               # BankaHesabi(Ahmet Yılmaz, 10300.00 TL)
print(len(hesap))          # 2
```

### Kalıtım

```python
class Hayvan:
    def __init__(self, isim: str, yas: int):
        self.isim = isim
        self.yas = yas

    def ses_cikar(self) -> str:
        raise NotImplementedError("Alt sınıf uygulamalı")

    def bilgi(self) -> str:
        return f"{self.isim} ({self.yas} yaş)"

class Kopek(Hayvan):
    def __init__(self, isim: str, yas: int, irk: str):
        super().__init__(isim, yas)    # üst sınıf __init__ çağır
        self.irk = irk

    def ses_cikar(self) -> str:
        return "Hav hav!"

    def bilgi(self) -> str:
        return f"{super().bilgi()} — {self.irk}"

class Kedi(Hayvan):
    def ses_cikar(self) -> str:
        return "Miyav!"

# Çok biçimlilik (polymorphism)
hayvanlar: list[Hayvan] = [
    Kopek("Karabaş", 3, "Kangal"),
    Kedi("Pamuk", 5),
    Kopek("Fındık", 2, "Golden Retriever")
]

for hayvan in hayvanlar:
    print(f"{hayvan.bilgi()} → {hayvan.ses_cikar()}")

# isinstance ve issubclass
print(isinstance(hayvanlar[0], Hayvan))  # True
print(isinstance(hayvanlar[0], Kopek))   # True
print(issubclass(Kopek, Hayvan))         # True
```

### Soyut Sınıflar ve Arayüzler

```python
from abc import ABC, abstractmethod
from typing import Protocol

# ABC ile soyut sınıf
class Sekil(ABC):
    @abstractmethod
    def alan(self) -> float:
        ...

    @abstractmethod
    def cevre(self) -> float:
        ...

    def tanim(self) -> str:
        return f"{type(self).__name__}: Alan={self.alan():.2f}, Çevre={self.cevre():.2f}"

class Daire(Sekil):
    def __init__(self, yaricap: float):
        self.yaricap = yaricap

    def alan(self) -> float:
        import math
        return math.pi * self.yaricap ** 2

    def cevre(self) -> float:
        import math
        return 2 * math.pi * self.yaricap

class Dikdortgen(Sekil):
    def __init__(self, genislik: float, yukseklik: float):
        self.genislik = genislik
        self.yukseklik = yukseklik

    def alan(self) -> float:
        return self.genislik * self.yukseklik

    def cevre(self) -> float:
        return 2 * (self.genislik + self.yukseklik)

sekiller = [Daire(5), Dikdortgen(4, 6)]
for sekil in sekiller:
    print(sekil.tanim())

# Protocol (structural subtyping — Python 3.8+)
class Yazilabilir(Protocol):
    def yaz(self, veri: str) -> None: ...

def kaydet(hedef: Yazilabilir, icerik: str) -> None:
    hedef.yaz(icerik)
```

---

## Bölüm 7 — Uzmanlaşma Alanları

### Veri Bilimi ve Analizi

NumPy, çok boyutlu diziler üzerinde yüksek performanslı matematiksel işlem yapma imkânı sunar. Pandas ise yapılandırılmış veri analizi için tablolar (DataFrame) üzerinde çalışır:

```python
import numpy as np
import pandas as pd

# NumPy — vektörize işlemler
dizi = np.array([1, 2, 3, 4, 5], dtype=np.float64)
print(dizi * 2)         # [2. 4. 6. 8. 10.]
print(np.sum(dizi))     # 15.0
print(np.mean(dizi))    # 3.0
print(np.std(dizi))     # 1.4142...

# Matris işlemleri
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(A @ B)            # matris çarpımı
print(np.linalg.det(A)) # determinant
print(np.linalg.inv(A)) # ters matris

# Random sayı üretimi
rng = np.random.default_rng(seed=42)
normal_dagilim = rng.normal(loc=0, scale=1, size=(1000,))
print(f"Ortalama: {normal_dagilim.mean():.4f}")
print(f"Std: {normal_dagilim.std():.4f}")

# Pandas — veri analizi
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    "yas": rng.integers(18, 65, n),
    "maas": rng.normal(15000, 5000, n).round(2),
    "departman": rng.choice(["Yazılım", "Pazarlama", "Finans", "İK"], n),
    "performans": rng.choice(["Düşük", "Orta", "Yüksek"], n, p=[0.2, 0.5, 0.3])
})

# Temel istatistikler
print(df.describe())

# Gruplama ve agregasyon
ozet = df.groupby("departman").agg(
    ortalama_maas=("maas", "mean"),
    medyan_yas=("yas", "median"),
    calisan_sayisi=("maas", "count")
).round(2)

print(ozet.sort_values("ortalama_maas", ascending=False))

# Filtreleme ve sorgu
yuksek_maasli = df.query("maas > 20000 and performans == 'Yüksek'")
print(f"Yüksek maaşlı, yüksek performanslı: {len(yuksek_maasli)}")

# pivot table
pivot = df.pivot_table(
    values="maas",
    index="departman",
    columns="performans",
    aggfunc="mean"
).round(0)

print(pivot)
```

### Web Geliştirme — FastAPI

Flask ve Django popüler çerçeveler olmakla birlikte FastAPI, modern Python tiplemesini ve otomatik API dokümantasyonunu birleştiren bir çerçeve olarak güçlü bir alternatif:

```python
# pip install fastapi uvicorn pydantic
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import uvicorn

app = FastAPI(title="Kullanıcı API", version="1.0.0")

# Pydantic model — veri doğrulama
class KullaniciOlustur(BaseModel):
    ad: str = Field(..., min_length=2, max_length=50)
    email: str = Field(..., pattern=r"^[^@]+@[^@]+\.[^@]+$")
    yas: Optional[int] = Field(None, ge=18, le=120)

class KullaniciYanit(BaseModel):
    id: int
    ad: str
    email: str

# Basit in-memory veritabanı
kullanicilar_db: dict[int, dict] = {}
sayac = 0

@app.get("/")
async def kok():
    return {"mesaj": "API çalışıyor", "versiyon": "1.0.0"}

@app.post("/kullanicilar", response_model=KullaniciYanit, status_code=201)
async def kullanici_olustur(kullanici: KullaniciOlustur):
    global sayac
    sayac += 1
    yeni = {"id": sayac, **kullanici.model_dump()}
    kullanicilar_db[sayac] = yeni
    return yeni

@app.get("/kullanicilar/{kullanici_id}", response_model=KullaniciYanit)
async def kullanici_getir(kullanici_id: int):
    if kullanici_id not in kullanicilar_db:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return kullanicilar_db[kullanici_id]

@app.get("/kullanicilar", response_model=list[KullaniciYanit])
async def kullanici_listele(atla: int = 0, limit: int = 10):
    liste = list(kullanicilar_db.values())
    return liste[atla: atla + limit]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
```

### Makine Öğrenmesi — Scikit-learn

```python
# pip install scikit-learn pandas numpy matplotlib
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
import pandas as pd

# Örnek veri seti oluştur
rng = np.random.default_rng(42)
n = 500

X = pd.DataFrame({
    "yas": rng.integers(18, 65, n),
    "maas": rng.normal(15000, 5000, n),
    "deneyim": rng.integers(0, 30, n),
    "egitim": rng.integers(1, 5, n)
})
y = (X["maas"] > 18000).astype(int)  # yüksek maaş sınıfı

# Eğitim/test bölümü
X_egitim, X_test, y_egitim, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Pipeline — ön işleme + model
boru_hatti = Pipeline([
    ("olcekleme", StandardScaler()),
    ("siniflandirici", RandomForestClassifier(n_estimators=100, random_state=42))
])

boru_hatti.fit(X_egitim, y_egitim)

# Değerlendirme
y_tahmin = boru_hatti.predict(X_test)
print(classification_report(y_test, y_tahmin, target_names=["Düşük", "Yüksek"]))

# Çapraz doğrulama
cv_skorlari = cross_val_score(boru_hatti, X, y, cv=5, scoring="f1")
print(f"CV F1 skoru: {cv_skorlari.mean():.3f} ± {cv_skorlari.std():.3f}")

# Hiperparametre optimizasyonu
param_izgarasi = {
    "siniflandirici__n_estimators": [50, 100, 200],
    "siniflandirici__max_depth": [None, 5, 10],
    "siniflandirici__min_samples_split": [2, 5]
}

izgara_arama = GridSearchCV(
    boru_hatti, param_izgarasi, cv=3, scoring="f1", n_jobs=-1
)
izgara_arama.fit(X_egitim, y_egitim)
print("En iyi parametreler:", izgara_arama.best_params_)
```

### Otomasyon ve Web Scraping

```python
# pip install requests beautifulsoup4 lxml
import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin, urlparse

class WebKaziyici:
    def __init__(self, temel_url: str, bekleme: float = 1.0):
        self.temel_url = temel_url
        self.bekleme = bekleme
        self.oturum = requests.Session()
        self.oturum.headers.update({
            "User-Agent": "Mozilla/5.0 (Educational Scraper)"
        })

    def sayfa_al(self, url: str) -> BeautifulSoup | None:
        try:
            yanit = self.oturum.get(url, timeout=10)
            yanit.raise_for_status()
            return BeautifulSoup(yanit.text, "lxml")
        except requests.RequestException as hata:
            print(f"Hata [{url}]: {hata}")
            return None

    def basliklar_al(self, url: str) -> list[dict]:
        soup = self.sayfa_al(url)
        if not soup:
            return []

        sonuclar = []
        for h in soup.find_all(["h1", "h2", "h3"]):
            sonuclar.append({
                "etiket": h.name,
                "metin": h.get_text(strip=True)
            })
        time.sleep(self.bekleme)  # sunucuya saygı
        return sonuclar

# Selenium ile dinamik içerik
# pip install selenium webdriver-manager
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def dinamik_icerik_al(url: str) -> str:
    secenekler = webdriver.ChromeOptions()
    secenekler.add_argument("--headless")
    secenekler.add_argument("--no-sandbox")

    surucu = webdriver.Chrome(options=secenekler)
    try:
        surucu.get(url)
        bekle = WebDriverWait(surucu, 10)
        # Belirli bir elementin yüklenmesini bekle
        element = bekle.until(
            EC.presence_of_element_located((By.ID, "icerik"))
        )
        return element.text
    finally:
        surucu.quit()
```

### Asenkron Programlama

```python
import asyncio
import aiohttp
import aiofiles
from typing import AsyncGenerator

async def url_indir(oturum: aiohttp.ClientSession, url: str) -> dict:
    try:
        async with oturum.get(url, timeout=aiohttp.ClientTimeout(total=10)) as yanit:
            icerik = await yanit.text()
            return {"url": url, "durum": yanit.status, "boyut": len(icerik)}
    except Exception as hata:
        return {"url": url, "hata": str(hata)}

async def coklu_indir(url_listesi: list[str]) -> list[dict]:
    async with aiohttp.ClientSession() as oturum:
        gorevler = [url_indir(oturum, url) for url in url_listesi]
        sonuclar = await asyncio.gather(*gorevler, return_exceptions=True)
        return [s for s in sonuclar if isinstance(s, dict)]

# Async generator
async def veri_akisi(n: int) -> AsyncGenerator[int, None]:
    for i in range(n):
        await asyncio.sleep(0.1)  # I/O simülasyonu
        yield i * 2

async def main():
    # Async generator tüket
    async for deger in veri_akisi(5):
        print(deger)

    # Async context manager
    async with aiofiles.open("async_log.txt", "w") as f:
        await f.write("Async yazma başarılı\n")

asyncio.run(main())
```

---

## Bölüm 8 — Üretim Ortamı ve İyi Pratikler

### Tip Sistemi ve Statik Analiz

Python'un tip ipuçları sistemi, büyük kod tabanlarında hata yakalamayı kolaylaştırır. `mypy` ile statik analiz yapılabilir:

```python
from typing import TypeVar, Generic, Callable, Any
from collections.abc import Sequence

T = TypeVar("T")
U = TypeVar("U")

# Generic sınıf
class Yigin(Generic[T]):
    def __init__(self) -> None:
        self._veriler: list[T] = []

    def it(self, deger: T) -> None:
        self._veriler.append(deger)

    def al(self) -> T:
        if not self._veriler:
            raise IndexError("Yığın boş")
        return self._veriler.pop()

    def __len__(self) -> int:
        return len(self._veriler)

    def __bool__(self) -> bool:
        return bool(self._veriler)

# Callable tipi
def uygula(fonksiyon: Callable[[T], U], dizi: Sequence[T]) -> list[U]:
    return [fonksiyon(eleman) for eleman in dizi]

# TypedDict
from typing import TypedDict

class KullaniciDict(TypedDict):
    id: int
    ad: str
    email: str
    aktif: bool
```

```bash
# mypy kurulumu ve kullanım
pip install mypy
mypy --strict main.py

# ruff — hızlı linter ve formatter (Rust ile yazılmış)
pip install ruff
ruff check .
ruff format .
```

### Test Yazımı

```python
# pytest ile test
# pip install pytest pytest-cov

import pytest
from unittest.mock import patch, MagicMock

class TestBankaHesabi:
    def test_para_yatirma(self):
        hesap = BankaHesabi("Test", "TR12345678901234567890123456")
        hesap.para_yatir(1000)
        assert hesap.bakiye == 1000.0

    def test_negatif_para_yatirma_hata_verir(self):
        hesap = BankaHesabi("Test", "TR12345678901234567890123456")
        with pytest.raises(ValueError, match="pozitif"):
            hesap.para_yatir(-100)

    def test_yetersiz_bakiye_hatasi(self):
        hesap = BankaHesabi("Test", "TR12345678901234567890123456", 500)
        with pytest.raises(ValueError, match="Yetersiz"):
            hesap.para_cek(1000)

    @pytest.mark.parametrize("miktar,beklenen", [
        (100, 100.0),
        (0.01, 0.01),
        (1_000_000, 1_000_000.0)
    ])
    def test_cesitli_miktarlar(self, miktar: float, beklenen: float):
        hesap = BankaHesabi("Test", "TR12345678901234567890123456")
        hesap.para_yatir(miktar)
        assert abs(hesap.bakiye - beklenen) < 1e-9

# Mock ile dış bağımlılık yönetimi
def test_api_cagri_basarisiz_olunca_yeniden_dener():
    with patch("requests.get") as mock_get:
        mock_get.side_effect = [
            ConnectionError("Bağlantı hatası"),
            ConnectionError("Bağlantı hatası"),
            MagicMock(status_code=200, json=lambda: {"veri": "ok"})
        ]
        # 3. denemede başarılı olması beklenir
        # ...test kodu...
```

```bash
# Test çalıştırma
pytest -v
pytest --cov=. --cov-report=html  # kapsama raporu
```

### Loglama

```python
import logging
import logging.handlers
from pathlib import Path

def logger_kur(isim: str, seviye: int = logging.INFO) -> logging.Logger:
    logger = logging.getLogger(isim)
    logger.setLevel(seviye)

    # Konsol handler
    konsol = logging.StreamHandler()
    konsol.setLevel(logging.WARNING)

    # Dosya handler (dönen dosyalar)
    log_dosyasi = Path("logs") / f"{isim}.log"
    log_dosyasi.parent.mkdir(exist_ok=True)
    dosya = logging.handlers.RotatingFileHandler(
        log_dosyasi, maxBytes=10_000_000, backupCount=5, encoding="utf-8"
    )
    dosya.setLevel(logging.DEBUG)

    # Format
    format_str = "%(asctime)s | %(name)s | %(levelname)s | %(funcName)s:%(lineno)d | %(message)s"
    formatter = logging.Formatter(format_str, datefmt="%Y-%m-%d %H:%M:%S")
    konsol.setFormatter(formatter)
    dosya.setFormatter(formatter)

    logger.addHandler(konsol)
    logger.addHandler(dosya)
    return logger

logger = logger_kur("uygulama")
logger.debug("Hata ayıklama mesajı")
logger.info("Bilgi mesajı")
logger.warning("Uyarı mesajı")
logger.error("Hata mesajı")
logger.critical("Kritik hata")
```

---

## Notlar ve Ek Kaynaklar

> **Not 1:** Python sürümü seçerken daima en güncel kararlı sürümü tercih edin. Python 2, 2020'de resmi destek sonunu tamamladı ve aktif kullanımdan kaldırılmalıdır.

> **Not 2:** `pip install` ile kurulan paketleri her zaman sanal ortam içinde kullanın. Sistem Python'una doğrudan paket kurmak, bağımlılık çakışmalarına yol açar.

> **Not 3:** Üretim kodunda `print()` yerine `logging` modülünü kullanın. Log seviyeleri (DEBUG, INFO, WARNING, ERROR, CRITICAL) ve dönen dosya handler'ları büyük uygulamalarda izlenebilirliği artırır.

> **Not 4:** Tip ipuçları zorunlu değil ama ekip çalışmasında ve büyük kod tabanlarında son derece değerlidir. `mypy --strict` ile statik analiz, çalışma zamanı hatalarının önemli bir bölümünü önceden yakalar.

> **Not 5:** Generator'lar ve lazy evaluation, büyük veri setleriyle çalışırken bellek tüketimini dramatik biçimde düşürür. Milyonlarca satırlık CSV dosyasını satır satır işlemek, tüm dosyayı belleğe yüklemekten çok daha verimlidir.

### Faydalı Kütüphaneler ve Araçlar

**Temel Geliştirme Araçları:**
- `ruff` — Hızlı Python linter ve formatter
- `mypy` — Statik tip denetleyicisi
- `pytest` — Test çerçevesi
- `poetry` veya `uv` — Bağımlılık yönetimi
- `pre-commit` — Commit öncesi otomatik kontroller

**Veri Bilimi:**
- `numpy` — Sayısal hesaplama
- `pandas` — Veri analizi ve manipülasyon
- `matplotlib` / `seaborn` / `plotly` — Görselleştirme
- `scipy` — Bilimsel hesaplama

**Web Geliştirme:**
- `fastapi` — Modern asenkron API çerçevesi
- `django` — Tam kapsamlı web çerçevesi
- `flask` — Hafif mikro çerçeve
- `sqlalchemy` — ORM ve veritabanı araçları
- `alembic` — Veritabanı migrasyon aracı

**Makine Öğrenmesi:**
- `scikit-learn` — Klasik ML algoritmaları
- `xgboost` / `lightgbm` — Gradient boosting
- `tensorflow` / `pytorch` — Derin öğrenme
- `huggingface transformers` — NLP modelleri

**Otomasyon:**
- `selenium` / `playwright` — Tarayıcı otomasyonu
- `beautifulsoup4` / `scrapy` — Web scraping
- `celery` — Dağıtık görev kuyruğu
- `apscheduler` — Zamanlayıcı

**Resmi Kaynaklar:**
- docs.python.org — Resmi Python belgeleri
- pypi.org — Paket indeksi
- peps.python.org — Python Enhancement Proposals
- realpython.com — Uygulamalı öğretici içerikler

