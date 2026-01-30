const skillManager = new SkillManager();

function init() {
    renderSkills();
    updateStats();
    setupEventListeners();
}

function renderSkills() {
    const container = document.getElementById('skillsContainer');
    const connections = document.getElementById('connections');
    
    container.innerHTML = '';
    connections.innerHTML = '';
    
    const skills = skillManager.getAllSkills();
    
    skills.forEach(skill => {
        const skillNode = createSkillNode(skill);
        container.appendChild(skillNode);
    });
    
    setTimeout(() => {
        drawConnections();
    }, 100);
}

function createSkillNode(skill) {
    const node = document.createElement('div');
    node.className = `skill-node ${skillManager.getSkillStatus(skill.id)}`;
    node.dataset.id = skill.id;
    
    const status = skillManager.getSkillStatus(skill.id);
    const statusText = {
        'locked': '🔒 未解锁',
        'current': '🎯 可解锁',
        'unlocked': '✅ 已解锁'
    };
    
    node.innerHTML = `
        <div class="skill-icon">${skill.icon}</div>
        <div class="skill-name">${skill.name}</div>
        <div class="skill-category">${getCategoryName(skill.category)}</div>
        <div class="skill-status ${status}">${statusText[status]}</div>
    `;
    
    node.addEventListener('click', () => showSkillDetail(skill));
    
    return node;
}

function getCategoryName(category) {
    const categories = {
        'frontend': '前端开发',
        'backend': '后端开发',
        'database': '数据库',
        'devops': '运维',
        'other': '其他'
    };
    return categories[category] || category;
}

function drawConnections() {
    const connections = document.getElementById('connections');
    const container = document.getElementById('skillsContainer');
    const skills = skillManager.getAllSkills();
    
    const containerRect = container.getBoundingClientRect();
    
    skills.forEach(skill => {
        skill.prerequisites.forEach(prereqId => {
            const prereqNode = container.querySelector(`[data-id="${prereqId}"]`);
            const skillNode = container.querySelector(`[data-id="${skill.id}"]`);
            
            if (prereqNode && skillNode) {
                const prereqRect = prereqNode.getBoundingClientRect();
                const skillRect = skillNode.getBoundingClientRect();
                
                const x1 = prereqRect.left - containerRect.left + prereqRect.width / 2;
                const y1 = prereqRect.top - containerRect.top + prereqRect.height / 2;
                const x2 = skillRect.left - containerRect.left + skillRect.width / 2;
                const y2 = skillRect.top - containerRect.top + skillRect.height / 2;
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('class', `connection-line ${skillManager.getSkillStatus(prereqId) === 'unlocked' ? 'unlocked' : ''}`);
                
                connections.appendChild(line);
            }
        });
    });
}

function showSkillDetail(skill) {
    const modal = document.getElementById('skillModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const status = skillManager.getSkillStatus(skill.id);
    const canUnlock = status === 'current';
    
    let prerequisitesHtml = '';
    if (skill.prerequisites.length > 0) {
        prerequisitesHtml = skill.prerequisites.map(prereqId => {
            const prereq = skillManager.getSkill(prereqId);
            const prereqStatus = skillManager.getSkillStatus(prereqId);
            const statusIcon = prereqStatus === 'unlocked' ? '✅' : '🔒';
            return `<span style="margin-right: 10px;">${statusIcon} ${prereq ? prereq.name : prereqId}</span>`;
        }).join('');
    } else {
        prerequisitesHtml = '<span>无前置技能</span>';
    }
    
    modalTitle.textContent = `${skill.icon} ${skill.name}`;
    modalBody.innerHTML = `
        <div class="skill-detail">
            <div class="skill-detail-label">技能描述</div>
            <div class="skill-detail-value">${skill.description}</div>
        </div>
        <div class="skill-detail">
            <div class="skill-detail-label">技能分类</div>
            <div class="skill-detail-value">${getCategoryName(skill.category)}</div>
        </div>
        <div class="skill-detail">
            <div class="skill-detail-label">前置技能</div>
            <div class="skill-detail-value">${prerequisitesHtml}</div>
        </div>
        <div class="skill-detail">
            <div class="skill-detail-label">当前状态</div>
            <div class="skill-detail-value">${status === 'unlocked' ? '✅ 已解锁' : status === 'current' ? '🎯 可解锁' : '🔒 未解锁'}</div>
        </div>
        ${canUnlock ? `<button class="unlock-btn" onclick="unlockSkill('${skill.id}')">🎮 解锁此技能</button>` : ''}
    `;
    
    modal.classList.add('show');
}

function unlockSkill(id) {
    if (skillManager.unlockSkill(id)) {
        renderSkills();
        updateStats();
        closeModal('skillModal');
        showNotification(`🎉 恭喜！你已解锁 ${skillManager.getSkill(id).name}！`);
    }
}

function updateStats() {
    document.getElementById('unlockedCount').textContent = skillManager.getUnlockedCount();
    document.getElementById('totalCount').textContent = skillManager.getTotalCount();
    document.getElementById('progressPercent').textContent = skillManager.getProgress() + '%';
}

function setupEventListeners() {
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('确定要重置所有进度吗？')) {
            skillManager.reset();
            renderSkills();
            updateStats();
            showNotification('🔄 进度已重置');
        }
    });
    
    document.getElementById('addSkillBtn').addEventListener('click', () => {
        document.getElementById('addSkillModal').classList.add('show');
    });
    
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            modal.classList.remove('show');
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    document.getElementById('addSkillForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewSkill();
    });
    
    window.addEventListener('resize', () => {
        drawConnections();
    });
}

function addNewSkill() {
    const name = document.getElementById('skillName').value.trim();
    const description = document.getElementById('skillDescription').value.trim();
    const category = document.getElementById('skillCategory').value;
    const prerequisitesText = document.getElementById('skillPrerequisites').value.trim();
    
    if (!name) {
        showNotification('❌ 请输入技能名称');
        return;
    }
    
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    if (skillManager.getSkill(id)) {
        showNotification('❌ 该技能已存在');
        return;
    }
    
    const prerequisites = prerequisitesText
        ? prerequisitesText.split(',').map(p => p.trim().toLowerCase().replace(/\s+/g, '-'))
        : [];
    
    const icons = ['🚀', '💡', '🎯', '⭐', '🔥', '💎', '🎪', '🎨', '🎭', '🎪'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    const newSkill = {
        id,
        name,
        description: description || '暂无描述',
        category,
        icon: randomIcon,
        prerequisites,
        unlocked: false
    };
    
    skillManager.addSkill(newSkill);
    renderSkills();
    updateStats();
    closeModal('addSkillModal');
    document.getElementById('addSkillForm').reset();
    showNotification('✅ 技能添加成功！');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00d9ff, #00ff88);
        color: #1a1a2e;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 20px rgba(0, 217, 255, 0.4);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', init);
