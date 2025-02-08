import { FaPhone, FaWhatsapp, FaSms, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

const ContactButton = ({ href, icon: Icon, label, className = "" }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${className}`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

const ContactsDisplay = ({ contacts, socialMediaHandles }) => {
  if (!contacts && !socialMediaHandles) return null;

  const { phoneNumber, canCall, canSMS, canWhatsApp } = contacts || {};
  const { facebook, instagram, x } = socialMediaHandles || {};

  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
      {/* Phone Contacts */}
      {phoneNumber && (
        <div className="flex gap-2">
          {canCall && (
            <ContactButton
              href={`tel:${phoneNumber}`}
              icon={FaPhone}
              label="Call"
              className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
            />
          )}
          {canSMS && (
            <ContactButton
              href={`sms:${phoneNumber}`}
              icon={FaSms}
              label="SMS"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
            />
          )}
          {canWhatsApp && (
            <ContactButton
              href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`}
              icon={FaWhatsapp}
              label="WhatsApp"
              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
            />
          )}
        </div>
      )}

      {/* Social Media */}
      <div className="flex gap-2">
        {facebook && (
          <ContactButton
            href={facebook}
            icon={FaFacebook}
            label="Facebook"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
          />
        )}
        {instagram && (
          <ContactButton
            href={instagram}
            icon={FaInstagram}
            label="Instagram"
            className="bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-300 dark:hover:bg-pink-800"
          />
        )}
        {x && (
          <ContactButton
            href={x}
            icon={FaTwitter}
            label="X"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          />
        )}
      </div>
    </div>
  );
};

export default ContactsDisplay;
