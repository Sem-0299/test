import { getContacts, saveContact, deleteContact } from './storage.js';

const contactList    = document.getElementById('contactList');
const contactModal   = document.getElementById('contactModal');
const contactForm    = document.getElementById('contactForm');
const addBtn         = document.getElementById('addContactBtn');
const closeBtn       = document.getElementById('closeModal');
const searchInput    = document.getElementById('searchInput');
const confirmModal   = document.getElementById('confirmModal');
const btnYes         = document.getElementById('confirmYes');
const btnNo          = document.getElementById('confirmNo');

let pendingDeleteIndex = null;

// Toon confirm-modal en wacht op keuze
function showConfirm() {
  return new Promise(resolve => {
    confirmModal.classList.remove('hidden');

    btnYes.onclick = () => {
      confirmModal.classList.add('hidden');
      resolve(true);
    };
    btnNo.onclick = () => {
      confirmModal.classList.add('hidden');
      resolve(false);
    };
  });
}

function renderContacts(contacts) {
  contactList.innerHTML = '';
  contacts.forEach((contact, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="contact-info">
        <strong>${contact.name}</strong><br>
        ${'mobile'}: ${contact.phone}<br>
        ${contact.email ? '📧 ' + contact.email + '<br>' : ''}
        ${contact.company ? '🏢 ' + contact.company : ''}
      </div>
      <button class="deleteBtn" data-index="${idx}">Verwijder</button>
    `;
    contactList.appendChild(li);
  });

  // Zet confirm flow op elke delete-knop
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      pendingDeleteIndex = Number(e.currentTarget.dataset.index);
      const ok = await showConfirm();
      if (ok) {
        deleteContact(pendingDeleteIndex);
        refreshContacts();
      }
      pendingDeleteIndex = null;
    });
  });
}

function refreshContacts() {
  const all = getContacts();
  const filtered = all.filter(c =>
    c.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  renderContacts(filtered);
}

addBtn.addEventListener('click', () => contactModal.classList.remove('hidden'));
closeBtn.addEventListener('click', () => contactModal.classList.add('hidden'));

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const contact = Object.fromEntries(formData.entries());
  saveContact(contact);
  contactForm.reset();
  contactModal.classList.add('hidden');
  refreshContacts();
});

searchInput.addEventListener('input', refreshContacts);

// Initial load
refreshContacts();

// Register service worker voor PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('SW registered:', reg.scope))
    .catch(err => console.error('SW failed:', err));
}