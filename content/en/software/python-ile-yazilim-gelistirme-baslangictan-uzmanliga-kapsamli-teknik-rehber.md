---
title: "Software Development with Python — A Comprehensive Technical Guide from Beginner to Expert"
date: 2026-06-25
type: "software"
draft: false
math: true
description: "A practical roadmap for those who want to learn Python, extending from beginner to expert level, supported by code examples. It offers a broad scope for developers of all levels, covering data science, web development, and artificial intelligence."
featured_image: "/images/software/python-ile-yazilim-gelistirme-baslangictan-uzmanliga-kapsamli-teknik-rehber.png"
tags: ["software", "development", "python", "software-development", "python-development", "python-tutorials", "pandas", "numpy", "programming-language", "coding", "data-science"]
---

Python, published by Guido van Rossum in 1991, has become one of the most widely used programming languages in the world today. It consistently ranks in the top three on the TIOBE index; it is the de facto industry standard in diverse fields such as data science, web development, automation, and artificial intelligence. It is appropriate to start with the syntax that provides this popularity: Python has a readable structure close to English. However, this simplicity does not hide the power underlying the language. Integration with C extensions, support for asynchronous programming, an extensive standard library, and a massive ecosystem—all of these make Python a truly multi-layered language.

{{< figure src="/images/software/python-ile-yazilim-gelistirme-baslangictan-uzmanliga-kapsamli-teknik-rehber.png" alt="Software Development with Python — A Comprehensive Technical Guide from Beginner to Expert" width="1200" caption="Figure 1: Software Development with Python — A Comprehensive Technical Guide from Beginner to Expert" >}}

---

## Section 1 — Setup, Environment, and First Steps

### Python Version Management

You can download Python directly from python.org. However, in professional use, working with multiple Python versions becomes mandatory. The `pyenv` tool is extremely useful for this:

```bash
# pyenv installation (Linux/macOS)
curl https://pyenv.run | bash

# List available Python versions
pyenv install --list

# Install a specific version
pyenv install 3.12.3

# Set global version
pyenv global 3.12.3

# Set project-specific version
pyenv local 3.11.8

```

For Windows users, the `pyenv-win` package serves the same function.

### Virtual Environment Management

Every project should carry its dependencies in an isolated environment. Python's built-in `venv` module is sufficient for this task:

```bash
# Create a virtual environment
python -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Freeze dependencies
pip freeze > requirements.txt

# Reinstall environment
pip install -r requirements.txt

```

For more advanced dependency management, `poetry` or `uv` can be preferred. `uv`, written in Rust, stands out as an extremely fast package manager:

```bash
# uv installation
pip install uv

# Create a new project
uv init myproject
cd myproject

# Add packages
uv add requests pandas

# Run the project
uv run python main.py

```

### IDE Selection

**VS Code** is a common choice due to its lightweight and extensible nature. When the Python extension, Pylance language server, and Jupyter notebook support are used together, a powerful environment is created.

**PyCharm** is a full-featured IDE. It comes integrated with code completion, debugging, refactoring tools, and project management.

**Jupyter Notebook / JupyterLab** is indispensable, especially for data analysis and research-oriented work. Its cell-based execution model is ideal for step-by-step exploration:

```bash
pip install jupyterlab
jupyter lab

```

---

## Section 2 — Basic Syntax and Data Types

### Variables and Dynamic Typing

Python is a dynamically typed language; declaring types for variables is not mandatory. However, type hints introduced since Python 3.5 improve readability and set the stage for static analysis tools:

```python
# Basic assignments
name: str = "Ahmet"
age: int = 28
salary: float = 12500.75
active: bool = True

# Multiple assignment
x, y, z = 10, 20, 30

# Value swap — unlike C/Java, no temporary variable is needed
x, y = y, x

# Constant-like variables (there are no real constants in Python, convention is uppercase)
MAX_CONNECTION: int = 100
PI: float = 3.14159265358979

```

### Numeric Types and Arithmetic

```python
# int — unlimited size
large_number = 10 ** 100  # googol

# float — IEEE 754 double precision
import sys
print(sys.float_info.max)  # 1.7976931348623157e+308

# complex
z = 3 + 4j
print(abs(z))  # 5.0 — Pythagorean theorem

# Division operators
print(7 / 2)   # 3.5  — true division
print(7 // 2)  # 3    — integer division
print(7 % 2)   # 1    — modulo
print(2 ** 10) # 1024 — exponentiation

# Decimal module for decimal precision
from decimal import Decimal, getcontext
getcontext().prec = 50
result = Decimal("1") / Decimal("3")
print(result)  # 0.33333333333333333333333333333333333333333333333333

```

### String Operations

Strings are immutable sequences in Python. They are extremely useful with their rich set of methods and f-string support:

```python
text = "Python Programming"

# Basic operations
print(text.upper())          # PYTHON PROGRAMMING
print(text.lower())          # python programming
print(text.split())          # ['Python', 'Programming']
print(text.replace("P", "p")) # python programming
print(text.strip())          # trim leading/trailing whitespace
print(text.startswith("Py")) # True
print(len(text))             # 18

# Indexing and slicing
print(text[0])     # P
print(text[-1])    # g
print(text[0:6])   # Python
print(text[::2])   # Pto rgamn  (every second character)
print(text[::-1])  # gnimmargorP nohtyP  (reverse)

# f-string (Python 3.6+) — most recommended method
name = "Zeynep"
score = 97.5
print(f"Student: {name}, Score: {score:.2f}")  # Student: Zeynep, Score: 97.50

# Expression inside f-string
print(f"Square: {score ** 2:.0f}")  # Square: 9506

# Multi-line string
sql = """
    SELECT *
    FROM users
    WHERE active = TRUE
    ORDER BY registration_date DESC
"""

```

### Conditional Statements

```python
temperature = 28

if temperature > 35:
    print("Very hot")
elif temperature > 25:
    print("Hot")
elif temperature > 15:
    print("Warm")
else:
    print("Cold")

# Ternary expression (one-line condition)
status = "hot" if temperature > 25 else "cold"

# match-case (Python 3.10+) — switch-like structure
http_code = 404

match http_code:
    case 200:
        message = "Success"
    case 301 | 302:
        message = "Redirect"
    case 404:
        message = "Not Found"
    case 500:
        message = "Server Error"
    case _:
        message = "Unknown"

print(message)

```

### Loops

```python
# for — iterate over an iterable
fruits = ["apple", "pear", "cherry", "grape"]

for fruit in fruits:
    print(fruit)

# enumerate — index and value together
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")

# range
for i in range(1, 11, 2):  # 1 to 10, increment by 2
    print(i)  # 1, 3, 5, 7, 9

# while
counter = 0
while counter < 5:
    print(counter)
    counter += 1

# break and continue
for n in range(20):
    if n % 2 == 0:
        continue   # skip even numbers
    if n > 15:
        break      # stop when greater than 15
    print(n)       # 1, 3, 5, 7, 9, 11, 13, 15

# else block (runs if the loop completes, not if it stops via break)
for n in range(5):
    if n == 10:
        break
else:
    print("Loop finished, break did not run")

```

---

## Section 3 — Data Structures

### Lists

A list is the most fundamental collection type in Python. It can hold heterogeneous data and is mutable:

```python
# Create a list
numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
mixed = [42, "Python", 3.14, True, None]

# Basic methods
numbers.append(7)          # add to end
numbers.insert(0, 0)       # add at specific index
numbers.remove(1)          # remove first 1
popped = numbers.pop()     # remove and return last element
numbers.sort()             # sort (in-place)
sorted_list = sorted(numbers)   # return new sorted list
numbers.reverse()          # reverse
print(numbers.count(5))    # count occurrences of 5
print(numbers.index(9))    # index of 9

# Slicing
first_three = numbers[:3]
last_three = numbers[-3:]
reversed_list = numbers[::-1]

# List concatenation
a = [1, 2, 3]
b = [4, 5, 6]
c = a + b            # new list
a.extend(b)          # add b to a

# Copying — be careful!
copy_wrong = numbers       # reference copy (points to same object)
copy_right = numbers.copy() # shallow copy
deep_copy_slice = numbers[:]     # slice copy

import copy
deep = copy.deepcopy(mixed)  # deep copy for nested objects

```

### Tuples

Tuples are immutable. Immutability provides advantages in scenarios requiring data integrity and when used as dictionary keys:

```python
coordinate = (41.0082, 28.9784)  # Istanbul coordinates
rgb = (255, 128, 0)

# Tuple created without parentheses
point = 10, 20

# Single element tuple — comma is mandatory
single = (42,)

# Unpacking
latitude, longitude = coordinate
r, g, b = rgb

# Extended unpacking (Python 3+)
first, *middle, last = [1, 2, 3, 4, 5]
print(first)   # 1
print(middle)  # [2, 3, 4]
print(last)    # 5

# namedtuple — increases readability
from collections import namedtuple

Point = namedtuple("Point", ["x", "y", "z"])
p = Point(1, 2, 3)
print(p.x, p.y, p.z)   # 1 2 3
print(p._asdict())       # {'x': 1, 'y': 2, 'z': 3}

# More modern alternative with dataclass (Python 3.7+)
from dataclasses import dataclass

@dataclass(frozen=True)  # frozen=True makes it immutable
class Coordinate:
    latitude: float
    longitude: float
    altitude: float = 0.0

ist = Coordinate(41.0082, 28.9784, 50)
print(ist)

```

### Dictionaries

Since Python 3.7, dictionaries preserve insertion order. Built on hash tables, searching has O(1) complexity:

```python
# Create dictionary
person = {
    "name": "Mehmet",
    "age": 32,
    "city": "Istanbul",
    "skills": ["Python", "SQL", "Docker"]
}

# Access
print(person["name"])                     # KeyError risk exists
print(person.get("email", "Not Found"))       # safe access, default value

# Update
person["email"] = "mehmet@example.com"
person.update({"tel": "0555...", "age": 33})

# Delete
del person["tel"]
removed = person.pop("email", None)   # returns None if key missing

# Iteration
for key in person:
    print(key)

for value in person.values():
    print(value)

for key, value in person.items():
    print(f"{key}: {value}")

# dict comprehension
squares = {n: n**2 for n in range(1, 11)}
# {1: 1, 2: 4, 3: 9, ...}

# Nested dictionaries
database = {
    "user1": {"name": "Ali", "role": "admin"},
    "user2": {"name": "Veli", "role": "user"},
}

# defaultdict — produces default value for missing keys
from collections import defaultdict

word_count = defaultdict(int)
text = "python java python c++ python java"
for word in text.split():
    word_count[word] += 1

print(dict(word_count))
# {'python': 3, 'java': 2, 'c++': 1}

# Counter — for frequency analysis
from collections import Counter
counter = Counter(text.split())
print(counter.most_common(2))  # [('python', 3), ('java', 2)]

```

### Sets

A set is a structure consisting of unique elements and supporting mathematical set operations:

```python
a = {1, 2, 3, 4, 5}
b = {3, 4, 5, 6, 7}

print(a | b)    # union: {1, 2, 3, 4, 5, 6, 7}
print(a & b)    # intersection: {3, 4, 5}
print(a - b)    # difference: {1, 2}
print(a ^ b)    # symmetric difference: {1, 2, 6, 7}
print(a <= b)   # is a a subset of b?

# Clean repeating elements
list_data = [1, 2, 2, 3, 3, 3, 4]
unique = list(set(list_data))

# frozenset — immutable set, can be a dictionary key
fs = frozenset([1, 2, 3])
dictionary = {fs: "fixed set"}

```

---

## Section 4 — Functions and Modularity

### Function Definition

```python
def add(a: int, b: int) -> int:
    """Returns the sum of two numbers."""
    return a + b

# Default parameter values
def greet(name: str, lang: str = "en") -> str:
    messages = {
        "tr": f"Merhaba, {name}!",
        "en": f"Hello, {name}!",
        "de": f"Hallo, {name}!"
    }
    return messages.get(lang, messages["en"])

# *args — variable number of positional arguments
def average(*numbers: float) -> float:
    if not numbers:
        return 0.0
    return sum(numbers) / len(numbers)

print(average(10, 20, 30, 40))  # 25.0

# **kwargs — variable number of keyword arguments
def create_profile(name: str, **info) -> dict:
    return {"name": name, **info}

profile = create_profile("Fatma", age=25, city="Ankara", profession="Engineer")

# Returning multiple values (actually returns a tuple)
def min_max(numbers: list) -> tuple[float, float]:
    return min(numbers), max(numbers)

small, big = min_max([3, 1, 4, 1, 5, 9, 2, 6])

```

### Scope

Python uses the LEGB rule: Local → Enclosing → Global → Built-in

```python
x = "global"

def outer_function():
    x = "enclosing"

    def inner_function():
        nonlocal x       # modify x in enclosing scope
        x = "local"
        print(x)         # local

    inner_function()
    print(x)             # local (nonlocal affected it)

def change_global():
    global x
    x = "changed"

outer_function()
change_global()
print(x)                 # changed

```

### Lambda Functions

```python
# One-line anonymous function
square = lambda x: x ** 2
add = lambda a, b: a + b

# Use as function argument
numbers = [5, 2, 8, 1, 9, 3]
sorted_list = sorted(numbers, key=lambda x: -x)  # descending order

# Dictionary sorting
people = [
    {"name": "Ahmet", "age": 30},
    {"name": "Fatma", "age": 25},
    {"name": "Mehmet", "age": 35}
]
by_age = sorted(people, key=lambda p: p["age"])

# map, filter, reduce
squares = list(map(lambda x: x**2, range(1, 6)))
# [1, 4, 9, 16, 25]

evens = list(filter(lambda x: x % 2 == 0, range(10)))
# [0, 2, 4, 6, 8]

from functools import reduce
product = reduce(lambda x, y: x * y, range(1, 6))
# 120 — factorial

```

### Modules and Packages

```python
# Standard library examples

import math
print(math.sqrt(144))     # 12.0
print(math.pi)            # 3.141592653589793
print(math.log(1000, 10)) # 3.0
print(math.factorial(10)) # 3628800

import random
random.seed(42)            # for reproducible results
print(random.randint(1, 100))
print(random.choice(["apple", "pear", "cherry"]))
random.shuffle(my_list := [1, 2, 3, 4, 5])

from datetime import datetime, timedelta, date

now = datetime.now()
print(now.strftime("%d.%m.%Y %H:%M:%S"))

a_week_later = now + timedelta(weeks=1)
birthday = date(1990, 5, 15)
today = date.today()
age = (today - birthday).days // 365

import os
import pathlib

# Working directory
print(os.getcwd())

# Path operations — pathlib is the recommended method
p = pathlib.Path.home() / "Documents" / "project"
p.mkdir(parents=True, exist_ok=True)

# List files
for file in pathlib.Path(".").glob("**/*.py"):
    print(file)

```

---

## Section 5 — Advanced Topics

### Error Handling

```python
# Basic structure
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Division by zero error: {e}")
except (TypeError, ValueError) as e:
    print(f"Type or value error: {e}")
except Exception as e:
    print(f"Unexpected error: {type(e).__name__}: {e}")
else:
    print("No error, result:", result)
finally:
    print("This always runs — cleanup operations")

# Custom exception class
class DataValidationError(ValueError):
    def __init__(self, field: str, value, message: str = ""):
        self.field = field
        self.value = value
        super().__init__(message or f"Invalid value for {field}: {value}")

def validate_age(age: int) -> None:
    if not isinstance(age, int):
        raise DataValidationError("age", age, "Age must be an integer")
    if age < 0 or age > 150:
        raise DataValidationError("age", age, "Age must be between 0-150")

try:
    validate_age(-5)
except DataValidationError as e:
    print(f"[{e.field}] {e}")

# Resource management with context manager
class ManageConnection:
    def __enter__(self):
        print("Connection opened")
        return self

    def __exit__(self, type, value, traceback):
        print("Connection closed")
        return False  # If True, exception is suppressed

with ManageConnection() as connection:
    print("Processing...")

```

### File Operations

```python
# Writing to a text file
with open("data.txt", "w", encoding="utf-8") as f:
    f.write("First line\n")
    f.writelines(["Second line\n", "Third line\n"])

# Reading
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()            # read all
    f.seek(0)
    lines = f.readlines()         # lines as a list
    f.seek(0)
    for line in f:              # iterate line by line (for large files)
        print(line.strip())

# Append mode
with open("log.txt", "a", encoding="utf-8") as f:
    from datetime import datetime
    f.write(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] System started\n")

# JSON operations
import json

data = {
    "users": [
        {"id": 1, "name": "Ali", "role": "admin"},
        {"id": 2, "name": "Veli", "role": "user"}
    ]
}

# Writing
with open("users.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Reading
with open("users.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)

# CSV operations
import csv

headers = ["name", "surname", "email", "age"]
rows = [
    ["Ali", "Kaya", "ali@example.com", 30],
    ["Fatma", "Demir", "fatma@example.com", 25]
]

with open("people.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)

with open("people.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["email"])

```

### List Comprehensions and Generator Expressions

```python
# List comprehension
squares = [x**2 for x in range(1, 11)]
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# Comprehension with filter
even_squares = [x**2 for x in range(1, 11) if x % 2 == 0]
# [4, 16, 36, 64, 100]

# Nested comprehension
matrix = [[i * j for j in range(1, 5)] for i in range(1, 5)]

# Dict comprehension
word_lengths = {word: len(word) for word in ["python", "java", "rust", "go"]}
# {'python': 6, 'java': 4, 'rust': 4, 'go': 2}

# Set comprehension
unique_lengths = {len(w) for w in ["ali", "veli", "ay", "is"]}
# {2, 3, 4}

# Generator expression — does not load into memory, produces on demand
total = sum(x**2 for x in range(1, 1000001))  # keeps only one number in memory

```

### Iterator and Generator

```python
# Manual iterator
class Counter:
    def __init__(self, start: int, end: int):
        self.current = start
        self.end = end

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.end:
            raise StopIteration
        value = self.current
        self.current += 1
        return value

for n in Counter(1, 6):
    print(n)  # 1 2 3 4 5

# Generator function
def fibonacci(n: int):
    """Produces n Fibonacci numbers."""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for number in fibonacci(10):
    print(number, end=" ")
# 0 1 1 2 3 5 8 13 21 34

# Infinite generator
def infinite_sequence(start: int = 0, step: int = 1):
    n = start
    while True:
        yield n
        n += step

# Use with itertools
import itertools

gen = infinite_sequence(0, 5)
first_10 = list(itertools.islice(gen, 10))
# [0, 5, 10, 15, 20, 25, 30, 35, 40, 45]

# itertools library
import itertools

# Permutation and combination
print(list(itertools.permutations([1, 2, 3], 2)))
print(list(itertools.combinations([1, 2, 3, 4], 2)))

# Grouping
data = [
    ("A", 1), ("A", 2), ("B", 3), ("B", 4), ("C", 5)
]
data.sort(key=lambda x: x[0])
for group, elements in itertools.groupby(data, key=lambda x: x[0]):
    print(group, list(elements))

```

### Decorators

```python
import functools
import time

# Basic decorator
def timer(function):
    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = function(*args, **kwargs)
        end = time.perf_counter()
        print(f"{function.__name__} — {end - start:.4f}s")
        return result
    return wrapper

@timer
def heavy_computation(n: int) -> int:
    return sum(i**2 for i in range(n))

result = heavy_computation(1000000)

# Decorator with parameters
def retry(max_retries: int = 3, wait: float = 1.0):
    def decorator(function):
        @functools.wraps(function)
        def wrapper(*args, **kwargs):
            errors = []
            for attempt in range(max_retries):
                try:
                    return function(*args, **kwargs)
                except Exception as e:
                    errors.append(e)
                    if attempt < max_retries - 1:
                        time.sleep(wait)
            raise Exception(f"{max_retries} attempts failed: {errors[-1]}")
        return wrapper
    return decorator

@retry(max_retries=3, wait=0.5)
def api_call(url: str) -> dict:
    import urllib.request
    with urllib.request.urlopen(url) as resp:
        return json.loads(resp.read())

# Memoization (caching)
@functools.lru_cache(maxsize=128)
def fib_recursive(n: int) -> int:
    if n < 2:
        return n
    return fib_recursive(n - 1) + fib_recursive(n - 2)

print(fib_recursive(50))  # Would be very slow without cache
print(fib_recursive.cache_info())  # CacheInfo(hits=48, misses=51, ...)

```

---

## Section 6 — Object Oriented Programming

### Classes and Objects

```python
from dataclasses import dataclass, field
from typing import ClassVar

class BankAccount:
    """Simple bank account implementation."""

    # Class variable — shared by all instances
    interest_rate: ClassVar[float] = 0.03

    def __init__(self, owner: str, iban: str, balance: float = 0.0):
        self._owner = owner          # "protected" (convention)
        self.__iban = iban           # "private" (name mangling)
        self._balance = balance
        self._transaction_history: list = []

    # Property — controlled access
    @property
    def balance(self) -> float:
        return self._balance

    @property
    def owner(self) -> str:
        return self._owner

    # Methods
    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Amount to deposit must be positive")
        self._balance += amount
        self._transaction_history.append(f"Deposit: +{amount:.2f} TL")

    def withdraw(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Amount to withdraw must be positive")
        if amount > self._balance:
            raise ValueError("Insufficient balance")
        self._balance -= amount
        self._transaction_history.append(f"Withdraw: -{amount:.2f} TL")

    def apply_interest(self) -> None:
        interest = self._balance * self.interest_rate
        self._balance += interest
        self._transaction_history.append(f"Interest: +{interest:.2f} TL")

    # Dunder (magic) methods
    def __str__(self) -> str:
        return f"BankAccount({self._owner}, {self._balance:.2f} TL)"

    def __repr__(self) -> str:
        return f"BankAccount(owner={self._owner!r}, balance={self._balance})"

    def __len__(self) -> int:
        return len(self._transaction_history)

    @classmethod
    def update_interest(cls, new_rate: float) -> None:
        cls.interest_rate = new_rate

    @staticmethod
    def validate_iban(iban: str) -> bool:
        return iban.startswith("TR") and len(iban) == 26


account = BankAccount("Ahmet Yılmaz", "TR123456789012345678901234")
account.deposit(10000)
account.apply_interest()
print(account)               # BankAccount(Ahmet Yılmaz, 10300.00 TL)
print(len(account))          # 2

```

### Inheritance

```python
class Animal:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def make_sound(self) -> str:
        raise NotImplementedError("Subclass must implement")

    def info(self) -> str:
        return f"{self.name} ({self.age} years old)"

class Dog(Animal):
    def __init__(self, name: str, age: int, breed: str):
        super().__init__(name, age)    # call superclass __init__
        self.breed = breed

    def make_sound(self) -> str:
        return "Woof!"

    def info(self) -> str:
        return f"{super().info()} — {self.breed}"

class Cat(Animal):
    def make_sound(self) -> str:
        return "Meow!"

# Polymorphism
animals: list[Animal] = [
    Dog("Karabaş", 3, "Kangal"),
    Cat("Pamuk", 5),
    Dog("Fındık", 2, "Golden Retriever")
]

for animal in animals:
    print(f"{animal.info()} → {animal.make_sound()}")

# isinstance and issubclass
print(isinstance(animals[0], Animal))  # True
print(isinstance(animals[0], Dog))   # True
print(issubclass(Dog, Animal))         # True

```

### Abstract Classes and Interfaces

```python
from abc import ABC, abstractmethod
from typing import Protocol

# Abstract class with ABC
class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        ...

    @abstractmethod
    def perimeter(self) -> float:
        ...

    def describe(self) -> str:
        return f"{type(self).__name__}: Area={self.area():.2f}, Perimeter={self.perimeter():.2f}"

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        import math
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        import math
        return 2 * math.pi * self.radius

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)

shapes = [Circle(5), Rectangle(4, 6)]
for shape in shapes:
    print(shape.describe())

# Protocol (structural subtyping — Python 3.8+)
class Writable(Protocol):
    def write(self, data: str) -> None: ...

def save(target: Writable, content: str) -> None:
    target.write(content)

```

---

## Section 7 — Fields of Specialization

### Data Science and Analysis

NumPy offers high-performance mathematical operation capability on multidimensional arrays. Pandas works on tables (DataFrame) for structured data analysis:

```python
import numpy as np
import pandas as pd

# NumPy — vectorized operations
array = np.array([1, 2, 3, 4, 5], dtype=np.float64)
print(array * 2)         # [2. 4. 6. 8. 10.]
print(np.sum(array))     # 15.0
print(np.mean(array))    # 3.0
print(np.std(array))     # 1.4142...

# Matrix operations
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(A @ B)            # matrix multiplication
print(np.linalg.det(A)) # determinant
print(np.linalg.inv(A)) # inverse matrix

# Random number generation
rng = np.random.default_rng(seed=42)
normal_dist = rng.normal(loc=0, scale=1, size=(1000,))
print(f"Mean: {normal_dist.mean():.4f}")
print(f"Std: {normal_dist.std():.4f}")

# Pandas — data analysis
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    "age": rng.integers(18, 65, n),
    "salary": rng.normal(15000, 5000, n).round(2),
    "department": rng.choice(["Software", "Marketing", "Finance", "HR"], n),
    "performance": rng.choice(["Low", "Medium", "High"], n, p=[0.2, 0.5, 0.3])
})

# Basic statistics
print(df.describe())

# Grouping and aggregation
summary = df.groupby("department").agg(
    avg_salary=("salary", "mean"),
    median_age=("age", "median"),
    employee_count=("salary", "count")
).round(2)

print(summary.sort_values("avg_salary", ascending=False))

# Filtering and query
high_salary = df.query("salary > 20000 and performance == 'High'")
print(f"High salary, high performance: {len(high_salary)}")

# pivot table
pivot = df.pivot_table(
    values="salary",
    index="department",
    columns="performance",
    aggfunc="mean"
).round(0)

print(pivot)

```

### Web Development — FastAPI

While Flask and Django are popular frameworks, FastAPI is a strong alternative that combines modern Python typing with automatic API documentation:

```python
# pip install fastapi uvicorn pydantic
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import uvicorn

app = FastAPI(title="User API", version="1.0.0")

# Pydantic model — data validation
class CreateUser(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: str = Field(..., pattern=r"^[^@]+@[^@]+\.[^@]+$")
    age: Optional[int] = Field(None, ge=18, le=120)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

# Simple in-memory database
users_db: dict[int, dict] = {}
counter = 0

@app.get("/")
async def root():
    return {"message": "API is running", "version": "1.0.0"}

@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: CreateUser):
    global counter
    counter += 1
    new = {"id": counter, **user.model_dump()}
    users_db[counter] = new
    return new

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

@app.get("/users", response_model=list[UserResponse])
async def list_users(skip: int = 0, limit: int = 10):
    listing = list(users_db.values())
    return listing[skip: skip + limit]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

```

### Machine Learning — Scikit-learn

```python
# pip install scikit-learn pandas numpy matplotlib
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
import pandas as pd

# Create sample dataset
rng = np.random.default_rng(42)
n = 500

X = pd.DataFrame({
    "age": rng.integers(18, 65, n),
    "salary": rng.normal(15000, 5000, n),
    "experience": rng.integers(0, 30, n),
    "education": rng.integers(1, 5, n)
})
y = (X["salary"] > 18000).astype(int)  # high salary class

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Pipeline — preprocessing + model
pipeline = Pipeline([
    ("scaling", StandardScaler()),
    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
])

pipeline.fit(X_train, y_train)

# Evaluation
y_pred = pipeline.predict(X_test)
print(classification_report(y_test, y_pred, target_names=["Low", "High"]))

# Cross-validation
cv_scores = cross_val_score(pipeline, X, y, cv=5, scoring="f1")
print(f"CV F1 score: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

# Hyperparameter optimization
param_grid = {
    "classifier__n_estimators": [50, 100, 200],
    "classifier__max_depth": [None, 5, 10],
    "classifier__min_samples_split": [2, 5]
}

grid_search = GridSearchCV(
    pipeline, param_grid, cv=3, scoring="f1", n_jobs=-1
)
grid_search.fit(X_train, y_train)
print("Best parameters:", grid_search.best_params_)

```

### Automation and Web Scraping

```python
# pip install requests beautifulsoup4 lxml
import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin, urlparse

class WebScraper:
    def __init__(self, base_url: str, wait: float = 1.0):
        self.base_url = base_url
        self.wait = wait
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Educational Scraper)"
        })

    def get_page(self, url: str) -> BeautifulSoup | None:
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.text, "lxml")
        except requests.RequestException as e:
            print(f"Error [{url}]: {e}")
            return None

    def get_headings(self, url: str) -> list[dict]:
        soup = self.get_page(url)
        if not soup:
            return []

        results = []
        for h in soup.find_all(["h1", "h2", "h3"]):
            results.append({
                "tag": h.name,
                "text": h.get_text(strip=True)
            })
        time.sleep(self.wait)  # respect the server
        return results

# Dynamic content with Selenium
# pip install selenium webdriver-manager
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_dynamic_content(url: str) -> str:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=options)
    try:
        driver.get(url)
        wait = WebDriverWait(driver, 10)
        # Wait for a specific element to load
        element = wait.until(
            EC.presence_of_element_located((By.ID, "content"))
        )
        return element.text
    finally:
        driver.quit()

```

### Asynchronous Programming

```python
import asyncio
import aiohttp
import aiofiles
from typing import AsyncGenerator

async def download_url(session: aiohttp.ClientSession, url: str) -> dict:
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
            content = await response.text()
            return {"url": url, "status": response.status, "size": len(content)}
    except Exception as e:
        return {"url": url, "error": str(e)}

async def download_multiple(url_list: list[str]) -> list[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [download_url(session, url) for url in url_list]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [s for s in results if isinstance(s, dict)]

# Async generator
async def data_stream(n: int) -> AsyncGenerator[int, None]:
    for i in range(n):
        await asyncio.sleep(0.1)  # I/O simulation
        yield i * 2

async def main():
    # Consume async generator
    async for value in data_stream(5):
        print(value)

    # Async context manager
    async with aiofiles.open("async_log.txt", "w") as f:
        await f.write("Async write successful\n")

asyncio.run(main())

```

---

## Section 8 — Production Environment and Best Practices

### Type System and Static Analysis

Python's type hint system makes it easier to catch errors in large codebases. Static analysis can be done with `mypy`:

```python
from typing import TypeVar, Generic, Callable, Any
from collections.abc import Sequence

T = TypeVar("T")
U = TypeVar("U")

# Generic class
class Stack(Generic[T]):
    def __init__(self) -> None:
        self._data: list[T] = []

    def push(self, value: T) -> None:
        self._data.append(value)

    def pop(self) -> T:
        if not self._data:
            raise IndexError("Stack is empty")
        return self._data.pop()

    def __len__(self) -> int:
        return len(self._data)

    def __bool__(self) -> bool:
        return bool(self._data)

# Callable type
def apply(function: Callable[[T], U], sequence: Sequence[T]) -> list[U]:
    return [function(element) for element in sequence]

# TypedDict
from typing import TypedDict

class UserDict(TypedDict):
    id: int
    name: str
    email: str
    active: bool

```

```bash
# mypy installation and usage
pip install mypy
mypy --strict main.py

# ruff — fast linter and formatter (written in Rust)
pip install ruff
ruff check .
ruff format .

```

### Writing Tests

```python
# Test with pytest
# pip install pytest pytest-cov

import pytest
from unittest.mock import patch, MagicMock

class TestBankAccount:
    def test_deposit(self):
        account = BankAccount("Test", "TR12345678901234567890123456")
        account.deposit(1000)
        assert account.balance == 1000.0

    def test_negative_deposit_raises_error(self):
        account = BankAccount("Test", "TR12345678901234567890123456")
        with pytest.raises(ValueError, match="positive"):
            account.deposit(-100)

    def test_insufficient_balance_error(self):
        account = BankAccount("Test", "TR12345678901234567890123456", 500)
        with pytest.raises(ValueError, match="Insufficient"):
            account.withdraw(1000)

    @pytest.mark.parametrize("amount,expected", [
        (100, 100.0),
        (0.01, 0.01),
        (1_000_000, 1_000_000.0)
    ])
    def test_various_amounts(self, amount: float, expected: float):
        account = BankAccount("Test", "TR12345678901234567890123456")
        account.deposit(amount)
        assert abs(account.balance - expected) < 1e-9

# Managing external dependencies with Mock
def test_api_call_retries_when_failed():
    with patch("requests.get") as mock_get:
        mock_get.side_effect = [
            ConnectionError("Connection error"),
            ConnectionError("Connection error"),
            MagicMock(status_code=200, json=lambda: {"data": "ok"})
        ]
        # Expected to succeed on 3rd attempt
        # ...test code...

```

```bash
# Run tests
pytest -v
pytest --cov=. --cov-report=html  # coverage report

```

### Logging

```python
import logging
import logging.handlers
from pathlib import Path

def setup_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Console handler
    console = logging.StreamHandler()
    console.setLevel(logging.WARNING)

    # File handler (rotating files)
    log_file = Path("logs") / f"{name}.log"
    log_file.parent.mkdir(exist_ok=True)
    file = logging.handlers.RotatingFileHandler(
        log_file, maxBytes=10_000_000, backupCount=5, encoding="utf-8"
    )
    file.setLevel(logging.DEBUG)

    # Format
    format_str = "%(asctime)s | %(name)s | %(levelname)s | %(funcName)s:%(lineno)d | %(message)s"
    formatter = logging.Formatter(format_str, datefmt="%Y-%m-%d %H:%M:%S")
    console.setFormatter(formatter)
    file.setFormatter(formatter)

    logger.addHandler(console)
    logger.addHandler(file)
    return logger

logger = setup_logger("application")
logger.debug("Debugging message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical error")

```

---

## Notes and Additional Resources

> **Note 1:** Always choose the latest stable version when selecting a Python version. Python 2 officially reached its end of life in 2020 and should be removed from active use.

> **Note 2:** Always use packages installed with `pip install` within a virtual environment. Installing packages directly to the system Python leads to dependency conflicts.

> **Note 3:** Use the `logging` module instead of `print()` for production code. Log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL) and rotating file handlers increase traceability in large applications.

> **Note 4:** Type hints are not mandatory but are extremely valuable in team work and large codebases. Static analysis with `mypy --strict` catches a significant portion of runtime errors in advance.

> **Note 5:** Generators and lazy evaluation dramatically reduce memory consumption when working with large datasets. Processing a multi-million row CSV file line by line is much more efficient than loading the entire file into memory.

### Useful Libraries and Tools

**Basic Development Tools:**

* `ruff` — Fast Python linter and formatter
* `mypy` — Static type checker
* `pytest` — Test framework
* `poetry` or `uv` — Dependency management
* `pre-commit` — Pre-commit automated checks

**Data Science:**

* `numpy` — Numerical computing
* `pandas` — Data analysis and manipulation
* `matplotlib` / `seaborn` / `plotly` — Visualization
* `scipy` — Scientific computing

**Web Development:**

* `fastapi` — Modern asynchronous API framework
* `django` — Full-featured web framework
* `flask` — Lightweight micro-framework
* `sqlalchemy` — ORM and database tools
* `alembic` — Database migration tool

**Machine Learning:**

* `scikit-learn` — Classic ML algorithms
* `xgboost` / `lightgbm` — Gradient boosting
* `tensorflow` / `pytorch` — Deep learning
* `huggingface transformers` — NLP models

**Automation:**

* `selenium` / `playwright` — Browser automation
* `beautifulsoup4` / `scrapy` — Web scraping
* `celery` — Distributed task queue
* `apscheduler` — Scheduler

**Official Resources:**

* docs.python.org — Official Python documentation
* pypi.org — Package index
* peps.python.org — Python Enhancement Proposals
* realpython.com — Applied tutorial content