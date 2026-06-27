---
title: "Gungor-robot-car: ESP32 Camera-Controlled Robot Car"
date: 2026-05-13
type: "blog"
draft: false
description: "A robotic vehicle project capable of live video streaming via WiFi and remote control through a browser-based interface, powered by the ESP32-WROVER module."
featured_image: "/images/blog/github-proje-3-gungor-robot-car.png"
tags: ["blog", "robotics", "robotic", "iot", "embedded", "cplusplus", "arduino", "esp32", "esp32-cam", "esp32-camera", "remote-control", "robotic-car", "electronic", "electronics", "software-hardware"]
---

**Gungor-robot-car** is a robotic vehicle project designed using the ESP32-WROVER module and a camera module, providing live video monitoring and remote movement control via a browser.

{{< figure src="/images/blog/github-proje-3-gungor-robot-car.png" alt="Gungor Camera Robot Car" width="1200" caption="Figure 1: Gungor Camera Robot Car." >}}

## 1. Architectural Approach

The project acts as an HTTP server using the ESP32's internal WiFi capabilities. Users can manage the vehicle and view the live video stream (MJPEG) by connecting to a browser-based interface over the local network.

## 2. Technical Specifications and Hardware

The project's basic technical structure is configured as follows:

* **Microcontroller:** ESP32 Wrover Module.
* **Connectivity:** HTTP server over WiFi.
* **Camera:** Live video streaming (MJPEG) support.
* **Control:** Browser-based control panel.
* **Additional Features:** Remote LED lighting control and the ability to change camera settings (resolution, brightness).

### Hardware Pin Configuration

The following GPIO pins have been defined for the robot's movement and lighting management:

| Function | GPIO Pin |
| --- | --- |
| Left Motor (Forward) | 14 |
| Left Motor (Backward) | 2 |
| Right Motor (Forward) | 13 |
| Right Motor (Backward) | 15 |
| LED | 4 |

## 3. Control Mechanism

The control panel operates by sending HTTP GET requests. The commands triggered when buttons are pressed are as follows:

* **Forward (`/go`)**: Runs the left and right motors in the forward direction.
* **Backward (`/back`)**: Runs the left and right motors in the backward direction.
* **Left (`/left`)**: Enables the robot to turn left on its own axis.
* **Right (`/right`)**: Enables the robot to turn right on its own axis.
* **STOP (`/stop`)**: Stops all motors.
* **Light Control**: Used to turn the LED on (`/ledon`) or off (`/ledoff`).

## 4. Setup

For the project to work, ESP32 board libraries must be installed on the Arduino IDE. During the configuration phase, the `hostname`, `ssid`, and `password` fields within the `gungor-robot-car-v3_0.ino` file must be updated according to your local WiFi network information.

---

### Project Access

You can access the project's source code and technical documents via the link below:

> **Project Link:** [https://github.com/abdulkadirgungor86/Gungor-robot-car](https://github.com/abdulkadirgungor86/Gungor-robot-car)

### Conclusion

Gungor-robot-car is a comprehensive IoT application that combines image processing and motor control using WiFi technology. This project provides an ideal infrastructure for those who want to develop their own wirelessly controlled robot.

