---
title: "Domain-Driven Design (DDD): Putting Business Rules at the Core of Software (Value Objects vs. Entities)"
date: 2026-03-17
type: "software"
draft: false
math: true
description: "Domain-Driven Design (DDD) is a methodology for building sustainable, flexible, and object-oriented architectures by focusing on business logic and the language of domain experts rather than technical details in complex software projects."
featured_image: "/images/software/domain-driven-design-(ddd)-is-kurallarini-yazilimin-merkezine-koymak-(value-objects-vs-entities).png"
tags: ["software", "software-performance", "domain-driven-design", "ddd", "entity", "clean-code", "microservices"]
---

In the world of software, managing complexity is not just about choosing the right algorithms, but about how you place business logic (domain logic) at the heart of your code. **Domain-Driven Design (DDD)**, introduced to the literature by Eric Evans, argues that software should focus on the business model rather than technical requirements. Understanding the distinction between **Entities** and **Value Objects**, two cornerstones of this approach, is the key to building a sustainable system architecture.

{{< figure src="/images/software/domain-driven-design-(ddd)-is-kurallarini-yazilimin-merkezine-koymak-(value-objects-vs-entities).png" alt="Domain-Driven Design (DDD): Putting Business Rules at the Core of Software (Value Objects vs. Entities)" width="1200" caption="Figure 1: Domain-Driven Design (DDD): Putting Business Rules at the Core of Software (Value Objects vs. Entities)." >}}

---

## Strategic Design in Domain-Driven Design Architecture

DDD uses the concept of **Bounded Context** to break down large systems into manageable pieces. However, beneath this strategic level lie tactical patterns that determine the behavior of object models. Placing the business rules of the software at the center requires creating a rich and behavior-oriented model, avoiding the "Anemic Domain Model" trap.

### 1. Entities: Identity-Focused Objects

If an object's existence within a system is defined by its **unique identity (Identity)** rather than the attributes it possesses, it is an **Entity**.

* **Continuity:** An Entity retains the same identity over time, even if its attributes (name, address, state, etc.) change.
* **Equality:** Equality between two Entity objects is checked by looking at their ID values, not the data they contain.
* **Mutable Structure:** Entities generally have state modifiers (setters or domain events).

#### Technical Implementation Example (C# / .NET)

In the example below, a `Customer` object is an Entity defined by its `Id` value in the database, even if its name changes.

```csharp
public abstract class Entity
{
    public Guid Id { get; protected set; }

    protected Entity(Guid id)
    {
        Id = id;
    }

    public override bool Equals(object obj)
    {
        if (obj is not Entity other) return false;
        return Id == other.Id;
    }

    public override int GetHashCode() => Id.GetHashCode();
}

public class Customer : Entity
{
    public string Name { get; private set; }
    public string Email { get; private set; }

    public Customer(Guid id, string name, string email) : base(id)
    {
        UpdateName(name);
        Email = email;
    }

    public void UpdateName(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
            throw new ArgumentException("Name cannot be empty.");
        Name = newName;
    }
}

```

### 2. Value Objects: Descriptive Objects

If an object gains meaning only through the combination of its values and does not need an identity of its own, it is a **Value Object**.

* **Immutability:** Once a Value Object is created, it cannot be changed. If a change is required, a new object is created.
* **Value Equality:** Two Value Objects are considered the same if all the fields they contain are equal to each other.
* **Side-Effect-Free Functions:** Their methods only perform calculations and do not change the state of the object.

#### Technical Implementation Example (Java / Spring Context)

The `Money` object representing currency and amount is a classic example of a Value Object.

```java
public final class Money {
    private final BigDecimal amount;
    private final String currency;

    public Money(BigDecimal amount, String currency) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be negative.");
        }
        this.amount = amount;
        this.currency = currency;
    }

    public Money add(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Different currencies cannot be added.");
        }
        return new Money(this.amount.add(other.amount), this.currency);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Money money = (Money) o;
        return amount.equals(money.amount) && currency.equals(money.currency);
    }
}

```

---

## Comparative Analysis: When to Use Which?

One of the common mistakes in software design is defining everything as an Entity. This increases database load and makes the code harder to test.

| Feature | Entity | Value Object |
| --- | --- | --- |
| **Identity** | Has a unique ID. | No ID, defined by its values. |
| **Lifecycle** | Can change over time, tracked in the system. | Transient, used for calculation. |
| **Equality Logic** | `Id == other.Id` | `PropertyA == other.PropertyA && ...` |
| **Side-Effects** | State changes are possible. | Must always be immutable. |

---

## Advanced Techniques and Patterns

### The Concept of Aggregate Root

Entities and Value Objects usually form a group. The "entry point" that provides communication between this group and the outside world is the **Aggregate Root**. Consider an order system; `Order` is an Aggregate Root, while the `OrderItem` objects within it are managed only through this root.

### Encapsulation and Domain Validation

Putting business rules at the center means embedding validation logic within the object. When an `Address` Value Object is created, the postal code format should be checked within the constructor. This is the "Always Valid" object principle.

### Persistence Strategies

When using ORM (Object-Relational Mapping) tools (Entity Framework, Hibernate), Value Objects are usually marked as "Owned Types" or "Embeddables." This ensures they are kept as columns in the table of the Entity they are attached to, rather than as a separate table in the database.

---

## Library and Tool Support

When applying DDD principles, the following libraries help reduce boilerplate code:

1. **MediatR (.NET):** Implements the "Mediator" pattern for distributing Domain Events asynchronously or synchronously.
2. **FluentValidation:** Used to validate complex business rules outside the object, yet still within the domain layer.
3. **Vavr (Java):** Provides immutable data structures and functional programming elements in Java, simplifying the writing of Value Objects.
4. **AutoMapper / MapStruct:** Enables conversion between domain models and DTOs (Data Transfer Objects), but care should be taken not to leak domain logic.

---

## Architectural Notes and Best Practices

> **Note 1: Identity Assignment**
> Entity identities (UUID/Guid) should be generated at the application level. Relying on the database's `Identity` or `Sequence` mechanisms makes the Domain layer dependent on the infrastructure.

> **Note 2: Avoiding Primitive Obsession**
> Instead of keeping a customer's phone number as a `string`, keep it in a Value Object called `PhoneNumber`. This way, you centralize the number format validation logic in one place.

> **Note 3: Behavior Comes Before Data**
> Do not view your objects simply as data holders (getter/setter). Add methods that reflect the business language (Ubiquitous Language) such as `UpdateStatus()`, `ApplyDiscount()`, or `Cancel()`.

## Conclusion: Why DDD?

Domain-Driven Design prevents code from being crushed under "technical debt," especially in enterprise projects with complex business logic. The distinction between Entity and Value Object enables an architecture that is independent of the database schema and focuses on pure business logic. Correctly positioning these two concepts in design will directly increase the evolvability and maintainability of the software.

The quality of a system is hidden not in how "smart" the code is, but in how "naturally" and "safely" it expresses business rules. DDD provides us with this safety and expressive power.

