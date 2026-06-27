---
title: "OAuth2, OpenID Connect ve Zero Trust: Modern Kimlik Doğrulama ve Ağ Güvenlik Mimarileri"
date: 2026-04-04
type: "software"
draft: false
math: true
description: "Modern ağ güvenliğinde \"asla güvenme, her zaman doğrula\" prensibini benimseyen Zero Trust mimarisinin, OAuth 2.0 yetkilendirme ve OpenID Connect kimlik doğrulama protokolleriyle teknik entegrasyonunu inceleyen bir yazıdır."
featured_image: "/images/software/oauth2-openid-connect-ve-zero-trust-modern-kimlik-dogrulama-ve-ag-guvenlik-mimarileri.png"
tags: ["yazilim", "software", "oauth2", "open-id-connect", "zero-trust", "jwt", "pkce", "microservices", "mikroservis", "mikroservis-guvenligi"]
---

Modern dijital ekosistemde güvenlik, artık çevresel bir savunma hattı kurmaktan ziyade her bir veri paketinin ve kimlik bilgisinin sürekli doğrulanması esasına dayanmaktadır. Geleneksel "güven ama doğrula" yaklaşımı, yerini "asla güvenme, her zaman doğrula" prensibine, yani **Zero Trust (Sıfır Güven)** mimarisine bırakmıştır. Bu mimarinin temel taşlarını ise **OAuth 2.0** ve **OpenID Connect (OIDC)** protokolleri oluşturur.

{{< figure src="/images/software/oauth2-openid-connect-ve-zero-trust-modern-kimlik-dogrulama-ve-ag-guvenlik-mimarileri.png" alt="OAuth2, OpenID Connect ve Zero Trust: Modern Kimlik Doğrulama ve Ağ Güvenlik Mimarileri" width="1200" caption="Şekil 1: OAuth2, OpenID Connect ve Zero Trust: Modern Kimlik Doğrulama ve Ağ Güvenlik Mimarileri" >}}

---

## 1. OAuth 2.0: Delegated Authorization (Yetkilendirme Devri)

OAuth 2.0, bir kullanıcının şifresini paylaşmadan üçüncü taraf uygulamalara sınırlı erişim izni vermesini sağlayan bir yetkilendirme çerçevesidir. Teknik olarak bir "kimlik doğrulama" (authentication) protokolü değil, bir "yetkilendirme" (authorization) protokolüdür.

### Temel Aktörler ve Akış (Grant Types)
OAuth 2.0 mimarisinde dört ana rol bulunur:
1.  **Resource Owner (Kaynak Sahibi):** Veriye erişim izni veren kullanıcı.
2.  **Client (İstemci):** Kaynağa erişmek isteyen uygulama.
3.  **Authorization Server (Yetkilendirme Sunucusu):** Kullanıcıyı doğrulayan ve token üreten sunucu.
4.  **Resource Server (Kaynak Sunucusu):** Verinin barındığı, Access Token ile erişilen API.

### Teknik Uygulama: Authorization Code Flow
Modern web uygulamalarında en güvenli yöntem olan *Authorization Code Flow* ile bir token alımı şu şekildedir:

```bash
# 1. Kullanıcıyı yetkilendirme sayfasına yönlendirme
GET /authorize?
  response_type=code&
  client_id=CLIENT_ID&
  redirect_uri=CALLBACK_URL&
  scope=read_profile&
  state=xyz123

# 2. Yetkilendirme kodunu Access Token ile takas etme (Sunucu tarafında)
POST /token
  grant_type=authorization_code&
  code=AUTHORIZATION_CODE&
  redirect_uri=CALLBACK_URL&
  client_id=CLIENT_ID&
  client_secret=CLIENT_SECRET
```



---

## 2. OpenID Connect (OIDC): Kimlik Katmanı

OAuth 2.0 yetkilendirme yaparken, kimin giriş yaptığını söylemez. **OIDC**, OAuth 2.0'ın üzerine inşa edilmiş bir kimlik doğrulama katmanıdır. Temel farkı, **ID Token** kavramını getirmesidir.

### ID Token ve JWT Yapısı
OIDC, kimlik bilgilerini taşımak için **JSON Web Token (JWT)** formatını kullanır. Bir JWT üç bölümden oluşur: `Header`, `Payload` ve `Signature`.

*   **Header:** Algoritma ve tip bilgisi.
*   **Payload:** Kullanıcı claims (ad, e-posta, issuer, expiration).
*   **Signature:** Token'ın değiştirilmediğini kanıtlayan imza.

### Python (PyJWT) ile Token Doğrulama Örneği:
```python
import jwt

# Resource Server tarafında token doğrulaması
def verify_token(token, public_key):
    try:
        payload = jwt.decode(token, public_key, algorithms=['RS256'], audience='my-api')
        return payload
    except jwt.ExpiredSignatureError:
        return "Token süresi dolmuş."
    except jwt.InvalidTokenError:
        return "Geçersiz token."
```

---

## 3. Zero Trust Networking (ZTN): Çevresiz Güvenlik

Zero Trust, ağın içindeki veya dışındaki hiç kimseye varsayılan olarak güvenilmediği bir stratejik modeldir. "Mikro-segmentasyon" ve "En Az Yetki İlkesi" (Least Privilege) üzerine kuruludur.

### Zero Trust Mimarisinin Üç Sütunu
1.  **Açıkça Doğrula:** Kullanıcı kimliği, konumu, cihaz sağlığı ve veri sınıflandırması gibi tüm mevcut veri noktalarına dayanarak her zaman doğrulama yapın.
2.  **En Az Yetkili Erişimi Kullan:** Tam zamanında ve yeterli erişim (JIT/JEA) ile riskleri sınırlayın.
3.  **İhlal Varsayımı (Assume Breach):** Saldırı alanını en aza indirmek için ağı küçük parçalara bölün (mikro-segmentasyon). Şifreleme ve analitiği uçtan uca uygulayın.



---

## 4. Teknik Entegrasyon: OAuth2/OIDC ve Zero Trust İlişkisi

Zero Trust mimarisinde OAuth2 ve OIDC, **Policy Enforcement Point (PEP)** görevini görür. Kullanıcı bir kaynağa erişmek istediğinde, sistem sadece şifreye bakmaz; OIDC üzerinden gelen ID Token'daki "context" (bağlam) bilgilerini inceler.

### Güvenlik Kütüphaneleri ve Araçlar
Modern mimarilerde bu protokolleri implemente etmek için kullanılan popüler kütüphaneler:

*   **Go:** `golang.org/x/oauth2`
*   **Node.js:** `openid-client`, `passport-openidconnect`
*   **Java/Spring:** `Spring Security OAuth2`
*   **Rust:** `openidconnect-rs`

### Örnek: Spring Security ile OIDC Yapılandırması
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/admin/**").hasAuthority("SCOPE_admin")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        return http.build();
    }
}
```

---

## 5. İleri Düzey Güvenlik Parametreleri: PKCE ve mTLS

### PKCE (Proof Key for Code Exchange)
Mobil ve Single Page Application (SPA) gibi "public client" yapılarında, `client_secret` güvenli tutulamaz. PKCE, bir kod yakalama saldırısını (code interception attack) önlemek için geçici bir gizli anahtar (code verifier) kullanır.

### mTLS (Mutual TLS)
Zero Trust mimarisinde sadece istemci sunucuyu doğrulamaz, sunucu da istemcinin sertifikasını kontrol eder. OAuth 2.0'da **Sender-Constrained Tokens** mekanizması ile token, istemcinin TLS sertifikasına bağlanarak çalınsa dahi başka bir cihazda kullanılmasını engeller.

---

## 6. Mikroservislerde Kimlik Yönetimi

Mikroservis mimarisinde her servis kendi başına bir Resource Server'dır. İstekler genellikle bir **API Gateway** üzerinden geçer.

1.  **Edge Authentication:** API Gateway, OIDC kullanarak dış dünyadan gelen isteği doğrular.
2.  **Internal Token Exchange:** İç servisler arası iletişimde, orijinal token daha kısıtlı yetkilere sahip yeni bir token ile takas edilebilir.

### Notlar ve Kritik Uyarılar
> **NOT 1:** Asla `Implicit Grant` akışını kullanmayın; güvenlik açıkları nedeniyle bu akış OAuth 2.1 spesifikasyonunda kaldırılmıştır. Bunun yerine PKCE destekli Authorization Code Flow tercih edilmelidir.
>
> **NOT 2:** Token süresini (Expiration Time) kısa tutun. Uzun süreli oturumlar için `Refresh Token` kullanın ve bu token'ları güvenli (HttpOnly, Secure cookies) alanlarda saklayın.
>
> **NOT 3:** Zero Trust bir ürün değil, bir süreçtir. Sadece OIDC kullanmak sizi "Zero Trust" yapmaz; cihaz sağlığı (Device Health) ve davranış analitiği (UEBA) ile desteklenmelidir.

---

## Sonuç

Modern güvenlik mimarisi, kimlik doğrulamanın (OIDC) ve yetkilendirmenin (OAuth 2.0) dinamik bir şekilde, her işlemde yeniden değerlendirildiği Zero Trust felsefesine evrilmiştir. Geliştiriciler için bu, sadece kütüphane entegrasyonu değil, aynı zamanda verinin ve erişimin en küçük parçaya (granularity) kadar kontrol edilmesi anlamına gelir. Güçlü bir şifreleme, katı bir kimlik denetimi ve sürekli izleme, bu üçlü yapının başarısı için vazgeçilmezdir.