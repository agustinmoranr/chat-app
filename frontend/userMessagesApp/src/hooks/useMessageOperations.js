import useGraphQLOperations from './useGraphqlOperations';
import {
	createMessageMutation,
	updateMessageMutation,
	deleteMessageMutation,
} from '../graphql/mutations';
import { useMemo } from 'react';

function useMessageOperations() {
	const fetchGraphql = useGraphQLOperations();
	async function createMessage(userId, chatId, message = '', createdAt) {
		return fetchGraphql({
			operation: createMessageMutation,
			variables: { userId, chatId, message, createdAt },
		}).then((data) => data.createMessage);
	}

	async function updateMessage(id, message) {
		return fetchGraphql({
			operation: updateMessageMutation,
			variables: { id, message },
		}).then((data) => data.updateMessage);
	}

	async function deleteMessage(id) {
		return fetchGraphql({
			operation: deleteMessageMutation,
			variables: { id },
		}).then((data) => data.deleteMessage);
	}

	return useMemo(
		() => ({
			createMessage,
			updateMessage,
			deleteMessage,
		}),
		[],
	);
}

export default useMessageOperations;
