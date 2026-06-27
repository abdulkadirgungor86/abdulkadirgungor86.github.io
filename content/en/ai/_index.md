+++
title = "Artificial Intelligence and Machine Learning"
description = "From supervised, unsupervised, and reinforcement learning models to technical depth in the modern AI ecosystem."
type = "list"
weight = 60
+++

**Artificial Intelligence (AI)**, the most powerful driver of digital transformation today, is the entirety of systems that not only process data but also derive meaning from it. The cornerstone of this ecosystem, **Machine Learning**, enables systems to improve their performance through experience using mathematical modeling and statistical methods. When approached with an engineering discipline, this process consists of rigorous stages such as data collection, feature engineering, and model optimization.

{{< figure src="/images/ai/yapay-zeka-makine-ogrenmesi.png" alt="Artificial Intelligence and Machine Learning" width="1200" caption="Figure 1: Artificial Intelligence and Machine Learning." >}}

---

### Basic and Advanced Learning Paradigms

Machine learning processes are categorized into main and hybrid technical categories based on how data is processed, the presence of a "teaching" signal, and architectural approaches:

#### 1. Supervised Learning

Supervised learning works on a labeled dataset consisting of input-output pairs. During the training process, the model optimizes itself through a **loss function** that measures how close it is to the target outputs.

* **Regression Analysis:** Used for predicting continuous and numerical values. For example, calculating the displacement values that occur depending on the amount of load on a structural element is a typical regression problem.
* **Classification:** Divides data into discrete categories. Logistic regression, support vector machines (SVM), and decision trees are the fundamental algorithms in this field. Determining whether a crack in image processing technologies is critical falls into this category.

#### 2. Unsupervised Learning

In this approach, there are no labels or target outputs in the dataset. The algorithm must discover hidden patterns and similarities within the internal structure of the data itself.

* **Clustering:** Data points showing similar characteristics are grouped using techniques such as K-Means or hierarchical clustering. It is vital for anomaly detection, especially in large datasets.
* **Dimensionality Reduction:** Techniques like PCA (Principal Component Analysis) are used to reduce complex, high-dimensional datasets into more manageable subspaces while keeping information loss to a minimum.

#### 3. Semi-Supervised Learning

It is a dynamic mix of supervised and unsupervised learning. In real-world scenarios, while raw data is easy to collect, labeling it by experts is extremely costly and time-consuming. This approach increases the model's generalization ability by using a small amount of labeled data and a very large amount of unlabeled data simultaneously.

* **Self-Training:** The model is first trained on a small amount of labeled data. It then makes predictions about unlabeled data. Predictions with the highest confidence scores are accepted as "pseudo-labels," added to the dataset, and the model is retrained.
* **Graph-Based Models:** A graph (network) structure is built based on the geometric or statistical similarities between data points. Label information propagates through this graph based on nearest-neighbor relationships. It is a critical method for understanding the status of an entire system when only a small portion of data from sensor networks is labeled, such as in structural health monitoring.

#### 4. Self-Supervised Learning

A modern and powerful subset of unsupervised learning. It does not require external human labels; instead, it uses the data's internal structure, context, or geometry to generate its own labels (pretext task). It forms the foundation of Large Language Models (LLM) and modern Computer Vision systems.

* **Context Prediction:** Processes such as predicting the next word in a text or reconstructing a randomly closed (masked) part of an image.
* **Contrastive Learning:** It learns a universal representation (embedding) of data by pulling together different augmentations (rotation, cropping) of the same data while pushing away images belonging to different data.

#### 5. Transfer Learning

A paradigm that radically reduces the computational cost and data requirements of training a model from scratch. The weights of a model that has previously been trained on massive datasets and has learned general features (edges, textures, basic geometric structures) are either frozen or fine-tuned to be adapted to a specific engineering problem.

* **Feature Extractor:** The lower layers of the pre-trained network are kept fixed, and only the final classification layer is changed according to the new problem.
* **Fine-Tuning:** With a low learning rate, all layers of the pre-trained model are slightly optimized according to the new and smaller target dataset.

#### 6. Active Learning

An interactive algorithm cycle where the model, rather than being a passive recipient in the learning process, decides for itself which data needs to be labeled. The algorithm requests labeling from an expert (oracle) by selecting data points where it is most "uncertain" or where the variance is highest. Thus, maximum model performance is targeted with minimum labeled data.

#### 7. Reinforcement Learning

It is based on an agent developing the optimal strategy in a dynamic environment based on the feedback (reward or punishment) it receives. Unlike other methods, the dataset here is not static but an interactive process.

* **Policy Optimization:** The agent learns to make decisions that will maximize the total long-term reward. Balance control of autonomous robotic systems and complex game strategies are structured with this model.

---

### Technical Terms and Engineering Approach

Building a successful model is possible not only through algorithm selection but also by correctly managing the following technical parameters:

* **Feature Engineering:** The process of deriving meaningful variables from raw data that will increase the model's success.
* **Overfitting:** When a model fails on real-world (unseen) data because it has memorized the noise in the training data. It is kept under control with regularization techniques (L1/L2).
* **Pseudo-Labeling:** The mechanism in semi-supervised learning where the model accepts its own high-confidence predictions as new truths in the training set.
* **Data Augmentation:** The entirety of techniques that prevent overfitting by synthetically multiplying existing data using methods such as rotating, adding noise, and scaling.
* **Artificial Neural Networks (ANN):** Architectures consisting of multi-layered structures capable of solving complex non-linear problems and forming the basis of Deep Learning.

These technical foundations play a key role in the integration of physical systems with digital models and the establishment of intelligent decision-support mechanisms.

---

*My articles regarding artificial intelligence and machine learning covering these and similar topics will be found under this heading.*