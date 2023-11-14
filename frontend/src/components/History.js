import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import DisplayRandomQuestion from "./DisplayRandomQuestion";
import { useNavigate } from 'react-router-dom';
import  {FaArrowLeft}  from 'react-icons/fa';

function History({ user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { historyId } = useParams(); // You may not need this if you're not using the historyId in the URL

    const [question, setQuestion] = useState(location.state?.question);
    const [code, setCode] = useState(location.state?.code);
    const [language, setLanguage] = useState(location.state?.language);
    const [partner, setPartner] = useState(location.state?.partner);


    useEffect(() => {
        console.log("partner", partner);
        // If the state is not passed via navigation, you may want to fetch it using the historyId
        if (!question || !code || !language) {
            // Fetch the data using historyId or another method
        }
    }, [historyId, question, code, language]);

    return (
        <div className="container-fluid">
            <div className="row mt-4">
                <div className="col-lg-5 col-md-6">
                    <div className="question-container m-2 d-flex flex-column">
                        <div className="d-flex align-items-center bg-success text-white m-2 rounded-4 p-2 fs-4">
                        <button onClick={() => navigate(-1)} className="btn btn-warning btn-sm rounded-circle m-2">
                                <FaArrowLeft/>
                            </button>
                            <span>Matched with: {partner}</span>
                            
                        </div>
                        <DisplayRandomQuestion
                            user={user}
                            randomQuestion={question}
                            hideRefresh={true}
                        />
                    </div>
                </div>
                <div className="col-lg-7 col-md-6">
                    <div className="editor-container-room m-2 d-flex flex-column">
                        <p className="text-white m-2 fs-4">
                            Chosen language: {language}
                        </p>

                        <Editor
                            height="100%"
                            width="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            options={{
                                readOnly: true, // Set to true if you only want to display the code
                                minimap: { enabled: false },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
