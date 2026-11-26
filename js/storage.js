const STORAGE_KEY = "carJournalGarage";


async function loadGarageData() {
  const storedData =
    localStorage.getItem(STORAGE_KEY);

  if (storedData) {
    return JSON.parse(storedData);
  }


  const response =
    await fetch("data/garage.json");

  if (!response.ok) {
    throw new Error(
      "Could not load garage.json"
    );
  }

  const garage =
    await response.json();

  saveGarageData(garage);

  return garage;
}


function saveGarageData(garage) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(garage)
  );
}

const MEDIA_DATABASE_NAME = "carJournalMedia";
const MEDIA_DATABASE_VERSION = 1;
const MEDIA_STORE_NAME = "media";


function openMediaDatabase() {
  return new Promise((resolve, reject) => {
    const request =
      indexedDB.open(
        MEDIA_DATABASE_NAME,
        MEDIA_DATABASE_VERSION
      );

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(MEDIA_STORE_NAME)) {
        database.createObjectStore(
          MEDIA_STORE_NAME,
          { keyPath: "id" }
        );
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function saveMediaFile(id, file) {
  const database =
    await openMediaDatabase();

  return new Promise((resolve, reject) => {
    const transaction =
      database.transaction(
        MEDIA_STORE_NAME,
        "readwrite"
      );

    const store =
      transaction.objectStore(MEDIA_STORE_NAME);

    store.put({
      id: id,
      blob: file,
      name: file.name,
      mimeType: file.type
    });

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}


async function loadMediaFile(id) {
  const database =
    await openMediaDatabase();

  return new Promise((resolve, reject) => {
    const transaction =
      database.transaction(
        MEDIA_STORE_NAME,
        "readonly"
      );

    const store =
      transaction.objectStore(MEDIA_STORE_NAME);

    const request =
      store.get(id);

    request.onsuccess = () => {
      database.close();
      resolve(request.result);
    };

    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}


async function deleteMediaFile(id) {
  const database =
    await openMediaDatabase();

  return new Promise((resolve, reject) => {
    const transaction =
      database.transaction(
        MEDIA_STORE_NAME,
        "readwrite"
      );

    const store =
      transaction.objectStore(MEDIA_STORE_NAME);

    store.delete(id);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}