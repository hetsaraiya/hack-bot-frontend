import { User, Bot } from 'lucide-react';
import type { Message as MessageType } from '../../types/chat';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  // const formatContent = (content: string) => {
  //   return content.split('\n').map((line, i) => (
  //     <React.Fragment key={i}>
  //       {line}
  //       <br />
  //     </React.Fragment>
  //   ));
  // };

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm whitespace-pre-wrap">
        <ReactMarkdown>{message.question}</ReactMarkdown>
        </div>
      </div>
      {message.answer && (
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Bot className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg shadow-sm whitespace-pre-wrap">
          <ReactMarkdown>{message.answer}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}