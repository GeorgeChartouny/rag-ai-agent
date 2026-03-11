(function () {
  const TOP_K = 5;

  const uploadForm = document.getElementById('upload-form');
  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('upload-btn');
  const uploadStatus = document.getElementById('upload-status');

  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const messagesEl = document.getElementById('messages');
  const chatStatus = document.getElementById('chat-status');

  function setStatus(el, text, type) {
    el.textContent = text;
    el.className = 'status ' + (type || '');
  }

  function clearStatus(el) {
    el.textContent = '';
    el.className = 'status';
  }

  uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      setStatus(uploadStatus, 'Please select a PDF file.', 'error');
      return;
    }
    if (file.type !== 'application/pdf') {
      setStatus(uploadStatus, 'Please upload a PDF file.', 'error');
      return;
    }

    uploadBtn.disabled = true;
    setStatus(uploadStatus, 'Uploading…', 'loading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(uploadStatus, data.error || 'Upload failed.', 'error');
        return;
      }
      setStatus(
        uploadStatus,
        data.message || 'PDF processed, ' + (data.chunks ?? 0) + ' chunks.',
        'success'
      );
      fileInput.value = '';
    } catch (err) {
      setStatus(uploadStatus, err.message || 'Network error.', 'error');
    } finally {
      uploadBtn.disabled = false;
    }
  });

  function appendMessage(role, content, sources) {
    const wrap = document.createElement('div');
    wrap.className = 'message ' + role;

    const contentEl = document.createElement('div');
    contentEl.className = 'content';
    contentEl.textContent = content;

    wrap.appendChild(contentEl);

    if (sources && sources.length > 0) {
      const sourcesWrap = document.createElement('details');
      sourcesWrap.className = 'sources';
      const summary = document.createElement('summary');
      summary.textContent = 'Sources (' + sources.length + ')';
      sourcesWrap.appendChild(summary);
      const ul = document.createElement('ul');
      sources.forEach(function (s) {
        const li = document.createElement('li');
        const text = (s.text || '').slice(0, 200);
        li.textContent = (text && text.length === 200 ? text + '…' : text) + (s.score != null ? ' (score: ' + s.score + ')' : '');
        ul.appendChild(li);
      });
      sourcesWrap.appendChild(ul);
      wrap.appendChild(sourcesWrap);
    }

    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendLoadingMessage() {
    const wrap = document.createElement('div');
    wrap.className = 'message assistant loading';
    const contentEl = document.createElement('div');
    contentEl.className = 'content';
    contentEl.textContent = 'Thinking';
    wrap.appendChild(contentEl);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return wrap;
  }

  chatForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const message = (messageInput.value || '').trim();
    if (!message) {
      setStatus(chatStatus, 'Please enter a message.', 'error');
      return;
    }

    sendBtn.disabled = true;
    clearStatus(chatStatus);

    appendMessage('user', message);
    messageInput.value = '';

    const loadingEl = appendLoadingMessage();

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, topK: TOP_K }),
      });
      const data = await res.json().catch(() => ({}));

      loadingEl.remove();

      if (!res.ok) {
        setStatus(chatStatus, data.error || 'Request failed.', 'error');
        appendMessage('assistant', 'Sorry, something went wrong.');
        return;
      }

      appendMessage('assistant', data.answer || '', data.sources || []);
    } catch (err) {
      loadingEl.remove();
      setStatus(chatStatus, err.message || 'Network error.', 'error');
      appendMessage('assistant', 'Sorry, something went wrong.');
    } finally {
      sendBtn.disabled = false;
      messageInput.focus();
    }
  });
})();
