import { CenteredLayout } from '../../../components/Layouts'

export const Privacy = () => {
  return (
    <CenteredLayout title="Privacy">
        <div className="bg-gray-100 text-gray-800 p-4 max-w-4xl m-4">
          <header className="bg-blue-600 text-white p-4 shadow-md rounded-md">
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
          </header>
          <main className="container mx-auto p-6 bg-white mt-6 rounded-lg shadow-lg">
            <section>
              <h2 className="text-xl font-semibold mb-2">Introduction</h2>
              <p className="mb-4">
                At <strong>Rede.io</strong> ("we," "our," or "us"), your privacy is paramount. This Privacy Policy
                describes how we collect, use, disclose, and safeguard your information when you use our Software as a Service
                (SaaS) application ("Service"). By accessing or using the Service, you agree to this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
              <ul className="list-disc list-inside mb-4">
                <li><strong>Personal Information:</strong>
                  <ul className="list-disc list-inside ml-6">
                    <li>Email Address: We collect your email address for account creation and to provide daily emails about the topics you’re interested in.</li>
                    <li>Name (Optional): Optionally, you may provide your name to personalize your experience.</li>
                  </ul>
                </li>
                <li><strong>Usage Information:</strong>
                  <ul className="list-disc list-inside ml-6">
                    <li>Log Data: We collect standard log files, including browser type, IP address, operating system, and timestamps, to analyze and improve the Service.</li>
                  </ul>
                </li>
                <li><strong>Niche/Topic Preferences:</strong>
                  <ul className="list-disc list-inside ml-6">
                    <li>Interest Topics and Niches: When you specify a topic or niche of interest, we save it to curate and send recurring emails tailored to your preferences.</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">How We Use Information</h2>
              <ul className="list-disc list-inside mb-4">
                <li><strong>Service Operation:</strong> We use your email address to authenticate your login and send you personalized recurring emails.</li>
                <li><strong>Improvement and Optimization:</strong> Usage data and log files are used to enhance and optimize the Service’s functionality and performance.</li>
                <li><strong>Customer Support:</strong> We may use your information to respond to inquiries and offer technical assistance.</li>
                <li><strong>Marketing and Communication:</strong> With your consent, we may send you promotional materials or updates about our Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Sharing of Information</h2>
              <ul className="list-disc list-inside mb-4">
                <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party service providers who assist with email delivery, analytics, or customer support. They are obligated to protect your data and use it solely for the Service's intended purposes.</li>
                <li><strong>Legal Obligations:</strong> We may disclose your information to comply with legal requirements, protect our rights, or enforce our policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Data Security</h2>
              <p className="mb-4">
                We implement industry-standard encryption and access controls to protect your information. However, no method of
                transmission over the Internet is completely secure. While we strive to protect your data, we cannot guarantee
                absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Retention of Data</h2>
              <p className="mb-4">
                We retain your information only for as long as necessary to fulfill the purposes outlined in this policy. If you
                deactivate your account, we will delete your data unless legally required to retain it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Your Rights and Choices</h2>
              <ul className="list-disc list-inside mb-4">
                <li><strong>Access and Correction:</strong> You may access, update, or correct your personal information by logging into your account.</li>
                <li><strong>Unsubscribe or Deletion:</strong> You can opt out of emails via a link in the email or request account deletion by contacting us directly.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Children's Privacy</h2>
              <p className="mb-4">
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from
                anyone under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Changes to this Privacy Policy</h2>
              <p className="mb-4">
                We may revise this Privacy Policy from time to time. Any changes will be posted here, and the date of the last update will
                be indicated at the top of this page. Your continued use of the Service after changes have been made signifies acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
              <p className="mb-4">
                If you have any questions or concerns about this Privacy Policy, feel free to contact us at support@rede.io.
              </p>
            </section>
          </main>
        </div>
    </CenteredLayout>
  )
}
