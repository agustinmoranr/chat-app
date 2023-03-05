import {
	Chat,
	ChatHeader,
	ChatProfile,
	ChatForm,
	ChatMessages,
} from './components/Chat';
import './styles/App.css';

function App() {
	return (
		<div className='layout'>
			<header></header>
			<main className='main-content'>
				<Chat>
					<ChatHeader />
					<ChatProfile />
					<ChatMessages />
					<ChatForm />
				</Chat>
			</main>
			<footer></footer>
		</div>
	);
}

export default App;
