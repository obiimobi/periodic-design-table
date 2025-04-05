
// JavaScript File - Updated (Version: 2023-10-11)

// Initialize necessary DOM elements
const pageSelector = document.getElementById('pageSelector');
const newPageFields = document.getElementById('newPageFields');
const form = document.getElementById('designElementForm');
const pageInfo = document.getElementById('pageInfo');
const previewContainer = document.getElementById('previewContainer');
const elementSelector = document.getElementById('elementSelector');
const filters = new Set();
let elements = [];

// Show new page fields if "Create New Page" is selected
pageSelector.addEventListener('change', (e) => {
  const selectedPage = e.target.value;
  if (selectedPage === 'createNewPage') {
    newPageFields.style.display = 'block'; // Show the new page fields
  } else {
    newPageFields.style.display = 'none'; // Hide the new page fields
  }
});

// Load Pages (dummy data, replace with real database interaction later)
function loadPages() {
  const dummyPages = [
    { id: 1, pageTitle: 'UX Design' },
    { id: 2, pageTitle: 'UI Design' }
  ];
  
  dummyPages.forEach(page => {
    const option = document.createElement('option');
    option.value = page.id;
    option.textContent = page.pageTitle;
    pageSelector.appendChild(option);
  });
}

// Load Elements (dummy data, replace with real database interaction later)
function loadElements() {
  const dummyElements = [
    { abbr: 'UX', label: 'User Experience' },
    { abbr: 'UI', label: 'User Interface' }
  ];
  
  dummyElements.forEach(element => {
    const option = document.createElement('option');
    option.value = element.abbr;
    option.textContent = element.abbr;
    elementSelector.appendChild(option);
  });
}

// Handle form submission (dummy implementation)
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

  if (!type) {
    alert('Please provide or select a filter (type).');
    return;
  }

  // Create new type if it doesn't exist
  if (newType && !filters.has(newType)) {
    filters.add(newType);
    const option = document.createElement('option');
    option.value = newType;
    option.textContent = newType;
    document.getElementById('typeSelect').appendChild(option);
  }

  // Handle page creation
  if (pageTitle && !pageInfo.hasChildNodes()) {
    const h1 = document.createElement('h1');
    h1.textContent = pageTitle;
    pageInfo.appendChild(h1);
    if (pageSubtitle) {
      const h2 = document.createElement('h2');
      h2.textContent = pageSubtitle;
      pageInfo.appendChild(h2);
    }
  }

  // Add tile to preview
  const el = document.createElement('div');
  el.className = 'preview';
  el.innerHTML = `
    <div class="abbr">${abbr}</div>
    <div class="label">${label} (${type})</div>
    <div class="text">${tooltip}</div>
    ${link ? `<a href="${link}" target="_blank">Read more ↗︎</a>` : ''}
  `;
  previewContainer.appendChild(el);

  // Add tile to the existing elements section (for visual display)
  const existing = document.createElement('div');
  existing.className = 'existing-tile';
  existing.innerHTML = `
    <div class="abbr">${abbr}</div>
    <div class="label">${label} (${type})</div>
    <div class="text">${tooltip}</div>
    ${link ? `<a href="${link}" target="_blank">Read more ↗︎</a>` : ''}
  `;
  document.getElementById('existingTiles').appendChild(existing);

  // Reset the form after submission
  form.reset();
});

// Load Pages and Elements on Page Load
loadPages();
loadElements();
