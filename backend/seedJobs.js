import dotenv from "dotenv";
import path from "path";
import connectDB from "./utils/db.js";
import { Job } from "./models/job.model.js";
import { Company } from "./models/company.model.js";
import { User } from "./models/user.model.js";
import { deleteKeysByPattern } from "./utils/redis.js";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
}

// Companies to ensure exist with high-quality icons & metadata
const companyDefinitions = [
  {
    name: "Google",
    website: "https://careers.google.com",
    location: "Bangalore, Karnataka",
    description: "Organizing the world's information and making it universally accessible and useful.",
    logo: "https://img.icons8.com/color/144/google-logo.png",
  },
  {
    name: "Microsoft",
    website: "https://careers.microsoft.com",
    location: "Hyderabad, Telangana",
    description: "Empowering every person and every organization on the planet to achieve more.",
    logo: "https://img.icons8.com/color/144/microsoft.png",
  },
  {
    name: "Amazon",
    website: "https://amazon.jobs",
    location: "Gurgaon, Haryana",
    description: "Earth's most customer-centric company, where people can find and discover anything.",
    logo: "https://img.icons8.com/color/144/amazon.png",
  },
  {
    name: "Apple",
    website: "https://www.apple.com/careers",
    location: "Hyderabad, Telangana",
    description: "Innovators in consumer electronics, computer software, and online services.",
    logo: "https://img.icons8.com/color/144/mac-os--v1.png",
  },
  {
    name: "Netflix",
    website: "https://jobs.netflix.com",
    location: "Mumbai, Maharashtra",
    description: "Leading subscription streaming service and production company worldwide.",
    logo: "https://img.icons8.com/color/144/netflix.png",
  },
  {
    name: "Stripe",
    website: "https://stripe.com/jobs",
    location: "Remote, India",
    description: "Financial infrastructure and payment processing for the global internet economy.",
    logo: "https://img.icons8.com/color/144/stripe.png",
  },
  {
    name: "Spotify",
    website: "https://www.lifeatspotify.com",
    location: "Mumbai, Maharashtra",
    description: "Unlocking human creativity by giving millions of artists the opportunity to live off their art.",
    logo: "https://img.icons8.com/color/144/spotify.png",
  },
  {
    name: "Flipkart",
    website: "https://www.flipkartcareers.com",
    location: "Bangalore, Karnataka",
    description: "India's homegrown e-commerce marketplace empowering millions of consumers and sellers.",
    logo: "https://ui-avatars.com/api/?name=Flipkart&background=2874F0&color=fff&size=256&bold=true",
  },
  {
    name: "Uber",
    website: "https://www.uber.com/careers",
    location: "Bangalore, Karnataka",
    description: "Reimagining the way the world moves for the better through mobility tech.",
    logo: "https://img.icons8.com/color/144/uber.png",
  },
  {
    name: "Atlassian",
    website: "https://www.atlassian.com/company/careers",
    location: "Bangalore, Karnataka",
    description: "Makers of Jira, Confluence, and Trello powering seamless team collaboration.",
    logo: "https://img.icons8.com/color/144/atlassian.png",
  },
  {
    name: "Adobe",
    website: "https://careers.adobe.com",
    location: "Noida, Uttar Pradesh",
    description: "Changing the world through digital experiences, creative cloud, and AI breakthroughs.",
    logo: "https://img.icons8.com/color/144/adobe.png",
  },
  {
    name: "Zomato",
    website: "https://www.zomato.com/careers",
    location: "Gurgaon, Haryana",
    description: "Better food for more people, transforming food delivery and dining tech.",
    logo: "https://ui-avatars.com/api/?name=Zomato&background=E23744&color=fff&size=256&bold=true",
  },
  {
    name: "Swiggy",
    website: "https://careers.swiggy.com",
    location: "Bangalore, Karnataka",
    description: "On-demand convenience platform bringing lightning-fast hyperlocal logistics.",
    logo: "https://ui-avatars.com/api/?name=Swiggy&background=FC8019&color=fff&size=256&bold=true",
  },
  {
    name: "Razorpay",
    website: "https://razorpay.com/jobs",
    location: "Bangalore, Karnataka",
    description: "Leading omnichannel payments and banking solutions for businesses across India.",
    logo: "https://ui-avatars.com/api/?name=Razorpay&background=0C2340&color=fff&size=256&bold=true",
  },
  {
    name: "CRED",
    website: "https://cred.club/careers",
    location: "Bangalore, Karnataka",
    description: "Members-only club rewarding creditworthiness and financial discipline.",
    logo: "https://ui-avatars.com/api/?name=CRED&background=181818&color=fff&size=256&bold=true",
  },
  {
    name: "NVIDIA",
    website: "https://www.nvidia.com/careers",
    location: "Pune, Maharashtra",
    description: "Pioneers of accelerated computing and the world's most advanced AI supercomputing hardware.",
    logo: "https://img.icons8.com/color/144/nvidia.png",
  },
  {
    name: "Salesforce",
    website: "https://www.salesforce.com/careers",
    location: "Hyderabad, Telangana",
    description: "The global CRM leader empowering companies in cloud customer relationship management.",
    logo: "https://img.icons8.com/color/144/salesforce.png",
  },
];

// Helper to compute future deadline date
const getFutureDate = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d;
};

// 40+ diverse, realistic job postings covering varied locations, roles, experience, salaries, deadlines, and job types
const jobsToSeed = [
  // 1. AI & Machine Learning
  {
    companyName: "Google",
    title: "AI Research Scientist - Large Language Models",
    description: "Spearhead deep learning and foundational model research. Train and optimize massive multi-modal transformers, working directly on core reasoning architectures, RLHF, and agentic reasoning systems.",
    requirements: ["Python", "PyTorch", "Transformers", "LLMs", "Distributed Training", "CUDA", "TensorFlow"],
    salary: 48,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 4,
    position: 3,
    deadlineDays: 45,
  },
  {
    companyName: "NVIDIA",
    title: "Generative AI Inference Optimization Engineer",
    description: "Develop ultra-fast TensorRT-LLM and vLLM acceleration engines for next-generation generative AI clusters. Optimize GPU kernel execution, memory caching, and low-precision quantization schemes.",
    requirements: ["C++", "CUDA", "Python", "TensorRT", "Deep Learning", "Kernel Optimization"],
    salary: 52,
    location: "Pune, Maharashtra",
    jobType: "Full-Time",
    experience: 5,
    position: 2,
    deadlineDays: 30,
  },
  {
    companyName: "Microsoft",
    title: "Machine Learning Engineer - Azure AI",
    description: "Integrate cognitive services and retrieval-augmented generation (RAG) pipelines at enterprise scale. Build vector embedding storage, semantic rerankers, and automated fine-tuning workflows.",
    requirements: ["Python", "Azure ML", "PyTorch", "LangChain", "Vector Databases", "Docker"],
    salary: 36,
    location: "Hyderabad, Telangana",
    jobType: "Full-Time",
    experience: 3,
    position: 4,
    deadlineDays: 20,
  },
  {
    companyName: "Zomato",
    title: "AI & Computer Vision Intern",
    description: "Join our restaurant intelligence vision team to build automated image moderation, menu digitization, and food quality classification pipelines using computer vision models.",
    requirements: ["Python", "OpenCV", "PyTorch", "Computer Vision", "Git"],
    salary: 9,
    location: "Gurgaon, Haryana",
    jobType: "Internship",
    experience: 0,
    position: 5,
    deadlineDays: 14,
  },

  // 2. Frontend & UI/UX Engineering
  {
    companyName: "Stripe",
    title: "Senior Frontend Engineer - Global Checkout",
    description: "Craft pixel-perfect, highly resilient checkout widgets used by millions of merchants worldwide. Drive accessibility (a11y), sub-millisecond interaction speed, and bulletproof browser state isolation.",
    requirements: ["React", "TypeScript", "Next.js", "Web Performance", "TailwindCSS", "Jest"],
    salary: 42,
    location: "Remote, India",
    jobType: "Remote",
    experience: 5,
    position: 2,
    deadlineDays: 25,
  },
  {
    companyName: "Netflix",
    title: "UI Systems Engineer - TV & Living Room Platforms",
    description: "Design and implement high-performance, smooth 60fps UI engines on constrained television devices and smart consoles using modern JavaScript and WebGL primitives.",
    requirements: ["JavaScript", "TypeScript", "React", "WebGL", "Performance Optimization"],
    salary: 38,
    location: "Mumbai, Maharashtra",
    jobType: "Full-Time",
    experience: 4,
    position: 2,
    deadlineDays: 35,
  },
  {
    companyName: "Swiggy",
    title: "Frontend Developer - Hyperlocal Customer Apps",
    description: "Build ultra-responsive web and micro-frontend features for Swiggy Instamart and Food Marketplace. Focus on instant cart responsiveness, live driver tracking maps, and PWA capabilities.",
    requirements: ["React", "Redux Toolkit", "JavaScript", "HTML5", "CSS3", "Webpack"],
    salary: 19,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 2,
    position: 6,
    deadlineDays: 18,
  },
  {
    companyName: "CRED",
    title: "Lead Design Systems Engineer",
    description: "Bridge the gap between world-class product design and engineering. Build CRED's unified cross-platform component library with fluid animations, micro-interactions, and dark mode theming.",
    requirements: ["React", "TailwindCSS", "Framer Motion", "Figma", "Design Tokens", "Storybook"],
    salary: 35,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 4,
    position: 1,
    deadlineDays: 40,
  },
  {
    companyName: "Flipkart",
    title: "Junior Frontend Developer (Fresher 2026 Batch)",
    description: "Great opportunity for fresh engineering graduates to build festive sales landing pages, promotional modules, and responsive user flows on Flipkart's desktop and mobile web experiences.",
    requirements: ["HTML", "CSS", "JavaScript", "React", "Responsive Design"],
    salary: 10,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 0,
    position: 8,
    deadlineDays: 21,
  },

  // 3. Backend & Distributed Systems
  {
    companyName: "Amazon",
    title: "Software Development Engineer II (SDE-2) - High-Scale Payments",
    description: "Architect distributed, fault-tolerant payment transaction processing pipelines handling tens of thousands of requests per second with strict ACID guarantees and sub-20ms latency.",
    requirements: ["Java", "Spring Boot", "AWS DynamoDB", "Kafka", "Microservices", "System Design"],
    salary: 34,
    location: "Gurgaon, Haryana",
    jobType: "Full-Time",
    experience: 3,
    position: 5,
    deadlineDays: 28,
  },
  {
    companyName: "Uber",
    title: "Senior Backend Engineer - Dynamic Pricing & Dispatch",
    description: "Build real-time geospatial dispatch algorithms and surge matching services across hundreds of cities globally. Low latency, high concurrency, and zero downtime resilience are essential.",
    requirements: ["Go", "Distributed Systems", "gRPC", "Kafka", "Redis", "PostgreSQL"],
    salary: 45,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 5,
    position: 3,
    deadlineDays: 32,
  },
  {
    companyName: "Razorpay",
    title: "Backend Engineer - Payouts & Neobanking",
    description: "Develop mission-critical banking integrations and instant settlement engines. Ensure absolute idempotency, PCI-DSS compliance, and zero failure rates for merchant transfers.",
    requirements: ["Node.js", "Express", "PostgreSQL", "Redis", "Kafka", "Docker"],
    salary: 26,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 3,
    position: 4,
    deadlineDays: 24,
  },
  {
    companyName: "Spotify",
    title: "Backend Engineer - Realtime Audio Streaming & Metadata",
    description: "Design low-latency audio indexing, playback telemetry streaming, and podcast graph metadata services serving over 500 million monthly active listeners worldwide.",
    requirements: ["Python", "Java", "GCP", "Kubernetes", "gRPC", "Cassandra"],
    salary: 31,
    location: "Mumbai, Maharashtra",
    jobType: "Full-Time",
    experience: 3,
    position: 2,
    deadlineDays: 16,
  },
  {
    companyName: "Atlassian",
    title: "Principal Backend Architect - Enterprise Cloud Platforms",
    description: "Guide multi-tenant data partitioning, zero-trust authorization, and global failover architecture for Jira Cloud and Confluence enterprise tiers across multi-cloud regions.",
    requirements: ["Java", "Kotlin", "AWS", "Distributed Architecture", "Event-Driven Systems", "Kafka"],
    salary: 58,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 8,
    position: 1,
    deadlineDays: 60,
  },

  // 4. Full Stack Development
  {
    companyName: "Adobe",
    title: "Full Stack Engineer - Creative Cloud Web Tools",
    description: "Build next-generation in-browser editing suites and asset collaboration dashboards utilizing WebAssembly, WebGL, TypeScript, React, and serverless Node.js backends.",
    requirements: ["TypeScript", "React", "Node.js", "GraphQL", "WebAssembly", "Docker"],
    salary: 28,
    location: "Noida, Uttar Pradesh",
    jobType: "Full-Time",
    experience: 3,
    position: 3,
    deadlineDays: 22,
  },
  {
    companyName: "Stripe",
    title: "Staff Full Stack Engineer - Billing & Subscriptions",
    description: "Lead end-to-end engineering of automated invoice reconciliation, recurring revenue calculations, and customer portal self-serve flows for global SaaS enterprises.",
    requirements: ["Ruby", "TypeScript", "React", "PostgreSQL", "Distributed Systems"],
    salary: 50,
    location: "Remote, India",
    jobType: "Remote",
    experience: 6,
    position: 2,
    deadlineDays: 45,
  },
  {
    companyName: "CRED",
    title: "Full Stack Developer - Member Experience & Rewards",
    description: "Create slick, gamified reward redemption flows and high-throughput cashback settlement microservices with delightful UI polish and unbreakable transactional safety.",
    requirements: ["React Native", "React", "Node.js", "MongoDB", "Redis", "TailwindCSS"],
    salary: 24,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 2,
    position: 3,
    deadlineDays: 19,
  },
  {
    companyName: "Apple",
    title: "Full Stack Software Engineer - Apple Media Services",
    description: "Develop global developer portals, telemetry dashboards, and analytics pipelines backing App Store and Apple TV+ partner ingestion workflows.",
    requirements: ["Java", "React", "TypeScript", "SQL", "Cloud Infrastructure"],
    salary: 37,
    location: "Hyderabad, Telangana",
    jobType: "Full-Time",
    experience: 4,
    position: 2,
    deadlineDays: 30,
  },
  {
    companyName: "Swiggy",
    title: "Full Stack Web Developer (Contract 6 Months)",
    description: "Rapidly build and deploy internal operational tooling, vendor verification portals, and delivery fleet onboarding workflows with React and Express.",
    requirements: ["React", "Node.js", "Express", "MongoDB", "TailwindCSS"],
    salary: 15,
    location: "Remote, India",
    jobType: "Contract",
    experience: 2,
    position: 3,
    deadlineDays: 12,
  },

  // 5. DevOps, Cloud & SRE
  {
    companyName: "Microsoft",
    title: "Site Reliability Engineer (SRE) - Cloud & Distributed Platforms",
    description: "Guarantee 99.999% uptime for core Azure services. Drive chaos engineering, telemetry automation, auto-remediation playbooks, and disaster recovery drills.",
    requirements: ["Linux", "Kubernetes", "Go", "Python", "Prometheus", "Terraform", "CI/CD"],
    salary: 31,
    location: "Hyderabad, Telangana",
    jobType: "Full-Time",
    experience: 4,
    position: 3,
    deadlineDays: 27,
  },
  {
    companyName: "Uber",
    title: "Staff Cloud Infrastructure & Kubernetes Architect",
    description: "Manage global multi-cluster bare-metal and cloud Kubernetes deployments spanning over 50,000 nodes. Optimize container networking (eBPF/Cilium) and compute costs.",
    requirements: ["Kubernetes", "Terraform", "eBPF", "Golang", "AWS", "GCP"],
    salary: 55,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 7,
    position: 1,
    deadlineDays: 50,
  },
  {
    companyName: "Flipkart",
    title: "DevOps & Release Automation Engineer",
    description: "Build lightning-fast GitOps pipelines, Helm charts, and Canary release rollout gates to support seamless flash sales traffic spikes during Big Billion Days.",
    requirements: ["Docker", "Kubernetes", "Jenkins", "ArgoCD", "Python", "Bash"],
    salary: 21,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 3,
    position: 4,
    deadlineDays: 15,
  },
  {
    companyName: "Razorpay",
    title: "Cloud Security & Infrastructure Engineer",
    description: "Harden production AWS VPCs, enforce IAM zero-trust policies, run automated vulnerability scanners, and achieve PCI-DSS Level 1 compliance audits across all banking microservices.",
    requirements: ["AWS Security", "Terraform", "Vault", "Docker", "WAF", "Compliance"],
    salary: 27,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 3,
    position: 2,
    deadlineDays: 20,
  },

  // 6. Mobile Engineering (iOS / Android / Cross-Platform)
  {
    companyName: "Google",
    title: "Android Platform Engineer - Core System Frameworks",
    description: "Work on the cutting edge of Android OS subsystem modules, runtime ART optimizations, Jetpack Compose UI architecture, and battery/thermal consumption improvements.",
    requirements: ["Kotlin", "Java", "Android SDK", "Jetpack Compose", "Coroutines", "NDK"],
    salary: 38,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 4,
    position: 3,
    deadlineDays: 34,
  },
  {
    companyName: "Apple",
    title: "Senior iOS Engineer - Swift & SwiftUI",
    description: "Build delightful, fluid native iOS experiences taking full advantage of iOS capabilities, Metal graphics, WidgetKit, Dynamic Island, and offline-first local data syncing.",
    requirements: ["Swift", "SwiftUI", "Combine", "CoreData", "XCTest", "Git"],
    salary: 40,
    location: "Hyderabad, Telangana",
    jobType: "Full-Time",
    experience: 5,
    position: 2,
    deadlineDays: 38,
  },
  {
    companyName: "Zomato",
    title: "React Native Mobile Developer",
    description: "Help craft India's favorite food delivery mobile experience. Build slick live-order tracking maps, smooth restaurant menus, and zero-jank checkout interactions.",
    requirements: ["React Native", "TypeScript", "Redux", "Mobile Performance", "iOS", "Android"],
    salary: 23,
    location: "Gurgaon, Haryana",
    jobType: "Full-Time",
    experience: 3,
    position: 5,
    deadlineDays: 17,
  },
  {
    companyName: "Spotify",
    title: "Mobile Engineer - Audio Player & Offline Sync (Flutter)",
    description: "Develop offline audio caching, cross-fade playback logic, and podcast download managers for lightweight mobile devices with high efficiency.",
    requirements: ["Flutter", "Dart", "Mobile Architecture", "REST APIs", "Unit Testing"],
    salary: 25,
    location: "Mumbai, Maharashtra",
    jobType: "Full-Time",
    experience: 3,
    position: 2,
    deadlineDays: 26,
  },

  // 7. Data Engineering & Analytics
  {
    companyName: "Amazon",
    title: "Senior Big Data Engineer - Petabyte Analytics",
    description: "Design real-time clickstream processing, customer churn prediction features, and data lake pipelines handling over 50TB daily using Apache Spark, Kafka, and Snowflake.",
    requirements: ["Python", "PySpark", "SQL", "Snowflake", "Kafka", "Airflow", "AWS EMR"],
    salary: 33,
    location: "Gurgaon, Haryana",
    jobType: "Full-Time",
    experience: 4,
    position: 3,
    deadlineDays: 29,
  },
  {
    companyName: "Netflix",
    title: "Data Platform Engineer - Video Quality Telemetry",
    description: "Build data streaming ingestion for real-time video buffer health, bitrate adaptation metrics, and device analytics across over 200 million globally connected smart screens.",
    requirements: ["Apache Flink", "Kafka", "Scala", "Java", "BigQuery", "Distributed Systems"],
    salary: 44,
    location: "Mumbai, Maharashtra",
    jobType: "Full-Time",
    experience: 5,
    position: 2,
    deadlineDays: 42,
  },
  {
    companyName: "Flipkart",
    title: "Data Analyst - Supply Chain & Inventory Optimization",
    description: "Extract actionable supply chain insights, build executive BI dashboards, and forecast regional warehouse fulfillment metrics during major retail events.",
    requirements: ["SQL", "Python", "PowerBI", "Tableau", "Statistical Modeling", "Excel"],
    salary: 16,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 2,
    position: 4,
    deadlineDays: 14,
  },

  // 8. Product Management & UI/UX Design
  {
    companyName: "Google",
    title: "Product Manager - Workspace Collaboration & Cloud AI",
    description: "Define product strategy, roadmaps, and feature execution for AI-powered enterprise collaboration tools. Partner with engineering, research, and go-to-market teams.",
    requirements: ["Product Roadmap", "Data Analysis", "Agile", "User Research", "AI Strategy", "A/B Testing"],
    salary: 42,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 4,
    position: 2,
    deadlineDays: 35,
  },
  {
    companyName: "Atlassian",
    title: "Senior Product Designer (UI/UX) - Jira Software",
    description: "Champion frictionless developer journeys and agile sprint planning workflows. Create high-fidelity design prototypes, conduct user usability studies, and refine interaction patterns.",
    requirements: ["Figma", "UI/UX Design", "Wireframing", "User Research", "Design Systems", "Prototyping"],
    salary: 29,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 4,
    position: 2,
    deadlineDays: 28,
  },
  {
    companyName: "Swiggy",
    title: "Associate Product Manager (APM) - Growth & Retargeting",
    description: "Own key acquisition loops, push notification engagement, and customer loyalty retention experiments. Great role for data-driven analytical problem solvers.",
    requirements: ["Product Management", "SQL", "Data Analytics", "Experimentation", "Growth Loops"],
    salary: 18,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 1,
    position: 2,
    deadlineDays: 15,
  },

  // 9. Cybersecurity, QA & Testing
  {
    companyName: "Razorpay",
    title: "Lead Cybersecurity & Penetration Tester",
    description: "Perform red team exercises, web/mobile application security assessments, automated dynamic code scans, and threat vulnerability hunting across banking infrastructure.",
    requirements: ["AppSec", "Burp Suite", "OWASP Top 10", "Network Security", "Python", "Ethical Hacking"],
    salary: 32,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 4,
    position: 2,
    deadlineDays: 23,
  },
  {
    companyName: "Adobe",
    title: "QA Automation Engineer (SDET) - Cypress & Playwright",
    description: "Architect end-to-end regression frameworks and visual regression testing suites for complex browser-based graphics editors with continuous integration hooks.",
    requirements: ["Playwright", "Cypress", "JavaScript", "TypeScript", "CI/CD", "Selenium"],
    salary: 17,
    location: "Noida, Uttar Pradesh",
    jobType: "Full-Time",
    experience: 2,
    position: 4,
    deadlineDays: 19,
  },
  {
    companyName: "Atlassian",
    title: "Software Engineer in Test (SDET II)",
    description: "Build scalable test harness frameworks, load testing engines with k6 and Gatling, and chaos testing scenarios for high-throughput enterprise team collaboration APIs.",
    requirements: ["Java", "Python", "k6", "Gatling", "REST Assured", "Docker", "Junit"],
    salary: 22,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 3,
    position: 3,
    deadlineDays: 31,
  },

  // 10. Emerging Roles (Blockchain, Embedded, Remote Specialists, Part-Time)
  {
    companyName: "Stripe",
    title: "Crypto & Stablecoin Protocols Engineer",
    description: "Build payment on-ramps, smart contract verifications, and gas-efficient fiat-to-stablecoin cross-border payment settlement rails for merchant accounts.",
    requirements: ["Solidity", "Rust", "Ethereum", "Smart Contracts", "Cryptography", "Node.js"],
    salary: 46,
    location: "Remote, India",
    jobType: "Remote",
    experience: 4,
    position: 2,
    deadlineDays: 50,
  },
  {
    companyName: "NVIDIA",
    title: "Embedded C++ Systems Engineer - Autonomous Machines",
    description: "Develop real-time robot controller device drivers, sensor fusion interfaces, and low-latency IPC daemons on NVIDIA Jetson embedded hardware platforms.",
    requirements: ["C++", "C", "Linux Kernel", "RTOS", "Sensor Fusion", "Robotics"],
    salary: 36,
    location: "Pune, Maharashtra",
    jobType: "Full-Time",
    experience: 3,
    position: 2,
    deadlineDays: 35,
  },
  {
    companyName: "Salesforce",
    title: "Technical Architect - Enterprise CRM Ecosystems",
    description: "Design complex data synchronization bridges, high-volume platform events, and Apex custom microservices for enterprise telecommunications and banking clients.",
    requirements: ["Salesforce Architecture", "Apex", "Integration Patterns", "Lightning Web Components", "REST"],
    salary: 39,
    location: "Hyderabad, Telangana",
    jobType: "Full-Time",
    experience: 5,
    position: 2,
    deadlineDays: 45,
  },
  {
    companyName: "Uber",
    title: "Technical Content & Developer Advocate (Part-Time)",
    description: "Author technical tutorials, sample open-source repos, and conduct developer webinars explaining Uber's public developer APIs and routing SDKs to external partners.",
    requirements: ["Technical Writing", "API Documentation", "JavaScript", "Python", "Community"],
    salary: 8,
    location: "Remote, India",
    jobType: "Part-Time",
    experience: 2,
    position: 2,
    deadlineDays: 20,
  },
  {
    companyName: "CRED",
    title: "Software Engineering Intern - Summer 2026",
    description: "Exciting internship program for ambitious students. Work directly alongside senior engineers on real production features, high-performance backends, and creative UI components.",
    requirements: ["Data Structures", "Algorithms", "JavaScript or Java", "Problem Solving", "Git"],
    salary: 7.5,
    location: "Bangalore, Karnataka",
    jobType: "Internship",
    experience: 0,
    position: 6,
    deadlineDays: 10,
  },
  {
    companyName: "Zomato",
    title: "Regional Operations & Logistics Associate",
    description: "Optimize delivery partner allocation, improve localized rider pickup times, and resolve operational bottlenecks across high-volume metro micro-markets.",
    requirements: ["Operations", "Problem Solving", "Data Analysis", "Vendor Management", "Communication"],
    salary: 6.5,
    location: "Delhi NCR",
    jobType: "Full-Time",
    experience: 1,
    position: 5,
    deadlineDays: 15,
  },
  {
    companyName: "Apple",
    title: "Hardware Reliability & Systems Verification Engineer",
    description: "Design automated environmental stress testing rigs, signal integrity diagnostic suites, and thermal chamber monitoring protocols for cutting-edge consumer hardware.",
    requirements: ["Python", "LabVIEW", "Hardware Testing", "Data Analysis", "Embedded Systems"],
    salary: 30,
    location: "Chennai, Tamil Nadu",
    jobType: "Full-Time",
    experience: 3,
    position: 2,
    deadlineDays: 40,
  },
  {
    companyName: "Microsoft",
    title: "Cyber Threat Intelligence & Incident Responder",
    description: "Monitor global telemetry alerts, reverse-engineer sophisticated malware samples, and author threat hunting advisories to defend worldwide enterprise clouds.",
    requirements: ["Incident Response", "SIEM", "Reverse Engineering", "KQL", "Threat Hunting"],
    salary: 33,
    location: "Noida, Uttar Pradesh",
    jobType: "Full-Time",
    experience: 4,
    position: 3,
    deadlineDays: 25,
  },
  {
    companyName: "Google",
    title: "Cloud Solutions Architect - Strategic Accounts",
    description: "Partner with chief technology officers of leading unicorns to architect cloud-native distributed microservices, multi-region database replication, and zero-downtime migrations on GCP.",
    requirements: ["GCP", "Kubernetes", "Enterprise Architecture", "Cloud Security", "Cost Optimization"],
    salary: 44,
    location: "Bangalore, Karnataka",
    jobType: "Full-Time",
    experience: 5,
    position: 2,
    deadlineDays: 32,
  },
];

async function seedDatabase() {
  try {
    console.log("🚀 Initializing Job Seeder...");
    await connectDB();

    // 1. Ensure at least one active recruiter user exists
    let recruiter = await User.findOne({ role: "recruiter" });
    if (!recruiter) {
      console.log("No recruiter found. Creating default recruiter user...");
      const hashedPassword = await bcrypt.hash("Recruiter@123", 10);
      recruiter = await User.create({
        fullName: "Aarav Sharma",
        email: "recruiter.aarav@hirehub.com",
        phoneNumber: "9876543210",
        password: hashedPassword,
        role: "recruiter",
      });
      console.log(`Created default recruiter: ${recruiter.fullName} (${recruiter.email})`);
    } else {
      console.log(`Using existing recruiter: ${recruiter.fullName} (${recruiter.email})`);
    }

    // 2. Ensure all top tech companies exist
    const companyMap = new Map();
    for (const compData of companyDefinitions) {
      let company = await Company.findOne({
        name: { $regex: new RegExp(`^${compData.name}$`, "i") },
      });

      if (!company) {
        company = await Company.create({
          ...compData,
          createdBy: recruiter._id,
        });
        console.log(`Created company: ${company.name}`);
      } else {
        // Ensure logo & website are populated if missing
        let changed = false;
        if (!company.logo && compData.logo) {
          company.logo = compData.logo;
          changed = true;
        }
        if (!company.website && compData.website) {
          company.website = compData.website;
          changed = true;
        }
        if (changed) await company.save();
      }
      companyMap.set(compData.name.toLowerCase(), company._id);
    }

    // Also fetch any other existing companies
    const allCompanies = await Company.find({});
    for (const c of allCompanies) {
      companyMap.set(c.name.toLowerCase(), c._id);
    }

    // 3. Prepare jobs payload
    const jobsToInsert = [];
    for (const item of jobsToSeed) {
      const compId =
        companyMap.get(item.companyName.toLowerCase()) ||
        companyMap.get("google") ||
        allCompanies[0]?._id;

      if (!compId) {
        console.warn(`Skipping job ${item.title}: No company found.`);
        continue;
      }

      // Check if job with same title and company already exists
      const existingJob = await Job.findOne({
        title: item.title,
        company: compId,
      });

      if (existingJob) {
        // Update deadline and fields if needed, or skip
        existingJob.expiryDate = getFutureDate(item.deadlineDays);
        existingJob.salary = item.salary;
        existingJob.experience = item.experience;
        existingJob.position = item.position;
        existingJob.location = item.location;
        existingJob.jobType = item.jobType;
        existingJob.requirements = item.requirements;
        existingJob.description = item.description;
        await existingJob.save();
        console.log(`Updated existing job: ${item.title} at ${item.companyName}`);
        continue;
      }

      jobsToInsert.push({
        title: item.title,
        description: item.description,
        requirements: item.requirements,
        salary: item.salary,
        location: item.location,
        jobType: item.jobType,
        experience: item.experience,
        position: item.position,
        company: compId,
        createdBy: recruiter._id,
        applications: [],
        expiryDate: getFutureDate(item.deadlineDays),
      });
    }

    if (jobsToInsert.length > 0) {
      const inserted = await Job.insertMany(jobsToInsert);
      console.log(`Successfully inserted ${inserted.length} new jobs!`);
    } else {
      console.log("All sample jobs were already present and synchronized.");
    }

    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Company.countDocuments();
    console.log(`========================================`);
    console.log(`DATABASE SEEDING COMPLETE!`);
    console.log(`Total active jobs in database: ${totalJobs}`);
    console.log(`Total companies in database: ${totalCompanies}`);
    console.log(`========================================`);

    // 4. Invalidate Redis caches so immediate queries see fresh jobs
    try {
      console.log("Clearing Redis cache keys...");
      await Promise.all([
        deleteKeysByPattern("jobs:all:*"),
        deleteKeysByPattern("jobs:admin:*"),
        deleteKeysByPattern("jobs:detail:*"),
        deleteKeysByPattern("ai_match:*"),
      ]);
      console.log("Redis cache successfully cleared!");
    } catch (cacheErr) {
      console.warn("Notice: Redis cache invalidation skipped or failed:", cacheErr.message);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
}

seedDatabase();
