import Link from "next/link";

export default function Terms() {
  return (
    <div className="prose max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <p className="text-slate-600 mb-8">
        <strong>Last Updated:</strong> October 22, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Dog Atlas. These Terms of Service ("Terms") govern your access to and use of the Dog Atlas 
          website and services (collectively, the "Service"), operated by <strong>Gustavo Del Prato</strong> 
          ("we," "us," or "our").
        </p>
        <p className="mb-4">
          By accessing or using Dog Atlas, you agree to be bound by these Terms. If you do not agree to these 
          Terms, please do not use our Service.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="font-semibold mb-2">Operator Contact Information:</p>
          <p>Gustavo Del Prato</p>
          <p>Email: <a href="mailto:inksky11@gmail.com" className="text-blue-600 hover:underline">inksky11@gmail.com</a></p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
        <p className="mb-4">
          Dog Atlas is a platform that helps dog owners discover dog-friendly places including cafés, 
          restaurants, parks, beaches, and other venues where dogs are welcome. Our Service includes:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Directory of dog-friendly locations worldwide</li>
          <li>User-generated reviews and ratings</li>
          <li>Photo uploads and location information</li>
          <li>Search and filtering capabilities</li>
          <li>User accounts and community features</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. User Accounts and Registration</h2>
        <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
        <p className="mb-4">
          To access certain features, you may need to create an account. You agree to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and update your information to keep it accurate</li>
          <li>Maintain the security of your password and account</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-3">3.2 Age Requirement</h3>
        <p className="mb-4">
          You must be at least 13 years old to use Dog Atlas. By using the Service, you represent that you 
          meet this age requirement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. User Content and Conduct</h2>
        <h3 className="text-xl font-semibold mb-3">4.1 Content Submission</h3>
        <p className="mb-4">
          By submitting content (reviews, photos, place suggestions, etc.) to Dog Atlas, you:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content</li>
          <li>Represent that you own or have the right to submit the content</li>
          <li>Agree that your content does not violate any third-party rights</li>
          <li>Agree to submit accurate and truthful information</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">4.2 Prohibited Content and Conduct</h3>
        <p className="mb-4">You agree NOT to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Submit false, misleading, or inaccurate information</li>
          <li>Post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or obscene</li>
          <li>Violate any intellectual property rights</li>
          <li>Upload malicious code or viruses</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use the Service for commercial spam or advertising without permission</li>
          <li>Impersonate others or misrepresent your affiliation</li>
          <li>Harass, bully, or harm other users</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">4.3 Content Moderation</h3>
        <p className="mb-4">
          We reserve the right to review, moderate, edit, or remove any user content that violates these 
          Terms or is deemed inappropriate, at our sole discretion, without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Intellectual Property Rights</h2>
        <h3 className="text-xl font-semibold mb-3">5.1 Our Content</h3>
        <p className="mb-4">
          The Dog Atlas Service, including its design, features, graphics, and content (excluding user content), 
          is owned by Gustavo Del Prato and protected by copyright, trademark, and other laws. You may not 
          copy, modify, distribute, or create derivative works without our written permission.
        </p>

        <h3 className="text-xl font-semibold mb-3">5.2 Trademarks</h3>
        <p className="mb-4">
          "Dog Atlas" and related logos are trademarks of Gustavo Del Prato. You may not use these marks 
          without prior written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Disclaimer of Warranties</h2>
        <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 mb-4">
          <p className="mb-4">
            <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
            EITHER EXPRESS OR IMPLIED.</strong>
          </p>
          <p className="mb-4">We do not guarantee that:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>The Service will be uninterrupted, secure, or error-free</li>
            <li>Information provided by users is accurate or reliable</li>
            <li>Venues listed are currently dog-friendly or meet your specific needs</li>
            <li>Any defects will be corrected</li>
          </ul>
          <p>
            <strong>You use the Service at your own risk.</strong> Always verify information independently 
            and comply with local laws, venue policies, and posted signage regarding dogs.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
        <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 mb-4">
          <p className="mb-4">
            <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, GUSTAVO DEL PRATO SHALL NOT BE LIABLE FOR:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, data, use, or goodwill</li>
            <li>Service interruptions or errors</li>
            <li>Actions or inactions of third parties (venue owners, other users)</li>
            <li>Injuries, property damage, or other harm resulting from visiting listed venues</li>
            <li>Inaccurate or outdated information on the platform</li>
          </ul>
          <p>
            <strong>OUR TOTAL LIABILITY SHALL NOT EXCEED €100 OR THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS, 
            WHICHEVER IS GREATER.</strong>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Indemnification</h2>
        <p className="mb-4">
          You agree to indemnify, defend, and hold harmless Gustavo Del Prato and Dog Atlas from any claims, 
          damages, losses, liabilities, and expenses (including legal fees) arising from:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your use of the Service</li>
          <li>Your content submissions</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any third-party rights</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Privacy and Data Protection</h2>
        <p className="mb-4">
          Your use of Dog Atlas is also governed by our Privacy Policy, which explains how we collect, 
          use, and protect your personal information in compliance with GDPR and other applicable data 
          protection laws.
        </p>
        <p className="mb-4">
          Please review our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> to 
          understand our data practices.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
        <h3 className="text-xl font-semibold mb-3">10.1 By You</h3>
        <p className="mb-4">
          You may stop using the Service and delete your account at any time by contacting us at 
          inksky11@gmail.com.
        </p>

        <h3 className="text-xl font-semibold mb-3">10.2 By Us</h3>
        <p className="mb-4">
          We reserve the right to suspend or terminate your access to the Service at any time, with or 
          without cause, with or without notice, including for:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Violation of these Terms</li>
          <li>Fraudulent or illegal activity</li>
          <li>Abuse of the Service or other users</li>
          <li>Extended periods of inactivity</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">10.3 Effect of Termination</h3>
        <p className="mb-4">
          Upon termination, your right to use the Service ceases immediately. Sections of these Terms that 
          by their nature should survive termination will survive, including warranty disclaimers, 
          limitations of liability, and dispute resolution provisions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">11. Third-Party Links and Services</h2>
        <p className="mb-4">
          Dog Atlas may contain links to third-party websites, services, or businesses (e.g., Google Maps, 
          social media). We are not responsible for:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>The content, privacy policies, or practices of third-party sites</li>
          <li>Any transactions between you and third parties</li>
          <li>The accuracy of information provided by external sources</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">12. Dispute Resolution</h2>
        <h3 className="text-xl font-semibold mb-3">12.1 Informal Resolution</h3>
        <p className="mb-4">
          If you have any dispute with us, please contact us first at inksky11@gmail.com to attempt to 
          resolve the matter informally.
        </p>

        <h3 className="text-xl font-semibold mb-3">12.2 Governing Law</h3>
        <p className="mb-4">
          These Terms are governed by the laws of the jurisdiction where the operator is based, 
          without regard to conflict of law provisions.
        </p>

        <h3 className="text-xl font-semibold mb-3">12.3 Jurisdiction</h3>
        <p className="mb-4">
          You agree to submit to the personal jurisdiction of the courts located in the operator's 
          jurisdiction for any legal proceedings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these Terms at any time. We will notify users of material changes by:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Updating the "Last Updated" date at the top of this page</li>
          <li>Posting a notice on the website</li>
          <li>Sending an email to registered users (for significant changes)</li>
        </ul>
        <p className="mb-4">
          Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">14. General Provisions</h2>
        <h3 className="text-xl font-semibold mb-3">14.1 Entire Agreement</h3>
        <p className="mb-4">
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
          Dog Atlas regarding the Service.
        </p>

        <h3 className="text-xl font-semibold mb-3">14.2 Severability</h3>
        <p className="mb-4">
          If any provision of these Terms is found to be unenforceable, the remaining provisions will 
          remain in full effect.
        </p>

        <h3 className="text-xl font-semibold mb-3">14.3 Waiver</h3>
        <p className="mb-4">
          Our failure to enforce any right or provision of these Terms will not be considered a waiver 
          of those rights.
        </p>

        <h3 className="text-xl font-semibold mb-3">14.4 Assignment</h3>
        <p className="mb-4">
          You may not assign or transfer these Terms without our prior written consent. We may assign 
          our rights and obligations without restriction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">15. Contact Information</h2>
        <p className="mb-4">
          If you have questions about these Terms of Service, please contact us:
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-semibold">Dog Atlas</p>
          <p>Operated by: Gustavo Del Prato</p>
          <p>Email: <a href="mailto:inksky11@gmail.com" className="text-blue-600 hover:underline">inksky11@gmail.com</a></p>
          <p className="mt-2 text-sm text-slate-600">We aim to respond to all inquiries within 48 hours.</p>
        </div>
      </section>

      <hr className="my-8" />

      <section className="text-sm text-slate-600">
        <p className="mb-2">
          <strong>Acknowledgment:</strong> By using Dog Atlas, you acknowledge that you have read, 
          understood, and agree to be bound by these Terms of Service.
        </p>
        <p>
          Thank you for being part of the Dog Atlas community! 🐾
        </p>
      </section>
    </div>
  );
}
