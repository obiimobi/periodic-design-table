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

// Firebase Firestore setup
const db = firebase.firestore();

// Page selection dropdown
const pageSelector = document.getElementById('pageSelector');
const newPageFields = document.getElementById('newPageFields');

// Show new page fields if "Create New Page" is selected
pageSelector.addEventListener('change', (e) => {
  const selectedPage = e.target.value;
  if (selectedPage === 'createNewPage') {
    newPageFields.style.display = 'block';
    document.getElementById('pageTitle').disabled = true;  // Disable default title input
    document.getElementById('pageSubtitle').disabled = true;  // Disable default subtitle input
  } else {
    newPageFields.style.display = 'none';
    document.getElementById('pageTitle').disabled = false;  // Enable default title input
    document.getElementById('pageSubtitle').disabled = false;  // Enable default subtitle input
  }
});

// Handle form submission
form.addEventListener('submit', (e) => {
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

  let selectedPageId = pageSelector.value;
  
  // Show a loading indicator while creating a page (optional)
  document.getElementById("loadingMessage").style.display = "block"; // Show the loading message
  
  // Handle page creation
  if (selectedPageId === 'createNewPage') {
    const newPageTitle = data.get('newPageTitle');
    const newPageSubtitle = data.get('newPageSubtitle');

    // Add new page to Firestore
    db.collection('pages').add({
      pageTitle: newPageTitle,
      pageSubtitle: newPageSubtitle,
    })
    .then(docRef => {
      selectedPageId = docRef.id;
      alert('New page created successfully!');
      document.getElementById("loadingMessage").style.display = "none"; // Hide the loading message
    })
    .catch((error) => {
      console.error('Error adding page: ', error);
      alert('Error creating new page!');
      document.getElementById("loadingMessage").style.display = "none"; // Hide the loading message
    });
  }

  // Handle design element submission (new or update)
  const selectedElementId = elementSelector.value;

  if (selectedElementId) {
    // Update existing element
    db.collection('designElements').doc(selectedElementId).update({
      abbr: abbr,
      label: label,
      category: type,
      tooltip: tooltip,
      link: link || null
    })
    .then(() => {
      alert('Design element updated successfully!');
      form.reset();
      document.getElementById("loadingMessage").style.display = "none"; // Hide the loading message
    })
    .catch((error) => {
      console.error('Error updating element: ', error);
      alert('Error updating design element.');
      document.getElementById("loadingMessage").style.display = "none"; // Hide the loading message
    });
  } else {
    // Add a new element
    db.collection('designElements').add({
      pageTitle: pageTitle,
      pageSubtitle: pageSubtitle,
      abbr: abbr,
      label: label,
      category: type,
      tooltip: tooltip,
      link: link || null,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      pageId: selectedPageId // Add reference to the selected page
    })
    .then(() => {
      alert('Design element added successfully!');
      form.reset();
      document.getElementById("loadingMessage").style.display = "none"; // Hide the loading message
    })
    .catch((error) => {
      console.error('Error adding element: ', error);
      alert('Error adding design element.');
      document.getElementById("loadingMessage").style.display = "none"; // Hide the loading message
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
