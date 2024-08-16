import React from "react";
import { BsTwitterX } from "react-icons/bs";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const ContactsDisplay = ({ socialMediaHandles, contacts }) => {
  if (!socialMediaHandles && !contacts) return null;
  return (
    <div className=" bg-transparent shadow-md rounded-lg p-4 m-2 ring-1">
      <div className="flex space-x-4 items-center">
        {contacts?.canCall && contacts?.phoneNumber && (
          <a
            href={`tel:${contacts.phoneNumber}`}
            className="cursor-pointer text-blue-500 hover:scale-105 transition-transform"
          >
            <FaPhone size={18} />
          </a>
        )}
        {contacts?.canWP && contacts?.phoneNumber && (
          <a
            href={`https://wa.me/${contacts.phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:scale-105 transition-transform"
          >
            <FaWhatsapp size={24} />
          </a>
        )}
        {contacts?.canSMS && contacts?.phoneNumber && (
          <a
            href={`sms:${contacts.phoneNumber}`}
            className="cursor-pointer text-gray-700 hover:scale-105 transition-transform"
          >
            <FaEnvelope className=" dark:text-slate-300" size={20} />
          </a>
        )}
        {socialMediaHandles?.Instagram && (
          <a
            href={socialMediaHandles?.Instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:scale-105 transition-transform"
          >
            <FaInstagram size={24} />
          </a>
        )}
        {socialMediaHandles?.FaceBook && (
          <a
            href={socialMediaHandles?.FaceBook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:scale-105 transition-transform"
          >
            <FaFacebook size={24} />
          </a>
        )}
        {socialMediaHandles?.X && (
          <a
            href={socialMediaHandles.X}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:scale-105 transition-transform"
          >
            <BsTwitterX size={20} className=" text-black dark:text-slate-50" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ContactsDisplay;
