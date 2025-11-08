import React, { useState } from 'react';
import BuildPrompt from './BuildPrompt/BuildPrompt';
import { Button, Card, Input, Space, Tooltip, message, Alert, Divider } from 'antd';
import {addSubject} from '../../api/api';
import { useAppContext } from '../../context';
import { InfoCircleOutlined } from '@ant-design/icons';

const AddNewSubject = () => {

    const { setSubjects } = useAppContext();
    // State for the new "Add Subject" textarea and error
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState('');
    
    const handleAddSubject = async () => {
    setJsonError(''); // Clear previous error

    if (!jsonInput.trim()) {
        setJsonError("אנא הזן טקסט."); // Please enter text.
        return;
    }

    try {
        const parsedJson = JSON.parse(jsonInput);

        // Basic structural validation
        if (typeof parsedJson !== 'object' || parsedJson === null || Array.isArray(parsedJson)) {
        throw new Error("הטקסט שהוזן אינו אובייקט JSON תקף."); // The entered text is not a valid JSON object.
        }

        // 🔹 Call the API to save the subject
        const response = await addSubject(parsedJson);

        // 🔹 Optionally validate API response
        if (response?.success) {
        // Update local state
        setSubjects((prevSubjects) => [...prevSubjects, response.data || parsedJson]);
        message.success("נושא חדש נוסף בהצלחה!"); // New subject added successfully!
        setJsonInput(''); // Clear the input field
        } else {
        throw new Error(response?.message || "שגיאה בהוספת הנושא לשרת."); // Error adding subject to server.
        }

    } catch (error) {
        console.error("Error adding subject:", error);
        setJsonError("שגיאת JSON או שרת: " + error.message); // JSON or server error
        message.error("הוספת הנושא נכשלה. בדוק את פורמט ה-JSON או את השרת."); // Failed to add subject. Check JSON or server.
    }
    };
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px", gap: 24, width: "100%", maxWidth: "100%" }}>
            <BuildPrompt />
            
            <Divider style={{ margin: '24px 0', width: '100%', maxWidth: 700, minWidth: 0 }} />

            {/* Add Subject Scope */}
            <Card
                title="הוספת נושא (JSON)"
                style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}
            >
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, direction: 'rtl', textAlign: 'right' }}>
                            הדבק את אובייקט ה-JSON כאן
                        </label>
                        <Input.TextArea
                            rows={10}
                            placeholder='הדבק כאן את אובייקט ה-JSON שנוצר על ידי ה-LLM...'
                            value={jsonInput}
                            onChange={(e) => {
                                setJsonInput(e.target.value);
                                setJsonError(''); // Clear error on change
                            }}
                            style={{ 
                                fontFamily: 'monospace', 
                                direction: 'ltr',
                                fontSize: "12px",
                                wordBreak: "break-word",
                                overflowWrap: "break-word"
                            }}
                        />
                    </div>
                    
                    {jsonError && (
                        <Alert
                            message="שגיאה"
                            description={jsonError}
                            type="error"
                            showIcon
                            closable
                            onClose={() => setJsonError('')}
                            style={{ direction: 'rtl', textAlign: 'right' }}
                        />
                    )}
                    
                    <Button
                        type="primary"
                        onClick={handleAddSubject}
                        size="large"
                        block
                        style={{ 
                            height: 48,
                            fontSize: 16,
                            fontWeight: 500
                        }}
                    >
                        הוסף נושא
                    </Button>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8, 
                        justifyContent: 'center',
                        padding: '12px',
                        backgroundColor: '#f0f7ff',
                        borderRadius: 6,
                        direction: 'rtl'
                    }}>
                        <Tooltip title="פונקציה זו מאפשרת להוסיף JSON שנוצר ידנית או באמצעות ה-Prompt למערך ה-subjects הכללי.">
                            <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 16, cursor: 'help' }} />
                        </Tooltip>
                        <span style={{ color: '#1890ff', fontSize: 14, fontWeight: 500 }}>
                            איך זה עובד?
                        </span>
                    </div>
                </Space>
            </Card>
        </div>
    );
}

export default AddNewSubject;
