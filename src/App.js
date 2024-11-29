import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window, LoadingIndicator } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";  
import { chatConfig } from "./config";
import "./style.css"


const user = {
  id: 'john',
  name: 'John Doe',
  image: 'https://getstream.imgix.net/images/random_svg/FS.png'
};

export default function App() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(chatConfig.apiKey);

      await chatClient.connectUser(user, chatClient.devToken(user.id));

      // Change the channel name to 'React Discussion'
      const channel = chatClient.channel('messaging', 'react-talk', {
        image: 'https://www.drupal.org/files/project-images/react.png',
        name: 'React Discussion',  // Updated title
        members: [user.id],
      });

      await channel.watch();

      setChannel(channel);
      setClient(chatClient);
    }

    init();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [client]);

  if (!channel || !client) return <LoadingIndicator />;

  return (
    <div className="chat-container">
      <Chat client={client} theme="team light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader className="channel-header" />
            <MessageList className="message-list" />
            <MessageInput className="message-input-container" />
          </Window>
          <Thread className="thread" />
        </Channel>
      </Chat>
    </div>
  );
}
