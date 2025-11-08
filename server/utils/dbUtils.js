import Logger from "./logger.js";

const FILE_NAME = "dbUtils";

/**
 * Fetch all documents from a collection, optionally selecting specific fields.
 * @param {mongoose.Model} Model - The Mongoose model to query.
 * @param {Array<string>} [fields=[]] - Optional list of fields to return.
 * @returns {Promise<Array>} - Array of documents (filtered if fields are provided).
 */
export const getCollectionData = async (Model, fields = []) => {
  try {
    const projection =
      Array.isArray(fields) && fields.length > 0 ? fields.join(" ") : undefined;

    const documents = await Model.find({}, projection).lean();

    if (!documents.length) {
      Logger.warn([FILE_NAME], `No documents found in ${Model.collection.name}`);
      return [];
    }

    Logger.success(
      [FILE_NAME],
      `Fetched ${documents.length} documents from ${Model.collection.name} ${
        projection ? `(fields: ${projection})` : "(all fields)"
      }`
    );

    return documents;
  } catch (error) {
    Logger.error([FILE_NAME], `Error fetching collection data: ${error.message}`);
    throw error;
  }
};

/**
 * Add one or multiple documents to a collection.
 * @param {mongoose.Model} Model - The Mongoose model.
 * @param {Object|Array} data - Document or array of documents.
 * @returns {Promise<Object|Array>} - The saved document(s).
 */
export const addNewDocumentsToCollection = async (Model, data) => {
  try {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      Logger.warn([FILE_NAME], "Attempted to add empty document data");
      throw new Error("Document data is required");
    }

    Logger.info([FILE_NAME], `Adding new document(s) to ${Model.collection.name}`);

    let savedDocs;
    if (Array.isArray(data)) {
      savedDocs = await Model.insertMany(data);
      Logger.success([FILE_NAME], `Inserted ${savedDocs.length} documents into ${Model.collection.name}`);
    } else {
      const newDoc = new Model(data);
      savedDocs = await newDoc.save();
      Logger.success([FILE_NAME], `Inserted single document with ID: ${savedDocs._id}`);
    }

    return savedDocs;
  } catch (error) {
    Logger.error([FILE_NAME], `Error adding document(s): ${error.message}`);
    throw error;
  }
};

/**
 * Update a document by its ID in a collection.
 * @param {mongoose.Model} Model - The Mongoose model.
 * @param {string} id - The document ID.
 * @param {Object} data - The updated data.
 * @returns {Promise<Object>} - The updated document.
 */
export const updateCollectionData = async (Model, id, data) => {
  try {
    if (!id) {
      Logger.warn([FILE_NAME], "Missing ID for update operation");
      throw new Error("Document ID is required for update");
    }

    Logger.info(
      [FILE_NAME],
      `Updating document with ID ${id} in ${Model.collection.name}`
    );

    const updatedDocument = await Model.findByIdAndUpdate(id, data, { new: true });

    if (!updatedDocument) {
      Logger.warn([FILE_NAME], `No document found with ID: ${id}`);
      throw new Error("Document not found for the given ID");
    }

    Logger.success([FILE_NAME], `Successfully updated document with ID: ${id}`);
    return updatedDocument;
  } catch (error) {
    Logger.error([FILE_NAME], `Error updating document: ${error.message}`);
    throw error;
  }
};

/**
 * Fetch a single document by its _id, optionally selecting specific fields.
 * @param {mongoose.Model} Model - The Mongoose model to query.
 * @param {string} id - The _id of the document to fetch.
 * @param {Array<string>} [fields=[]] - Optional list of fields to return.
 * @returns {Promise<Object|null>} - The document if found, or null.
 */
export const getDocumentById = async (Model, id, fields = []) => {
  const FILE_NAME = "dbUtils";
  try {
    const projection =
      Array.isArray(fields) && fields.length > 0 ? fields.join(" ") : undefined;

    const document = await Model.findById(id, projection).lean();

    if (!document) {
      Logger.warn([FILE_NAME], `No document found with _id: ${id} in ${Model.collection.name}`);
      return null;
    }

    Logger.success(
      [FILE_NAME],
      `Fetched document ${id} from ${Model.collection.name} ${
        projection ? `(fields: ${projection})` : "(all fields)"
      }`
    );

    return document;
  } catch (error) {
    Logger.error([FILE_NAME], `Error fetching document ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Check if a value already exists in a given field within a collection.
 * @param {mongoose.Model} Model - The Mongoose model to query.
 * @param {string} field - The field name to check.
 * @param {*} value - The value to search for.
 * @returns {Promise<boolean>} - True if value exists, false otherwise.
 */
export const checkIfValueExistsInCollection = async (Model, field, value) => {
  try {
    if (!field || typeof field !== "string") {
      Logger.warn([FILE_NAME], "Invalid or missing field name for existence check");
      throw new Error("Field name must be a non-empty string");
    }

    Logger.info(
      [FILE_NAME],
      `Checking if value "${value}" exists in field "${field}" of ${Model.collection.name}`
    );

    const exists = await Model.exists({ [field]: value });

    if (exists) {
      Logger.success(
        [FILE_NAME],
        `Value "${value}" already exists in field "${field}" of ${Model.collection.name}`
      );
      return true;
    }

    Logger.info(
      [FILE_NAME],
      `Value "${value}" does not exist in field "${field}" of ${Model.collection.name}`
    );
    return false;
  } catch (error) {
    Logger.error([FILE_NAME], `Error checking value existence: ${error.message}`);
    throw error;
  }
};
