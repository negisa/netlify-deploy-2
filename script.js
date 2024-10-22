const sessionList = document.getElementById('sessionList');
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const newSessionBtn = document.getElementById('newSessionBtn');
const colorPicker = document.getElementById('colorPicker');
const responseLength = document.getElementById('responseLength');
const pageTitle = document.getElementById('pageTitle'); // 获取标题元素  
const toggleColorBtn = document.getElementById('toggleColorBtn'); // 新增的按钮
let isDarkMode = false;
let sessions = JSON.parse(localStorage.getItem('chatSessions')) || {};
let currentSession = null;

function renderSessions() {
  sessionList.innerHTML = '';
  for (const session in sessions) {
    const sessionItem = document.createElement('div');
    sessionItem.className = 'sessionItem';
    sessionItem.textContent = session;
    sessionItem.onclick = () => switchSession(session);
    sessionList.appendChild(sessionItem);
  }
}
toggleColorBtn.onclick = () => {
  isDarkMode = !isDarkMode; // 切换暗模式状态
  if (isDarkMode) {
    document.body.style.backgroundColor = '#333'; // 暗模式背景色
    document.querySelector('.pannel').style.backgroundColor = '#444'; // 暗模式侧边栏背景色
    document.body.style.color = '#000'; // 暗模式文字颜色
    pageTitle.style.color = '#fff'; // 暗模式标题文字颜色
  } else {
    document.body.style.backgroundColor = '#fff'; // 默认背景色
    document.querySelector('.pannel').style.backgroundColor = '#f0f0f0'; // 默认侧边栏背景色
    document.body.style.color = '#000'; // 默认文字颜色
    pageTitle.style.color = '#000'; // 默认标题文字颜色
  }
};
function switchSession(sessionName) {
  currentSession = sessionName;
  chatArea.innerHTML = sessions[sessionName].join('');

  // 移除所有会话项的 current 类
  const sessionItems = document.querySelectorAll('.sessionItem');
  sessionItems.forEach(item => item.classList.remove('current'));

  // 为当前会话项添加 current 类
  const currentSessionItem = document.querySelector(`.sessionItem[textContent="${sessionName}"]`);
  if (currentSessionItem) {
    currentSessionItem.classList.add('current');
  }
}

colorPicker.oninput = (e) => {
  const selectedColor = e.target.value;
  document.body.style.backgroundColor = selectedColor; // 更新页面背景色
  document.querySelector('.pannel').style.backgroundColor = selectedColor; // 更新侧边栏背景色
};

function addMessage(message, isUser = false) {
  const prefix = isUser ? '用户: ' : 'AI: ';
  const messageRow = document.createElement('div');
  messageRow.className = 'chatpdfRow' + (isUser ? ' user' : ''); // 根据消息类型添加类

  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'chatpdfContent' : 'chatpdfAiContent'; // 根据消息类型选择样式
  messageDiv.innerHTML = `${prefix}${message}`;

  messageRow.appendChild(messageDiv);
  chatArea.appendChild(messageRow);

  if (!isUser) {
    typeWriterEffect(messageDiv, message);
  } else {
    messageDiv.innerHTML = `${prefix}${message}`;
  }

  saveSession();
}

function typeWriterEffect(element, text, index = 0) {
  if (index < text.length) {
    element.innerHTML += text.charAt(index);
    index++;
    setTimeout(() => typeWriterEffect(element, text, index), 50); // 50毫秒延迟
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const sessionItems = document.querySelectorAll('.sessionItem');

  sessionItems.forEach(item => {
    item.addEventListener('click', function () {
      // 移除所有 sessionItem 的 selected 类
      sessionItems.forEach(i => i.classList.remove('selected'));
      // 为当前点击的 sessionItem 添加 selected 类
      this.classList.add('selected');
    });
  });
});

function saveSession() {
  if (currentSession) {
    sessions[currentSession] = Array.from(chatArea.children).map(row => row.outerHTML);
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }
}

newSessionBtn.onclick = () => {
  const sessionName = prompt('请输入会话名称:');
  if (sessionName && !sessions[sessionName]) {
    sessions[sessionName] = []; // 初始化会话数据为一个空数组
    currentSession = sessionName;
    renderSessions();
    switchSession(currentSession); // 切换到新建的会话
    saveSession(); // 保存新会话
  }
};

sendBtn.onclick = () => {
  const message = userInput.value;
  if (message) {
    addMessage(message, true);
    userInput.value = '';

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = message;
      addMessage(aiResponse);
    }, 500);
  }
};

responseLength.onchange = (e) => {
  // 处理响应长度调整逻辑，如果需要的话
  console.log(`AI回答长度设置为: ${e.target.value}`);
};

const deleteBtn = document.getElementById('deleteBtn');

deleteBtn.onclick = () => {
  if (currentSession) {
    if (confirm('您确定要删除此对话吗？')) {
      delete sessions[currentSession]; // 删除当前会话
      currentSession = null; // 清空当前会话
      chatArea.innerHTML = ''; // 清空聊天区域
      renderSessions(); // 重新渲染会话列表
      saveSession(); // 保存删除后的会话列表
    }
  } else {
    alert('没有可删除的对话。');
  }
};

renderSessions();