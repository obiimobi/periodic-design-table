
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
          el.setAttribute("data-type", item.type);

          el.innerHTML = `
            <div class="tooltip-wrapper">
              <div class="abbr">${item.abbr}</div>
              <div class="label">${item.label}</div>
              <div class="tooltip" data-type="${item.type}">
                <p>${item.text}</p>
                ${item.link ? `<a href="${item.link}" target="_blank" class="read-more">Read more ↗︎</a>` : ''}
              </div>
            </div>
          `;
          container.appendChild(el);
        });
      }

      // Filter functionality
      document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('change', () => {
          const active = Array.from(document.querySelectorAll('.filter'))
            .filter(f => f.checked)
            .map(f => f.value);
          document.querySelectorAll('.element').forEach(el => {
            const type = el.getAttribute('data-type');
            // Hide tooltip for faded elements (non-visible)
            const tooltip = el.querySelector('.tooltip');
            if (el.classList.contains('faded')) {
              tooltip.style.visibility = 'hidden';
            } else {
              tooltip.style.visibility = 'visible';
            }
            el.classList.toggle('faded', !active.includes(type));

            // Tooltip positioning fix: Avoid cut-off at edges without affecting the layout
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let tooltipLeft = tooltipRect.left;
            let tooltipTop = tooltipRect.top;

            // Ensure tooltip stays within the viewport bounds
            if (tooltipLeft + tooltipRect.width > viewportWidth) {
              tooltipLeft = viewportWidth - tooltipRect.width - 10;
            }
            if (tooltipTop + tooltipRect.height > viewportHeight) {
              tooltipTop = viewportHeight - tooltipRect.height - 10;
            }

            tooltip.style.left = `${tooltipLeft}px`;
            tooltip.style.top = `${tooltipTop}px`;
          });
        });
      });
    });
});
