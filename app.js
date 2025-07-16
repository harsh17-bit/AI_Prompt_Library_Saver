const promptForm = document.getElementById('prompt-form');
const promptBoard = document.getElementById('prompt-board');
const filterType = document.getElementById('filter-type');
const searchKeyword = document.getElementById('search-keyword');
const clearFilters = document.getElementById('clear-filters');

const TYPE_COLORS = {
  chat: 'border-l-blue-500 bg-blue-50',
  code: 'border-l-green-500 bg-green-50',
  image: 'border-l-pink-500 bg-pink-50',
};
const TYPE_TEXT = {
  chat: 'text-blue-700 bg-blue-100',
  code: 'text-green-700 bg-green-100',
  image: 'text-pink-700 bg-pink-100',
};

const SAMPLE_PROMPTS = [
  {
    title: 'Summarize this article',
    type: 'chat',
    text: 'Summarize the following article in 3 bullet points.'
  },
  {
    title: 'Generate Python function',
    type: 'code',
    text: 'Write a Python function to reverse a string.'
  },
  {
    title: 'Create a fantasy landscape',
    type: 'image',
    text: 'A breathtaking fantasy landscape with mountains, rivers, and a castle at sunset.'
  },
  {
    title: 'Debug this code',
    type: 'code',
    text: 'Find and fix the bug in the following JavaScript code.'
  },
  {
    title: 'Roleplay as a travel agent',
    type: 'chat',
    text: 'Act as a travel agent and help me plan a trip to Japan.'
  },
  {
    title: 'Write a haiku about AI',
    type: 'chat',
    text: 'Compose a haiku about artificial intelligence and its impact.'
  },
  {
    title: 'SQL Query for Top Customers',
    type: 'code',
    text: 'Write an SQL query to find the top 5 customers by total purchase amount.'
  },
  {
    title: 'Generate logo concept',
    type: 'image',
    text: 'A modern, minimal logo for a tech startup called "Promptly".'
  },
  {
    title: 'Explain recursion to a child',
    type: 'chat',
    text: 'Explain the concept of recursion in simple terms for a 10-year-old.'
  },
  {
    title: 'Create a cyberpunk cityscape',
    type: 'image',
    text: 'A vibrant cyberpunk city at night, neon lights, flying cars, and bustling streets.'
  },
  {
    title: 'Regex for email validation',
    type: 'code',
    text: 'Provide a regular expression to validate email addresses.'
  },
  {
    title: 'Brainstorm blog post ideas',
    type: 'chat',
    text: 'List 10 creative blog post ideas for a productivity website.'
  },
  {
    title: 'Fantasy character portrait',
    type: 'image',
    text: 'A detailed portrait of a fantasy elf warrior, with intricate armor and a mystical background.'
  }
];

let prompts = JSON.parse(localStorage.getItem('prompts') || 'null');
if (!prompts) {
  prompts = SAMPLE_PROMPTS.slice();
  localStorage.setItem('prompts', JSON.stringify(prompts));
}

function savePrompts() {
  localStorage.setItem('prompts', JSON.stringify(prompts));
}

function renderPrompts() {
  let filtered = prompts;
  if (filterType.value) {
    filtered = filtered.filter(p => p.type === filterType.value);
  }
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(kw) ||
      p.text.toLowerCase().includes(kw)
    );
  }
  promptBoard.innerHTML = '';
  if (!filtered.length) {
    promptBoard.innerHTML = '<div class="text-center text-gray-400">No prompts found.</div>';
    return;
  }
  filtered.slice().reverse().forEach((prompt, idx) => {
    // Animation: fade/slide-in
    const card = document.createElement('div');
    card.className = `prompt-card border-l-8 ${TYPE_COLORS[prompt.type] || 'border-l-gray-400 bg-gray-50'} rounded-xl shadow-md p-5 transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl relative overflow-hidden opacity-0 translate-y-6`;
    card.style.animation = `fadeInUp 0.5s ease ${(idx * 0.07 + 0.1)}s forwards`;
    card.innerHTML = `
      <div class="prompt-header flex items-center gap-3 mb-2">
        <span class="prompt-title text-lg font-semibold flex-1">${prompt.title}</span>
        <span class="prompt-type px-3 py-1 rounded-md ${TYPE_TEXT[prompt.type] || 'text-gray-700 bg-gray-100'} text-sm font-medium capitalize">${prompt.type}</span>
        <button class="toggle-btn text-xl text-gray-400 hover:text-blue-600 transition-colors duration-200 ml-2 transform" title="Expand/collapse">&#9660;</button>
      </div>
      <div class="prompt-content font-mono text-base bg-white rounded-lg border border-gray-100 px-4 py-3 mb-1 transition-all duration-300 ease-in-out">${prompt.text.replace(/\n/g, '<br>')}</div>
    `;
    const content = card.querySelector('.prompt-content');
    const toggleBtn = card.querySelector('.toggle-btn');
    // Animation: collapse/expand with smooth height/opacity and toggle rotation
    function collapse() {
      content.style.maxHeight = content.scrollHeight + 'px';
      setTimeout(() => {
        content.style.transition = 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s';
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
      }, 10);
      card.classList.add('collapsed');
      toggleBtn.innerHTML = '&#9654;';
      toggleBtn.style.transform = 'rotate(-90deg)';
    }
    function expand() {
      content.style.transition = 'none';
      content.style.maxHeight = '0px';
      content.style.opacity = '0';
      setTimeout(() => {
        content.style.transition = 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s';
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      }, 10);
      card.classList.remove('collapsed');
      toggleBtn.innerHTML = '&#9660;';
      toggleBtn.style.transform = 'rotate(0deg)';
    }
    // Start collapsed for all but the first
    if (idx !== 0) {
      collapse();
    } else {
      expand();
    }
    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (card.classList.contains('collapsed')) {
        expand();
      } else {
        collapse();
      }
    });
    promptBoard.appendChild(card);
  });
}

// Add fade/slide-in animation via CSS
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);

promptForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('prompt-title').value.trim();
  const type = document.getElementById('prompt-type').value;
  const text = document.getElementById('prompt-text').value.trim();
  if (!title || !type || !text) return;
  prompts.push({ title, type, text });
  savePrompts();
  renderPrompts();
  promptForm.reset();
});

filterType.addEventListener('change', renderPrompts);
searchKeyword.addEventListener('input', renderPrompts);
clearFilters.addEventListener('click', e => {
  filterType.value = '';
  searchKeyword.value = '';
  renderPrompts();
});

// Initial render
renderPrompts(); 