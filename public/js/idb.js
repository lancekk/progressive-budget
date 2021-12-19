
let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = e => {
  const db = e.target.result;
  db.createObjectStore('new_budget', {autoIncrement: true});
};

request.onsuccess = e => {
  db = e.target.result;
  if (navigator.onLine) {
    uploadTransactions();
  }
};

request.onerror = e => {
  console.log(e.target.errorCode);
};

function saveRecord(rec) {
  const transaction = db.transaction(['new_budget'], 'readwrite');
  const store = transaction.objectStore('new_budget');
  store.add(rec);
}

function uploadTransactions() {
  const transaction = db.transaction(['new_budget'], 'readwrite');
  const store = transaction.objectStore(['new_budget']);

  const txs = store.getAll();

  txs.onsuccess = () => {
    if (txs.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(txs.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          throw new Error(res);
        }
        const tx = db.transaction(['new_budget'], 'readwrite');
        const txstore = tx.objectStore('new_budget');
        txstore.clear();
        alert('All pending transactions have been submitted!');
      })
      .catch(err => {
        console.log(err);
      });
    }
  };
}

window.addEventListener('online', uploadTransactions);
