const defaultSkills = [
    {
        id: 'html',
        name: 'HTML',
        description: '网页的骨架，学习HTML标签、语义化、表单等基础知识',
        category: 'frontend',
        icon: '📄',
        prerequisites: [],
        unlocked: false
    },
    {
        id: 'css',
        name: 'CSS',
        description: '网页的样式，学习选择器、盒模型、Flexbox、Grid布局等',
        category: 'frontend',
        icon: '🎨',
        prerequisites: ['html'],
        unlocked: false
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        description: '网页的交互，学习变量、函数、DOM操作、事件处理等',
        category: 'frontend',
        icon: '⚡',
        prerequisites: ['html', 'css'],
        unlocked: false
    },
    {
        id: 'git',
        name: 'Git',
        description: '版本控制工具，学习git命令、分支管理、协作流程',
        category: 'devops',
        icon: '🔀',
        prerequisites: [],
        unlocked: false
    },
    {
        id: 'react',
        name: 'React',
        description: '前端框架，学习组件化、Hooks、状态管理、路由等',
        category: 'frontend',
        icon: '⚛️',
        prerequisites: ['javascript'],
        unlocked: false
    },
    {
        id: 'nodejs',
        name: 'Node.js',
        description: '后端运行时，学习Express框架、RESTful API、中间件等',
        category: 'backend',
        icon: '🟢',
        prerequisites: ['javascript'],
        unlocked: false
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        description: 'JavaScript的超集，学习类型系统、接口、泛型等',
        category: 'frontend',
        icon: '📘',
        prerequisites: ['javascript'],
        unlocked: false
    },
    {
        id: 'mysql',
        name: 'MySQL',
        description: '关系型数据库，学习SQL语句、表设计、索引优化等',
        category: 'database',
        icon: '🗄️',
        prerequisites: [],
        unlocked: false
    },
    {
        id: 'mongodb',
        name: 'MongoDB',
        description: 'NoSQL数据库，学习文档存储、聚合查询、索引等',
        category: 'database',
        icon: '🍃',
        prerequisites: [],
        unlocked: false
    },
    {
        id: 'docker',
        name: 'Docker',
        description: '容器化技术，学习镜像构建、容器管理、Docker Compose等',
        category: 'devops',
        icon: '🐳',
        prerequisites: ['git'],
        unlocked: false
    },
    {
        id: 'vue',
        name: 'Vue.js',
        description: '渐进式前端框架，学习Vue3、Composition API、Pinia等',
        category: 'frontend',
        icon: '💚',
        prerequisites: ['javascript'],
        unlocked: false
    },
    {
        id: 'python',
        name: 'Python',
        description: '通用编程语言，学习基础语法、面向对象、标准库等',
        category: 'backend',
        icon: '🐍',
        prerequisites: [],
        unlocked: false
    },
    {
        id: 'django',
        name: 'Django',
        description: 'Python Web框架，学习MTV架构、ORM、Admin后台等',
        category: 'backend',
        icon: '🎸',
        prerequisites: ['python'],
        unlocked: false
    },
    {
        id: 'redis',
        name: 'Redis',
        description: '内存数据库，学习数据结构、缓存策略、持久化等',
        category: 'database',
        icon: '🔴',
        prerequisites: ['mysql'],
        unlocked: false
    },
    {
        id: 'nginx',
        name: 'Nginx',
        description: 'Web服务器，学习反向代理、负载均衡、静态资源服务等',
        category: 'devops',
        icon: '🌐',
        prerequisites: ['docker'],
        unlocked: false
    },
    {
        id: 'graphql',
        name: 'GraphQL',
        description: 'API查询语言，学习Schema设计、Resolver、Apollo等',
        category: 'backend',
        icon: '◈',
        prerequisites: ['nodejs'],
        unlocked: false
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        description: 'React全栈框架，学习SSR、SSG、API Routes、App Router等',
        category: 'frontend',
        icon: '▲',
        prerequisites: ['react', 'typescript'],
        unlocked: false
    },
    {
        id: 'testing',
        name: '测试',
        description: '软件测试，学习单元测试、集成测试、E2E测试等',
        category: 'other',
        icon: '🧪',
        prerequisites: ['javascript'],
        unlocked: false
    },
    {
        id: 'ci-cd',
        name: 'CI/CD',
        description: '持续集成与部署，学习GitHub Actions、自动化部署等',
        category: 'devops',
        icon: '🔄',
        prerequisites: ['docker', 'git'],
        unlocked: false
    },
    {
        id: 'aws',
        name: 'AWS',
        description: '云服务，学习EC2、S3、Lambda、RDS等核心服务',
        category: 'devops',
        icon: '☁️',
        prerequisites: ['docker', 'ci-cd'],
        unlocked: false
    }
];

class SkillManager {
    constructor() {
        this.skills = this.loadSkills();
    }

    loadSkills() {
        const saved = localStorage.getItem('skillMap');
        if (saved) {
            return JSON.parse(saved);
        }
        return JSON.parse(JSON.stringify(defaultSkills));
    }

    saveSkills() {
        localStorage.setItem('skillMap', JSON.stringify(this.skills));
    }

    getSkill(id) {
        return this.skills.find(skill => skill.id === id);
    }

    getAllSkills() {
        return this.skills;
    }

    addSkill(skill) {
        this.skills.push(skill);
        this.saveSkills();
    }

    deleteSkill(id) {
        // 从其他技能的前置条件中移除该技能
        this.skills.forEach(skill => {
            skill.prerequisites = skill.prerequisites.filter(prereqId => prereqId !== id);
        });
        
        // 删除技能
        const index = this.skills.findIndex(skill => skill.id === id);
        if (index !== -1) {
            this.skills.splice(index, 1);
            this.saveSkills();
            return true;
        }
        return false;
    }

    unlockSkill(id) {
        const skill = this.getSkill(id);
        if (skill && this.canUnlock(id)) {
            skill.unlocked = true;
            this.saveSkills();
            return true;
        }
        return false;
    }

    canUnlock(id) {
        const skill = this.getSkill(id);
        if (!skill) return false;
        
        if (skill.unlocked) return false;
        
        return skill.prerequisites.every(prereqId => {
            const prereq = this.getSkill(prereqId);
            return prereq && prereq.unlocked;
        });
    }

    getSkillStatus(id) {
        const skill = this.getSkill(id);
        if (!skill) return 'locked';
        
        if (skill.unlocked) return 'unlocked';
        
        if (this.canUnlock(id)) return 'current';
        
        return 'locked';
    }

    getUnlockedCount() {
        return this.skills.filter(skill => skill.unlocked).length;
    }

    getTotalCount() {
        return this.skills.length;
    }

    getProgress() {
        const total = this.getTotalCount();
        if (total === 0) return 0;
        return Math.round((this.getUnlockedCount() / total) * 100);
    }

    reset() {
        this.skills.forEach(skill => {
            skill.unlocked = false;
        });
        this.saveSkills();
    }

    getNextUnlockableSkills() {
        return this.skills.filter(skill => this.getSkillStatus(skill.id) === 'current');
    }
}
