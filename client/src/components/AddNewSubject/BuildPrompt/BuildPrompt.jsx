import React, { useState, useRef, useMemo } from 'react';
import { Input, Card, Space, Tooltip, Button, message } from "antd";
import { CopyOutlined, InfoCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { useAppContext } from '../../../context';
import subjectJsonClass from '../../../../jsonClass.json'
const subjectClass = subjectJsonClass; // Import the JSON structure

const BuildPrompt = () => {
    // 1. Setup for Copy Functionality
    const promptRef = useRef(null); // Ref to hold the prompt text div
    const [copied, setCopied] = useState(false); // State for copy icon change
    
    // The original component had an issue where 'message' and 'promptRef' were not defined/used correctly.
    // Also, message.success/error is not defined in the provided scope, so we import 'message' from antd.
    const { setSubjects } = useAppContext();
    const [promptData, setPromptData] = useState({
        subjectName: "__",
        courseName: "__",
        imageUrl: "__",
        youTubeUrl: "__",
        audioUrl: "__",
        explanationTime: "__",
        subInfo: "__",
        numberOfQuestions: "__"
    });

    // State for the new "Add Subject" textarea and error
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromptData(prev => ({ ...prev, [name]: value }));
    };

    // Calculate the full prompt string based on state
    // Use useMemo to prevent unnecessary recalculations
    const fullPromptText = useMemo(() => {
        // The multiline string from your original component
        return `You are an expert university tutor. Your task is to generate a JSON output containing detailed information about a subject for a student. **All text content in the JSON must be in Hebrew**, including:
              - info titles and descriptions
              - subInfo titles and descriptions
              - tags
              - quiz questions and answers

              Important keywords, technical terms, or names in English should be kept in English.

              You must treat subInfo as recursive: each subInfo entry can contain its own subInfo array, following the same structure and keys as info (i.e., infoTitle, infoDescription, subInfo).

              The user will provide values for the following variables directly in this prompt:

              subjectName = "${promptData.subjectName}"
              courseName = "${promptData.courseName}"
              imageUrl = "${promptData.imageUrl}"
              youTubeUrl = "${promptData.youTubeUrl}"
              audioUrl = "${promptData.audioUrl}"
              explanationTime = "${promptData.explanationTime}"
              subInfo = "${promptData.subInfo}"
              numberOfQuestions = "${promptData.numberOfQuestions}"

              You must return **only JSON**, strictly following this structure:

              ${JSON.stringify(subjectClass, null, 2)}
              Instructions for generating JSON:

              1. Keep **exactly** the same spelling for subjectName and courseName as given.  
              2. If any input (imageUrl, youTubeUrl, audioUrl) is missing or empty, fill it with a relevant placeholder or reasonable value.  
              3. In the "info" section:
                  - Include the subInfo provided by the user.
                  - Add **at least 4 additional relevant subInfo entries**.
                  - Each subInfo can recursively include its own subInfo array, following the same keys as info.
                  - All text must be in Hebrew, except important English keywords or technical terms.  
              4. In "subjectTrivia":
                  - Generate quiz questions relevant to the subject.
                  - Include 4 possible answers for each question and mark the correct answer.  
                  - All questions and answers must be in Hebrew, except important English keywords or technical terms.  
                  - If numberOfQuestions is missing, generate 3-5 questions.  
              5. Use realistic tags in the "tags" array related to the subject. Include tag colors as any valid color name or hex code. Tag names must be in Hebrew, except important English keywords.  
              6. Only return JSON. Do not add explanations, comments, or any extra text.`
            
      }, [promptData]);

    /**
     * Fixes: 
     * 1. Uses the ref to get the prompt text.
     * 2. Sets the 'copied' state to true/false to change the icon.
     * 3. Uses Antd's 'message' for feedback.
     */
    const copyPrompt = () => {
        if (promptRef.current) {
            navigator.clipboard.writeText(fullPromptText)
                .then(() => {
                    message.success("ההנחיה הועתקה בהצלחה ללוח!"); // Prompt copied successfully!
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
                })
                .catch(() => message.error("ההעתקה נכשלה.")); // Failed to copy.
        }
    };

    /**
     * Implementation for "Add Subject Scope"
     * 1. Validates the textarea content as JSON.
     * 2. If valid, adds the parsed object to the subjects array via setSubjects.
     * 3. Clears the input and shows success/error messages.
     */
    const handleAddSubject = () => {
        setJsonError(''); // Clear previous error
        if (!jsonInput.trim()) {
            setJsonError("אנא הזן טקסט."); // Please enter text.
            return;
        }
        try {
            const parsedJson = JSON.parse(jsonInput);
            
            // Basic structural validation (optional but recommended)
            if (typeof parsedJson !== 'object' || parsedJson === null || Array.isArray(parsedJson)) {
                throw new Error("הטקסט שהוזן אינו אובייקט JSON תקף."); // The entered text is not a valid JSON object.
            }

            // Call the context function to update the global state
            setSubjects(prevSubjects => [...prevSubjects, parsedJson]);
            message.success("נושא חדש נוסף בהצלחה!"); // New subject added successfully!
            setJsonInput(''); // Clear the input field

        } catch (error) {
            setJsonError("שגיאת JSON: " + error.message); // JSON Error: ...
            message.error("הוספת הנושא נכשלה. בדוק את פורמט ה-JSON."); // Failed to add subject. Check JSON format.
        }
    };

    const inputsConfig = [
        { name: "subjectName", label: "שם הנושא", placeholder: "הזן את שם הנושא", tooltip: "שם הנושא כפי שירצה המשתמש" },
        { name: "courseName", label: "שם הקורס", placeholder: "הזן את שם הקורס", tooltip: "שם הקורס אותו המשתמש לוקח" },
        { name: "imageUrl", label: "כתובת תמונה", placeholder: "הזן כתובת URL לתמונה", tooltip: "כתובת תמונה של הנושא (אם יש)" },
        { name: "youTubeUrl", label: "קישור ליוטיוב", placeholder: "הזן קישור ל-YouTube", tooltip: "קישור לסרטון יוטיוב בנושא (אם יש)" },
        { name: "audioUrl", label: "קישור לאודיו", placeholder: "הזן קישור לאודיו", tooltip: "קישור לקובץ אודיו בנושא (אם יש)" },
        { name: "explanationTime", label: "זמן הסבר", placeholder: "כמה זמן המשתמש רוצה להסביר את החומר", tooltip: "כמה זמן המשתמש רוצה להסביר את החומר" },
        { name: "subInfo", label: "נושא משנה", placeholder: "הזן נושא משנה מרכזי", tooltip: "נושא משנה מרכזי שהמשתמש רוצה לכלול" },
        { name: "numberOfQuestions", label: "מספר שאלות", placeholder: "מספר שאלות ל-Quiz (אופציונלי)", tooltip: "מספר שאלות ל-Quiz (אופציונלי)" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 24, gap: 24 }}>
            {/* Inputs */}
            <Card title="בניית הנחיה (Prompt Builder)" style={{ width: "100%", maxWidth: 700 }}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {inputsConfig.map(input => (
                        <div key={input.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: 4, fontWeight: 500, direction: 'rtl', textAlign: 'right' }}>{input.label}</label>
                                <Input
                                    name={input.name}
                                    placeholder={input.placeholder}
                                    onChange={handleChange}
                                    dir="rtl" // Set input direction to RTL
                                />
                            </div>
                            <Tooltip title={input.tooltip}>
                                <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 18, marginTop: '20px' }} />
                            </Tooltip>
                        </div>
                    ))}
                </Space>
            </Card>

            ---

            {/* Prompt Preview */}
            <Card
                title="תצוגה מקדימה של ההנחיה"
                style={{
                    width: "100%",
                    maxWidth: 700,
                    position: "relative", // Needed for absolute positioning of the icon
                }}
            >
                <div 
                    ref={promptRef} // Attach the ref here
                    style={{
                        fontFamily: "monospace",
                        fontSize: 14,
                        whiteSpace: "pre-wrap",
                        textAlign: "left", // Keep content alignment to left for code/prompt structure
                        paddingRight: '30px' // Make space for the icon
                    }}
                >
                    {/* Copy Icon - FIX: Use state for conditional rendering */}
                    <Tooltip title={copied ? "הועתק!" : "העתק הנחיה"}>
                        {copied ? (
                            <CheckOutlined 
                                style={{ position: "absolute", top: 16, right: 16, fontSize: 20, color: "green" }}
                            />
                        ) : (
                            <CopyOutlined
                                onClick={copyPrompt}
                                style={{ position: "absolute", top: 16, right: 16, fontSize: 20, cursor: "pointer", color: "#1890ff" }}
                            />
                        )}
                    </Tooltip>
                    {/* Display the full prompt text */}
                    {fullPromptText}
                </div>
            </Card>

            ---
            
            {/* Add Subject Scope - New Implementation */}
            <Card 
                title="הוספת נושא (JSON)"
                style={{ width: "100%", maxWidth: 700 }}
            >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Input.TextArea
                        rows={8}
                        placeholder='הדבק כאן את אובייקט ה-JSON שנוצר על ידי ה-LLM...'
                        value={jsonInput}
                        onChange={(e) => {
                            setJsonInput(e.target.value);
                            setJsonError(''); // Clear error on change
                        }}
                        style={{ fontFamily: 'monospace', direction: 'ltr' }}
                    />
                    {jsonError && <p style={{ color: 'red', margin: 0, direction: 'rtl' }}>{jsonError}</p>}
                    <Button
                        type="primary"
                        onClick={handleAddSubject}
                        style={{ width: '100%' }}
                    >
                        הוסף נושא
                    </Button>
                    <Tooltip title="פונקציה זו מאפשרת להוסיף JSON שנוצר ידנית או באמצעות ה-Prompt למערך ה-subjects הכללי.">
                        <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 14 }} />
                        <span style={{ marginRight: 8 }}>איך זה עובד?</span>
                    </Tooltip>
                </Space>
            </Card>
        </div>
    );
}

export default BuildPrompt;