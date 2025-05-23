import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | MixTube",
  description:
    "Learn how MixTube collects, uses, and protects your personal information and data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Privacy Policy
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Last updated: May 23, 2025
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          1. Introduction
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          MixTube (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you
          visit our website and use our services. Please read this privacy
          policy carefully. If you do not agree with the terms of this privacy
          policy, please do not access the site.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          2. Information We Collect
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We collect information that you provide directly to us when you
          register for an account, create or modify your profile, set
          preferences, or make purchases through the service.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This information may include:
        </p>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
          <li>Name, email address, and password</li>
          <li>
            Profile information such as username, profile picture, and interests
          </li>
          <li>
            User-generated content such as comments, mixtape uploads (for DJs),
            and playlists
          </li>
          <li>
            Payment information (we do not store full credit card details)
          </li>
          <li>Communication preferences</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          3. How We Use Your Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We may use the information we collect about you for various purposes,
          including to:
        </p>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>
            Send administrative information, such as updates, security alerts,
            and support messages
          </li>
          <li>Respond to comments, questions, and requests</li>
          <li>
            Personalize your experience and deliver content relevant to your
            interests
          </li>
          <li>
            Monitor and analyze trends, usage, and activities in connection with
            our services
          </li>
          <li>
            Detect, investigate, and prevent fraudulent transactions and other
            illegal activities
          </li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          4. Password Reset Tokens
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          When you request a password reset, we generate a secure token that
          expires after 15 minutes. These tokens are one-time use only and are
          stored securely in our database. We never share these tokens with
          third parties.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          5. Sharing Your Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We may share the information we collect in various ways, including:
        </p>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
          <li>
            With vendors, consultants, and other service providers who need
            access to such information to carry out work on our behalf
          </li>
          <li>
            In response to a request for information if we believe disclosure is
            in accordance with any applicable law, regulation, or legal process
          </li>
          <li>
            If we believe your actions are inconsistent with our user agreements
            or policies, or to protect the rights, property, and safety of
            MixTube or others
          </li>
          <li>
            In connection with, or during negotiations of, any merger, sale of
            company assets, financing, or acquisition of all or a portion of our
            business by another company
          </li>
          <li>With your consent or at your direction</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          6. Data Security
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We have implemented measures designed to secure your personal
          information from accidental loss and from unauthorized access, use,
          alteration, and disclosure. All information you provide to us is
          stored on secure servers behind firewalls. Any payment transactions
          will be encrypted using SSL technology.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The safety and security of your information also depends on you. Where
          we have given you (or where you have chosen) a password for access to
          certain parts of our website, you are responsible for keeping this
          password confidential. We ask you not to share your password with
          anyone.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          7. Your Rights
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
          <li>Access the personal information we hold about you</li>
          <li>
            Request that we correct any personal information we hold about you
            that is inaccurate
          </li>
          <li>
            Request that we delete any personal information we hold about you
          </li>
          <li>Opt out of marketing communications</li>
          <li>Object to processing of your personal information</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          To exercise any of these rights, please contact us at
          privacy@mixtube.xyz.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          8. Changes to Our Privacy Policy
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We may update our privacy policy from time to time. We will notify you
          of any changes by posting the new privacy policy on this page and
          updating the &quot;Last Updated&quot; date at the top of this page.
          You are advised to review this privacy policy periodically for any
          changes.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          9. Contact Us
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          If you have any questions about this privacy policy, please contact us
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
