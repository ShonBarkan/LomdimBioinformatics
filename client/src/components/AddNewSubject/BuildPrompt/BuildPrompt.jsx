import React, { useState, useRef, useMemo } from 'react';
import { Input, Card, Space, Tooltip, Button, message, Divider, Alert, Select, InputNumber } from "antd";
import { CopyOutlined, InfoCircleOutlined, CheckOutlined } from '@ant-design/icons';
import subjectJsonClass from '../../../../jsonClass.json'
const subjectClass = subjectJsonClass; // Import the JSON structure

const BuildPrompt = () => {
    // 1. Setup for Copy Functionality
    const promptRef = useRef(null); // Ref to hold the prompt text div
    const [copied, setCopied] = useState(false); // State for copy icon change
    
    // The original component had an issue where 'message' and 'promptRef' were not defined/used correctly.
    // Also, message.success/error is not defined in the provided scope, so we import 'message' from antd.
    const [promptData, setPromptData] = useState({
        subjectName: "__",
        courseName: "__",
        imageUrl: "__",
        youTubeUrl: "__",
        audioUrl: "__",
        wordsPerParagraph: "__",
        subInfo: "__",
        numberOfQuestions: "__"
    });


    const handleChange = (nameOrEvent, value) => {
        // Handle both event objects (from Input) and direct values (from Select/InputNumber)
        if (typeof nameOrEvent === 'object' && nameOrEvent.target) {
            // Regular input event
            const { name: inputName, value: inputValue } = nameOrEvent.target;
            setPromptData(prev => ({ ...prev, [inputName]: inputValue || "__" }));
        } else {
            // Direct value from Select or InputNumber
            setPromptData(prev => ({ ...prev, [nameOrEvent]: value !== null && value !== undefined ? value : "__" }));
        }
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
              wordsPerParagraph = "${promptData.wordsPerParagraph}"
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
                  - Each infoDescription and subInfoDescription should be approximately ${promptData.wordsPerParagraph} words long. 
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

    const inputsConfig = [
        { name: "subjectName", label: "שם הנושא", placeholder: "הזן את שם הנושא", tooltip: "שם הנושא כפי שירצה המשתמש", type: "text" },
        { name: "courseName", label: "שם הקורס", placeholder: "בחר שם קורס", tooltip: "שם הקורס אותו המשתמש לוקח", type: "select", options: ["מבוא למדעי המחשב-JAVA","מבוא לכימיה כללית ואנליטית","לוגיקה","התא"] },
        { name: "imageUrl", label: "כתובת תמונה", placeholder: "הזן כתובת URL לתמונה", tooltip: "כתובת תמונה של הנושא (אם יש)", type: "text" },
        { name: "youTubeUrl", label: "קישור ליוטיוב", placeholder: "הזן קישור ל-YouTube", tooltip: "קישור לסרטון יוטיוב בנושא (אם יש)", type: "text" },
        { name: "audioUrl", label: "קישור לאודיו", placeholder: "הזן קישור לאודיו", tooltip: "קישור לקובץ אודיו בנושא (אם יש)", type: "text" },
        { name: "wordsPerParagraph", label: "מילים בכל פסקה", placeholder: "כמה מילים יהיו בכל פסקה?", tooltip: "לבחור כמה מילים בממוצע יהיה בכל פסקה כמה זמן המשתמש רוצה להסביר את החומר", type: "number" },
        { name: "subInfo", label: "נושא משנה", placeholder: "הזן נושא משנה מרכזי", tooltip: "נושא משנה מרכזי שהמשתמש רוצה לכלול", type: "text" },
        { name: "numberOfQuestions", label: "מספר שאלות", placeholder: "מספר שאלות ל-Quiz (אופציונלי)", tooltip: "מספר שאלות ל-Quiz (אופציונלי)", type: "number" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px", gap: 24, width: "100%", maxWidth: "100%" }}>
            {/* Inputs */}
            <Card title="בניית הנחיה (Prompt Builder)" style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    {inputsConfig.map(input => {
                        const inputType = input.type || "text";
                        const inputValue = promptData[input.name] === "__" ? undefined : promptData[input.name];
                        
                        return (
                            <div key={input.name} style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                                <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
                                    <label style={{ display: "block", marginBottom: 8, fontWeight: 500, direction: 'rtl', textAlign: 'right' }}>
                                        {input.label}
                                    </label>
                                    {inputType === "select" ? (
                                        <Select
                                            name={input.name}
                                            placeholder={input.placeholder}
                                            onChange={(value) => handleChange(input.name, value)}
                                            dir="rtl"
                                            size="large"
                                            style={{ width: "100%" }}
                                            value={inputValue}
                                            options={input.options?.map(opt => 
                                                typeof opt === 'string' 
                                                    ? { label: opt, value: opt }
                                                    : opt
                                            )}
                                        />
                                    ) : inputType === "number" ? (
                                        <InputNumber
                                            name={input.name}
                                            placeholder={input.placeholder}
                                            onChange={(value) => handleChange(input.name, value)}
                                            dir="rtl"
                                            size="large"
                                            style={{ width: "100%" }}
                                            value={inputValue}
                                        />
                                    ) : (
                                        <Input
                                            name={input.name}
                                            placeholder={input.placeholder}
                                            onChange={handleChange}
                                            dir="rtl"
                                            size="large"
                                            value={inputValue}
                                            type={inputType}
                                        />
                                    )}
                                </div>
                                <Tooltip title={input.tooltip}>
                                    <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 18, marginTop: '32px', cursor: 'help', flexShrink: 0 }} />
                                </Tooltip>
                            </div>
                        );
                    })}
                </Space>
            </Card>

            <Divider style={{ margin: '24px 0', width: '100%', maxWidth: 700, minWidth: 0 }} />

            {/* Prompt Preview */}
            <Card
                title={
                    <div style={{ direction: 'rtl', textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>תצוגה מקדימה של ההנחיה</div>
                        <div style={{ fontSize: 13, fontWeight: 400, color: '#666', lineHeight: 1.6 }}>
                            הדבק את הפרומפט הזה בכלי AI לבחירתך. את התוצאה תדביק למטה. 
                            <br />
                            שים לב: הכנס רק את ה-JSON שקיבלת, ודא שהחומר שהכנסת הוא הגיוני.
                        </div>
                    </div>
                }
                style={{
                    width: "100%",
                    maxWidth: 700,
                    position: "relative",
                    margin: "0 auto",
                }}
                extra={
                    <Tooltip title={copied ? "הועתק!" : "העתק הנחיה"}>
                        {copied ? (
                            <CheckOutlined 
                                style={{ fontSize: 20, color: "#52c41a", cursor: 'pointer' }}
                            />
                        ) : (
                            <CopyOutlined
                                onClick={copyPrompt}
                                style={{ fontSize: 20, cursor: "pointer", color: "#1890ff" }}
                            />
                        )}
                    </Tooltip>
                }
            >
                <Alert
                    message="הנחיות חשובות"
                    description="לאחר שתעתיק את ההנחיה לכלי AI, ודא שהתשובה מכילה רק JSON תקף ללא טקסט נוסף."
                    type="info"
                    showIcon
                    closable
                    style={{ marginBottom: 16, direction: 'rtl', textAlign: 'right' }}
                />
                <div 
                    ref={promptRef}
                    style={{
                        fontFamily: "monospace",
                        fontSize: "12px",
                        whiteSpace: "pre-wrap",
                        textAlign: "left",
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 6,
                        border: '1px solid #e8e8e8',
                        maxHeight: '500px',
                        overflowY: 'auto',
                        overflowX: 'auto',
                        lineHeight: 1.6,
                        wordBreak: "break-word"
                    }}
                >
                    {fullPromptText}
                </div>
            </Card>
        </div>
    );
}

export default BuildPrompt;