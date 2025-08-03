import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | MixTapped",
  description:
    "Terms and conditions for using the MixTapped platform. Read about your rights and responsibilities as a MixTapped user.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Terms and Conditions
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Last updated: May 23, 2025
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          1. Introduction
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Welcome to MixTapped. These Terms and Conditions govern your use of
          the MixTapped website and services. By accessing or using MixTapped,
          you agree to be bound by these Terms. If you disagree with any part of
          the terms, you may not access the service.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          2. User Accounts
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          When you create an account with us, you must provide information that
          is accurate, complete, and current at all times. Failure to do so
          constitutes a breach of the Terms, which may result in immediate
          termination of your account on our service.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You are responsible for safeguarding the password that you use to
          access the service and for any activities or actions under your
          password.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          3. Content
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Our service allows you to post, link, store, share and otherwise make
          available certain information, audio files, or content. You are
          responsible for the content that you post to the service, including
          its legality, reliability, and appropriateness.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          By posting content to the service, you grant us the right to use,
          modify, publicly perform, publicly display, reproduce, and distribute
          such content on and through the service. You retain any and all of
          your rights to any content you submit, post or display on or through
          the service and you are responsible for protecting those rights.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          4. DJ Portal
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          DJs and artists who use our DJ Portal at dj.mixtapped.com are subject
          to additional terms and conditions specific to content creators. By
          uploading mixtapes and creating DJ profiles, you warrant that you have
          all necessary rights to the content you share.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          5. Copyright Policy
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We respect the intellectual property rights of others. It is our
          policy to respond to any claim that content posted on the service
          infringes on the copyright or other intellectual property rights of
          any person or entity.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          If you are a copyright owner, or authorized on behalf of one, and you
          believe that the copyrighted work has been copied in a way that
          constitutes copyright infringement, please submit your claim via email
          to copyright@mixtapped.com, with the subject line: &quot;Copyright
          Infringement&quot;.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          6. Termination
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We may terminate or suspend your account and bar access to the service
          immediately, without prior notice or liability, under our sole
          discretion, for any reason whatsoever and without limitation,
          including but not limited to a breach of the Terms.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          7. Limitation of Liability
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          In no event shall MixTapped, nor its directors, employees, partners,
          agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential or punitive damages, including
          without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from your access to or use of or
          inability to access or use the service.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          8. Changes
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material we will provide at
          least 30 days&apos; notice prior to any new terms taking effect. What
          constitutes a material change will be determined at our sole
          discretion.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
          9. Contact Us
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          If you have any questions about these Terms, please contact us at
          legal@mixtapped.com.
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
