import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '2348147644763'; // 08147644763 in international format

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hi Daja Installation Services, I need help with...'
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-base hover:scale-105 hover:bg-[#1ebe5a]"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
