---
title: "OOP Temelleri: Kapsülleme, Kalıtım, Çok Biçimlilik ve Soyutlama"
date: 2026-04-06
type: "software"
draft: false
math: true
description: "Modern yazılım mimarisinin kalbinde yer alan Nesne Yönelimli Programlama (OOP), sürdürülebilir, ölçeklenebilir ve esnek sistemler inşa etmenin en güçlü yoludur. Bu yazıda, OOP paradigmalarının dört temel direği olan Soyutlama (Abstraction), Kapsülleme (Encapsulation), Kalıtım (Inheritance) ve Çok Biçimlilik (Polymorphism) kavramlarını teorik bir anlatımın ötesine taşınmaktadır."
featured_image: "/images/software/oop-encapsulation-inheritance-polymorphism-ve-abstraction.png"
tags: ["yazilim", "software", "oop", "encapsulation", "inheritance", "polymorphism", "abstraction"]
---

Nesne Yönelimli Programlama (Object-Oriented Programming - OOP), karmaşık yazılım sistemlerini yönetilebilir, sürdürülebilir ve genişletilebilir parçalara ayırmak için kullanılan en temel paradigmadır. Modern sistem tasarımında bu dört temel ilke—Encapsulation, Inheritance, Polymorphism ve Abstraction—yazılımın iskeletini oluşturur.

{{< figure src="/images/software/oop-encapsulation-inheritance-polymorphism-ve-abstraction.png" alt="OOP Temelleri: Kapsülleme, Kalıtım, Çok Biçimlilik ve Soyutlama" width="1200" caption="Şekil 1: OOP Temelleri: Kapsülleme, Kalıtım, Çok Biçimlilik ve Soyutlama." >}}

---

## 1. Abstraction (Soyutlama): Sistemin Karmaşıklığını Gizlemek

Abstraction, bir nesnenin sadece dış dünyaya sunduğu fonksiyonelliğe odaklanmak, nesnenin bu işi "nasıl" yaptığına dair içsel detayları gizlemektir. Sistem tasarımında soyutlama, bağımlılıkları (coupling) azaltmak için en kritik araçtır.

### Teknik Detay ve Mimari Rolü
Soyutlama genellikle **Abstract Class** (Soyut Sınıf) ve **Interface** (Arayüz) yapıları üzerinden gerçekleştirilir. Soyutlama sayesinde, üst seviye modüller (High-level modules), alt seviye detayların (Low-level details) nasıl çalıştığını bilmek zorunda kalmaz. Bu, yazılımın bir parçasını değiştirirken sistemin geri kalanının etkilenmesini önler.

*   **Interface:** Bir nesnenin "ne yapabileceğini" tanımlayan bir sözleşmedir (contract).
*   **Abstract Class:** Hem tamamlanmamış (abstract) metodları hem de ortak davranışları içeren bir şablondur.

### Kod Uygulaması: Python ve Abstract Base Classes (ABC)
```python
from abc import ABC, abstractmethod

class Database(ABC):
    """Veritabanı işlemleri için bir soyutlama katmanı."""
    
    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def execute_query(self, query: str):
        pass

class PostgreSQL(Database):
    def connect(self):
        return "PostgreSQL veritabanına bağlanıldı."

    def execute_query(self, query: str):
        return f"PostgreSQL üzerinde '{query}' çalıştırıldı."

class MongoDB(Database):
    def connect(self):
        return "MongoDB (NoSQL) kümesine bağlanıldı."

    def execute_query(self, query: str):
        return f"BSON formatında '{query}' sorgusu işlendi."
```

**Not:** Soyutlama, kullanıcıya sadece gerekli olan arayüzü sunarak "bilişsel yükü" azaltır. Bir otomobil sürücüsünün motorun içindeki piston hareketlerini bilmeden sadece direksiyon ve pedalları kullanması en temel soyutlama örneğidir.

---

## 2. Encapsulation (Kapsülleme): Veri Güvenliği ve Durum Yönetimi

Encapsulation, verilerin (attributes) ve bu veriler üzerinde işlem yapan metodların tek bir birim (class) içinde toplanmasıdır. Buradaki temel amaç, nesnenin iç durumuna (state) dışarıdan kontrolsüz erişimi engellemek ve verinin tutarlılığını sağlamaktır.

### Teknik Mekanizmalar: Access Modifiers
Kapsülleme, erişim belirleyiciler aracılığıyla yönetilir:
*   **Public:** Her yerden erişilebilir.
*   **Private:** Sadece tanımlandığı sınıf içinden erişilebilir.
*   **Protected:** Sınıf içinden ve türetilmiş sınıflardan erişilebilir.

### Mimari Faydaları
Encapsulation, **Data Hiding** (Veri Gizleme) prensibini uygular. Bu, nesnenin iç mantığının (business logic) dış müdahalelerden korunmasını sağlar. Örneğin, bir banka hesabı sınıfında bakiyenin (`balance`) doğrudan değiştirilmesini engelleyip, bunun yerine `deposit()` veya `withdraw()` metodlarını zorunlu kılmak, sistemin güvenliğini artırır.

### C++ Örneği: Access Modifiers ve Get/Set Mantığı
```cpp
#include <iostream>
#include <string>

class BankAccount {
private:
    double balance; // Dışarıdan erişilemez

public:
    BankAccount(double initialBalance) {
        if (initialBalance >= 0) balance = initialBalance;
        else balance = 0;
    }

    // Getter Metodu
    double getBalance() const {
        return balance;
    }

    // İş Mantığı İçeren Metod
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
};
```

---

## 3. Inheritance (Kalıtım): Yeniden Kullanılabilirlik ve Hiyerarşi

Inheritance, bir sınıfın (child/subclass) başka bir sınıftan (parent/superclass) özelliklerini ve metodlarını miras almasıdır. Yazılımda kod tekrarını önlemek ve mantıksal bir hiyerarşi kurmak için kullanılır.

### "Is-A" İlişkisi ve Tasarım Stratejileri
Kalıtım, sınıflar arasında "bir ... dır" (is-a) ilişkisi kurar. Örneğin, "Kamyon bir Araçtır". Ancak kontrolsüz kalıtım kullanımı, sınıflar arasında sıkı sıkıya bağlılığa (tight coupling) neden olabilir. Bu noktada modern yazılım dünyasında **"Composition over Inheritance"** (Kalıtım yerine Kompozisyon) prensibi sıklıkla tartışılır.

### Kod Uygulaması: Java’da Hiyerarşik Yapı
```java
class Employee {
    protected String name;
    protected double salary;

    public void displayInfo() {
        System.out.println("İsim: " + name + " Maaş: " + salary);
    }
}

class SoftwareDeveloper extends Employee {
    private String techStack;

    public SoftwareDeveloper(String name, double salary, String techStack) {
        this.name = name;
        this.salary = salary;
        this.techStack = techStack;
    }

    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Teknoloji: " + techStack);
    }
}
```

**Kritik Not:** Elmas problemi (Diamond Problem) gibi çoklu kalıtım karmaşalarından kaçınmak için Java ve C# gibi diller çoklu kalıtımı arayüzler (Interfaces) üzerinden yönetir.

---

## 4. Polymorphism (Çok Biçimlilik): Esneklik ve Dinamik Davranış

Polymorphism, aynı isimdeki bir metodun farklı sınıflar tarafından farklı şekillerde uygulanabilmesidir. Bu, sistemin tip bağımsız çalışmasına olanak tanır ve yeni özelliklerin sisteme eklenmesini inanılmaz derecede kolaylaştırır.

### Statik vs. Dinamik Polymorphism
1.  **Static Polymorphism (Compile-time):** Method Overloading (Aynı isimli metodun farklı parametrelerle tanımlanması).
2.  **Dynamic Polymorphism (Runtime):** Method Overriding (Kalıtım alınan metodun alt sınıfta yeniden yazılması).

### Tasarım Desenlerindeki Yeri
Strateji (Strategy) ve Fabrika (Factory) gibi tasarım desenleri tamamen çok biçimlilik üzerine kuruludur. Bir liste içerisindeki farklı nesne türlerinin aynı döngü içinde `render()` edilmesi, polymorphism'in en güçlü kullanım alanıdır.

### Kod Uygulaması: C# Polymorphism ve Virtual Metodlar
```csharp
public class Logger {
    public virtual void Log(string message) {
        Console.WriteLine("Standart Log: " + message);
    }
}

public class JsonLogger : Logger {
    public override void Log(string message) {
        Console.WriteLine("{ 'log': '" + message + "' }");
    }
}

public class CloudLogger : Logger {
    public override void Log(string message) {
        // Bulut API'sine gönderim simülasyonu
        Console.WriteLine("Cloud Storage Log: " + message);
    }
}
```

---

## Sistem Tasarımında OOP Entegrasyonu ve Kütüphane Yaklaşımları

Modern yazılım geliştirme süreçlerinde OOP, sadece dilin bir özelliği değil, kütüphane ve framework yapılarının kalbidir.

### 1. Tasarım Kalıpları (Design Patterns)
OOP ilkeleri, **SOLID** prensipleriyle birleştiğinde ortaya endüstri standardı çözümler çıkar:
*   **S**ingle Responsibility (Tek Sorumluluk)
*   **O**pen/Closed (Gelişime Açık, Değişime Kapalı)
*   **L**iskov Substitution (Liskov’un Yerine Geçme)
*   **I**nterface Segregation (Arayüz Ayrımı)
*   **D**ependency Inversion (Bağımlılığın Ters Çevrilmesi)

### 2. Framework ve Kütüphanelerden Örnekler
*   **Django (Python):** `models.Model` sınıfından kalıtım alarak veritabanı şemaları oluşturulur (Inheritance & Abstraction).
*   **React (JavaScript/TypeScript):** Component tabanlı mimari, kapsülleme ve props/state yönetimi ile OOP benzeri bir yapı sunar.
*   **Spring Boot (Java):** Dependency Injection (Bağımlılık Enjeksiyonu) mekanizması ile Abstraction ve Polymorphism'i en uç noktada kullanır.

---

## Derinlemesine Teknik Karşılaştırma Tablosu

| Kavram | Temel Amaç | Teknik Araç | Mimari Etki |
| :--- | :--- | :--- | :--- |
| **Abstraction** | Karmaşıklığı azaltmak | Interface, Abstract Class | Bağımlılıkları minimize eder. |
| **Encapsulation** | Veriyi korumak | Access Modifiers (Private, etc.) | Veri bütünlüğünü sağlar. |
| **Inheritance** | Kod tekrarını önlemek | Extends, Implements | Hiyerarşik yapı kurar. |
| **Polymorphism** | Esneklik sağlamak | Override, Virtual Methods | Sistemin genişletilebilirliğini artırır. |

---

## Sonuç ve İleri Düzey Notlar

OOP'nin dört atlısı, modern sistem tasarımında birbirinden bağımsız çalışan mekanizmalar değil, birbiriyle sürekli etkileşim halinde olan bir ekosistemdir. İyi bir yazılım mimarı;
1.  **Abstraction** ile sistemi planlar,
2.  **Encapsulation** ile sınırları çizer,
3.  **Inheritance** ile ortak paydaları bulur,
4.  **Polymorphism** ile sisteme dinamizm katar.

Ancak unutulmamalıdır ki; aşırı soyutlama (over-engineering) sistemi karmaşıklaştırabilir, gereksiz kalıtım derinliği ise "fragile base class" (kırılgan temel sınıf) problemine yol açabilir. Her bir ilke, projenin ihtiyacına göre dengeli bir şekilde uygulanmalıdır.



**Teknik Not:** Bellek yönetimi (Memory Management) açısından bakıldığında, Polymorphism ve Inheritance kullanımı "Virtual Table" (VTable) gibi çalışma zamanı maliyetleri getirebilir. Performans kritik sistemlerde (Gömülü sistemler veya oyun motorları gibi) bu maliyetler göz önünde bulundurularak tasarım yapılmalıdır.