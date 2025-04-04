document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleMode');
  const body = document.body;

  if (localStorage.getItem('mode') === 'dark') {
    body.classList.add('dark-mode');
    toggleButton.textContent = '🌞';
  }

  toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    toggleButton.textContent = isDark ? '🌞' : '🌚';
    localStorage.setItem('mode', isDark ? 'dark' : 'light');
  });

  const pageId = document.body.getAttribute('data-table');
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      const table = data.tables.find(t => t.id === pageId);
      const container = document.getElementById('elementTable');
      if (table) {
        table.items.forEach(item => {
          const el = document.createElement('div');
          el.className = 'element';
          el.setAttribute("data-type", item.type.toLowerCase());
          el.innerHTML = `
            <div class="tooltip-wrapper">
              <div class="abbr">${item.abbr}</div>
              <div class="label">${item.label}</div>
              <div class="tooltip">
                <p>${item.text}</p>
                ${item.link ? `<a href="${item.link}" target="_blank" class="read-more">Read more ↗︎</a>` : ''}
              </div>
            </div>
          `;
          container.appendChild(el);
        });
      }

      document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('change', () => {
          const active = Array.from(document.querySelectorAll('.filter'))
            .filter(f => f.checked)
            .map(f => f.value);
          document.querySelectorAll('.element').forEach(el => {
            el.classList.toggle('faded', !active.includes(el.getAttribute('data-type')));
          });
        });
      });
    });
});
