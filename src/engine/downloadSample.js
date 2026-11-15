import { SAMPLE_CHATS } from '../data/sampleChats';

/**
 * Programmatically downloads the realistic fake WhatsApp group export text file
 * containing Deadlines, Resources, Announcements, and Noise chatter.
 */
export const downloadSampleChatFile = () => {
  const content = SAMPLE_CHATS[0].rawText;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'WhatsApp Chat - CS_Department_Official_2026.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

