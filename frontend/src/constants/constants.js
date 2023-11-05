export const POSTGRESQL_PORT = 8081;
export const MATCHING_SERVICE_PORT = 8083;
export const COLLABORATION_SERVICE_PORT = 8084;
export const HISTORY_SERVICE_PORT = 8085;


export const complexityOptions = [
	{ value: "Easy", label: "Easy" },
	{ value: "Medium", label: "Medium" },
	{ value: "Hard", label: "Hard" }
  ];
export const categoryOptions = [
	"String",
	"Algorithms",
	"Data Structures",
	"Bit Manipulation",
	"Recursion",
	"Databases",
	"Arrays",
	"Brainteaser",
]; // Define your category options here

export const categoryOptionsLabelled = [
    { value: "String", label: "String" },
	{ value: "Algorithms", label: "Algorithms" },
    { value: "Data Structures", label: "Data Structures" },
	{ value: "Bit Manipulation", label: "Bit Manipulation" },
    { value: "Recursion", label: "Recursion" },
    { value: "Databases", label: "Databases" },
    { value: "Arrays", label: "Arrays" },
    { value: "Brainteaser", label: "Brainteaser" },
]; // Define your category options here

export const TOOLBAR_OPTIONS = [
	[{ header: [1, 2, 3, 4, 5, 6, false] }],
	[{ font: [] }],
	[{ list: "ordered" }, { list: "bullet" }],
	["bold", "italic", "underline"],
	[{ color: [] }, { background: [] }],
	[{ script: "sub" }, { script: "super" }],
	[{ align: [] }],
	["image", "blockquote", "code-block"],
	["clean"],
];
