import React, { createContext, useContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Custom hook to use the context easily
export const useAppContext = () => useContext(AppContext);
const subjectsDefault= [
  {
    "subjectName": "ATP (אדנוזין טריפוספט)",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7f/ATP-structure.png",
    "courseName": "התא",
    "tags": [
        {
            "tagName": "אנרגיה בתא",
            "tagColor": "green"
        },
        {
            "tagName": "מטבוליזם",
            "tagColor": "blue"
        },
        {
            "tagName": "נוקלאוטידים",
            "tagColor": "orange"
        }
    ],
    "info": [
        {
            "infoTitle": "מהו ATP",
            "infoDescription": "ATP (Adenosine Triphosphate – אדנוזין טריפוספט) הוא מולקולה המכילה בסיס אדנין, סוכר ריבוז ושלוש קבוצות פוספט. הוא מהווה את מקור האנרגיה המרכזי בתא.",
            "subInfo": [
                {
                    "infoTitle": "מבנה המולקולה",
                    "infoDescription": "המולקולה מורכבת מבסיס חנקני (Adenine), סוכר (Ribose) ושלוש קבוצות פוספט (Triphosphate). הקשרים בין קבוצות הפוספט עשירים באנרגיה."
                },
                {
                    "infoTitle": "תפקיד בתא",
                    "infoDescription": "ATP מספק אנרגיה לתהליכים תאיים כמו סינתזת חלבונים, העברת חומרים דרך ממברנות והתכווצות שרירים."
                },
                {
                    "infoTitle": "שחרור אנרגיה",
                    "infoDescription": "כאשר קשר בין קבוצות הפוספט נשבר, ATP הופך ל-ADP (Adenosine Diphosphate) או AMP (Adenosine Monophosphate), ותוך כדי כך משתחררת אנרגיה זמינה לשימוש מיידי."
                }
            ]
        }
    ]
  },
  {
    "subjectName": "מולקולה אמפיפתית (Amphipathic molecule)",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Phospholipid.svg",
    "courseName": "התא",
    "tags": [
        {
            "tagName": "מבנה מולקולרי",
            "tagColor": "blue"
        },
        {
            "tagName": "הידרופובי והידרופילי",
            "tagColor": "teal"
        },
        {
            "tagName": "ממברנות ביולוגיות",
            "tagColor": "purple"
        }
    ],
    "info": [
        {
            "infoTitle": "מהי מולקולה אמפיפתית",
            "infoDescription": "מולקולה אמפיפתית (Amphipathic) היא מולקולה שיש בה גם אזורים הידרופוביים (שאינם מסיסים במים) וגם אזורים הידרופיליים (נמשכים למים).",
            "subInfo": [
                {
                    "infoTitle": "החלק ההידרופילי",
                    "infoDescription": "החלק ההידרופילי הוא הקצה הפולרי של המולקולה, אשר נמשך למים ויכול ליצור קשרים עם מולקולות מים או יונים טעונים."
                },
                {
                    "infoTitle": "החלק ההידרופובי",
                    "infoDescription": "החלק ההידרופובי הוא קצה שאינו מסיס במים, לרוב מורכב מזנבות פחמימניים ארוכים שאינם יוצרים קשרים עם מים."
                },
                {
                    "infoTitle": "דוגמה ביולוגית",
                    "infoDescription": "פוספוליפידים (Phospholipids), המרכיבים העיקריים של קרומי התא, הם מולקולות אמפיפתיות. הם יוצרים מבנה דו-שכבתי שבו החלקים ההידרופוביים פונים פנימה וההידרופיליים פונים החוצה אל הסביבה המימית."
                }
            ]
        }
    ]
  }

]
// Provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState(subjectsDefault);
  const [currentSubject, setCurrentSubject] = useState(subjectsDefault[0]);
  const [notFoundMessage , setNotFoundMessage] = useState('');

  return (
    <AppContext.Provider value={
        { 
            user, setUser,
            subjects, setSubjects,
            currentSubject, setCurrentSubject,
            notFoundMessage , setNotFoundMessage
        }
        }>
      {children}
    </AppContext.Provider>
  );
};
