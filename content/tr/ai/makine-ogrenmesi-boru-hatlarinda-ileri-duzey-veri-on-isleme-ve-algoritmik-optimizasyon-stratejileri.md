---
title: "Makine Öğrenmesi Boru Hatlarında İleri Düzey Veri Ön İşleme ve Algoritmik Optimizasyon Stratejileri"
date: 2026-03-05
type: "ai"
draft: false
math: true
description: "İleri düzey öznitelik mühendisliği, istatistiksel imputasyon teknikleri, ensemble modelleme stratejileri ve Bayesian optimizasyon ile model performansını maksimize etme rehberi. SHAP ve Isolation Forest gibi modern araçlarla veri analitiğinde mühendislik disiplinidir."
featured_image: "/images/ai/makine-ogrenmesi-boru-hatlarinda-ileri-duzey-veri-on-isleme-ve-algoritmik-optimizasyon-stratejileri.png"
tags: ["ai","veri-muhendisligi", "buyuk-veri", "veri-analitigi", "algoritma-optimizasyonu", "oznitelik-muhendisligi", "makine-ogrenmesi"]
---

Modern veri bilimi ve makine öğrenmesi boru hatlarında (pipelines), ham verinin işlenmesi ve modelleme aşamasına hazırlanması, toplam proje süresinin yaklaşık %80'ini oluşturur. Bu süreçte sadece kütüphane fonksiyonlarını çağırmak değil, verinin istatistiksel dağılımını ve algoritmaların matematiksel beklentilerini anlamak esastır. Aşağıda, ileri düzey veri analitiği süreçleri, teknik detayları ve uygulama kodları ile kapsamlı bir şekilde ele alınmıştır.

{{< figure src="/images/ai/makine-ogrenmesi-boru-hatlarinda-ileri-duzey-veri-on-isleme-ve-algoritmik-optimizasyon-stratejileri.png" alt="Makine Öğrenmesi Boru Hatlarında İleri Düzey Veri Ön İşleme ve Algoritmik Optimizasyon Stratejileri" width="1200" caption="Şekil 1: Makine Öğrenmesi Boru Hatlarında İleri Düzey Veri Ön İşleme ve Algoritmik Optimizasyon Stratejileri." >}}

---

## 1. İleri Düzey Öznitelik Mühendisliği (Advanced Feature Engineering)

Öznitelik mühendisliği, verideki gizli kalıpları ortaya çıkarmak için alan bilgisini ve matematiksel dönüşümleri kullanma sanatıdır.

### Değişken Dönüşümleri ve Dağılım Optimizasyonu
Lineer modeller, verilerin normal dağıldığını ve değişkenler arasındaki ilişkinin doğrusal olduğunu varsayar. Eğer veriniz sağa çarpıksa (skewed), modelin öğrenme kapasitesini artırmak için `Log` veya `Power Transformer` (Box-Cox, Yeo-Johnson) uygulanmalıdır.

```python
import pandas as pd
import numpy as np
from scipy import stats
from sklearn.preprocessing import PowerTransformer

# Verideki çarpıklığı (skewness) giderme
pt = PowerTransformer(method='yeo-johnson')
df['target_transformed'] = pt.fit_transform(df[['target_variable']])

# Logaritmik dönüşüm (Sıfır değerleri için 1 eklenerek)
df['feature_log'] = np.log1p(df['feature_column'])
```

### Kategorik Değişkenlerin Vektörizasyonu
Standart `One-Hot Encoding`, yüksek kardinaliteli (çok sayıda benzersiz sınıfa sahip) sütunlarda "boyutsallık laneti"ne (curse of dimensionality) yol açar. Bunun yerine, hedef değişkenin ortalamasını temel alan `Target Encoding` veya ağırlıklandırılmış `Rare Encoding` kullanılmalıdır.

```python
from category_encoders import TargetEncoder

# Target Encoding uygulaması
# Veri sızıntısını (Data Leakage) önlemek için sadece train setinde fit edilir
encoder = TargetEncoder(cols=['city', 'occupation'])
df_encoded = encoder.fit_transform(X_train, y_train)
```

---

## 2. Eksik Veri ve Aykırı Değerlerin İstatistiksel İmputasyonu

Eksik verileri (Missing Values) sadece ortalama ile doldurmak, verideki varyansı yapay olarak düşürür. Bunun yerine, değişkenler arası korelasyonu kullanan `Iterative Imputer` (MICE algoritması) tercih edilmelidir.

### Çok Değişkenli Eksik Veri Tamamlama
`IterativeImputer`, her bir değişkeni diğerlerinin bir fonksiyonu olarak modeller ve eksik değerleri tahmin eder.

```python
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from sklearn.ensemble import RandomForestRegressor

# Random Forest tabanlı MICE imputasyonu
it_imputer = IterativeImputer(estimator=RandomForestRegressor(), max_iter=10, random_state=42)
df_imputed = it_imputer.fit_transform(df)
```

### Aykırı Değerlerin Robust Analizi
Aykırı değer tespiti için `Z-Score` yerine, medyana dayalı ve daha dayanıklı olan `Modified Z-Score` veya `Isolation Forest` kullanılmalıdır. Isolation Forest, veriyi izole etmek için gereken bölünme sayısına bakarak anomalileri belirler.

```python
from sklearn.ensemble import IsolationForest

iso_forest = IsolationForest(contamination=0.05, random_state=42)
outliers = iso_forest.fit_predict(df)
# -1 değerleri aykırı değerleri temsil eder
df_clean = df[outliers == 1]
```

---

## 3. Algoritmik Modelleme ve Topluluk (Ensemble) Stratejileri

Modern analitik yaklaşımlarda tek bir model yerine, birden fazla modelin tahminlerini birleştiren yapılar (Ensemble Learning) standart haline gelmiştir.

### Gradient Boosting Makineleri (GBM) ve Optimizasyon
`XGBoost`, `LightGBM` ve `CatBoost` algoritmaları, gradyan tabanlı optimizasyon yaparak hata fonksiyonunu minimize eder. Bu modellerde aşırı öğrenmeyi engellemek için `early_stopping_rounds` ve `regularization` (L1/L2) parametreleri kritik rol oynar.

```python
import lightgbm as lgb

params = {
    'objective': 'regression',
    'metric': 'rmse',
    'learning_rate': 0.01,
    'feature_fraction': 0.8,
    'lambda_l1': 0.1,
    'lambda_l2': 0.5,
    'boosting_type': 'gbdt'
}

dtrain = lgb.Dataset(X_train, label=y_train)
model = lgb.train(params, dtrain, num_boost_round=1000, valid_sets=[dtrain], 
                  callbacks=[lgb.early_stopping(stopping_rounds=50)])
```

### Model Stacking (Yığınlama)
Stacking, farklı modellerin (örn. bir SVM, bir Random Forest ve bir KNN) tahminlerini girdi olarak alan bir "Meta-Model" eğitilmesidir.

```python
from sklearn.ensemble import StackingRegressor
from sklearn.linear_model import RidgeCV

estimators = [
    ('lr', RidgeCV()),
    ('rf', RandomForestRegressor(n_estimators=10, random_state=42))
]
reg = StackingRegressor(estimators=estimators, final_estimator=RandomForestRegressor(n_estimators=10, random_state=42))
reg.fit(X_train, y_train)
```

---

## 4. Hiperparametre Optimizasyonu ve Bayesyen Yaklaşım

`GridSearch` gibi kaba kuvvet (brute-force) yöntemleri yerine, olasılıksal bir model üzerinden en iyi parametreleri arayan `Bayesian Optimization` (Optuna kütüphanesi gibi) kullanılmalıdır. Bu yöntem, önceki denemelerden ders çıkararak arama uzayını daha akıllıca tarar.

```python
import optuna

def objective(trial):
    n_estimators = trial.suggest_int('n_estimators', 100, 1000)
    max_depth = trial.suggest_int('max_depth', 3, 20)
    regressor = RandomForestRegressor(n_estimators=n_estimators, max_depth=max_depth)
    # Skorlama ve cross-validation işlemleri...
    return score

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=50)
```

---

## 5. Model Değerlendirme ve İş Karar Mekanizmaları

Sadece `Accuracy` veya `R-Squared` değerlerine bakmak yanıltıcı olabilir. Sınıflandırma problemlerinde `Precision-Recall Curve` ve `F1-Score`, regresyonda ise `MAE` (Mean Absolute Error) ve `RMSE` (Root Mean Squared Error) birlikte analiz edilmelidir.

*   **SHAP (SHapley Additive exPlanations):** Modelin hangi özniteliğe neden önem verdiğini açıklamak için oyun teorisini kullanır. Kara kutu modellerin (XGBoost vb.) şeffaflaştırılmasını sağlar.
*   **Permutation Importance:** Bir özniteliğin değerleri rastgele karıştırıldığında model başarısı ne kadar düşüyor sorusuna yanıt arayarak gerçek etkiyi ölçer.

### Teknik Kütüphane Referansları
*   **Veri Manipülasyonu:** `Pandas`, `NumPy`, `Polars` (Yüksek performanslı veri işleme için).
*   **Görselleştirme:** `Matplotlib`, `Seaborn`, `Plotly`.
*   **Makine Öğrenmesi:** `Scikit-Learn`, `XGBoost`, `LightGBM`, `CatBoost`.
*   **Optimizasyon:** `Optuna`, `Scikit-Optimize`.
*   **Model Açıklanabilirlik:** `SHAP`, `LIME`.

Sonuç olarak, ileri düzey bir veri analizi süreci, matematiksel titizlik ile programlama yetkinliğinin birleşimidir. Verinin ön işlemesinden modelin canlıya alınmasına kadar olan her adım, sistematik bir mühendislik disipliniyle yönetilmelidir.
