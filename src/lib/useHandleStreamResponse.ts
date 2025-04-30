
import { useState, useCallback } from 'react';

interface UseHandleStreamResponseProps {
  onChunk: (chunk: string) => void;
  onFinish: (fullMessage: string) => void;
}

export const useHandleStreamResponse = ({ onChunk, onFinish }: UseHandleStreamResponseProps) => {
  const [fullMessage, setFullMessage] = useState('');

  const handleStreamResponse = useCallback(
    async (response: Response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder('utf-8');
      let accumulatedMessage = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          console.log('Received chunk:', chunk); // Debug log
          
          try {
            const lines = chunk
              .split('\n')
              .filter((line) => line.trim() !== '' && line.startsWith('data: '));

            for (const line of lines) {
              const jsonStr = line.replace('data: ', '').trim();
              
              if (jsonStr === '[DONE]') continue;
              
              try {
                const json = JSON.parse(jsonStr);
                console.log('Parsed JSON:', json); // Debug log
                
                const content = json.choices?.[0]?.delta?.content || '';
                
                if (content) {
                  accumulatedMessage += content;
                  onChunk(accumulatedMessage);
                  console.log('Current accumulated message:', accumulatedMessage); // Debug log
                }
              } catch (e) {
                console.error('Error parsing JSON:', jsonStr, e);
              }
            }
          } catch (e) {
            console.error('Error processing chunk:', e);
          }
        }
        
        console.log('Stream complete, final message:', accumulatedMessage); // Debug log
        setFullMessage(accumulatedMessage);
        onFinish(accumulatedMessage);
      } catch (error) {
        console.error('Error reading from stream:', error);
        throw error;
      }
    },
    [onChunk, onFinish]
  );

  return handleStreamResponse;
};
