const skillManager = new SkillManager();
let currentFilter = 'all';
let currentView = window.innerWidth <= 768 ? 'list' : 'grid';

function init() {
    updateViewButtons();
    renderSkills();
    updateStats();
    setupEventListeners();
}

function updateViewButtons() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === currentView) {
            btn.classList.add('active');
        }
    });
}

function renderSkills() {
    const container = document.getElementById('skillsContainer');
    const connections = document.getElementById('connections');
    
    container.innerHTML = '';
    connections.innerHTML = '';
    
    if (currentView === 'list') {
        container.classList.add('list-view');
    } else {
        container.classList.remove('list-view');
    }
    
    const skills = skillManager.getAllSkills();
    const filteredSkills = currentFilter === 'all' 
        ? skills 
        : skills.filter(skill => skill.category === currentFilter);
    
    filteredSkills.forEach(skill => {
        const skillNode = createSkillNode(skill);
        container.appendChild(skillNode);
    });
    
    if (currentView === 'grid') {
        setTimeout(() => {
            drawConnections();
        }, 100);
    }
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
    
    if (currentView === 'list') {
        node.innerHTML = `
            <div class="skill-icon">${skill.icon}</div>
            <div class="skill-info">
                <div class="skill-name">${skill.name}</div>
                <div class="skill-category">${getCategoryName(skill.category)}</div>
            </div>
            <div class="skill-status ${status}">${statusText[status]}</div>
        `;
    } else {
        node.innerHTML = `
            <div class="skill-icon">${skill.icon}</div>
            <div class="skill-name">${skill.name}</div>
            <div class="skill-category">${getCategoryName(skill.category)}</div>
            <div class="skill-status ${status}">${statusText[status]}</div>
        `;
    }
    
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
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderSkills();
        });
    });
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            renderSkills();
        });
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
        
        setupSwipeToClose(modal);
    });
    
    document.getElementById('addSkillForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewSkill();
    });
    
    window.addEventListener('resize', () => {
        drawConnections();
    });
    
    document.addEventListener('touchstart', () => {}, { passive: true });
}

function setupSwipeToClose(modal) {
    let startY = 0;
    let currentY = 0;
    const content = modal.querySelector('.modal-content');
    
    modal.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        currentY = startY;
    }, { passive: true });
    
    modal.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 0) {
            content.style.transform = `translateY(${diff}px)`;
            content.style.opacity = 1 - (diff / 300);
        }
    }, { passive: true });
    
    modal.addEventListener('touchend', () => {
        const diff = currentY - startY;
        
        if (diff > 100) {
            modal.classList.remove('show');
        }
        
        content.style.transform = '';
        content.style.opacity = '';
    }, { passive: true });
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
    const isMobile = window.innerWidth <= 768;
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        ${isMobile ? 'top: auto; bottom: 20px; left: 50%; transform: translateX(-50%);' : 'top: 20px; right: 20px;'}
        background: linear-gradient(135deg, #00d9ff, #00ff88);
        color: #1a1a2e;
        padding: ${isMobile ? '12px 20px' : '15px 25px'};
        border-radius: 10px;
        font-weight: 600;
        z-index: 2000;
        animation: ${isMobile ? 'slideUp' : 'slideIn'} 0.3s ease;
        box-shadow: 0 5px 20px rgba(0, 217, 255, 0.4);
        max-width: ${isMobile ? '90vw' : 'auto'};
        text-align: center;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = isMobile ? 'slideDown 0.3s ease' : 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
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
    
    @keyframes slideUp {
        from {
            transform: translate(-50%, 100px);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, 100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', init);
