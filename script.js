// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjD5OquKymNs27ObbEELux9cPEzIndGUI",
  authDomain: "design-elements-f3448.firebaseapp.com",
  projectId: "design-elements-f3448",
  storageBucket: "design-elements-f3448.firebasestorage.app",
  messagingSenderId: "81965502008",
  appId: "1:81965502008:web:9bfde1d9719db04a7420cd",
  measurementId: "G-2YJ4V8N8M7"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Load Pages into Page Selector
function loadPages() {
  db.collection('pages').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const pageData = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = pageData.pageTitle;
      pageSelector.appendChild(option);
    });
  });
}

// Load Design Elements into Element Selector
function loadElements() {
  db.collection('designElements').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const elementData = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = elementData.abbr;
      elementSelector.appendChild(option);
    });
  });
}

// Pre-fill form when element is selected for editing
elementSelector.addEventListener('change', (event) => {
  const selectedElementId = event.target.value;
  if (selectedElementId) {
    db.collection('designElements').doc(selectedElementId).get().then(doc => {
      const data = doc.data();
      document.getElementById('abbr').value = data.abbr;
      document.getElementById('label').value = data.label;
      document.getElementById('typeSelect').value = data.type;
      document.getElementById('text').value = data.tooltip;
      document.getElementById('link').value = data.link || '';
    });
  }
});

// Form Submission
form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const abbr = data.get('abbr').toUpperCase();
  const label = data.get('label');
  const tooltip = data.get('text');
  const link = data.get('link');
  const pageTitle = data.get('pageTitle');
  const pageSubtitle = data.get('pageSubtitle');
  const newType = data.get('newType');
  const selectedType = data.get('typeSelect');
  const type = newType || selectedType;

  // Ensure category (type) is selected
  if (!type) {
    alert('Please provide or select a filter (type).');
    return;
  }

  // Check for existing element
  const selectedElementId = elementSelector.value;

  // Create or update element
  if (selectedElementId) {
    // Update the existing element in Firestore
    db.collection('designElements').doc(selectedElementId).update({
      abbr: abbr,
      label: label,
      category: type,
      tooltip: tooltip,
      link: link || null
    })
    .then(() => {
      alert('Design element updated!');
      form.reset();
    })
    .catch((error) => {
      console.error('Error updating element: ', error);
      alert('Error updating design element.');
    });
  } else {
    // Add a new design element to Firestore
    db.collection('designElements').add({
      pageTitle: pageTitle,
      pageSubtitle: pageSubtitle,
      abbr: abbr,
      label: label,
      category: type,
      tooltip: tooltip,
      link: link || null,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      alert('Design element added!');
      form.reset();
    })
    .catch((error) => {
      console.error('Error adding element: ', error);
      alert('Error adding design element.');
    });
  }
});

// Load pages and elements on page load
loadPages();
loadElements();

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
