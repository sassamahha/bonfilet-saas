export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last Updated: January 20, 2026</p>

        <p className="mt-6 text-sm leading-7 text-slate-700">
          Welcome to Bonfilet. These Terms of Service (&quot;Terms&quot;) govern your use of the Bonfilet website
          (bonfilet.jp) and purchases made through our platform. By placing an order, you agree to these Terms.
        </p>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">1. About Us</h2>
          <p>Bonfilet is operated by Eidendo, Inc., a company registered in Japan.</p>
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

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">2. Products</h2>
          <p>
            Bonfilet offers custom fabric bracelets with personalized text and colors. All products are made-to-order
            based on your specifications.
          </p>
          <h3 className="font-semibold text-slate-900">2.1 Customization</h3>
          <p>You are responsible for ensuring that your custom text and design:</p>
          <ul className="list-disc pl-5">
            <li>Does not infringe on any third-party intellectual property rights</li>
            <li>Does not contain offensive, defamatory, or illegal content</li>
            <li>Is spelled correctly and as intended</li>
          </ul>
          <p>We reserve the right to refuse orders containing inappropriate content.</p>

          <h3 className="font-semibold text-slate-900">2.2 Product Specifications</h3>
          <ul className="list-disc pl-5">
            <li>Maximum text length: 40 characters</li>
            <li>Colors: Custom hex color selection for background and text</li>
            <li>One-size design with adjustable fit</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">3. Orders and Payment</h2>
          <h3 className="font-semibold text-slate-900">3.1 Order Confirmation</h3>
          <p>
            An order is confirmed only after successful payment processing. You will receive an order confirmation via
            email.
          </p>

          <h3 className="font-semibold text-slate-900">3.2 Pricing</h3>
          <p>
            All prices are displayed in USD and include the product cost. Shipping costs are calculated separately based
            on your destination.
          </p>

          <h3 className="font-semibold text-slate-900">3.3 Payment</h3>
          <p>
            We accept major credit cards through Stripe. Your payment information is processed securely and we do not
            store your card details.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">4. Shipping</h2>
          <h3 className="font-semibold text-slate-900">4.1 Manufacturing and Delivery</h3>
          <ul className="list-disc pl-5">
            <li>Products are manufactured in China</li>
            <li>Shipping is handled by FedEx</li>
            <li>Estimated delivery: 7-14 business days (varies by destination)</li>
          </ul>

          <h3 className="font-semibold text-slate-900">4.2 Shipping Destinations</h3>
          <p>
            We currently ship to: United States, Canada, United Kingdom, Australia, New Zealand, Singapore, Hong Kong,
            Taiwan, Malaysia, Thailand, Vietnam, and Japan.
          </p>

          <h3 className="font-semibold text-slate-900">4.3 Customs, Duties, and Taxes</h3>
          <p className="font-semibold">
            IMPORTANT: The displayed price includes shipping but does NOT include:
          </p>
          <ul className="list-disc pl-5">
            <li>Import duties</li>
            <li>Taxes (VAT, GST, etc.)</li>
            <li>Customs/brokerage fees</li>
          </ul>
          <p>
            These fees are determined by your country&apos;s customs authority and are the responsibility of the
            recipient. FedEx may collect these fees before, during, or after delivery. By placing an order, you
            acknowledge and accept responsibility for any customs duties, taxes, and brokerage fees.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">5. Refund and Return Policy</h2>
          <h3 className="font-semibold text-slate-900">5.1 Custom Products - No Returns</h3>
          <p>
            Because all Bonfilet products are custom-made to your specifications, we cannot accept returns or issue
            refunds for change of mind. Please review your design carefully before confirming your order.
          </p>

          <h3 className="font-semibold text-slate-900">5.2 Defective Products</h3>
          <p>If you receive a defective product:</p>
          <ol className="list-decimal pl-5">
            <li>Contact us within 7 days of delivery at bonfilet@eidendo.co.jp</li>
            <li>Provide photos clearly showing the defect</li>
            <li>We will assess the issue and offer a resolution</li>
          </ol>
          <p>
            Note: We include spare units with bulk orders to accommodate minor defects. Please check your spare units
            before contacting us.
          </p>

          <h3 className="font-semibold text-slate-900">5.3 Non-Delivery</h3>
          <p>
            If your order does not arrive within 30 days of the estimated delivery date, please contact us. We will
            investigate with FedEx and either reship or refund your order.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">6. Intellectual Property</h2>
          <h3 className="font-semibold text-slate-900">6.1 Your Content</h3>
          <p>
            You retain ownership of any text or designs you submit. By placing an order, you grant us a license to use
            your content solely for manufacturing your product.
          </p>
          <h3 className="font-semibold text-slate-900">6.2 Our Content</h3>
          <p>
            The Bonfilet name, logo, website design, and all related materials are owned by Eidendo, Inc. and protected
            by intellectual property laws.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law:</p>
          <ul className="list-disc pl-5">
            <li>Our total liability for any claim shall not exceed the amount you paid for the relevant order</li>
            <li>We are not liable for indirect, incidental, or consequential damages</li>
            <li>
              We are not liable for delays or failures caused by circumstances beyond our control (including shipping
              delays, customs holds, or natural disasters)
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">8. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Japan. Any disputes shall be resolved in the courts of Tokyo,
            Japan.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">9. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of our services after changes constitutes
            acceptance of the new Terms.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">10. Contact</h2>
          <p>For questions about these Terms, please contact us:</p>
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


