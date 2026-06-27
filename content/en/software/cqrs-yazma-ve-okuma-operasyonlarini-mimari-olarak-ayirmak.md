---
title: "CQRS: Architecturally Separating Write and Read Operations"
date: 2026-03-09
type: "software"
draft: false
math: true
description: "CQRS architecture is an advanced design pattern that provides high scalability, performance, and flexibility by separating data writing and reading responsibilities in software systems."
featured_image: "/images/software/cqrs-yazma-ve-okuma-operasyonlarini-mimari-olarak-ayirmak.png"
tags: ["software", "cqrs", "microservices", "event-sourcing", "domain-driven-design", "ddd", "mediatr", "performance-management"]
---

As scalability and performance requirements increase in modern software architectures, traditional data access models (CRUD) have begun to fall short. **CQRS (Command Query Responsibility Segregation)** aims to overcome these bottlenecks by completely separating the data update (Command) and data read (Query) operations in a system. Popularized by Greg Young, this pattern is based on Bertrand Meyer’s **CQS (Command-Query Separation)** principle.

{{< figure src="/images/software/cqrs-yazma-ve-okuma-operasyonlarini-mimari-olarak-ayirmak.png" alt="CQRS: Architecturally Separating Write and Read Operations" width="1200" caption="Figure 1: CQRS: Architecturally Separating Write and Read Operations." >}}

---

### 1. CQRS Conceptual Framework and Basic Theory

In traditional architectures, the same data model is generally used for both read and write operations. However, as a system grows, read requests require complex reporting and filtering, while write requests focus on business logic and consistency.

* **Commands:** These are operations that change the state of the data. They do not return data (except for success/error status). The focus is on "Task-Based" operations. (e.g., `ChangeUserAddress`)
* **Queries:** These are operations that do not change the state of the data and only return the current state. There are no side effects. (e.g., `GetUserDetails`)

---

### 2. Architectural Components and Flow

In a system where CQRS is implemented, the operational flow is usually conducted through two different channels:

#### A. Command Side (Write Model)

This layer is responsible for maintaining the system's domain logic. It validates data integrity and business rules. It is usually used in conjunction with **Domain Driven Design (DDD)** practices. `Aggregates`, `Value Objects`, and `Entities` are at the center of this layer.

#### B. Query Side (Read Model)

This layer is optimized for the data format required by the user interface or client. To avoid complex JOIN operations, data is often kept in a "De-normalized" form.

---

### 3. Data Synchronization and Eventual Consistency

When read and write models are separated, data synchronization between them becomes a critical issue. A change that occurs on the write side is reflected to the read side via **Domain Events**.

1. The command runs and the database is updated.
2. An `OrderCreated` event is fired.
3. An `Event Handler` captures this event and updates the read model (Read DB).

In this process, the **Eventual Consistency** principle applies. That is, the data becomes up-to-date on the read side shortly after the write moment.

---

### 4. Technical Implementation: C# and MediatR Example

The most common way to implement CQRS in the modern .NET ecosystem is to use the **MediatR** library. MediatR minimizes dependencies by using `In-process messaging`.

#### Command and Handler Definition

```csharp
// Command
public record CreateProductCommand(string Name, decimal Price) : IRequest<Guid>;

// Command Handler
public class CreateProductHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly ApplicationDbContext _context;
    public CreateProductHandler(ApplicationDbContext context) => _context = context;

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product { Id = Guid.NewGuid(), Name = request.Name, Price = request.Price };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product.Id;
    }
}

```

#### Query and Handler Definition

```csharp
// Query
public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto>;

// Query Handler (Faster reading can be achieved using Dapper)
public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IDbConnection _dbConnection;
    public GetProductByIdHandler(IDbConnection dbConnection) => _dbConnection = dbConnection;

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var sql = "SELECT Id, Name, Price FROM Products WHERE Id = @Id";
        return await _dbConnection.QueryFirstOrDefaultAsync<ProductDto>(sql, new { Id = request.Id });
    }
}

```

---

### 5. Enriching CQRS with Advanced Scenarios

#### Event Sourcing Integration

CQRS is often confused with **Event Sourcing**, but these are complementary and different patterns. In Event Sourcing, not the final state of the data, but all events that occurred until that state are stored. CQRS is the best tool for creating meaningful "Read Models" from this pile of events.

#### Different Database Technologies

While benefiting from ACID properties by using a relational database (PostgreSQL, SQL Server) on the write side; using a high-performance NoSQL (Elasticsearch, Redis, MongoDB) on the read side maximizes the power of the CQRS architecture.

---

### 6. Libraries and Tools to Use

Popular tools that facilitate CQRS implementation are:

* **MediatR (.NET):** The industry standard for separating commands and queries.
* **MassTransit / Rebus (.NET):** Used for asynchronous communication between services and event distribution.
* **Axon Framework (Java/Spring):** Offers an end-to-end solution for CQRS and Event Sourcing.
* **Broadway (PHP):** Preferred for building event-sourced systems on the PHP side.
* **Dapper:** A lightweight ORM solution for running high-performance SQL queries on the read side.

---

### 7. Architectural Decision Making: When to Use CQRS?

CQRS is not a "silver bullet" suitable for every project. Implementing it increases system complexity (Cognitive Load).

**Situations where it should be used:**

* If there is a massive difference between the number of reads and writes (e.g., social media platforms).
* If complex business rules and parallel operations are performed on the same data.
* If read performance at the millisecond level is critical.
* If a transition to Microservices architecture is planned.

**Situations to avoid:**

* Applications consisting of simple CRUD operations.
* Financial modules where data consistency is required to be instantaneous (Strong Consistency) (if asynchronous structure cannot be managed).

---

### 8. Technical Notes and Best Practices

> **Note 1: Task-Based UI:** When using CQRS, the user interface should focus on specific business tasks like "RelocateUser" or "PromoteUser" instead of a general structure like "UpdateUser".
> **Note 2: Validation:** Validation processes on the command side should be two-staged. Syntax validation (like FluentValidation) should be done with `Pipeline Behavior` before the handler, and domain validation should be done within the handler.
> **Note 3: Projection:** Structures that update read models are called "Projector". Being idempotent with projections ensures that the system becomes consistent again in case of possible error situations.

---

### 9. Conclusion and Evaluation

CQRS provides flexibility in the evolutionary process of software. It allows for the development of a clean domain by freeing the write model from complex queries, while optimizing performance by focusing the read model only on the view. However, considering the additional cost (multiple database, event handling, messaging), the healthiest approach is to apply it locally in the bottleneck parts of the system.

When designing a scalable system, CQRS should be treated not just as a pattern, but as a strategy that determines the growth capacity of the system. Constructing the architecture in this direction is the key to managing future load increases and changing business requirements with minimal refactoring.

