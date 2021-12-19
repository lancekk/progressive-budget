
let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = e => {
  const db = e.target.result;
  db.createObjectStore('new_budget', {autoIncrement: true});
};

request.onsuccess = e => {
  db = e.target.result;
  if (navigator.onLine) {
    // ...
  }
};

request.onerror = e => {
  console.log(e.target.errorCode);
}
