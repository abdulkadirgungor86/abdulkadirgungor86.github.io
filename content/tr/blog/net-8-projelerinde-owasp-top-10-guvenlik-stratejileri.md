---
title: ".NET 8 Projelerinde OWASP Top 10 Güvenlik Stratejileri"
date: 2026-05-17
type: "blog"
draft: false
math: true
description: ".NET 8 projelerinde güvenli kodlama için kritik bir rehber! OWASP Top 10 tehditlerine karşı EF Core, Data Protection API ve politika tabanlı yetkilendirme gibi araçları kullanarak uygulamanızı nasıl koruyacağınızı teknik örneklerle keşfedin. Güvenli yazılım mimarisi için temel stratejileri öğrenin."
featured_image: "/images/blog/net-8-projelerinde-owasp-top-10-guvenlik-stratejileri.png"
tags: ["blog", "siber-guvenlik", "cyber-security", "dotnet", "owasp", "ag-guvenligi", "network-security", "bilgi-guvenligi", "bulut-guvenligi"]
---

Modern yazılım geliştirme süreçlerinde güvenlik, artık projenin sonunda eklenen bir katman değil, geliştirme yaşam döngüsünün (SDLC) en başından itibaren içselleştirilmesi gereken temel bir mimari bileşendir. .NET 8, yüksek performansı ve modern altyapısı ile güvenli uygulamalar geliştirmek için güçlü araçlar sunar. Ancak, platformun sağladığı bu imkanları doğru yapılandırmak, geliştiricinin sorumluluğundadır. Bu makalede, OWASP Top 10 tehdit vektörlerini .NET 8 ekosisteminde nasıl bertaraf edebileceğimizi teknik detayları ve kod örnekleriyle incelenmiştir.

{{< figure src="/images/blog/net-8-projelerinde-owasp-top-10-guvenlik-stratejileri.png" alt=".NET 8 Projelerinde OWASP Top 10 Güvenlik Stratejileri" width="1200" caption="Şekil 1: .NET 8 Projelerinde OWASP Top 10 Güvenlik Stratejileri." >}}

---

## 1. Injection (Enjeksiyon) Saldırılarına Karşı Savunma

Enjeksiyon saldırıları, özellikle SQL Injection, uygulamaların veritabanı katmanındaki zafiyetlerini hedef alır. Entity Framework Core (EF Core), parametreli sorguları varsayılan olarak kullandığı için bu tür saldırılara karşı yerleşik bir koruma sağlar.

### Teknik Uygulama

Ham SQL sorguları yazarken asla string birleştirme yöntemini kullanmamalısınız. Aşağıdaki hatalı ve doğru kullanım farkını inceleyelim:

**Hatalı (Güvensiz):**

```csharp
// ASLA YAPMAYIN: SQL Injection zafiyetine yol açar
var query = "SELECT * FROM Users WHERE Username = '" + userInput + "'";
var result = await context.Users.FromSqlRaw(query).ToListAsync();

```

**Doğru (Güvenli):**

```csharp
// Parametreli sorgu kullanımı: EF Core veriyi güvenli bir şekilde işler
var result = await context.Users
    .FromSqlRaw("SELECT * FROM Users WHERE Username = {0}", userInput)
    .ToListAsync();

```

---

## 2. Kırık Erişim Denetimi (Broken Access Control)

Kullanıcıların yetkileri dışındaki verilere veya işlevlere erişmesi, yetkilendirme (Authorization) mantığındaki boşluklardan kaynaklanır. .NET 8'de `Policy-Based Authorization` kullanmak, esnek ve güvenli bir model oluşturmanızı sağlar.

### Politika Bazlı Yetkilendirme

Controller veya Action seviyesinde `[Authorize]` özniteliğini kullanırken mutlaka politika tanımlayın:

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
});

// Controller kullanımı
[Authorize(Policy = "RequireAdminRole")]
public class AdministrationController : ControllerBase { ... }

```

---

## 3. Kriptografik Başarısızlıklar

Veri koruması (Data Protection), .NET 8'de hassas verilerin şifrelenmesi için kullanılan en güvenli kütüphanedir. Hassas verileri veritabanında düz metin (plain text) olarak saklamaktan kaçınmalıyız.

### Data Protection API Kullanımı

`IDataProtectionProvider` arayüzü ile verileri şifrelemek oldukça basittir:

```csharp
public class SecurityService
{
    private readonly IDataProtector _protector;

    public SecurityService(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("MyApplication.SecurityKey");
    }

    public string EncryptData(string input) => _protector.Protect(input);
    public string DecryptData(string input) => _protector.Unprotect(input);
}

```

---

## 4. Güvensiz Tasarım ve Kimlik Doğrulama Hataları

Kimlik doğrulama süreçlerinde `ASP.NET Core Identity` kullanmak, tekerleği yeniden icat etmekten kaçınmanızı sağlar. Parola hashleme algoritmalarında `PBKDF2` (Password-Based Key Derivation Function 2) gibi modern yöntemler kullanılmalıdır.

* **Not:** ASP.NET Core Identity, `PasswordHasher<TUser>` sınıfı üzerinden `HMAC-SHA256` tabanlı ve `salt` içeren güvenli bir hashleme mekanizması sunar.

---

## 5. Güvenlik Yapılandırma Hataları

Hata mesajları, saldırganlara sistem mimarisi hakkında ipucu verebilir. Üretim (Production) ortamında asla detaylı hata mesajlarını istemciye göstermeyin.

### Hata Yönetimi Yapılandırması

`Program.cs` dosyanızda şu şekilde yapılandırın:

```csharp
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts(); // HTTP Strict Transport Security
}

```

---

## 6. Güvensiz Bileşen Kullanımı (Supply Chain Attacks)

Projenize dahil ettiğiniz NuGet paketlerinin zafiyetlerini kontrol etmek kritik öneme sahiptir. `.NET CLI` aracılığıyla paketlerinizi sürekli denetleyebilirsiniz.

```bash
dotnet list package --vulnerable --include-transitive

```

---

## 7. Günlükleme (Logging) ve İzleme

Saldırıların tespit edilmesi için `Microsoft.Extensions.Logging` kullanımı zorunludur. Ancak, log dosyalarına asla kullanıcı parolası, kredi kartı bilgisi veya JWT token gibi hassas verileri yazmayın.

### Güvenli Logging Örneği

```csharp
// Hatalı: _logger.LogInformation($"Login attempt for {user.Password}");
// Doğru: 
_logger.LogInformation("Login attempt for user: {UserId}", user.Id);

```

---

## Özet ve Tavsiyeler

.NET 8 ile güvenliği artırmak sadece kütüphaneleri kullanmak değil, bir "savunma derinliği" (defense in depth) kültürü oluşturmaktır.

* **HTTPS Zorunluluğu:** `app.UseHttpsRedirection()` ile trafiği her zaman şifreleyin.
* **CORS Politikaları:** `AllowAnyOrigin` kullanımından kaçının, sadece güvenli alan adlarını tanımlayın.
* **Rate Limiting:** .NET 8'in yerleşik `RateLimiter` middleware bileşeni ile kaba kuvvet (brute force) saldırılarını engelleyin.

Güvenlik, bir ürünün bitiş çizgisi değil, sürekli bir döngüdür. Statik kod analizi (SAST) araçları ve düzenli sızma testleri, .NET 8 projenizin uzun vadeli sağlığı için vazgeçilmezdir. Yazılım geliştirmede "güvenlik ilk önceliktir" yaklaşımı, teknik borçları azaltacağı gibi kurumsal itibarınızı da koruyacaktır.

> **Önemli Hatırlatma:** OWASP Top 10 listesi güncellenmektedir. Projenizdeki güvenliği sağlarken OWASP'ın resmi web sitesindeki güncel dokümantasyonu referans almayı ihmal etmeyin.