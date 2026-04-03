# Project Generators

Automated project generation system for Team Finder. Populates the database with projects from multiple specialized sources per major.

## Overview

Each major has **tailored project sources** based on industry standards and learning paths:

### **CS (Computer Science)**
- **LeetCode / HackerRank** - Algorithms, competitive programming challenges
- **SourceForge** - Open source systems projects
- **GitHub** - General CS projects

### **CIS (Computer Information Systems)**
- **Kaggle** - Business datasets
- **GitHub** - Web/mobile applications
- **SAP Learning Hub** - ERP case studies (curated)

### **BIT (Business Information Technology)**
- **Kaggle** - Business/financial datasets
- **Microsoft Power BI Samples** - BI dashboard projects
- **Tableau Public** - Data visualization dashboards

### **CYS (Cybersecurity)**
- **Hack The Box / TryHackMe** - Hands-on security labs
- **VulnHub** - Vulnerable VMs for practice
- **CVE / NVD Databases** - Vulnerability research projects
- **CTFtime.org** - CTF writeups and challenges

### **DS / AI (Data Science / Artificial Intelligence)**
- **Kaggle** - Datasets and competitions
- **HuggingFace** - Pre-trained models and datasets
- **GitHub** - ML/AI project repositories
- **Papers With Code** - SOTA (State-of-the-Art) implementations
- **UCI ML Repository** - Classic ML datasets
- **Google Dataset Search** - Curated datasets

### **SWE (Software Engineering - General)**
- **GitHub** - Main source for software projects
- **GitLab** - Open source projects
- **OpenHub** - Open source project metrics

---

## Module Structure

```
project_generators/
├── fetchers/
│   ├── github_fetcher.py         # GitHub API (all majors)
│   ├── kaggle_fetcher.py         # Kaggle API (DS, AI, CIS, BIT)
│   ├── huggingface_fetcher.py    # HuggingFace API (DS, AI)
│   ├── leetcode_fetcher.py       # LeetCode problems (CS)
│   ├── papers_with_code.py       # Papers With Code API (DS, AI)
│   ├── ctf_fetcher.py            # CTFtime.org scraper (CYS)
│   ├── vuln_fetcher.py           # CVE/NVD databases (CYS)
│   └── powerbi_fetcher.py        # Power BI samples (BIT)
│
├── curated/
│   ├── sap_case_studies.json     # SAP ERP projects (CIS)
│   ├── hackthebox_labs.json      # HTB/THM labs (CYS)
│   ├── vuln_vms.json             # VulnHub VMs (CYS)
│   └── tableau_dashboards.json   # Tableau Public (BIT)
│
├── ai_generator.py               # Claude API generator (all majors)
├── populate_projects.py          # Main orchestrator script
├── config.py                     # Configurations and mappings
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

---

## Setup

### 1. Install Dependencies
```bash
cd project_generators
pip install -r requirements.txt
```

### 2. Environment Variables
Create `.env` file:
```bash
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# APIs
ANTHROPIC_API_KEY=your_claude_api_key
GITHUB_TOKEN=your_github_token
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_KEY=your_kaggle_key
HUGGINGFACE_TOKEN=your_hf_token  # Optional, for private datasets
```

### 3. Kaggle Setup (one-time)
```bash
# Download kaggle.json from https://www.kaggle.com/settings/account
mkdir ~/.kaggle
mv kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```

---

## Usage

### Populate All Majors (Recommended)
```bash
python populate_projects.py --all
```

### Populate Specific Major
```bash
python populate_projects.py --major CS --count 30
python populate_projects.py --major DS --count 40
python populate_projects.py --major CYS --count 25
```

### Populate from Specific Source
```bash
python populate_projects.py --major CS --source leetcode --count 20
python populate_projects.py --major AI --source huggingface --count 15
python populate_projects.py --major CYS --source ctftime --count 10
```

### Clear and Regenerate
```bash
python populate_projects.py --clear --all
```

---

## Data Sources by Major

### **CS - Computer Science**
| Source | Type | API | Projects Generated |
|--------|------|-----|-------------------|
| LeetCode | Algorithms | Unofficial | 15-20 coding challenges |
| HackerRank | Competitive Programming | No | 10-15 challenges (curated) |
| SourceForge | Open Source | Web Scraping | 10 system projects |
| GitHub | General CS | ✅ API | 20+ repositories |

**Example Projects:**
- "Implement a LRU Cache (LeetCode Hard)"
- "Build a Custom Malloc/Free in C"
- "Contribute to Open Source Compiler Project"

---

### **CIS - Computer Information Systems**
| Source | Type | API | Projects Generated |
|--------|------|-----|-------------------|
| Kaggle | Business Datasets | ✅ API | 10 dataset projects |
| GitHub | Web/Mobile Apps | ✅ API | 15 app projects |
| SAP Learning Hub | ERP Case Studies | Curated JSON | 5 ERP projects |

**Example Projects:**
- "Build Customer Segmentation Dashboard (Kaggle)"
- "Create Inventory Management System"
- "SAP FICO Module Implementation Case Study"

---

### **BIT - Business Information Technology**
| Source | Type | API | Projects Generated |
|--------|------|-----|-------------------|
| Kaggle | Financial/Business Data | ✅ API | 15 datasets |
| Power BI Samples | BI Dashboards | Curated | 10 dashboard projects |
| Tableau Public | Visualizations | Web Scraping | 10 viz projects |

**Example Projects:**
- "Sales Performance Dashboard with Power BI"
- "Financial KPI Tracker using Tableau"
- "Customer Churn Analysis (Kaggle Dataset)"

---

### **CYS - Cybersecurity**
| Source | Type | API | Projects Generated |
|--------|------|-----|-------------------|
| Hack The Box | Hands-on Labs | Curated | 10 lab challenges |
| TryHackMe | Security Rooms | Curated | 10 beginner-friendly labs |
| VulnHub | Vulnerable VMs | Curated JSON | 8 VM challenges |
| CVE/NVD | Vulnerabilities | ✅ API | 10 research projects |
| CTFtime.org | CTF Writeups | Web Scraping | 10 CTF challenges |

**Example Projects:**
- "Exploit OWASP Top 10 on VulnHub VM"
- "Analyze CVE-2024-XXXX and Write Report"
- "Complete 'Mr. Robot' CTF on TryHackMe"

---

### **DS / AI - Data Science / Artificial Intelligence**
| Source | Type | API | Projects Generated |
|--------|------|-----|-------------------|
| Kaggle | Datasets/Competitions | ✅ API | 20 projects |
| HuggingFace | Models/Datasets | ✅ API | 15 NLP/CV projects |
| GitHub | ML/DL Repos | ✅ API | 15 implementation projects |
| Papers With Code | SOTA Models | ✅ API | 10 research projects |
| UCI ML Repository | Classic Datasets | Web Scraping | 10 classic ML projects |
| Google Dataset Search | Curated Datasets | Manual List | 5 unique datasets |

**Example Projects:**
- "Build Image Classifier with ResNet (Papers With Code)"
- "Fine-tune BERT for Sentiment Analysis (HuggingFace)"
- "Kaggle: House Prices Prediction Competition"
- "Implement YOLO from Scratch (GitHub)"

---

### **SWE - Software Engineering**
| Source | Type | API | Projects Generated |
|--------|------|-----|-------------------|
| GitHub | Software Projects | ✅ API | 30 projects |
| GitLab | Open Source | ✅ API | 10 projects |
| OpenHub | Project Metrics | ✅ API | 5 contribution projects |

**Example Projects:**
- "Contribute to Top 100 GitHub Projects"
- "Build Microservices Architecture"
- "Implement CI/CD Pipeline for React App"

---

## Difficulty Classification

### Automatic Classification Rules:

**GitHub/GitLab:**
- **Beginner**: 100-500 stars, <10 contributors
- **Intermediate**: 500-2000 stars, 10-50 contributors
- **Advanced**: 2000+ stars, 50+ contributors

**Kaggle:**
- **Beginner**: <500 participants, Getting Started
- **Intermediate**: 500-2000 participants, Featured
- **Advanced**: 2000+ participants, Research

**LeetCode/HackerRank:**
- **Beginner**: Easy problems
- **Intermediate**: Medium problems
- **Advanced**: Hard problems

**CTF/Security Labs:**
- **Beginner**: TryHackMe Easy, HTB Starting Point
- **Intermediate**: TryHackMe Medium, HTB Active Machines
- **Advanced**: HTB Pro Labs, Advanced CTFs

---

## Database Schema

All projects stored in `projects` table:

```sql
type: 'external'
source: 'github' | 'kaggle' | 'huggingface' | 'leetcode' | 'ctftime' | 'ai_generated' | etc.
title: Project name
description: Project description (HTML supported)
difficulty: 'beginner' | 'intermediate' | 'advanced'
tech_stack: Array<string> (e.g., ['Python', 'TensorFlow', 'Docker'])
skills_needed: Array<string> (e.g., ['Machine Learning', 'Python', 'Git'])
specialization: Target specialization (e.g., 'Cybersecurity', 'Data Science')
external_url: Link to original resource
status: 'open'
created_at: Auto timestamp
```

---

## Rate Limits & Ethics

- **GitHub API**: 5000 req/hour (authenticated)
- **Kaggle API**: No strict limit
- **HuggingFace API**: Rate limited, use token
- **Web Scraping**: Respectful delays (2-5s between requests)
- **Papers With Code**: No strict limit

**Important:** Always respect robots.txt and terms of service.

---

## CLI Examples

```bash
# Generate all projects for all majors (one-time setup)
python populate_projects.py --all

# CS major: LeetCode + GitHub
python populate_projects.py --major CS --source leetcode --count 20
python populate_projects.py --major CS --source github --count 20

# DS major: Kaggle + HuggingFace + Papers With Code
python populate_projects.py --major DS --source kaggle --count 15
python populate_projects.py --major DS --source huggingface --count 10
python populate_projects.py --major DS --source papers_with_code --count 10

# CYS major: CTF + Vulnerabilities
python populate_projects.py --major CYS --source ctftime --count 10
python populate_projects.py --major CYS --source cve --count 10

# AI major: Everything
python populate_projects.py --major AI --all-sources --count 50

# Regenerate with AI-generated projects
python populate_projects.py --source ai_generated --all --count 5
```

---

## Recommended Initial Population

Run this once to populate the database:

```bash
# CS
python populate_projects.py --major CS --source leetcode --count 20
python populate_projects.py --major CS --source github --count 15

# CIS
python populate_projects.py --major CIS --source kaggle --count 10
python populate_projects.py --major CIS --source github --count 15

# BIT
python populate_projects.py --major BIT --source kaggle --count 15
python populate_projects.py --major BIT --source powerbi --count 10

# CYS
python populate_projects.py --major CYS --source ctftime --count 10
python populate_projects.py --major CYS --source vuln --count 10

# DS
python populate_projects.py --major DS --source kaggle --count 20
python populate_projects.py --major DS --source huggingface --count 15

# AI
python populate_projects.py --major AI --source kaggle --count 15
python populate_projects.py --major AI --source papers_with_code --count 15
python populate_projects.py --major AI --source huggingface --count 10

# Add AI-generated custom projects for all majors
python populate_projects.py --source ai_generated --all --count 5
```

**Total:** ~250-300 projects across all majors
