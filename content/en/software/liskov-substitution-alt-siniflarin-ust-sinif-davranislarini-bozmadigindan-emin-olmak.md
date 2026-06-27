---
title: "Liskov Substitution: Ensuring Subclasses Do Not Break Superclass Behavior"
date: 2026-03-30
type: "software"
draft: false
math: true
description: "An analysis focusing on the Liskov Substitution Principle (LSP), explaining how to structure subclasses without violating superclass contracts through technical depth, code examples, and architectural solutions."
featured_image: "/images/software/liskov-substitution-alt-siniflarin-ust-sinif-davranislarini-bozmadigindan-emin-olmak.png"
tags: ["software", "oop", "object-oriented-programming", "solid-principles", "code-quality", "lsp"]
---

In software architecture, sustainability and flexibility are measured not just by whether the code works, but by the harmony between its components. The **Liskov Substitution Principle (LSP)**, the third pillar of the SOLID principles popularized by Robert C. Martin, is one of the most critical rules for ensuring the mathematical and logical consistency of inheritance hierarchies in Object-Oriented Programming (OOP).

{{< figure src="/images/software/liskov-substitution-alt-siniflarin-ust-sinif-davranislarini-bozmadigindan-emin-olmak.png" alt="Liskov Substitution: Ensuring Subclasses Do Not Break Superclass Behavior" width="1200" caption="Figure 1: Liskov Substitution: Ensuring Subclasses Do Not Break Superclass Behavior" >}}

---

## 1. What is the Liskov Substitution Principle (LSP)?

Introduced by Barbara Liskov in 1987, this principle is based on the following mathematical definition:

> "If $S$ is a subtype of $T$, then objects of type $T$ may be replaced with objects of type $S$ without altering any of the desirable properties of the program (correctness, task completion, etc.)."

Technically speaking; when an instance of a subclass is used instead of an instance of a superclass, the system's behavior should not be impaired, unexpected exceptions should not be thrown, and logical consistency must be maintained.

---

## 2. Type Safety and Behavioral Compatibility

LSP is not just about signature compatibility (method names and parameter types). The real focus is on **behavioral compatibility**. When a subclass overrides a method of the superclass, it should not violate the "implicit contract" created by that method.

### Contract Violations: Preconditions and Postconditions

The operating principle of a method is based on two main concepts:

* **Preconditions:** Conditions that must be met before the method runs. Subclasses cannot **strengthen** these conditions.
* **Postconditions:** Results guaranteed after the method finishes. Subclasses cannot **weaken** these guarantees.

---

## 3. A Classic Mistake: The Square-Rectangle Problem

The best-known example of an LSP violation appears in a geometric hierarchy. Mathematically, every square is a rectangle; however, in the software world, this inheritance relationship violates LSP.

### Incorrect Design (Python Example)

```python
class Rectangle:
    def __init__(self, width, height):
        self._width = width
        self._height = height

    def set_width(self, width):
        self._width = width

    def set_height(self, height):
        self._height = height

    def get_area(self):
        return self._width * self._height

class Square(Rectangle):
    def set_width(self, width):
        self._width = width
        self._height = width  # Since it's a square, we change the height too

    def set_height(self, height):
        self._height = height
        self._width = height

```

**Why was it violated?**
If a client code expects a `Rectangle` object and assumes that changing the width will keep the height constant, sending it a `Square` object will cause this assumption to collapse. The subclass has changed the behavior of the superclass.

---

## 4. Technical Solution Strategies

To resolve LSP violations, the "Composition over Inheritance" principle or more specific decomposition of interfaces (Interface Segregation) is used.

### Correct Design: Abstraction (C# Example)

```csharp
public abstract class Shape
{
    public abstract double GetArea();
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public override double GetArea() => Width * Height;
}

public class Square : Shape
{
    public double Side { get; set; }

    public override double GetArea() => Side * Side;
}

```

In this design, `Square` does not inherit the behaviors of `Rectangle`; both adhere to a common `Shape` contract. Thus, when a method expects a `Shape`, both classes return the correct area calculation according to their own logic, and the expected behavior of the superclass is not compromised.

---

## 5. LSP Implementations in Software Libraries

Modern software libraries and frameworks are built on LSP. For example:

* **Java Collections Framework:** `ArrayList` and `LinkedList` classes implement the `List` interface. When a method takes a parameter of type `List`, it expects the `add()`, `remove()`, or `get()` methods to exhibit standard behavior, regardless of which actual implementation is behind it.
* **Entity Framework Core (C#):** In queries performed on `DbSet<T>`, LINQ providers remain faithful to the `IQueryable` interface. When a custom provider is written, breaking the basic query logic cripples the entire data access layer.

---

## 6. LSP Violation Indicators (Code Smells)

You may be violating LSP if you see the following situations in your code:

1. **Empty Override Methods:** If a subclass cannot implement a method coming from a superclass and leaves it empty.
2. **NotImplementedException:** If an error is thrown saying "This method is not applicable for this subclass."
3. **Type Checking:** If checks like `if (obj is Square)` are performed in the client code, this indicates that polymorphism has failed and the subclass cannot make itself feel like the superclass.

---

## 7. In-depth Technical Analysis: Covariance and Contravariance

LSP also imposes strict rules on generics and return types.

* **Covariance:** A subclass can return a more specific version of the type returned by the superclass.
* **Contravariance:** A subclass can accept a more general type than the parameter type accepted by the superclass.

These rules ensure that type safety is maintained at runtime. While this is managed via the "Virtual Table" (vtable) mechanism in languages like C++, virtual method tables and runtime control mechanisms come into play in languages like Java and C#.

---

## 8. Advanced Example: File System and Authorization

Let's assume we are designing a file management system.

```python
from abc import ABC, abstractmethod

class File(ABC):
    @abstractmethod
    def write(self, data):
        pass

class ReadWriteFile(File):
    def write(self, data):
        print(f"Writing data: {data}")

class ReadOnlyFile(File):
    def write(self, data):
        # LSP VIOLATION: While the superclass promises a write operation, this class throws an error.
        raise Exception("Cannot write to a read-only file")

```

**Solution:** Moving files with write capability to a separate interface. This way, `ReadOnlyFile` only signs the read contract.

---

## 9. LSP and Unit Testing

The most effective method for testing the accuracy of LSP is the "Base Class Tests" pattern. All test scenarios you write for the superclass must pass (be green) for all subclasses without exception. If a subclass cannot pass the superclass's tests, it means that subclass cannot replace the superclass.

---

## 10. Conclusion and Architectural Recommendation

The Liskov Substitution Principle questions the "is-a" relationship between objects. If the sentence "Every Square is a Rectangle" leads to logical errors in software, this relationship is not "is-a," but perhaps just a "behaves-like" relationship.

**Technical Notes:**

* Prefer composition instead of deepening the inheritance hierarchy.
* Keep your abstractions (Interface/Abstract Class) as narrow (granular) as possible.
* When overriding methods in subclasses, preserve all documented or undocumented (side effects) behaviors of the superclass.

Complying with LSP reduces dependencies in the system and allows you to utilize the true power of polymorphism. In systems that adhere to this principle, adding new features can be performed without the risk of breaking existing code.

