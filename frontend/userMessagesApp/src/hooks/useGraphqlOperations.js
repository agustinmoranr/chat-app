const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const DEFAULT_FETCH_CONFIG = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
};

function useGraphQLOperations() {
	return ({ operation, variables = null, ...config }) =>
		fetch(API_ENDPOINT, {
			...DEFAULT_FETCH_CONFIG,
			body: JSON.stringify({
				query: operation,
				variables,
			}),
			...config,
		})
			.then((response) => response.json())
			.then((data) => data?.data);
}

export default useGraphQLOperations;
