function ancient(timestamp2, timestamp1 = Date.now()) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  const diffMilliseconds = Math.abs(date1 - date2);
  const diffSeconds = Math.floor(diffMilliseconds / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  return {
    minutes: diffMinutes % 60,
    hours: diffHours % 24,
    day: diffDays % 30,
  };
}
function openDatabase() {
  const dbName = "app";
  const dbVersion = 1;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onupgradeneeded = function (e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("Linguaverse")) {
        db.createObjectStore("Linguaverse", { keyPath: "id" });
      }
    };
    request.onerror = (e) => {
      reject(e.target.error);
    };
    request.onsuccess = (e) => {
      const db = e.target.result;
      resolve(db);
    };
  });
}
const db = openDatabase();
function save(data) {
  return new Promise((resolve, reject) => {
    db.then(async (db) => {
      await remove(data.id);
      const transaction = db.transaction("Linguaverse", "readwrite");
      const objectStore = transaction.objectStore("Linguaverse");
      data.date = Date.now();
      const requestAdd = objectStore.add(data);
      requestAdd.onsuccess = () => {
        resolve();
      };
      requestAdd.onerror = (event) => {
        reject(event.target.error);
      };
    });
  });
}
function find(dkey) {
  return new Promise(async (resolve, reject) => {
    if (!dkey) {
      resolve(undefined);
    }
    db.then((db) => {
      const transaction = db.transaction("Linguaverse", "readonly");
      const objectStore = transaction.objectStore("Linguaverse");
      const requestGet = objectStore.get(dkey);
      requestGet.onsuccess = (event) => {
        const data = event.target.result;
        resolve(data);
        //! not online during dev
        if (data && navigator.onLine && ancient(data.date).hours > 12) {
          remove(data.id).then(() => {});
        }
      };
      requestGet.onerror = (event) => {
        reject(event.target.error);
      };
    });
  });
}
function remove(dkey) {
  return new Promise(async (resolve, reject) => {
    db.then((db) => {
      const transaction = db.transaction("Linguaverse", "readwrite");
      const objectStore = transaction.objectStore("Linguaverse");
      const requestDelete = objectStore.delete(dkey);
      requestDelete.onsuccess = () => {
        resolve();
      };
      requestDelete.onerror = (event) => {
        reject(event.target.error);
      };
    });
  });
}
function drop() {
  return new Promise(async (resolve, reject) => {
    db.then((db) => {
      try {
        const transaction = db.transaction("Linguaverse", "readwrite");
        transaction.db.deleteObjectStore("Linguaverse");
        resolve(undefined);
      } catch (error) {
        reject(error);
      }
    });
  });
}
export default { find, save, remove, drop };
