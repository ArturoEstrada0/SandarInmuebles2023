import ChatBubble from './ChatBubble';

const Chat = () => {
  return (
    <div>
      <ChatBubble message="Hola, ¿cómo estás?" isUser={true} />
      <ChatBubble message="¡Hola! Estoy bien, ¿y tú?" isUser={false} />
    </div>
  );
};

export default Chat;
