import { storageService } from "./async-storage.service.js";

const STORAGE_KEY = "bugDB";

export const bugService = {
  query,
  getById,
  save,
  remove,
};

async function query() {
  return await storageService.query(STORAGE_KEY);
}

async function getById(bugId) {
  return await storageService.get(STORAGE_KEY, bugId);
}

async function save(bug) {
  return bug._id
    ? storageService.put(STORAGE_KEY, bug)
    : storageService.post(STORAGE_KEY, bug);
}

async function remove(bugId) {
  return await storageService.remove(STORAGE_KEY, bugId);
}
