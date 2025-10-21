import React from 'react';
import { Mail, MessageCircle, Users, Instagram } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const Contact = () => {
  const isMobile = useIsMobile();
  
  const contacts = [
    {
      platform: "Telegram",
      icon: MessageCircle,
      handle: "@yypstrade",
      url: "https://t.me/yypstrade",
      color: "text-blue-500"
    },
    {
      platform: "Email",
      icon: Mail,
      handle: "qcrb355@gmail.com",
      color: "text-red-500"
    },
    {
      platform: "Discord",
      icon: Users,
      handle: "@yypstrade",
      url: "https://discord.com/users/969898192466485329",
      color: "text-indigo-500"
    },
    {
      platform: "Instagram",
      icon: Instagram,
      handle: "@yypstrade",
      url: "https://instagram.com/yypstrade",
      color: "text-pink-500"
    }
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
            Have any questions?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Contact me for a personal consultation on any issue.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 max-w-6xl mx-auto">
          {contacts.map((contact, index) => (
            <a
              key={index}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`inline-flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-14 h-14 lg:w-16 lg:h-16'} rounded-full bg-white shadow-lg mb-2 sm:mb-3 lg:mb-4 ${contact.color} group-hover:scale-110 transition-transform duration-300`}>
                <contact.icon className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7 lg:h-8 lg:w-8'}`} />
              </div>
              <h3 className={`${isMobile ? 'text-sm' : 'text-base lg:text-lg'} font-semibold text-gray-900 mb-1 lg:mb-2`}>
                {contact.platform}
              </h3>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium ${contact.color} break-all`}>
                {contact.handle}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
