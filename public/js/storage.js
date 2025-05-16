export function getContacts() {
  const stored = localStorage.getItem('contacts');
  return stored ? JSON.parse(stored) : [];
}

export function saveContact(contact) {
  const contacts = getContacts();
  contacts.push(contact);
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

export function deleteContact(index) {
  const contacts = getContacts();
  contacts.splice(index, 1);
  localStorage.setItem('contacts', JSON.stringify(contacts));
}