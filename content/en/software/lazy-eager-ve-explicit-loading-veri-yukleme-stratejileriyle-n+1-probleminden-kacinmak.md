---
title: "Lazy, Eager, and Explicit Loading: Avoiding the \"N+1 Problem\" with Data Loading Strategies"
date: 2026-03-29
type: "software"
draft: false
math: true
description: "A comprehensive guide examining the technical details and implementation methods of Lazy, Eager, and Explicit Loading strategies to optimize database performance and prevent the N+1 query problem."
featured_image: "/images/software/lazy-eager-ve-explicit-loading-veri-yukleme-stratejileriyle-n+1-probleminden-kacinmak.png"
tags: ["software", "software-development", "software-performance", "nplus1-problem", "performance-optimization", "backend", "eager-loading", "lazy-loading"]
---

In modern software architectures, database interactions play a decisive role in the scalability and response time of an application. One of the biggest performance bottlenecks encountered, especially when using Object-Relational Mapping (ORM) tools, is the N+1 Query Problem. To overcome this issue and optimize the data access layer, it is essential to have a deep understanding of Lazy, Eager, and Explicit Loading strategies.

{{< figure src="/images/software/lazy-eager-ve-explicit-loading-veri-yukleme-stratejileriyle-n+1-probleminden-kacinmak.png" alt="Lazy, Eager, and Explicit Loading: Avoiding the \"N+1 Problem\" with Data Loading Strategies" width="1200" caption="Figure 1: Lazy, Eager, and Explicit Loading: Avoiding the \"N+1 Problem\" with Data Loading Strategies." >}}

---

## 1. The N+1 Query Problem: The Silent Killer of Performance

The N+1 problem occurs when a main data set (N records) and a separate query for each of the related data associated with those records are executed. As a result, a total of $N+1$ queries are sent to the database.

**Example Scenario:**
Assume you want to display 50 articles and the author of each article in a blog application:

1. The main query that fetches all articles: `SELECT * FROM Articles;` (1 query)
2. The query that fetches the relevant author for each article: `SELECT * FROM Authors WHERE Id = @AuthorId;` (50 queries)

This situation increases network traffic, exhausts the database connection pool, and leads to significant latency.

---

## 2. Eager Loading

Eager Loading is the process of fetching related data **at the same time** with a single query (usually using `JOIN`) while the main data set is being retrieved. Although it may seem costly at the database level, it completely eliminates the N+1 problem on the application side.

### Technical Implementation (Entity Framework Core)

The `Include` and `ThenInclude` methods are used for this strategy in EF Core.

```csharp
// A single JOIN query is sent to the database.
var articles = context.Articles
    .Include(a => a.Author)
    .Include(a => a.Comments)
        .ThenInclude(c => c.User)
    .ToList();

```

### Pros and Cons

* **Pros:** All data is obtained with a single database round-trip.
* **Cons:** Over-fetching data can increase memory usage. Queries containing too many `JOIN`s can become complex.

---

## 3. Lazy Loading

Lazy Loading is a strategy where related data is loaded from the database only at the moment when an attempt is made to access it. Data is not loaded until the navigation property on the object is called.

### Technical Infrastructure and Proxy Objects

This mechanism is generally carried out through **Proxy classes** or **Virtual** keywords. The ORM tool creates a proxy that derives from your class at runtime and triggers the database query when the relevant property is called.

### Example Structure

```csharp
public class Article
{
    public int Id { get; set; }
    public string Title { get; set; }
    
    // Being virtual is critical for Lazy Loading
    public virtual Author Author { get; set; } 
}

```

### Critical Risk: Uncontrolled Query Explosion

Although Lazy Loading provides comfort to the developer, it is the root cause of the N+1 problem. If a related property is accessed within a `foreach` loop, a new SQL query runs every time the loop turns.

---

## 4. Explicit Loading

Explicit Loading is when the developer manually decides when data will be loaded within the flow of the code. Data is not loaded initially, but is triggered with the `Load()` method when needed.

### Implementation Example

```csharp
var article = context.Articles.FirstOrDefault(a => a.Id == 1);

// Load related data based on a specific condition
if (needComments)
{
    context.Entry(article)
        .Collection(a => a.Comments)
        .Load();
}

```

This method is the safest middle ground for preventing unnecessary loading in large object networks.

---

## 5. Advanced Optimization Techniques

Relying only on ORM methods is not sufficient when implementing data loading strategies. The following techniques take performance to the next level:

### A. Projection Queries (Select)

Mapping only the required fields into a DTO (Data Transfer Object) instead of fetching all table columns saves you from the cost of `SELECT *`.

```csharp
var data = context.Articles
    .Select(a => new ArticleDto {
        Title = a.Title,
        AuthorName = a.Author.Name
    }).ToList();

```

### B. Split Queries

Using too many `JOIN`s can lead to the "Cartesian Product" problem, creating massive result sets. The `AsSplitQuery()` feature, which comes with EF Core 5.0+, fetches relationships with separate queries but in an optimized way.

```csharp
var articles = context.Articles
    .Include(a => a.Comments)
    .AsSplitQuery()
    .ToList();

```

### C. No-Tracking

If no updates will be made to the fetched data (Read-only scenarios), turning off the ORM's object tracking mechanism provides memory and CPU savings.

```csharp
var list = context.Articles.AsNoTracking().ToList();

```

---

## 6. Strategy Selection Matrix

| Criterion | Eager Loading | Lazy Loading | Explicit Loading |
| --- | --- | --- | --- |
| **Number of Queries** | Low (Usually 1) | High (N+1 Risk) | Medium (Controlled) |
| **Amount of Data** | High (Risk of unnecessary loading) | Minimum (Only what is needed) | Selective |
| **Use Case** | Where the relationship will always be used | Optional, rarely accessed data | Scenarios containing complex business logic |
| **Complexity** | Medium | Low | High |

---

## 7. Software Libraries and Ecosystem Support

Different languages and frameworks manage these strategies with different libraries:

* **Java (Spring Boot / Hibernate):** Hibernate uses Lazy Loading for collections by default. The strategy can be changed with `@EntityGraph` or `FetchType.EAGER`.
* **.NET (Entity Framework Core):** Lazy Loading is disabled by default. It can be activated with the `Microsoft.EntityFrameworkCore.Proxies` package.
* **Python (SQLAlchemy / Django ORM):** Django has `select_related` (Eager-JOIN) and `prefetch_related` (Eager-Separate Query) methods.
* **Node.js (Sequelize / TypeORM):** Eager Loading is managed with `relations` or `include` parameters.

---

## 8. Implementation Notes and Architectural Recommendations

1. **Query Monitoring:** Monitoring SQL Profiler or ORM logs during the development phase is critical to catching the N+1 problem before going live.
2. **Standardize DTO Usage:** Avoid returning Entity objects directly at the API layer. This leads to unintentional Lazy Loading triggers and JSON serialization errors.
3. **Avoid Deep Relationships:** Queries requiring more than three `ThenInclude`s usually indicate a problem in the database design or that the query needs to be broken down.
4. **Caution with Large Data Sets:** Using Eager Loading on tables containing thousands of records can cause the server memory (RAM) to fill up rapidly. Paging is mandatory in these situations.

Choosing the right data loading strategies not only increases the execution speed of the code but also reduces the total cost of ownership (TCO) of the system, enabling resources to be used efficiently. For a modern software engineer, these strategies are the most powerful optimization instruments in the toolbox.

