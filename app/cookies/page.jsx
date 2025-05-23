import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | MixTube",
  description:
    "Information about how MixTube uses cookies and similar technologies to enhance your browsing experience.",
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Cookie Policy
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Last updated: May 23, 2025
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          1. Introduction
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          MixTube uses cookies and similar technologies to enhance your browsing
          experience, analyze site traffic, personalize content, and serve
          targeted advertisements. This Cookie Policy explains how we use these
          technologies and the choices you have regarding their use.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          2. What Are Cookies?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Cookies are small text files that are stored on your device when you
          visit a website. They are widely used to make websites work more
          efficiently and provide information to the owners of the site. Cookies
          can be &quot;persistent&quot; or &quot;session&quot; cookies.
          Persistent cookies remain on your device when you go offline, while
          session cookies are deleted as soon as you close your web browser.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          3. How We Use Cookies
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We use different types of cookies for various purposes:
        </p>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
          <li>
            <strong>Essential Cookies:</strong> These are necessary for the
            website to function properly and cannot be switched off in our
            systems. They are usually only set in response to actions made by
            you which amount to a request for services, such as setting your
            privacy preferences, logging in, or filling in forms.
          </li>
          <li>
            <strong>Performance Cookies:</strong> These allow us to count visits
            and traffic sources so we can measure and improve the performance of
            our site. They help us to know which pages are the most and least
            popular and see how visitors move around the site.
          </li>
          <li>
            <strong>Functional Cookies:</strong> These enable the website to
            provide enhanced functionality and personalization. They may be set
            by us or by third-party providers whose services we have added to
            our pages.
          </li>
          <li>
            <strong>Targeting Cookies:</strong> These may be set through our
            site by our advertising partners. They may be used by those
            companies to build a profile of your interests and show you relevant
            advertisements on other sites.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          4. Specific Cookies We Use
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Here are some of the key cookies we use on MixTube:
        </p>
        <table className="min-w-full border border-gray-300 dark:border-gray-700 mb-6">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-left">
                Cookie Name
              </th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-left">
                Purpose
              </th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-left">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white dark:bg-gray-900">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                session_id
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                Maintains your login session
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                Session
              </td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                preferences
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                Stores your site preferences (e.g., dark mode)
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                1 year
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-900">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                _ga
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                Google Analytics - Used to distinguish users
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                2 years
              </td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                _gid
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                Google Analytics - Used to distinguish users
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                24 hours
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          5. Managing Cookies
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Most web browsers allow you to control cookies through their settings
          preferences. However, if you limit the ability of websites to set
          cookies, you may worsen your overall user experience, since it will no
          longer be personalized to you. It may also stop you from saving
          customized settings like login information.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          To manage cookies in different browsers, please consult the
          documentation for your specific browser:
        </p>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          6. Changes to Our Cookie Policy
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We may update our Cookie Policy from time to time. We will notify you
          of any changes by posting the new Cookie Policy on this page and
          updating the &quot;Last Updated&quot; date at the top of this page.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          7. Contact Us
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          If you have any questions about our Cookie Policy, please contact us
          at privacy@mixtube.xyz.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
