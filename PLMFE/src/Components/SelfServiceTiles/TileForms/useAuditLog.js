import { useAxios } from "../../../api/axios.hook";

export const useAuditLog = () => {
    const { customAxios } = useAxios();

    /**
     * Recursively removes keys with specific conditions:
     * - If the value is an object and equals `{ "operation": "U" }`
     * - If the value is an empty array
     * - If the value is an empty object
     * @param {Object|Array} obj - The object or array to clean
     * @returns {Object|Array} - Cleaned object or array
     */
    const removeKeysWithExactOperationUAndEmptyArrays = (obj) => {
        try {
            if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                // Iterate over the keys of the object
                for (const key in obj) {
                    const value = obj[key];

                    // Remove the key if the value is exactly { "operation": "U" }
                    if (
                        value &&
                        typeof value === 'object' &&
                        !Array.isArray(value) &&
                        Object.keys(value).length === 1 &&
                        value.operation === 'U'
                    ) {
                        delete obj[key];
                    }
                    // Remove the key if the value is an empty array
                    else if (Array.isArray(value) && value.length === 0) {
                        delete obj[key];
                    }
                    // Remove the key if the value is an empty object
                    else if (
                        value &&
                        typeof value === 'object' &&
                        !Array.isArray(value) &&
                        Object.keys(value).length === 0
                    ) {
                        delete obj[key];
                    }
                    // Recursively process nested structures (Object or Array)
                    else if (value && (typeof value === 'object' || Array.isArray(value))) {
                        removeKeysWithExactOperationUAndEmptyArrays(value);
                        // After recursion, check if the value turned into an empty object
                        if (
                            typeof value === 'object' &&
                            !Array.isArray(value) &&
                            Object.keys(value).length === 0
                        ) {
                            delete obj[key];
                        }
                    }
                }
            } else if (Array.isArray(obj)) {
                // Iterate over the array and remove invalid items
                for (let i = obj.length - 1; i >= 0; i--) {
                    const item = obj[i];

                    // Remove items if they match { "operation": "U" }, empty arrays, or empty objects
                    if (
                        item &&
                        typeof item === 'object' &&
                        !Array.isArray(item) &&
                        Object.keys(item).length === 1 &&
                        item.operation === 'U'
                    ) {
                        obj.splice(i, 1);
                    } else if (Array.isArray(item) && item.length === 0) {
                        obj.splice(i, 1);
                    } else if (
                        item &&
                        typeof item === 'object' &&
                        !Array.isArray(item) &&
                        Object.keys(item).length === 0
                    ) {
                        obj.splice(i, 1);
                    } else if (item && (typeof item === 'object' || Array.isArray(item))) {
                        removeKeysWithExactOperationUAndEmptyArrays(item);
                        // After recursion, check if the item turned into an empty object
                        if (
                            typeof item === 'object' &&
                            !Array.isArray(item) &&
                            Object.keys(item).length === 0
                        ) {
                            obj.splice(i, 1);
                        }
                    }
                }
            }

            return obj;
        } catch (error) {
            console.error("Error in removeKeysWithExactOperationUAndEmptyArrays:", error);
            return obj; // Return the object even if an error occurs
        }
    };

    /**
     * Fetches case log history based on case number and table names.
     * @param {String} caseNumber - Case number to filter
     * @param {String} token - Authentication token
     * @param {Array} tableNames - List of table names to query
     * @returns {Array|null} - Returns audit logs or null if an error occurs
     */
    const getCaseLogHistory = async (caseNumber, token, tableNames) => {
        try {
            let getApiJson = {
                tableNames: tableNames,
                whereClause: { caseId: caseNumber },
            };

            const res = await customAxios.post("/generic/get", getApiJson, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const apiStat = res.data.Status;

            if (apiStat === -1) {
                alert("Error in fetching audit log");
                return null;
            }

            if (apiStat === 0) {
                const auditLogs = res.data.data.auditLog;
                return auditLogs;
            }
        } catch (error) {
            console.error("Error in getCaseLogHistory:", error);
            alert("An error occurred while fetching audit log");
            return null;
        }
    };

    /**
     * Gets the current date and time in UTC format.
     * @returns {String} - UTC formatted date string
     */
    const getFormattedDateInUTC = () => {
        try {
            const now = new Date();
            const year = now.getUTCFullYear();
            const month = String(now.getUTCMonth() + 1).padStart(2, "0");
            const date = String(now.getUTCDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0");

            return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
        } catch (error) {
            console.error("Error in getFormattedDateInUTC:", error);
            return null;
        }
    };

    /**
     * Creates an audit log entry by sending data to the server.
     * @param {String} flowId - Workflow ID
     * @param {String} stageId - Stage ID
     * @param {String} stageName - Stage name
     * @param {String} caseId - Case ID
     * @param {String} username - Username performing the operation
     * @param {Object} cleanedApiJson - Cleaned API JSON data
     * @param {String} operationKey - Operation key to assign
     * @param {String} token - Authentication token
     */
    const createAuditLog = async (
        flowId,
        stageId,
        stageName,
        caseId,
        username,
        cleanedApiJson,
        operationKey,
        token
    ) => {
        try {
            const logJson = JSON.parse(JSON.stringify(cleanedApiJson));
            const logData = removeKeysWithExactOperationUAndEmptyArrays({ ...logJson });
            addOperationKey(logData, operationKey);

            await customAxios.post(
                "/generic/update",
                {
                    AuditLog: {
                        flowId: flowId,
                        stageId: stageId,
                        stageName: stageName,
                        caseId: caseId,
                        caseNumber: null, // Use caseNumber or let the backend generate it
                        username: username,
                        payloadData: JSON.stringify(logData),
                        actionDate: getFormattedDateInUTC(),
                    },
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.error("Error in createAuditLog:", error);
        }
    };

    /**
     * Adds an "operation" key to objects and their nested structures.
     * @param {Object|Array} data - Data to process
     * @param {String} operationValue - Operation value to assign
     */
    const addOperationKey = (data, operationValue) => {
        try {
            for (const key in data) {
                if (typeof data[key] === "object" && !Array.isArray(data[key]) && data[key] !== null) {
                    data[key].operation = operationValue; // Add the "operation" key
                    addOperationKey(data[key], operationValue); // Recursively handle nested objects
                } else if (Array.isArray(data[key])) {
                    data[key].forEach((item) => {
                        if (typeof item === "object" && item !== null) {
                            addOperationKey(item, operationValue); // Handle objects within arrays
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error in addOperationKey:", error);
        }
    };

    return {
        createAuditLog,
        getCaseLogHistory,
    };
};
