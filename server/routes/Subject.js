import express from "express";
import Subject from "../models/Subject.js";
import {
  getCollectionData,
  addNewDocumentsToCollection,
  updateCollectionData,
  getDocumentById,
  checkIfValueExistsInCollection,
} from "../utils/dbUtils.js";
import Logger from "../utils/logger.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
const FILE_NAME = "Subject";

/**
 * @route GET /subjects/
 * @desc Get all Subject documents, with optional field filtering
 * @query fields (optional) - Comma-separated list of fields to include
 * @example GET /subjects/
 */
router.get("/", async (req, res) => {
  //#swagger.tags = ['Subject']
  //#swagger.summary = 'Get all Subject documents (optionally only specific fields)'

  try {
    const data = await getCollectionData(Subject);
    Logger.success([FILE_NAME], `Fetched ${data.length} ${FILE_NAME} documents`);
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    Logger.error([FILE_NAME], `Error fetching ${FILE_NAME} data: ${error.message}`);
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
});

/**
 * @route GET /subjects/getDataForCards
 * @desc Get minimal data for displaying Subject cards
 */
router.get("/getDataForCards", async (req, res) => {
  //#swagger.tags = ['Subject']
  //#swagger.summary = 'Get minimal Subject data for cards (only key fields)'

  try {
    const fields = ["subjectName", "courseName", "tags", "imageUrl", "_id"];
    const data = await getCollectionData(Subject, fields);

    Logger.success(
      [FILE_NAME],
      `Fetched ${data.length} ${FILE_NAME} documents (fields: ${fields.join(", ")})`
    );

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    Logger.error([FILE_NAME], `Error fetching card data: ${error.message}`);
    res.status(500).json({ success: false, message: "Error fetching card data" });
  }
});

/**
 * @route POST /subjects
 * @desc Add one or multiple Subject documents
 * @body {Object|Array} - Single document or array of documents
 * @example POST /subjects
 * [
 *   { "subjectName": "סטויכיומטריה", "courseName": "כימיה כללית", "userId": "123" },
 *   { "subjectName": "אלקטרוכימיה", "courseName": "כימיה 2", "userId": "123" }
 * ]
 */
router.post("/", authenticate, async (req, res) => {
  //#swagger.tags = ['Subject']
  //#swagger.summary = 'Add one or multiple Subject documents'
  try {
    const data = req.body;
    const userName = req.user?.name || "unknown";

    if (!data || (Array.isArray(data) && data.length === 0)) {
      Logger.warn([FILE_NAME], "Empty request body");
      return res
        .status(400)
        .json({ success: false, message: "Request body cannot be empty" });
    }

    // Normalize to array for easier handling
    const subjectsArray = Array.isArray(data) ? data : [data];

    // Check for existing courseName before inserting
    for (const subject of subjectsArray) {
      if (!subject.courseName) {
        throw new Error("Each subject must include a courseName field");
      }

      const exists = await checkIfValueExistsInCollection(
        Subject,
        "subjectName",
        subject.subjectName
      );

      if (exists) {
        Logger.warn(
          [FILE_NAME],
          `Attempted to add duplicate subjectName: ${subject.subjectName}`
        );
        throw new Error(
          `Subject with subjectName "${subject.subjectName}" already exists`
        );
      }
    }

    // Add createdBy field
    const processedData = subjectsArray.map((item) => ({
      ...item,
      createdBy: userName,
    }));

    Logger.info(
      [FILE_NAME],
      `Adding ${processedData.length} new ${FILE_NAME} document(s) by ${userName}`
    );

    const savedDocs = await addNewDocumentsToCollection(Subject, processedData);

    Logger.success(
      [FILE_NAME],
      `Successfully added ${processedData.length} new ${FILE_NAME} document(s)`
    );

    res.status(201).json({
      success: true,
      count: processedData.length,
      data: savedDocs,
    });
  } catch (error) {
    Logger.error([FILE_NAME], `Error adding ${FILE_NAME} document(s): ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route PUT /subjects/:id
 * @desc Update an existing Subject document
 * @body {Object} - Updated document data
 */
router.put("/:id", authenticate, async (req, res) => {
  //#swagger.tags = ['Subject']
  //#swagger.summary = 'Update an existing Subject document'
  const { id } = req.params;
  const userName = req.user?.name || "unknown";

  try {
    Logger.info([FILE_NAME], `Updating ${FILE_NAME} document with ID: ${id} by ${userName}`);
    
    // Get the current subject to update editedBy array
    const currentSubject = await Subject.findById(id);
    if (!currentSubject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Add user to editedBy array if not already present
    const editedBy = currentSubject.editedBy || [];
    if (!editedBy.includes(userName)) {
      editedBy.push(userName);
    }

    // Update the subject with editedBy
    const updateData = { ...req.body, editedBy };
    const updatedDoc = await updateCollectionData(Subject, id, updateData);

    Logger.success([FILE_NAME], `Updated ${FILE_NAME} document with ID: ${id}`);
    res.json({ success: true, data: updatedDoc });
  } catch (error) {
    Logger.error([FILE_NAME], `Error updating ${FILE_NAME} document: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route GET /subjects/:id
 * @desc Get a specific Subject document by its _id, with optional field filtering
 * @query fields (optional) - Comma-separated list of fields to include
 * @example GET /subjects/6733a2459d8c1d2fddc3b12a?fields=subjectName,courseName
 */
router.get("/:id", async (req, res) => {
  //#swagger.tags = ['Subject']
  //#swagger.summary = 'Get a specific Subject document by _id (optionally only specific fields)'
  const { id } = req.params;
  const { fields } = req.query;

  try {
    const selectedFields = fields ? fields.split(",").map(f => f.trim()) : [];
    Logger.info(
      [FILE_NAME],
      `GET /${id} - Fetching Subject document with fields: ${
        selectedFields.length > 0 ? selectedFields.join(", ") : "all"
      }`
    );

    const document = await getDocumentById(Subject, id, selectedFields);

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    Logger.success([FILE_NAME], `Fetched document ${id}`);
    res.json({ success: true, data: document });
  } catch (error) {
    Logger.error([FILE_NAME], `Error fetching document ${id}: ${error.message}`);
    res.status(500).json({ success: false, message: "Error fetching document" });
  }
});



export default router;
