export const projectsData = [
  {
    id: "smart-home-iot",
    title: "Smart Home IoT Ecosystem",
    subtitle: "Real-time Distributed Sensor & Device Controller",
    category: "IoT & Full-stack",
    image: "./asset/project4.png",
    featured: true,
    star: {
      situation: "Need for an energy-efficient, responsive smart home automation system with remote monitoring capabilities.",
      task: "Build real-time bidirectional telemetry between ESP32/ESP8266 microcontrollers and a web command dashboard.",
      action: "Implemented lightweight MQTT publish-subscribe messaging broker, Python gateway, and asynchronous responsive web control panel.",
      result: "Achieved sub-100ms command latency for lights, fans, and environmental sensors (temperature, motion, light)."
    },
    techStack: ["ESP32", "ESP8266", "MQTT", "Python", "JavaScript", "HTML5/CSS3", "WebSockets"],
    reportUrl: "./report/Report_IoT.pdf",
    githubUrl: "https://github.com/Khoataphat/Smart-Home-IoT-System",
    liveDemo: null
  },
  {
    id: "warehouse-management-dsa",
    title: "Warehouse Management System",
    subtitle: "High-Performance Inventory & Order Engine",
    category: "DSA & Desktop App",
    image: "./asset/project3.png",
    featured: true,
    star: {
      situation: "Manual stock tracking caused bottlenecks in product lookup, order processing, and inventory discrepancy.",
      task: "Engineer a high-throughput desktop application to manage products, categories, stock levels, and customer orders.",
      action: "Applied optimized data structures (Binary Search Trees, Hash Maps, Priority Queues) and custom sorting algorithms for rapid query processing.",
      result: "Reduced search complexity to O(log n) and streamlined multi-item order fulfillment workflows."
    },
    techStack: ["Java", "Data Structures & Algorithms", "Swing/JavaFX", "File I/O", "OOP"],
    reportUrl: "./report/Report_DSA.pdf",
    githubUrl: "https://github.com/Khoataphat/Warehouse-Management-DSA",
    liveDemo: null
  },
  {
    id: "saving-sir-nghia-oop",
    title: "Saving Sir Nghia (2D Adventure Game)",
    subtitle: "Object-Oriented Gameplay & Physics Engine",
    category: "Game Dev & OOP",
    image: "./asset/project2.png",
    featured: true,
    star: {
      situation: "Demonstrating deep mastery of Object-Oriented Principles through an interactive gaming simulation.",
      task: "Design an engaging 2D game engine featuring multi-level progression, collision physics, and animated sprites.",
      action: "Leveraged OOP design patterns (State, Factory, Singleton, Strategy), modular entity inheritance, and custom rendering loops.",
      result: "Delivered a smooth, bug-free interactive game with sound effects, dynamic scoring, and distinct enemy AI behaviors."
    },
    techStack: ["Java", "OOP Design Patterns", "Game Loop Architecture", "2D Graphics", "Audio Synthesis"],
    reportUrl: "./report/Report_OOP.pdf",
    githubUrl: "https://github.com/Khoataphat/Saving-Sir-Nghia-OOP-Game",
    liveDemo: null
  },
  {
    id: "secure-voting-system",
    title: "Secure Digital Voting System",
    subtitle: "Automated Ballot Management & Fraud Prevention",
    category: "Software Design & Database",
    image: "./asset/project1.png",
    featured: true,
    star: {
      situation: "Traditional ballot counting is prone to human error, tampering, and slow verification.",
      task: "Develop a secure, auditable election management platform with automated tallying and anti-duplicate safeguards.",
      action: "Structured normalized relational schemas in MySQL, implemented robust Java backend services with cryptographic hash validations.",
      result: "Guaranteed 100% duplicate ballot prevention, instantaneous election result computation, and audit logging."
    },
    techStack: ["Java", "MySQL", "JDBC", "Data Modeling (PDM)", "Security & Cryptography"],
    reportUrl: "./report/Report_PDM.pdf",
    githubUrl: "https://github.com/Khoataphat/Secure-Voting-System",
    liveDemo: null
  }
];
