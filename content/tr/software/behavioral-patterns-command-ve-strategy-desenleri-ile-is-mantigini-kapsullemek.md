---
title: "Behavioral Patterns: Command ve Strategy Desenleri ile İş Mantığını Kapsüllemek"
date: 2026-03-03
type: "software"
draft: false
math: true
description: "Yazılım mimarisinde iş mantığını esnek ve sürdürülebilir kılmak amacıyla, isteklerin nesneleştirilmesini sağlayan Command deseni ile algoritmaların dinamik değişimine odaklanan Strategy deseninin teknik uygulama ve kapsülleme prensiplerini inceleyen bir yazıdır."
featured_image: "/images/software/behavioral-patterns-command-ve-strategy-desenleri-ile-is-mantigini-kapsullemek.png"
tags: ["yazilim", "software", "yazilim-performansi", "tasarim-desenleri", "command-pattern", "strategy-pattern", "clean-code", "kod-kapsulleme"]
---

Yazılım mimarisinde sürdürülebilirlik ve esneklik, iş mantığının (business logic) nasıl organize edildiğiyle doğrudan ilintilidir. Karmaşık sistemlerde karar mekanizmaları ile icra mekanizmalarını birbirinden ayırmak, kodun zamanla "spagetti" yapıya dönüşmesini engeller. Bu bağlamda, Gang of Four (GoF) tarafından tanımlanan **Command** ve **Strategy** desenleri, davranışsal kalıplar (behavioral patterns) arasında iş mantığını kapsüllemek (encapsulation) için en güçlü araçlardır.

{{< figure src="/images/software/behavioral-patterns-command-ve-strategy-desenleri-ile-is-mantigini-kapsullemek.png" alt="Behavioral Patterns: Command ve Strategy Desenleri ile İş Mantığını Kapsüllemek" width="1200" caption="Şekil 1: Behavioral Patterns: Command ve Strategy Desenleri ile İş Mantığını Kapsüllemek." >}}

---

## 1. Davranışsal Desenlerin Mimari Rolü

Nesne yönelimli programlamada (OOP), nesneler arası iletişim ve sorumluluk dağılımı kritik öneme sahiptir. Davranışsal desenler, nesnelerin birbirleriyle nasıl etkileşime girdiğini ve sorumlulukların nasıl paylaştırıldığını standardize eder. İş mantığını kapsüllemek, bir algoritmanın veya bir isteğin, onu çağıran yapıdan bağımsız hale getirilmesidir.

---

## 2. Command Deseni: İsteklerin Nesneleştirilmesi

Command deseni, bir isteği (request) kendi başına bir nesne haline getirir. Bu dönüşüm; parametrelerin saklanmasını, işlemlerin kuyruğa alınmasını (queuing), günlüklenmesini (logging) ve geri alınabilmesini (undo/redo) sağlar.

### 2.1. Bileşenler
*   **Command (Arayüz):** İşlemi tetikleyecek `execute()` metodunu tanımlar.
*   **ConcreteCommand:** Alıcı (Receiver) nesne ile eylem arasındaki bağı kurar.
*   **Receiver:** Gerçek iş mantığının bulunduğu nesnedir.
*   **Invoker:** Komutu ne zaman çalıştıracağını bilen tetikleyici yapıdır.

### 2.2. Teknik Uygulama (C# Örneği)

```csharp
// Receiver: Gerçek operasyonu yürüten sınıf
public class TextEditor {
    public void InsertText(string text) => Console.WriteLine($"Metin eklendi: {text}");
    public void DeleteText() => Console.WriteLine("Son karakter silindi.");
}

// Command Arayüzü
public interface ICommand {
    void Execute();
    void Undo();
}

// ConcreteCommand
public class InsertCommand : ICommand {
    private readonly TextEditor _editor;
    private readonly string _text;

    public InsertCommand(TextEditor editor, string text) {
        _editor = editor;
        _text = text;
    }

    public void Execute() => _editor.InsertText(_text);
    public void Undo() => _editor.DeleteText();
}

// Invoker: Komut geçmişini tutabilir
public class CommandManager {
    private readonly Stack<ICommand> _history = new Stack<ICommand>();

    public void Invoke(ICommand command) {
        command.Execute();
        _history.Push(command);
    }

    public void Undo() {
        if (_history.Count > 0) _history.Pop().Undo();
    }
}
```



**Not:** Command deseni, GUI butonlarından transaction yönetimine kadar geniş bir yelpazede kullanılır. Özellikle mikroservis mimarilerinde "Saga Pattern" uygulamalarında komutların takibi için temel teşkil eder.

---

## 3. Strategy Deseni: Algoritmaların Dinamik Değişimi

Strategy deseni, belirli bir işi yapan algoritma ailesini tanımlar, her birini kapsüller ve bunları birbirinin yerine kullanılabilir hale getirir. Bu desen, istemcinin (client) çalışma zamanında (runtime) hangi stratejiyi kullanacağını seçmesine olanak tanır.

### 3.1. Ne Zaman Kullanılmalı?
*   Bir sınıfın içinde çok sayıda `if-else` veya `switch-case` bloğu algoritma seçimi yapıyorsa.
*   Aynı işin farklı varyasyonları (örneğin farklı ödeme yöntemleri, farklı sıkıştırma formatları) mevcutsa.

### 3.2. Teknik Uygulama (Java Örneği)

```java
// Strategy Arayüzü
interface PaymentStrategy {
    void pay(int amount);
}

// Concrete Strategy A: Kredi Kartı
class CreditCardPayment implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println(amount + " TL kredi kartı ile ödendi.");
    }
}

// Concrete Strategy B: Bitcoin
class CryptoPayment implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println(amount + " TL kripto varlık ile ödendi.");
    }
}

// Context: Stratejiyi kullanan yapı
class ShoppingCart {
    private PaymentStrategy strategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void checkout(int amount) {
        strategy.pay(amount);
    }
}
```



---

## 4. Command ve Strategy Arasındaki Nüanslar

Her iki desen de kapsülleme ilkesini kullansa da, kullanım amaçları yapısal olarak farklılık gösterir:

| Özellik | Command Deseni | Strategy Deseni |
| :--- | :--- | :--- |
| **Temel Amaç** | Bir isteği/eylemi nesneye dönüştürmek. | Bir algoritmanın nasıl yapılacağını değiştirmek. |
| **Odak Noktası** | "Ne" yapılacağı (What). | "Nasıl" yapılacağı (How). |
| **Zamanlama** | İşlemlerin kuyruğa alınması veya geciktirilmesi mümkündür. | Genellikle o anki işlem için en uygun yöntem seçilir. |
| **İlişki** | Invoker ve Receiver arasında de-coupling sağlar. | Context ve Algoritma arasında polimorfik bağ kurur. |

---

## 5. İleri Seviye Teknikler ve Kütüphane Entegrasyonları

### 5.1. MediatR ve Command Deseni (.NET)
Modern .NET uygulamalarında Command deseni genellikle **MediatR** kütüphanesi ile uygulanır. Bu yapı, In-Process Messaging sağlayarak Controller sınıflarının iş mantığından tamamen arınmasını sağlar (CQRS - Command Query Responsibility Segregation).

```csharp
public record CreateUserCommand(string Name) : IRequest<int>;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, int> {
    public async Task<int> Handle(CreateUserCommand request, CancellationToken ct) {
        // DB işlemleri burada kapsüllenir
        return await Task.FromResult(1); 
    }
}
```

### 5.2. Functional Strategy Pattern (Modern Java/C#)
Lambda ifadelerinin gelişiyle, basit stratejiler için ayrı sınıflar oluşturmak yerine fonksiyonel arayüzler kullanılmaktadır. Bu, kod kalabalığını azaltır (Boilerplate code reduction).

---

## 6. İş Mantığını Kapsüllemenin Avantajları

1.  **Open/Closed Principle (OCP):** Sisteme yeni bir komut veya strateji eklerken mevcut kodu değiştirmeye gerek kalmaz. Sadece yeni bir sınıf eklemek yeterlidir.
2.  **Single Responsibility Principle (SRP):** Her sınıf sadece kendi işini yapar. `Invoker` tetiklemeyi, `Command` yönlendirmeyi, `Receiver` ise icrayı üstlenir.
3.  **Test Edilebilirlik:** İş mantığı küçük parçalara bölündüğü için Unit Test yazımı kolaylaşır. Mock nesnelerle bağımlılıklar kolayca simüle edilebilir.

---

## 7. Uygulama Notları ve Best Practices

*   **State Management:** Command nesneleri, işlemi geri almak için gereken durum bilgisini (state) kendi içlerinde saklamalıdır. Ancak bellek sızıntılarını önlemek için bu geçmişin (history) boyutu sınırlandırılmalıdır.
*   **Generic Interfaces:** Strategy deseninde arayüzlerin jenerik yapıda tasarlanması, farklı veri tipleriyle çalışan algoritmaların tek bir kalıptan türetilmesini sağlar.
*   **Dependency Injection:** Her iki desen de DI (Bağımlılık Enjeksiyonu) konteynerleri ile mükemmel uyum sağlar. Çalışma zamanında strateji değişikliği için `Factory` desenleri ile kombine edilebilirler.

## Sonuç

Command ve Strategy desenleri, yazılımın evrimleşme sürecinde karşılaşılan katılık (rigidity) ve kırılganlık (fragility) sorunlarına karşı en etkili çözümlerdir. Command, eylemleri birer veri paketine dönüştürerek sistem içinde serbestçe dolaşmalarını sağlarken; Strategy, algoritmik değişkenliği kontrol altına alarak kodun if-else yığınları arasında boğulmasını önler. Bu iki desenin doğru kombinasyonu, teknik borcu (technical debt) minimize eden, yüksek kaliteli ve sürdürülebilir bir mimarinin kapılarını açar.