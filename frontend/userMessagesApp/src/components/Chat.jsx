import React, {
	useContext,
	createContext,
	useRef,
	useState,
	useMemo,
	useEffect,
	useLayoutEffect,
} from 'react';
import { Menu, MenuItem, CLOSE_REASONS } from './Menu';
import IconButton from './IconButton';
import { UserBagde, UserBagdeImage, UserBadgeName } from './UserBagde';
import Overlay from './Overlay';
import SendIcon from '../icons/SendIcon';
import CloseIcon from '../icons/CloseIcon';
import EditIcon from '../icons/EditIcon';
import SwitchAccountIcon from '../icons/SwitchAccountIcon';
import dayjs from 'dayjs';
import useMessageOperations from '../hooks/useMessageOperations';
import { getChatQuery } from '../graphql/queries';
import useGraphQLOperations from '../hooks/useGraphqlOperations';
import '../styles/Chat.css';

const ChatContext = createContext();

const FORM_MODES = {
	CREATE: 'CREATE',
	EDIT: 'EDIT',
};

const ChatProvider = ({ children }) => {
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);
	const [chat, setChat] = useState(null);
	const [userSelectedId, setUserSelectedId] = React.useState('1');
	const [messageSelectedId, setMessageSelectedId] = React.useState(null);

	const userSelected = React.useMemo(() =>
		users?.find(({ id }) => id === userSelectedId),
	);
	const messageSelected = React.useMemo(() =>
		messages?.find(({ id }) => id === messageSelectedId),
	);
	const usersProfilesImagesById = useMemo(() =>
		users.reduce((userImages, { id, profileImage }) => {
			userImages[id] = profileImage;
			return userImages;
		}, {}),
	);

	const [formMode, setFormMode] = useState(FORM_MODES.CREATE);
	const { createMessage, deleteMessage, updateMessage } =
		useMessageOperations();
	const fetchGraphql = useGraphQLOperations();

	useEffect(() => {
		fetchGraphql({ operation: getChatQuery, variables: { id: '1' } }).then(
			(data) => {
				const { messages, users, ...chatInfo } = data?.getChat;
				setMessages(messages);
				setUsers(users);
				setChat(chatInfo);
			},
		);
	}, []);

	const onCreateMessage = (newMessage) => {
		setMessages([...messages, newMessage]);
	};

	const onEditMessage = (messageEdited) => {
		let messagesCopy = [...messages];
		const messageToUpdateIndex = messagesCopy.findIndex(
			({ id }) => id === messageEdited?.id,
		);

		if (messageToUpdateIndex === -1) {
			throw new Error(
				'Ocurrio un error al actualizar el mensaje, intentalo más tarde.',
			);
		}

		const messageToUpdate = messagesCopy[messageToUpdateIndex];
		messagesCopy[messageToUpdateIndex] = {
			...messageToUpdate,
			...messageEdited,
		};
		setMessages(messagesCopy);
	};

	const onDeleteMessage = (messageId) => {
		const newMessages = messages.filter(({ id }) => id !== messageId);
		setMessages([...newMessages]);
	};

	async function handleCreateMessage(newMessage) {
		try {
			const messageCreated = await createMessage(
				userSelectedId,
				chat?.id,
				newMessage,
				dayjs().toISOString(),
			);
			onCreateMessage(messageCreated);
		} catch (error) {
			console.error(error);
			alert('Ocurrio un error, intentalo más tarde');
		}
	}

	async function handleEditMessage(updatedMessage) {
		try {
			const messageEdited = await updateMessage(
				messageSelectedId,
				updatedMessage,
			);
			onEditMessage(messageEdited);
		} catch (error) {
			console.error(error);
			alert('Ocurrio un error, intentalo más tarde');
		}
	}

	async function handleDeleteMessage(messageId) {
		try {
			const messageDeleted = await deleteMessage(messageId);
			onDeleteMessage(messageDeleted.id);
		} catch (error) {
			console.error(error);
			alert('Ocurrio un error, intentalo más tarde');
		}
	}

	const value = {
		users,
		messages,
		chat,
		messageSelectedId,
		userSelectedId,
		userSelected,
		messageSelected,
		formMode,
		handleCreateMessage,
		handleEditMessage,
		handleDeleteMessage,
		setMessageSelectedId,
		setFormMode,
		setUserSelectedId,
		setUsers,
		setChat,
		usersProfilesImagesById,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error('useChat must be used into a Chat component');
	}
	return context;
};

export const Chat = ({ children }) => {
	return (
		<ChatProvider>
			<div className='chat-container'>{children}</div>
		</ChatProvider>
	);
};

export const ChatProfile = () => {
	const { userSelected, userSelectedId, setUserSelectedId, users } = useChat();
	const restChatUser = users.filter(({ id }) => id !== userSelectedId);
	const hasMultiple = restChatUser?.length > 1;

	useLayoutEffect(() => {
		const element = document.querySelector('.chat__profile__switch-account');

		if (hasMultiple) {
			element.classList.add('switch-account-multiple');
		} else {
			element.classList.add('switch-account-only-one');
		}
	}, [hasMultiple]);

	return (
		<div className='chat__profile'>
			<UserBagde>
				<UserBagdeImage
					src={userSelected?.profileImage}
					width='200px'
					height='200px'
				/>
				<div className='chat__profile__switch-account'>
					{restChatUser.map(({ id, profileImage }) => (
						<div
							key={id}
							onClick={() => setUserSelectedId(id)}
							className='switch-account-image-container'>
							<UserBagdeImage
								src={profileImage}
								width={hasMultiple ? 50 : 100}
								height={hasMultiple ? 50 : 100}
							/>
							<Overlay rounded={true} />
							<SwitchAccountIcon
								color='text-primary'
								className='switch-account-icon'
							/>
						</div>
					))}
				</div>
				<UserBadgeName>{userSelected?.name}</UserBadgeName>
			</UserBagde>
		</div>
	);
};

export const ChatForm = ({ onSuccess = () => {}, onError = () => {} }) => {
	const {
		handleCreateMessage,
		handleEditMessage,
		formMode,
		messageSelected,
		setFormMode,
		setMessageSelectedId,
	} = useChat();
	const newMessageRef = useRef(null);
	const [message, setMessage] = useState('');
	const messageParsed = useMemo(() => message.trim(), [message]);
	const isInputEmpty = !Boolean(message);
	const isNotEdited =
		formMode === FORM_MODES.EDIT && messageParsed === messageSelected?.message;

	React.useEffect(() => {
		if (formMode === FORM_MODES.EDIT) {
			setMessage(messageSelected.message || '');
		}
		newMessageRef.current.focus();
	}, [formMode]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		let response = null;
		try {
			if (formMode === FORM_MODES.CREATE) {
				response = await handleCreateMessage(messageParsed);
			}

			if (formMode === FORM_MODES.EDIT) {
				response = await handleEditMessage(messageParsed);
			}

			onSuccess(response);
			reset();
			return response;
		} catch (error) {
			console.error(error);
			onError(error);
		}
	};

	function handleInputchange(event) {
		setMessage(event.target.value);
	}

	function reset() {
		setMessage('');
		setFormMode(FORM_MODES.CREATE);
		setMessageSelectedId(null);
	}

	return (
		<div className='chat-form-container chat-form-bottom'>
			{formMode === FORM_MODES.EDIT && (
				<div className='chat-form__edit-container'>
					<EditIcon variant='outlined' className='chat-form__edit-icon' />
					<div className='edit-message__text-container'>
						<p children='edit-message__text-helper'>Editar Mensaje</p>
						<p children='edit-message__text'>{messageSelected?.message}</p>
					</div>
					<IconButton onClick={reset}>
						<CloseIcon variant='outlined' style={{ color: '#8f95da' }} />
					</IconButton>
				</div>
			)}
			<form onSubmit={handleSubmit} className='chat__form'>
				<div className='chat__form__input-container'>
					<label htmlFor='new-message-input' className='chat__form__label'>
						<textarea
							rows='4'
							aria-invalid='false'
							name='message'
							id='new-message-input'
							className='chat__form__textarea'
							placeholder='Escribe un mensaje...'
							onChange={handleInputchange}
							value={message}
							ref={newMessageRef}
						/>
					</label>
					<IconButton
						className='chat-form-button'
						disabled={isInputEmpty || isNotEdited}
						type='submit'>
						<SendIcon variant='outlined' color='text-primary' />
					</IconButton>
				</div>
			</form>
		</div>
	);
};

export const ChatMessage = ({ message, id, onContextMenu, isSelected }) => {
	let _className = isSelected
		? 'chat-message chat-message-selected'
		: 'chat-message';

	function handleContextMenu(event) {
		event.preventDefault();
		onContextMenu(id, event);
	}

	return (
		<p onContextMenu={handleContextMenu} className={_className}>
			{message}
		</p>
	);
};

const ALIGN = {
	TOP: 'top',
	BOTTOM: 'bottom',
	LEFT: 'left',
	RIGHT: 'right',
};

const ALIGN_MESSAGE_CLASSNAME = {
	top: 'chat-message-to-top',
	bottom: 'chat-message-to-bottom',
	left: 'chat-message-to-left',
	right: 'chat-message-to-right',
};

export const ChatMessageWrapper = ({ children, align, ...props }) => {
	let _className = `chat-message-container ${ALIGN_MESSAGE_CLASSNAME[align]}`;

	return (
		<div className={_className} {...props}>
			{children}
		</div>
	);
};

ChatMessage.defaultProps = {
	align: ALIGN.LEFT,
};

export const ChatMessages = () => {
	const {
		messages = [],
		handleDeleteMessage,
		setMessageSelectedId,
		messageSelectedId,
		setFormMode,
		userSelectedId,
		usersProfilesImagesById,
	} = useChat();
	const chatMessagesContainerRef = useRef(null);
	const [openMenu, setOpenMenu] = React.useState(false);
	const hasMessages = Boolean(messages.length);

	useLayoutEffect(() => {
		const messagesElement = chatMessagesContainerRef?.current;
		if (!messagesElement) return;
		messagesElement.scrollTo(0, messagesElement.scrollHeight);
	}, [messages]);

	const openMenuCallback = () => setOpenMenu(true);
	const closeMenu = (reason) => {
		if (reason === CLOSE_REASONS.CLICK_OUTSIDE_MENU) {
			setMessageSelectedId(null);
		}
		setOpenMenu(false);
	};

	const onContextMenuMessage = (id, event) => {
		openMenuCallback();
		setMessageSelectedId(id);
	};

	const deleteMessage = (event) => {
		handleDeleteMessage(messageSelectedId);
		setMessageSelectedId(null);
	};

	return (
		<div ref={chatMessagesContainerRef} className='chat-messages-container'>
			{!hasMessages && <p>No hay mensajes.</p>}
			{messages.map(({ id, message, userId }, index) => (
				<ChatMessageWrapper
					key={id}
					align={userSelectedId === userId ? 'left' : 'right'}>
					{messages[index + 1]?.userId !== userId && (
						<UserBagdeImage
							src={usersProfilesImagesById[userId]}
							width='40px'
							height='40px'
						/>
					)}
					<ChatMessage
						message={message}
						id={id}
						isSelected={messageSelectedId === id}
						onContextMenu={onContextMenuMessage}
					/>
				</ChatMessageWrapper>
			))}
			<Menu open={openMenu} onClose={closeMenu}>
				<MenuItem onClick={() => setFormMode(FORM_MODES.EDIT)}>Editar</MenuItem>
				<MenuItem onClick={deleteMessage}>Eliminar</MenuItem>
			</Menu>
		</div>
	);
};

export default Chat;
