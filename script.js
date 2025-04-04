document.addEventListener('DOMContentLoaded', () => {
  
function adjustTooltipPosition(el) {
  const tooltip = el.querySelector('.tooltip');
  const rect = el.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  tooltip.style.top = '100%';
  tooltip.style.bottom = 'auto';
  tooltip.style.left = '50%';
  tooltip.style.right = 'auto';
  tooltip.style.transform = 'translateX(-50%)';

  if (rect.left < 220) {
    tooltip.style.left = '0';
    tooltip.style.transform = 'translateX(0)';
  } else if (rect.right > windowWidth - 220) {
    tooltip.style.left = 'auto';
    tooltip.style.right = '0';
    tooltip.style.transform = 'translateX(0)';
  }

  if (rect.bottom + 300 > windowHeight) {
    tooltip.style.top = 'auto';
    tooltip.style.bottom = '100%';
  }
}

      const toggleButton = document.getElementById('toggleMode');
      const body = document.body;

      if (localStorage.getItem('mode') === 'dark') {
        body.classList.add('dark-mode');
        toggleButton.textContent = '☼';
      }

      toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        toggleButton.textContent = isDark ? '☼' : '☽';
        localStorage.setItem('mode', isDark ? 'dark' : 'light');
      });

      const items = [
  {
    "abbr": "AG",
    "label": "Agile",
    "type": "method",
    "text": "Iterative collaboration."
  },
  {
    "abbr": "API",
    "label": "Application Interface",
    "type": "product",
    "text": "Connecting services and systems."
  },
  {
    "abbr": "App",
    "label": "Mobile App",
    "type": "product",
    "text": "Crafting delightful on-the-go experiences."
  },
  {
    "abbr": "BA",
    "label": "Business Analysis",
    "type": "service",
    "text": "Aligning goals with user needs."
  },
  {
    "abbr": "CMS",
    "label": "Content Management",
    "type": "product",
    "text": "Editing and maintaining web content."
  },
  {
    "abbr": "CX",
    "label": "Customer Experience",
    "type": "service",
    "text": "End-to-end service design focus."
  },
  {
    "abbr": "DS",
    "label": "Design System",
    "type": "product",
    "text": "A framework for consistent design at scale."
  },
  {
    "abbr": "HCD",
    "label": "Human-Centred Design",
    "type": "method",
    "text": "Putting people at the heart of the process."
  },
  {
    "abbr": "IA",
    "label": "Information Architecture",
    "type": "product",
    "text": "Structuring content clearly."
  },
  {
    "abbr": "ID",
    "label": "Interaction Design",
    "type": "service",
    "text": "Creating meaningful moments."
  },
  {
    "abbr": "JTBD",
    "label": "Jobs To Be Done",
    "type": "method",
    "text": "Understanding user motivations and outcomes."
  },
  {
    "abbr": "PD",
    "label": "Participatory Design",
    "type": "method",
    "text": "Co-design with users."
  },
  {
    "abbr": "PLT",
    "label": "Prototyping Toolkit",
    "type": "product",
    "text": "Tools to explore and test ideas."
  },
  {
    "abbr": "PM",
    "label": "Project Management",
    "type": "method",
    "text": "Planning and tracking delivery."
  },
  {
    "abbr": "RE",
    "label": "Research & Evidence",
    "type": "service",
    "text": "Validating design decisions."
  },
  {
    "abbr": "RWD",
    "label": "Responsive Web Design",
    "type": "service",
    "text": "Making experiences work across devices."
  },
  {
    "abbr": "SAAS",
    "label": "Software as a Service",
    "type": "product",
    "text": "Cloud-based product delivery."
  },
  {
    "abbr": "SEO",
    "label": "Search Engine Optimisation",
    "type": "service",
    "text": "Making your work discoverable."
  },
  {
    "abbr": "UCD",
    "label": "User-Centred Design",
    "type": "method",
    "text": "Design informed by real needs."
  },
  {
    "abbr": "UX",
    "label": "User Experience",
    "type": "service",
    "text": "Designing intuitive and engaging interactions."
  },
  {
    "abbr": "WCAG",
    "label": "Accessibility",
    "type": "method",
    "text": "Designing with inclusivity and access in mind."
  }
];

      const table = document.getElementById("elementTable");
      items.forEach(item => {
        const el = document.createElement("div");
        el.className = "element";
        el.setAttribute("data-type", item.type);
        el.innerHTML = `
          <div class="tooltip-wrapper">
            <div class="abbr">${item.abbr}</div>
            <div class="label">${item.label}</div>
            <div class="tooltip">
              <p>${item.text}</p>
              <a href="#" class="read-more">Read more ↗︎</a>
            </div>
          </div>
        `;
        table.appendChild(el);
        el.addEventListener('mouseenter', () => {
          if (!el.classList.contains('faded')) {
            adjustTooltipPosition(el);
            el.classList.add('show-tooltip');
          }
        });
        el.addEventListener('mouseleave', () => {
          el.classList.remove('show-tooltip');
        });
      });

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