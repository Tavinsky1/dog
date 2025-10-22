export default function Privacy() {
  return (
    <div className="prose max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <p className="text-slate-600 mb-8">
        <strong>Last Updated:</strong> October 22, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Dog Atlas ("we," "us," or "our") is operated by <strong>Gustavo Del Prato</strong>. We are 
          committed to protecting your privacy and personal data in compliance with the General Data 
          Protection Regulation (GDPR) and other applicable data protection laws.
        </p>
        <p className="mb-4">
          This Privacy Policy explains how we collect, use, store, and protect your personal information 
          when you use our website and services.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="font-semibold mb-2">Data Controller:</p>
          <p>Gustavo Del Prato</p>
          <p>Email: <a href="mailto:inksky11@gmail.com" className="text-blue-600 hover:underline">inksky11@gmail.com</a></p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide Directly</h3>
        <p className="mb-4">When you create an account or use our services, we collect:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Account Information:</strong> Email address, username, password (encrypted)</li>
          <li><strong>Profile Information:</strong> Name, profile photo (optional), user role</li>
          <li><strong>User-Generated Content:</strong> Reviews, ratings, comments, photos, place submissions</li>
          <li><strong>Communication Data:</strong> Messages sent to us via contact forms or email</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">2.2 Information Collected Automatically</h3>
        <p className="mb-4">When you use Dog Atlas, we automatically collect:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, search queries</li>
          <li><strong>Device Information:</strong> Browser type, operating system, device type, IP address</li>
          <li><strong>Location Data:</strong> Approximate location based on IP address (not precise GPS)</li>
          <li><strong>Cookies and Similar Technologies:</strong> See Section 7 for details</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">2.3 Third-Party Information</h3>
        <p className="mb-4">We may receive information from third-party services:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>OAuth Providers:</strong> If you sign in with Google, we receive basic profile information (name, email, profile photo)</li>
          <li><strong>Analytics Services:</strong> Aggregated usage statistics from analytics providers</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">We use your personal data for the following purposes:</p>
        
        <h3 className="text-xl font-semibold mb-3">3.1 Service Provision (Contractual Necessity)</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Create and manage your user account</li>
          <li>Enable you to submit and view content (reviews, photos, places)</li>
          <li>Display your contributions to other users</li>
          <li>Process your searches and personalize results</li>
          <li>Provide customer support</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">3.2 Service Improvement (Legitimate Interest)</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Analyze usage patterns to improve features and user experience</li>
          <li>Monitor and prevent fraud, spam, and abuse</li>
          <li>Ensure platform security and integrity</li>
          <li>Develop new features and services</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">3.3 Communication (Legitimate Interest / Consent)</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Send service-related notifications (e.g., account changes, security alerts)</li>
          <li>Respond to your inquiries and support requests</li>
          <li>Send promotional emails (with your consent - you can opt out anytime)</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">3.4 Legal Compliance (Legal Obligation)</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Comply with applicable laws and regulations</li>
          <li>Respond to legal requests and prevent illegal activities</li>
          <li>Enforce our Terms of Service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Legal Basis for Processing (GDPR)</h2>
        <p className="mb-4">Under GDPR, we process your personal data based on:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Contract:</strong> Processing necessary to provide our services to you</li>
          <li><strong>Consent:</strong> You have given clear consent (e.g., for marketing emails)</li>
          <li><strong>Legitimate Interests:</strong> Necessary for our legitimate interests (e.g., improving service, preventing fraud) that don't override your rights</li>
          <li><strong>Legal Obligation:</strong> Required to comply with the law</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. How We Share Your Information</h2>
        <p className="mb-4 font-semibold">
          We do NOT sell your personal data to third parties.
        </p>
        
        <h3 className="text-xl font-semibold mb-3">5.1 Public Information</h3>
        <p className="mb-4">
          The following information is publicly visible to all users:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your username and profile photo</li>
          <li>Reviews, ratings, and comments you post</li>
          <li>Photos you upload</li>
          <li>Places you submit</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">5.2 Service Providers</h3>
        <p className="mb-4">We share data with trusted third-party service providers who help us operate:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Hosting Providers:</strong> Vercel (website hosting)</li>
          <li><strong>Database Services:</strong> For data storage and management</li>
          <li><strong>Authentication Services:</strong> NextAuth, Google OAuth</li>
          <li><strong>Analytics Providers:</strong> To understand usage patterns (anonymized data)</li>
          <li><strong>Email Services:</strong> For transactional and marketing emails</li>
        </ul>
        <p className="mb-4">
          These providers are contractually bound to protect your data and use it only for specified purposes.
        </p>

        <h3 className="text-xl font-semibold mb-3">5.3 Legal Requirements</h3>
        <p className="mb-4">We may disclose your information if required by law or to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Comply with legal obligations, court orders, or government requests</li>
          <li>Protect our rights, property, or safety</li>
          <li>Prevent fraud or illegal activities</li>
          <li>Protect the safety of our users or the public</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">5.4 Business Transfers</h3>
        <p className="mb-4">
          If Dog Atlas is involved in a merger, acquisition, or sale of assets, your personal data may be 
          transferred. We will notify you before your data is transferred and becomes subject to a different 
          privacy policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
        <p className="mb-4">We retain your personal data for as long as:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Active Accounts:</strong> As long as your account is active</li>
          <li><strong>Deleted Accounts:</strong> 30 days after deletion (to allow recovery), then permanently deleted</li>
          <li><strong>User Content:</strong> Reviews and contributions may be retained (anonymized) for service integrity</li>
          <li><strong>Legal Requirements:</strong> Longer if required by law or for legal purposes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking Technologies</h2>
        <p className="mb-4">We use cookies and similar technologies to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Essential Cookies:</strong> Required for authentication, security, and basic functionality</li>
          <li><strong>Analytics Cookies:</strong> Understand how users interact with our service</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
        </ul>
        <p className="mb-4">
          You can control cookies through your browser settings. Disabling certain cookies may limit 
          functionality.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Your Rights Under GDPR</h2>
        <p className="mb-4">If you are in the European Economic Area (EEA), you have the following rights:</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">8.1 Right to Access</h3>
          <p className="mb-2">You can request a copy of all personal data we hold about you.</p>
          
          <h3 className="text-lg font-semibold mb-3 mt-4">8.2 Right to Rectification</h3>
          <p className="mb-2">You can correct inaccurate or incomplete personal data.</p>
          
          <h3 className="text-lg font-semibold mb-3 mt-4">8.3 Right to Erasure ("Right to be Forgotten")</h3>
          <p className="mb-2">You can request deletion of your personal data in certain circumstances.</p>
          
          <h3 className="text-lg font-semibold mb-3 mt-4">8.4 Right to Restrict Processing</h3>
          <p className="mb-2">You can limit how we use your data in certain situations.</p>
          
          <h3 className="text-lg font-semibold mb-3 mt-4">8.5 Right to Data Portability</h3>
          <p className="mb-2">You can receive your data in a machine-readable format and transfer it to another service.</p>
          
          <h3 className="text-lg font-semibold mb-3 mt-4">8.6 Right to Object</h3>
          <p className="mb-2">You can object to processing based on legitimate interests or for direct marketing.</p>
          
          <h3 className="text-lg font-semibold mb-3 mt-4">8.7 Right to Withdraw Consent</h3>
          <p className="mb-2">You can withdraw consent at any time (where processing is based on consent).</p>
          
          <h3 className="text-lg font-semibold mb-3 mt-4">8.8 Right to Lodge a Complaint</h3>
          <p>You can file a complaint with your local data protection authority.</p>
        </div>

        <p className="mb-4 font-semibold">To exercise any of these rights, contact us at:</p>
        <p className="mb-4">
          Email: <a href="mailto:inksky11@gmail.com" className="text-blue-600 hover:underline">inksky11@gmail.com</a>
        </p>
        <p className="mb-4">We will respond to your request within 30 days.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Data Security</h2>
        <p className="mb-4">We implement appropriate technical and organizational measures to protect your data:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Encryption:</strong> Passwords are hashed using industry-standard encryption (bcrypt)</li>
          <li><strong>Secure Connections:</strong> HTTPS/SSL encryption for all data transmission</li>
          <li><strong>Access Controls:</strong> Limited employee/system access to personal data</li>
          <li><strong>Regular Security Audits:</strong> Monitoring for vulnerabilities and threats</li>
        </ul>
        <p className="mb-4">
          However, no method of transmission over the Internet is 100% secure. While we strive to protect 
          your data, we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
        <p className="mb-4">
          Your data may be transferred to and processed in countries outside your country of residence, 
          including countries that may not have the same data protection laws as your jurisdiction.
        </p>
        <p className="mb-4">
          When we transfer data outside the EEA, we ensure appropriate safeguards are in place, such as:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Standard Contractual Clauses approved by the European Commission</li>
          <li>Adequacy decisions recognizing equivalent data protection</li>
          <li>Other legally approved transfer mechanisms</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">11. Children's Privacy</h2>
        <p className="mb-4">
          Dog Atlas is not intended for children under 13 years old. We do not knowingly collect personal 
          information from children under 13.
        </p>
        <p className="mb-4">
          If we discover that we have collected data from a child under 13, we will delete it immediately. 
          If you believe we have collected data from a child, please contact us at inksky11@gmail.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">12. Third-Party Links</h2>
        <p className="mb-4">
          Dog Atlas may contain links to third-party websites, services, or social media platforms. We are 
          not responsible for the privacy practices of these external sites.
        </p>
        <p className="mb-4">
          We encourage you to review the privacy policies of any third-party sites you visit.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">13. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of significant changes by:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Updating the "Last Updated" date at the top of this page</li>
          <li>Posting a prominent notice on our website</li>
          <li>Sending an email to registered users (for material changes)</li>
        </ul>
        <p className="mb-4">
          Your continued use of Dog Atlas after changes take effect constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">14. California Privacy Rights (CCPA)</h2>
        <p className="mb-4">
          If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Right to know what personal information is collected, used, shared, or sold</li>
          <li>Right to delete personal information</li>
          <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
          <li>Right to non-discrimination for exercising your privacy rights</li>
        </ul>
        <p className="mb-4">To exercise these rights, contact us at inksky11@gmail.com.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">15. Contact Us</h2>
        <p className="mb-4">
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
          please contact us:
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="font-semibold">Dog Atlas - Data Controller</p>
          <p>Gustavo Del Prato</p>
          <p>Email: <a href="mailto:inksky11@gmail.com" className="text-blue-600 hover:underline">inksky11@gmail.com</a></p>
          <p className="mt-2 text-sm text-slate-600">
            We are committed to resolving privacy concerns and will respond to your inquiry within 30 days.
          </p>
        </div>
      </section>

      <hr className="my-8" />

      <section className="text-sm text-slate-600">
        <p className="mb-2">
          <strong>Data Summary:</strong> We collect account information (email, username), user-generated 
          content (reviews, photos), and usage data (analytics). We use this data to provide and improve 
          our service. We do not sell your personal data.
        </p>
        <p>
          For full details on data collection, use, and your rights, please read the complete policy above.
        </p>
      </section>
    </div>
  );
}
