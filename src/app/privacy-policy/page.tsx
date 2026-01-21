export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last Updated: January 20, 2026</p>

        <p className="mt-6 text-sm leading-7 text-slate-700">
          Eidendo, Inc. (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
          operates the Bonfilet website (bonfilet.jp). This Privacy Policy explains
          how we collect, use, and protect your personal information.
        </p>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">1. Information We Collect</h2>
          <p>When you place an order, we collect:</p>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-semibold">Contact Information</span>: Name, email address, phone number
            </li>
            <li>
              <span className="font-semibold">Shipping Information</span>: Delivery address
            </li>
            <li>
              <span className="font-semibold">Payment Information</span>: Processed securely through Stripe (we do not
              store your card details)
            </li>
            <li>
              <span className="font-semibold">Order Details</span>: Product customization choices (text, colors,
              design specifications)
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-5">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your order status</li>
            <li>Respond to your inquiries</li>
            <li>Improve our products and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">3. Information Sharing</h2>
          <p>We share your information with:</p>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-semibold">Manufacturing Partners</span>: Your name, shipping address, and phone
              number are shared with our manufacturing facility in China to fulfill your order and enable FedEx
              shipping. This is necessary for international customs clearance and delivery.
            </li>
            <li>
              <span className="font-semibold">Shipping Carriers</span>: FedEx receives your shipping information to
              deliver your order.
            </li>
            <li>
              <span className="font-semibold">Payment Processor</span>: Stripe processes your payment securely.
            </li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">4. International Data Transfer</h2>
          <p>
            Your personal information may be transferred to and processed in countries outside your residence,
            including China (for manufacturing) and the United States (for payment processing). By placing an order,
            you consent to this transfer.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">5. Data Retention</h2>
          <p>
            We retain your order information for 1 year after your purchase for customer service purposes. After this
            period, your data will be deleted unless retention is required by law.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">6. Cookies</h2>
          <p>We may use cookies and similar technologies to:</p>
          <ul className="list-disc pl-5">
            <li>Remember your preferences</li>
            <li>Analyze website traffic</li>
            <li>Improve user experience</li>
          </ul>
          <p>You can control cookies through your browser settings.</p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5">
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for data processing</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href="mailto:bonfilet@eidendo.co.jp" className="text-slate-900 underline">
              bonfilet@eidendo.co.jp
            </a>
            .
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">8. Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against
            unauthorized access, alteration, or destruction.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">9. Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to individuals under 16. We do not knowingly collect personal information
            from children.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting
            the new policy on our website.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <p>
            <span className="font-semibold">Eidendo, Inc.</span>
            <br />
            WinAoyama 14F, 2-2-15, Minami-Aoyama, Minato-ku, Tokyo, JAPAN
            <br />
            Email:{" "}
            <a href="mailto:bonfilet@eidendo.co.jp" className="text-slate-900 underline">
              bonfilet@eidendo.co.jp
            </a>
            <br />
            Phone: +81-3-6822-4668
          </p>
        </section>
      </div>
    </main>
  );
}


