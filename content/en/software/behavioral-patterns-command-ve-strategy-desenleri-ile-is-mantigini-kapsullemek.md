---
title: "Behavioral Patterns: Encapsulating Business Logic with Command and Strategy Patterns"
date: 2026-03-03
type: "software"
draft: false
math: true
description: "A technical examination of encapsulating business logic to ensure flexibility and sustainability in software architecture, focusing on the Command pattern for objectifying requests and the Strategy pattern for dynamic algorithm switching."
featured_image: "/images/software/behavioral-patterns-command-ve-strategy-desenleri-ile-is-mantigini-kapsullemek.png"
tags: ["software", "software-engineering", "software-performance", "design-patterns", "command-pattern", "strategy-pattern", "clean-code", "encapsulation"]
---

Sustainability and flexibility in software architecture are directly related to how business logic is organized. Decoupling decision mechanisms from execution mechanisms in complex systems prevents code from evolving into a "spaghetti" structure. In this context, the **Command** and **Strategy** patterns, defined by the Gang of Four (GoF), are the most powerful tools among behavioral patterns for encapsulating business logic.

{{< figure src="/images/software/behavioral-patterns-command-ve-strategy-desenleri-ile-is-mantigini-kapsullemek.png" alt="Behavioral Patterns: Encapsulating Business Logic with Command and Strategy Patterns" width="1200" caption="Figure 1: Behavioral Patterns: Encapsulating Business Logic with Command and Strategy Patterns." >}}

---

## 1. Architectural Role of Behavioral Patterns

In object-oriented programming (OOP), communication between objects and the distribution of responsibilities are of critical importance. Behavioral patterns standardize how objects interact with each other and how responsibilities are shared. Encapsulating business logic means making an algorithm or a request independent of the structure that calls it.

---

## 2. Command Pattern: Objectification of Requests

The Command pattern turns a request into a standalone object. This transformation enables the storage of parameters, queuing of operations, logging, and undo/redo functionality.

### 2.1. Components

* **Command (Interface):** Defines the `execute()` method that will trigger the operation.
* **ConcreteCommand:** Establishes the link between the Receiver object and the action.
* **Receiver:** The object containing the actual business logic.
* **Invoker:** The triggering structure that knows when to execute the command.

### 2.2. Technical Implementation (C# Example)

```csharp
// Receiver: The class that performs the actual operation
public class TextEditor {
    public void InsertText(string text) => Console.WriteLine($"Text inserted: {text}");
    public void DeleteText() => Console.WriteLine("Last character deleted.");
}

// Command Interface
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

// Invoker: Can maintain command history
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

**Note:** The Command pattern is used in a wide range of applications, from GUI buttons to transaction management. It serves as a foundation for tracking commands, especially in "Saga Pattern" implementations within microservice architectures.

---

## 3. Strategy Pattern: Dynamic Change of Algorithms

The Strategy pattern defines a family of algorithms that perform a specific task, encapsulates each one, and makes them interchangeable. This pattern allows the client to choose which strategy to use at runtime.

### 3.1. When to Use?

* If a class contains numerous `if-else` or `switch-case` blocks for algorithm selection.
* If there are different variations of the same task (e.g., different payment methods, different compression formats).

### 3.2. Technical Implementation (Java Example)

```java
// Strategy Interface
interface PaymentStrategy {
    void pay(int amount);
}

// Concrete Strategy A: Credit Card
class CreditCardPayment implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println(amount + " TL paid via credit card.");
    }
}

// Concrete Strategy B: Bitcoin
class CryptoPayment implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println(amount + " TL paid via crypto assets.");
    }
}

// Context: The structure using the strategy
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

## 4. Nuances Between Command and Strategy

Although both patterns use the principle of encapsulation, their usage purposes differ structurally:

| Feature | Command Pattern | Strategy Pattern |
| --- | --- | --- |
| **Main Goal** | To turn a request/action into an object. | To change how an algorithm is performed. |
| **Focus** | "What" will be done. | "How" it will be done. |
| **Timing** | Operations can be queued or delayed. | Usually, the most suitable method for the current operation is chosen. |
| **Relationship** | Provides decoupling between Invoker and Receiver. | Establishes a polymorphic link between Context and Algorithm. |

---

## 5. Advanced Techniques and Library Integrations

### 5.1. MediatR and Command Pattern (.NET)

In modern .NET applications, the Command pattern is usually implemented with the **MediatR** library. This structure provides In-Process Messaging, allowing Controller classes to be completely cleared of business logic (CQRS - Command Query Responsibility Segregation).

```csharp
public record CreateUserCommand(string Name) : IRequest<int>;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, int> {
    public async Task<int> Handle(CreateUserCommand request, CancellationToken ct) {
        // DB operations are encapsulated here
        return await Task.FromResult(1); 
    }
}

```

### 5.2. Functional Strategy Pattern (Modern Java/C#)

With the advent of lambda expressions, functional interfaces are used instead of creating separate classes for simple strategies. This reduces boilerplate code.

---

## 6. Advantages of Encapsulating Business Logic

1. **Open/Closed Principle (OCP):** There is no need to modify existing code when adding a new command or strategy to the system. Simply adding a new class is sufficient.
2. **Single Responsibility Principle (SRP):** Each class does only its own job. The `Invoker` handles triggering, the `Command` handles routing, and the `Receiver` handles execution.
3. **Testability:** Since business logic is divided into small pieces, writing Unit Tests becomes easier. Dependencies can be easily simulated with mock objects.

---

## 7. Implementation Notes and Best Practices

* **State Management:** Command objects should store the state information required to undo the operation internally. However, the size of this history should be limited to prevent memory leaks.
* **Generic Interfaces:** Designing interfaces generically in the Strategy pattern allows algorithms working with different data types to be derived from a single template.
* **Dependency Injection:** Both patterns integrate perfectly with DI (Dependency Injection) containers. They can be combined with `Factory` patterns for strategy changes at runtime.

## Conclusion

Command and Strategy patterns are the most effective solutions against the problems of rigidity and fragility encountered during the evolution of software. While Command enables actions to circulate freely within the system by turning them into data packets, Strategy prevents the code from being buried under piles of if-else statements by keeping algorithmic variability under control. The correct combination of these two patterns opens the door to a high-quality, sustainable architecture that minimizes technical debt.

