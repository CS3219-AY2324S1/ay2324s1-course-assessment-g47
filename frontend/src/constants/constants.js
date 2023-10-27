export const POSTGRESQL_URL =
	process.env.ENV === "PROD" ? process.env.USER_URL : "http://localhost:8081";
export const MATCHING_SERVICE_URL =
	process.env.ENV === "PROD"
		? process.env.MATCHING_URL
		: "http://localhost:8083";
export const COLLABORATION_SERVICE_URL =
	process.env.ENV === "PROD"
		? process.env.COLLABORATION_URL
		: "http://localhost:8084";
export const HISTORY_SERVICE_URL =
	process.env.ENV === "PROD"
		? process.env.HISTORY_URL
		: "http://localhost:8085";
