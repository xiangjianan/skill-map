# 🎮 技能解锁地图

一个游戏化的技能树管理工具，帮助你追踪和管理技能学习进度。

![Demo](https://img.shields.io/badge/状态-可用-brightgreen)
![License](https://img.shields.io/badge/许可证-MIT-blue)

## ✨ 功能特性

- 🌳 **技能树展示** - 可视化展示技能及其依赖关系
- 📊 **进度追踪** - 实时统计已解锁技能数量和完成进度
- 🏷️ **分类筛选** - 支持按前端、后端、数据库、运维、其他分类筛选
- 🔄 **视图切换** - 支持网格视图和列表视图
- ➕ **自定义技能** - 添加新技能并设置前置依赖
- ✏️ **编辑技能** - 修改技能名称、描述、图标和前置条件
- 💾 **本地存储** - 数据保存在浏览器 localStorage，无需后端
- 📱 **响应式设计** - 完美适配桌面端和移动端

## 🎮 使用方法

1. **解锁技能** - 点击「可解锁」状态的技能即可解锁
2. **查看详情** - 点击已解锁的技能查看详细描述
3. **添加技能** - 点击「添加技能」按钮创建新技能
4. **编辑技能** - 在技能详情弹窗中点击编辑
5. **筛选分类** - 使用顶部筛选按钮按分类查看
6. **重置进度** - 点击「重置进度」清除所有数据

## 🛠️ 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 现代化样式、动画效果
- **JavaScript** - 原生 JS，无框架依赖
- **SVG** - 技能连接线绘制
- **LocalStorage** - 本地数据持久化

## 🚀 快速开始

### 在线访问

👉 [https://xiangjianan.github.io/skill-map/](https://xiangjianan.github.io/skill-map/)

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/xiangjianan/skill-map.git

# 进入目录
cd skill-map

# 直接打开 index.html 或使用本地服务器
python -m http.server 8080
# 访问 http://localhost:8080
```

## 📁 项目结构

```
skill-map/
├── index.html    # 主页面
├── styles.css    # 样式文件
├── app.js        # 核心逻辑
├── skills.js     # 技能数据
└── README.md     # 项目文档
```

## 🎯 技能依赖规则

- 每个技能可以设置多个前置技能
- 只有当前置技能全部解锁后，技能才会变为「可解锁」状态
- 「未解锁」- 前置条件未满足
- 「可解锁」- 前置条件已满足，可以解锁
- 「已解锁」- 已完成解锁

## 📝 自定义技能数据

编辑 `skills.js` 文件中的 `initialSkills` 数组来自定义初始技能：

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
  // ... 更多技能
];
```

## 📄 许可证

[MIT License](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
