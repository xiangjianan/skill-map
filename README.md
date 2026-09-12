# 🎮 Skill Unlock Map

**English** | [简体中文](README.zh-CN.md)

A gamified skill tree management tool that helps you track and manage your skill learning progress.

![Demo](https://img.shields.io/badge/状态-可用-brightgreen)
![License](https://img.shields.io/badge/许可证-MIT-blue)

## ✨ Features

- 🌳 **Skill tree view** - Visualize skills and their dependencies
- 📊 **Progress tracking** - Live stats on the number of unlocked skills and completion progress
- 🏷️ **Category filtering** - Filter by frontend, backend, database, DevOps, or other
- 🔄 **View switching** - Switch between grid view and list view
- ➕ **Custom skills** - Add new skills and set prerequisites
- ✏️ **Edit skills** - Modify skill names, descriptions, icons, and prerequisites
- 💾 **Local storage** - Data is saved in the browser's localStorage, no backend required
- 📱 **Responsive design** - Fully adapted for both desktop and mobile

## 🎮 Usage

1. **Unlock skills** - Click a skill in the "unlockable" state to unlock it
2. **View details** - Click an unlocked skill to see its full description
3. **Add skills** - Click the "Add skill" button to create a new skill
4. **Edit skills** - Click edit in the skill details modal
5. **Filter categories** - Use the filter buttons at the top to browse by category
6. **Reset progress** - Click "Reset progress" to clear all data

## 🛠️ Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling and animations
- **JavaScript** - Vanilla JS, no framework dependencies
- **SVG** - Skill connection lines
- **LocalStorage** - Local data persistence

## 🚀 Quick Start

### Online

👉 [https://xiangjianan.github.io/skill-map/](https://xiangjianan.github.io/skill-map/)

### Run Locally

```bash
# Clone the repository
git clone https://github.com/xiangjianan/skill-map.git

# Enter the directory
cd skill-map

# Open index.html directly or use a local server
python -m http.server 8080
# Visit http://localhost:8080
```

## 📁 Project Structure

```
skill-map/
├── index.html    # Main page
├── styles.css    # Stylesheet
├── app.js        # Core logic
├── skills.js     # Skill data
└── README.md     # Project documentation
```

## 🎯 Skill Dependency Rules

- Each skill can have multiple prerequisite skills
- A skill only becomes "unlockable" once all of its prerequisites are unlocked
- "Locked" - prerequisites not yet met
- "Unlockable" - prerequisites met, ready to unlock
- "Unlocked" - unlock completed

## 📝 Customizing Skill Data

Edit the `initialSkills` array in the `skills.js` file to customize the initial skills:

```javascript
const initialSkills = [
  {
    id: 'skill-1',
    name: 'HTML',
    description: '超文本标记语言',
    category: 'frontend',
    icon: '📄',
    prerequisites: []
  },
  // ... more skills
];
```

## 📄 License

[MIT License](LICENSE)

## 🤝 Contributing

Issues and Pull Requests are welcome!
