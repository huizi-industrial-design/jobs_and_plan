// 1. 初始化数据：优先读取 localStorage，如果没有则为空数组
let jobData = JSON.parse(localStorage.getItem('myJobs')) || [];

function renderJobs() {
    const tableBody = document.getElementById('job-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    jobData.forEach((job, index) => {
        const row = document.createElement('div');
        row.className = 'job-row';
        row.innerHTML = `
            <div>${job.company}</div>
            <div>${job.role}</div>
            <div>${job.status}</div>
            <div>${job.matchMatrix}</div>
            <div>${job.lastDate || ''}</div>
            <div>${job.note || ''}</div>
            <div class="action-btns">
                <button onclick="editJob(${index})" class="btn-edit">编</button>
                <button onclick="deleteJob(${index})" class="btn-delete">删</button>
            </div>
        `;
        tableBody.appendChild(row);
    });
}
function editJob(index) {
    const job = jobData[index];
    // 将现有数据填回输入框
    document.getElementById('in-company').value = job.company;
    document.getElementById('in-role').value = job.role;
    // ... 其他字段同理
    
    // 这里可以设置一个“更新模式”，点击添加按钮时判断是新增还是保存修改
    alert("请在上方修改信息，然后点击添加（或扩展逻辑覆盖当前数据）");
}

// 3. 添加新岗位逻辑
function addNewJob() {
    // 1. 获取所有输入框元素
    const companyInput = document.getElementById('in-company');
    const roleInput = document.getElementById('in-role');
    const statusInput = document.getElementById('in-status');
    const matchInput = document.getElementById('in-match');
    const dateInput = document.getElementById('in-date');
    const noteInput = document.getElementById('in-note');

    // 2. 获取值
    const company = companyInput.value;
    const role = roleInput.value;
    const status = statusInput.value;
    const match = matchInput.value;
    const date = dateInput.value;
    const note = noteInput.value;

    if (!company) return alert("公司名不能为空");

    // 3. 加入数据
    jobData.push({ 
        id: Date.now(), 
        company, role, status, 
        matchMatrix: match, 
        lastDate: date, 
        note: note 
    });

    // 4. 保存并渲染
    localStorage.setItem('myJobs', JSON.stringify(jobData));
    renderJobs();

    // 5. 核心：清空所有输入框
    companyInput.value = '';
    roleInput.value = '';
    statusInput.value = '';
    matchInput.value = '';
    dateInput.value = '';
    noteInput.value = '';
}

// 4. 删除逻辑
function deleteJob(index) {
    if(confirm('确定要删除这个岗位吗？')) {
        jobData.splice(index, 1);
        localStorage.setItem('myJobs', JSON.stringify(jobData));
        renderJobs();
    }
}

// 5. 周计划逻辑
// 修改后的周渲染逻辑，支持指定日期
function updateWeek(targetDate = new Date()) {
    const container = document.getElementById('days-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 如果传入的是日期字符串（比如 input 传来的），转为 Date 对象
    const dateObj = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    
    // 计算当前选定日期所在周的周一
    const dayOfWeek = dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1; 
    const monday = new Date(dateObj);
    monday.setDate(dateObj.getDate() - dayOfWeek);

    const todayStr = new Date().toISOString().split('T')[0];

    for(let i = 0; i < 7; i++) {
        let d = new Date(monday);
        d.setDate(monday.getDate() + i);
        let dateStr = d.toISOString().split('T')[0];
        
        const dayDiv = document.createElement('div');
        dayDiv.className = `day-card ${dateStr === todayStr ? 'today' : ''}`;
        dayDiv.innerHTML = `
            <strong>${['周一','周二','周三','周四','周五','周六','周日'][i]} (${dateStr})</strong>
            <div class="task-list" contenteditable="true" data-date="${dateStr}"></div>
        `;
        container.appendChild(dayDiv);
    }
    // 重新加载该周的任务
    loadTasks();
}

function changeWeek(dateStr) {
    if (!dateStr) return;
    updateWeek(dateStr);
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', () => {
    renderJobs();
    updateWeek();
});