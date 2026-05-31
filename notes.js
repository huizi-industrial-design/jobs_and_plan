// 页面加载时自动渲染所有列表
window.onload = function() {
    renderAll();
};

function saveNote(type) {
    const date = document.getElementById('note-date').value;
    const content = document.getElementById('note-content').value;
    
    if(!date || !content) {
        alert("请填写日期和内容");
        return;
    }
    
    // 按类型存入 localStorage
    localStorage.setItem(`${type}_${date}`, content);
    
    // 清空输入框并刷新显示
    document.getElementById('note-content').value = '';
    renderAll();
}

function renderAll() {
    renderList('work', 'work-list');
    renderList('life', 'life-list');
    renderList('weekly', 'weekly-list');
}

function renderList(type, containerId) {
    const list = document.getElementById(containerId);
    list.innerHTML = '';
    
    let records = [];
    // 遍历所有数据，筛选出匹配 type 的记录
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(type + '_')) {
            records.push({
                date: key.replace(type + '_', ''),
                content: localStorage.getItem(key)
            });
        }
    }
    
    // 按日期从新到旧排序
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    records.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `<strong>${item.date}</strong>${item.content}`;
        list.appendChild(div);
    });
}