---
title: "Nur-o-link: Remote-Controlled Robotic Arm and Vehicle System"
date: 2026-05-14
type: "blog"
draft: false
description: "The Nur-o-link project is an innovative robotics study that combines remote-controllable robotic arm and autonomous vehicle features, highlighting the interaction between hardware and software."
featured_image: "/images/blog/github-proje-4-nur-o-link.png"
tags: ["blog", "robotic", "robotic-arm", "robotik", "iot", "embedded", "cplusplus", "arduino","esp32","remote-control","software-hardware","rex-8in1-v2","electronic"]
---

In the world of robotics, control and mobility are the two most critical factors that determine the functionality of systems. The **Nur-o-link** project offers a flexible and versatile robotic platform by combining both a precise robotic arm mechanism and a remote-controllable vehicle system.

{{< figure src="/images/blog/github-proje-4-nur-o-link.png" alt="Nur-o-link: Remote-Controlled Robotic Arm and Vehicle System" width="1200" caption="Figure 1: Nur-o-link: Remote-Controlled Robotic Arm and Vehicle System." >}}

## 1. Architectural Approach: Hybrid Robotic Design

Nur-o-link is not just a tool, but a manipulator system capable of performing tasks in the physical world. The project successfully integrates the vehicle's mobility with the gripping and carrying capabilities of a robotic arm on the same embedded system.

### Key Components of the System

* **Mobile Platform:** Vehicle body with autonomous or manual driving capabilities, directed by remote commands.
* **Robotic Arm:** A mechanical arm with multi-axis movement capability, used for precise positioning and object handling.
* **Control Center:** The central processing unit that processes remote signals to manage both the vehicle and the arm in a synchronized manner.

## 2. Technological Infrastructure

The system has been developed considering real-time response times and hardware control requirements:

* **Microcontroller:** Arduino-based control units capable of managing multiple motor drivers and sensor data.
* **Language:** C/C++ optimized for low-latency communication and direct hardware management.
* **Remote Communication:** Seamless transmission of commands from the operator via wireless protocols.
* **Motion Management:** Precise control of servo motors and DC motors using PWM signals.

## 3. Core Functionality

Nur-o-link is designed to perform complex tasks:

* **Remote Control:** Real-time direction of the mobile platform and the robotic arm by the user.
* **Versatile Tasks:** The vehicle reaching the desired point by moving, and subsequently, the robotic arm managing the load or object on it.
* **Low-Latency Command Processing:** Conversion of remotely sent signals into mechanical movements with minimum response time.

## 4. Software and Design Principles

The following principles have been adopted for the system's sustainability and stability on hardware:

* **Modular Software:** Independent and manageable code blocks for vehicle movements and arm manipulation.
* **Extensibility:** A flexible architecture for sensors or autonomous modes that may be added in the future.
* **Hardware Abstraction:** Managing the software layer through a simpler interface, stripped of the complexity of the mechanical assembly.

---

### Project Access and Development

The Nur-o-link project is an excellent reference for developers who want to practice remote-controlled robotic systems and mechanical-software integration. You can use the link below to examine the project's source code and integrate it into your own system:

> **Project Link:** [https://github.com/abdulkadirgungor86/Nur-o-link](https://github.com/abdulkadirgungor86/Nur-o-link)

### Conclusion

Nur-o-link is an impressive study that shows robotics enthusiasts how to go beyond just building a "vehicle," demonstrating how to add a "manipulator" onto a mobile system and how these two different mechanisms work in harmony. There is much to discover in this project, where software turns into physical motion.