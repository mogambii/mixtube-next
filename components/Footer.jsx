import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
const Footer = () => {
  return (
    <div className=" w-full rounded-lg">
      <footer className="pt-10 pb-16">
        <div className="flex justify-center pt-1 gap-2">
          <a href="https://t.me/kenyanmix" aria-label="telegram">
            <FaTelegram
              size={22}
              className=" dark:text-slate-50 hover:scale-125 transition-transform duration-100"
            />
          </a>
          /
          <a href="https://instagram.com/mogambi.dev" aria-label="instagram">
            <FaInstagram
              size={22}
              className="dark:text-slate-50 hover:scale-125 transition-transform duration-100"
            />
          </a>
          /
          <a href="https://wa.me/254101468231" aria-label="whatsapp">
            <FaWhatsapp
              size={22}
              className="dark:text-slate-50 hover:scale-125 transition-transform duration-100"
            />
          </a>
        </div>
        <h5 className="dark:text-slate-50 justify-center flex text-center pt-5 text-xs">
          mixtube
        </h5>
      </footer>
    </div>
  );
};

export default Footer;
