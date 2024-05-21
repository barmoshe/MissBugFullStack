import { MongoClient, ObjectId } from "mongodb";
import { utilService } from "../../services/util.service.js";

// MongoDB connection string
const url = "mongodb+srv://admin:admin@misterbug.sr2xsoj.mongodb.net/";
const dbName = "MissBug";
const collectionName = "bugDB";
const PAGE_SIZE = 5;

const client = new MongoClient(url);

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function connect() {
  if (!client) {
    await client.connect();
  }
  return client.db(dbName).collection(collectionName);
}

async function query(filterBy, sortBy, pageIdx = 1) {
  try {
    const collection = await connect();

    let query = {};
    if (filterBy) {
      query = _buildFilterQuery(filterBy);
    }

    const totalDocs = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE);
    if (pageIdx > totalPages) {
      throw new Error("Invalid page index");
    }

    let bugs = await collection
      .find(query)
      .skip((pageIdx - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray();

    if (sortBy) {
      bugs = _sortBugs(sortBy, bugs);
    }

    return {
      bugs,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
}

async function getById(bugId) {
  try {
    const collection = await connect();
    const bug = await collection.findOne({
      _id: ObjectId.createFromHexString(bugId),
    });
  } catch (error) {
    throw error;
  }
}

async function remove(bugId) {
  try {
    const collection = await connect();
    await collection.deleteOne({ _id: ObjectId.createFromHexString(bugId) });
  } catch (error) {
    throw error;
  }
}

async function save(bugToSave) {
  try {
    const collection = await connect();

    if (bugToSave._id) {
      const bugId = ObjectId.createFromHexString(bugToSave._id);
      await collection.updateOne({ _id: bugId }, { $set: bugToSave });
    } else {
      bugToSave._id = new ObjectId();
      bugToSave.createdAt = Date.now();
      await collection.insertOne(bugToSave);
    }

    return bugToSave;
  } catch (error) {
    throw error;
  }
}

function _buildFilterQuery(filterBy) {
  const query = {};

  if (filterBy.txt) {
    const txt = filterBy.txt.toLowerCase();
    query.$or = [
      { title: { $regex: txt, $options: "i" } },
      { description: { $regex: txt, $options: "i" } },
      { labels: { $elemMatch: { $regex: txt, $options: "i" } } },
    ];
  }

  if (filterBy.severity) {
    query.severity = { $gte: filterBy.severity };
  }

  return query;
}

function _sortBugs(sortBy, bugs) {
  switch (sortBy) {
    case "title":
      return bugs.sort((a, b) => a.title.localeCompare(b.title));
    case "severity":
      return bugs.sort((a, b) => a.severity - b.severity);
    case "createdAt":
      return bugs.sort((a, b) => a.createdAt - b.createdAt);
    default:
      return bugs;
  }
}

// Example function to print all data in MissBug database and bugDB collection
// async function printAllData() {
//   try {
//     const collection = await connect();
//     const data = await collection.find().toArray();
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }
// printAllData();
