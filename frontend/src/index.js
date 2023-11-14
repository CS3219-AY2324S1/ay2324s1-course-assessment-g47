import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { QuestionsContextProvider } from "./context/QuestionContext";
import { AuthContextProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.render(
	<React.StrictMode>
		<AuthContextProvider>
			<QuestionsContextProvider>
				<App />
			</QuestionsContextProvider>
		</AuthContextProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
