import React, { createContext, useContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Custom hook to use the context easily
export const useAppContext = () => useContext(AppContext);
const subjectsDefault= [
  {
    "subjectName": "ATP (אדנוזין טריפוספט)",
    "imageUrl": "./assets/the_cell.png",
    "courseName": "התא",
    "youTubeUrl":"",
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
                    "infoDescription": "ATP מספק אנרגיה לתהליכים תאיים כמו סינתזת חלבונים, העברת חומרים דרך ממברנות והתכווצות שרירים.",
                    "subInfo": [
                        {
                            "infoTitle": "תפקיד בתא",
                            "infoDescription": "ATP מספק אנרגיה לתהליכים תאיים כמו סינתזת חלבונים, העברת חומרים דרך ממברנות והתכווצות שרירים.",
                            "subInfo": [
                                {
                                    "infoTitle": "תפקיד בתא",
                                    "infoDescription": "ATP מספק אנרגיה לתהליכים תאיים כמו סינתזת חלבונים, העברת חומרים דרך ממברנות והתכווצות שרירים."
                                }
                            ]
                        },
                        {
                            "infoTitle": "שחרור אנרגיה",
                            "infoDescription": "כאשר קשר בין קבוצות הפוספט נשבר, ATP הופך ל-ADP (Adenosine Diphosphate) או AMP (Adenosine Monophosphate), ותוך כדי כך משתחררת אנרגיה זמינה לשימוש מיידי."
                        }
                    ]
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
    "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.biologyonline.com%2Fdictionary%2Famphipathic&psig=AOvVaw0UHQ_eMcIeOpdPUeGx_W4k&ust=1762094473583000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJC_48-X0ZADFQAAAAAdAAAAABAE",
    "courseName": "התא",
    "youTubeUrl": "" ,
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
  },
  {
"subjectName": "סטויכיומטריה",
"imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Stoichiometry_diagram.png",
"courseName": "מבוא לכימיה כללית ואנליטית",
"youTubeUrl": "https://www.youtube.com/watch?v=7Cfq0ilw7ps",
"audioUrl": "https://example.com/audio/stoichiometry_explained.mp3",
"tags": [
    {
    "tagName": "כימיה",
    "tagColor": "#4CAF50"
    },
    {
    "tagName": "סטויכיומטריה",
    "tagColor": "#2196F3"
    },
    {
    "tagName": "חישובים כימיים",
    "tagColor": "#FF9800"
    },
    {
    "tagName": "חוק שימור המסה",
    "tagColor": "#9C27B0"
    }
],
"info": [
    {
    "infoTitle": "מהי סטויכיומטריה?",
    "infoDescription": "סטויכיומטריה היא תחום בכימיה העוסק ביחסים הכמותיים בין חומרים במגוון תגובות כימיות. היא מבוססת על עקרון חוק שימור המסה.",
    "subInfo": [
        {
        "infoTitle": "שימושים",
        "infoDescription": "סטויכיומטריה משמשת בחישוב כמויות חומרים הדרושות או המתקבלות בתגובה כימית, כגון בחישוב כמויות ריאגנטים או מוצרים.",
        "subInfo": [
            {
            "infoTitle": "שימוש בתעשייה",
            "infoDescription": "בתעשייה הכימית, סטויכיומטריה מסייעת בקביעת יחס מדויק בין חומרים כדי למנוע בזבוז ולהבטיח יעילות מירבית.",
            "subInfo": []
            },
            {
            "infoTitle": "שימוש במעבדה",
            "infoDescription": "במעבדות מחקר, סטויכיומטריה משמשת לקביעת כמות הריאגנט הנדרשת להשגת תוצאה מדויקת.",
            "subInfo": []
            }
        ]
        },
        {
        "infoTitle": "סוגים",
        "infoDescription": "סטויכיומטריה מתחלקת למספר תחומים כגון סטויכיומטריית תגובות, סטויכיומטריית גזים וסטויכיומטריית תמיסות.",
        "subInfo": [
            {
            "infoTitle": "סטויכיומטריית תגובות",
            "infoDescription": "עוסקת ביחסים הכמותיים בין חומרים במצב מוצק, נוזלי או גזי בתגובה כימית.",
            "subInfo": []
            },
            {
            "infoTitle": "סטויכיומטריית גזים",
            "infoDescription": "משתמשת בחוקי הגזים (כמו חוק בויאל וחוק אבוגדרו) כדי לחשב נפחים וכמויות של גזים בתגובה.",
            "subInfo": []
            }
        ]
        },
        {
        "infoTitle": "חישובים",
        "infoDescription": "כוללים חישובי מול (mol), מסה, נפח, וריכוז (Molarity) תוך שימוש ביחסים כימיים מהמשוואה המאוזנת.",
        "subInfo": [
            {
            "infoTitle": "יחס מולים",
            "infoDescription": "יחס המולים בין ריאגנטים למוצרים נגזר מהמקדם הסטויכיומטרי במשוואה הכימית.",
            "subInfo": []
            },
            {
            "infoTitle": "חישוב מסה",
            "infoDescription": "מסה מחושבת לפי הנוסחה: מסה = מספר מולים × מסה מולרית.",
            "subInfo": []
            }
        ]
        },
        {
        "infoTitle": "דוגמאות",
        "infoDescription": "לדוגמה, בתגובה בין H₂ ל-O₂ ליצירת H₂O, היחס הסטויכיומטרי הוא 2:1:2, כלומר שני מול של מימן מגיבים עם מול אחד של חמצן ליצירת שני מול מים.",
        "subInfo": []
        },
        {
        "infoTitle": "חוק שימור המסה",
        "infoDescription": "הבסיס לכל חישוב סטויכיומטרי הוא שחומר אינו נעלם ואינו נוצר יש מאין. המסה הכוללת של הריאגנטים שווה למסה הכוללת של המוצרים.",
        "subInfo": []
        }
    ]
    }
],
"subjectTrivia": [
    {
    "question": "מהו העיקרון הבסיסי שעליו מתבססת הסטויכיומטריה?",
    "answers": [
        "חוק שימור המסה",
        "חוק בויאל (Boyle’s Law)",
        "חוק שימור האנרגיה",
        "חוק צ'ארלס (Charles’s Law)"
    ],
    "Correct answer": "חוק שימור המסה",
    "explanation": "הסטויכיומטריה מתבססת על חוק שימור המסה הקובע כי מסה אינה נוצרת או נעלמת בתגובה כימית."
    },
    {
    "question": "מהו היחס הסטויכיומטרי בין H₂ ל-O₂ ליצירת H₂O?",
    "answers": [
        "1:1:1",
        "2:1:2",
        "1:2:1",
        "3:1:2"
    ],
    "Correct answer": "2:1:2",
    "explanation": "שני מול של מימן מגיבים עם מול אחד של חמצן ליצירת שני מול מים."
    },
    {
    "question": "איזה כלי עוזר לחישוב ריכוז תמיסה (Molarity)?",
    "answers": [
        "משוואת PV = nRT",
        "M = n/V",
        "ΔE = mc²",
        "Q = mcΔT"
    ],
    "Correct answer": "M = n/V",
    "explanation": "ריכוז מולרי (M) מחושב לפי מספר המולים חלקי הנפח בליטרים."
    },
    {
    "question": "מה מתאר 'יחס מולים' בתגובה כימית?",
    "answers": [
        "יחס בין נפחי הגזים בתגובה",
        "יחס בין מולי הריאגנטים והמוצרים",
        "יחס בין טמפרטורות החומרים",
        "יחס בין מהירויות התגובה"
    ],
    "Correct answer": "יחס בין מולי הריאגנטים והמוצרים",
    "explanation": "יחס המולים נגזר מהמקדם הסטויכיומטרי במשוואה הכימית המאוזנת."
    },
    {
    "question": "מה מתארת 'מסה מולרית'?",
    "answers": [
        "המסה של חלקיק בודד",
        "המסה של מול אחד של חומר",
        "הנפח של גז בטמפרטורה נתונה",
        "האנרגיה הדרושה לשבירת קשר"
    ],
    "Correct answer": "המסה של מול אחד של חומר",
    "explanation": "מסה מולרית (Molar Mass) היא המסה בגרמים של מול אחד של אטום, מולקולה או תרכובת."
    },
    {
    "question": "מה קובע חוק אבוגדרו?",
    "answers": [
        "בטמפרטורה ולחץ שווים, נפח שווה של גזים שונים מכיל מספר שונה של חלקיקים",
        "בטמפרטורה ולחץ שווים, נפח שווה של גזים שונים מכיל אותו מספר חלקיקים",
        "מסה שווה של גזים שונים מכילה אותו מספר מולקולות",
        "לחץ גז פרופורציונלי לנפחו"
    ],
    "Correct answer": "בטמפרטורה ולחץ שווים, נפח שווה של גזים שונים מכיל אותו מספר חלקיקים",
    "explanation": "חוק אבוגדרו הוא אחד מחוקי הגזים החשובים ומשמש בחישובים סטויכיומטריים."
    },
    {
    "question": "מהי הנוסחה לחישוב מספר מולים (n)?",
    "answers": [
        "n = m / M",
        "n = M × V",
        "n = P × T",
        "n = Q / c"
    ],
    "Correct answer": "n = m / M",
    "explanation": "מספר המולים שווה למסה חלקי המסה המולרית."
    },
    {
    "question": "מה מתארת משוואה מאוזנת בתגובה כימית?",
    "answers": [
        "היחס האנרגטי בין החומרים",
        "היחס הכמותי הנכון בין ריאגנטים למוצרים",
        "מהירות התגובה",
        "טמפרטורת התגובה"
    ],
    "Correct answer": "היחס הכמותי הנכון בין ריאגנטים למוצרים",
    "explanation": "המשוואה המאוזנת משקפת את היחס הסטויכיומטרי הנכון בין כל חומר בתגובה."
    },
    {
    "question": "מה נדרש כדי לאזן משוואה כימית?",
    "answers": [
        "שינוי הסימנים הכימיים של היסודות",
        "שינוי הקשרים הקוולנטיים",
        "שינוי המקדמים לפני החומרים",
        "שינוי המטען הכולל של המולקולה"
    ],
    "Correct answer": "שינוי המקדמים לפני החומרים",
    "explanation": "איזון מתבצע על ידי שינוי המקדמים כך שמספר האטומים מכל סוג יהיה זהה משני צדי המשוואה."
    },
    {
    "question": "מהו מול (mol) לפי הגדרת Avogadro?",
    "answers": [
        "מספר אטומים בגרם אחד של חומר",
        "6.022×10²³ חלקיקים מכל סוג של חומר",
        "מספר המולקולות בליטר אחד של מים",
        "המסה של גז בטמפרטורת החדר"
    ],
    "Correct answer": "6.022×10²³ חלקיקים מכל סוג של חומר",
    "explanation": "מול הוא יחידת מידה בסיסית המתארת כמות של 6.022×10²³ חלקיקים (אטומים, מולקולות וכו')."
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
