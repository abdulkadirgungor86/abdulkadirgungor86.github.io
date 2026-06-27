---
title: "Event Sourcing: Ensuring State Management by Storing Change History, Not Data"
date: 2026-03-19
type: "software"
draft: false
math: true
description: "An architectural pattern that provides full traceability and flexible state management by recording every change in the system as an immutable stream of events instead of storing the final state of the data."
featured_image: "/images/software/event-sourcing-veriyi-degil-degisim-gecmisini-saklayarak-durum-yonetimi-saglamak.png"
tags: ["software", "event-sourcing", "cqrs", "microservices", "event-store", "data-integrity", "state-management"]
---

Traditional database designs are dominated by a "State-Oriented" approach. In this model, the most current state of an object is stored in the database, and every update operation (UPDATE) permanently deletes or overwrites the previous data. However, in complex distributed systems and financial/logistics structures where auditability is critical, this model loses the semantic information regarding "why" and "how" the data reached its current state. **Event Sourcing** is an architectural pattern that solves this problem by basing the system not on the final state of the data, but on storing all change events that created that state in an immutable order.

{{< figure src="/images/software/event-sourcing-veriyi-degil-degisim-gecmisini-saklayarak-durum-yonetimi-saglamak.png" alt="Event Sourcing: Ensuring State Management by Storing Change History, Not Data" width="1200" caption="Figure 1: Event Sourcing: Ensuring State Management by Storing Change History, Not Data." >}}

---

### 1. Conceptual Framework of Event Sourcing

In Event Sourcing, the "Source of Truth" for the system is an **Event Store**. The current state of an object (Aggregate) is obtained by replaying all events that have occurred since its creation in order.

* **Event:** An immutable fact that has occurred in the past. Naming is done in the past tense (*OrderCreated*, *PaymentReceived*).
* **Append-Only Store:** Events are never deleted or updated; they are only added to the end of the list.
* **Point-in-Time Recovery:** By navigating to any timestamp, the exact state of the system at that moment can be simulated.

### 2. Architectural Components and Operational Mechanism

The system should be treated as a flow, not just a data storage method. The key actors in this flow are:

#### Command

The intention of a user or an external system to perform an action (*CreateOrder*). Commands can be rejected; they are validated according to business rules.

#### Aggregate

The area where business rules are applied and state is maintained. It receives the command, checks its current state, and if the operation is valid, generates one or more **Events**.

#### Event Store

The physical storage area where events are recorded atomically and sequentially. A traditional RDBMS (PostgreSQL) can be used, or specialized tools like EventStoreDB can be preferred.

### 3. Technical Implementation: An Example with C# and MediatR

Below is the code-level reflection of the Event Sourcing logic via a bank account.

```csharp
// Basic Event Definition (Immutable)
public record AccountCreated(Guid Id, string Owner, decimal InitialBalance);
public record MoneyDeposited(Guid Id, decimal Amount);
public record MoneyWithdrawn(Guid Id, decimal Amount);

// Aggregate Root
public class BankAccount
{
    public Guid Id { get; private set; }
    public decimal Balance { get; private set; }
    public List<object> Changes { get; } = new();

    // Method used to rebuild state (Replay)
    public void Apply(object @event)
    {
        switch (@event)
        {
            case AccountCreated e:
                Id = e.Id;
                Balance = e.InitialBalance;
                break;
            case MoneyDeposited e:
                Balance += e.Amount;
                break;
            case MoneyWithdrawn e:
                Balance -= e.Amount;
                break;
        }
    }

    // Business rule validation and event generation
    public void Withdraw(decimal amount)
    {
        if (amount > Balance)
            throw new InvalidOperationException("Insufficient balance.");

        var @event = new MoneyWithdrawn(Id, amount);
        Apply(@event);
        Changes.Add(@event);
    }
}

```

### 4. Snapshotting Performance Optimization

For an Aggregate with thousands or even millions of events, replaying from scratch every time creates a significant performance cost. To overcome this, a **Snapshotting** mechanism is used.

At certain intervals (e.g., every 100 events), the current state of the Aggregate is saved as a "snapshot". When the system wants to load the state:

1. It finds and loads the latest snapshot.
2. It fetches events that occurred after the snapshot from the Event Store.
3. It applies only these new events onto the snapshot.

### 5. CQRS (Command Query Responsibility Segregation) Relationship

Event Sourcing is generally used in conjunction with CQRS. While the Event Store forms the "write" (Command) side, the processing (Projection) of these events into optimized tables or NoSQL documents forms the "read" (Query) side.

* **Projections:** When an "OrderCreated" event occurs, this event is captured by a background service and written to ElasticSearch or an SQL table for reporting. This maximizes read performance.

### 6. Disadvantages and Complexity Management

Event Sourcing is not a silver bullet; it brings significant challenges:

* **Event Versioning:** As the application evolves, event schemas may change. "Upcasting" techniques are required to adapt old events to new code.
* **Eventual Consistency:** Because read models (Projections) are updated asynchronously, a user might see stale data immediately after updating.
* **External Systems:** If an event has side effects in the outside world (e.g., sending an SMS), idempotent structures must be established so that these side effects are not triggered again during "replay".

### 7. Popular Libraries and Tools

Using mature libraries instead of building this architecture from scratch is critical for risk management:

* **EventStoreDB:** A database optimized for event sourcing that offers built-in stream support.
* **Marten (.NET):** A powerful library that allows you to use PostgreSQL as a Document Store and Event Store.
* **Axon Framework (Java):** A framework that has become the industry standard for CQRS and Event Sourcing in the Java ecosystem.
* **Lagom (Scala/Java):** A microservices-oriented framework that provides asynchronous event sourcing support.
* **Eventuate:** A platform for distributed data management and event-driven services.

### 8. Data Consistency and Concurrency Control

In Event Sourcing, concurrency control is usually managed with **Optimistic Concurrency**. Every Aggregate has a version number. When an event is being saved, if the expected version number sent does not match the current number in the Event Store, the operation is rejected (WrongExpectedVersionException). This protects data integrity in cases where two different users try to update the balance simultaneously.

### 9. Debugging and Analysis Advantages

When a bug occurs in a system, traditional systems require looking at log files to answer the question "why is this data incorrect?". In Event Sourcing, the sequence of events leading to the erroneous state is exactly at hand. A developer can take the event sequence from the production environment, "replay" it in a local environment, and identify with 100% accuracy at which event and which business rule the error was triggered.

---

**Technical Note:** When implementing Event Sourcing, "Eventual Consistency" must be well understood by business units. If strong consistency is required across all read models in your system, the asynchronous structure introduced by Event Sourcing will impose additional overhead. However, if your priority is audit trails, retrospective analysis, and high write performance, this architecture is one of the most powerful tools in modern software engineering.

**Critical Tip for System Design:** Be "Domain" oriented, not "Technical" when designing events. Instead of `UserTableUpdated`, using `UserEmailChanged` represents business logic and system evolution better.

