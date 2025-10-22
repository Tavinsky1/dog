import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - DogAtlas',
  description: 'Get in touch with DogAtlas for partnerships, advertising, support, or just to say hello. We love hearing from the dog community!',
};

export default function ContactPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
          Get in Touch 🐾
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you're interested in partnerships, advertising, 
          need support, or just want to share your favorite dog-friendly spot.
        </p>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">About Dog Atlas</h2>
        <p className="text-slate-700 leading-relaxed">
          Dog Atlas is operated by <strong>Gustavo Del Prato</strong>, dedicated to helping dog owners 
          discover the best dog-friendly places around the world. From cozy cafés with outdoor seating 
          to off-leash parks and swimming spots, we make it easy to find places where both you and your 
          furry friend are welcome.
        </p>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="font-semibold">Contact:</span>
          <a 
            href="mailto:inksky11@gmail.com" 
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            inksky11@gmail.com
          </a>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* General Inquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="text-4xl">💬</div>
          <h2 className="text-xl font-bold text-slate-900">General Inquiries</h2>
          <p className="text-sm text-slate-600">
            Questions about DogAtlas, suggestions for new cities, or general feedback?
          </p>
          <a
            href="mailto:inksky11@gmail.com"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            inksky11@gmail.com
            <span>→</span>
          </a>
        </div>

        {/* Partnerships */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="text-4xl">🤝</div>
          <h2 className="text-xl font-bold text-slate-900">Partnerships</h2>
          <p className="text-sm text-slate-600">
            Interested in collaborating with DogAtlas? We work with dog-friendly businesses and brands.
          </p>
          <a
            href="mailto:inksky11@gmail.com"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            inksky11@gmail.com
            <span>→</span>
          </a>
        </div>

        {/* Advertising */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="text-4xl">📢</div>
          <h2 className="text-xl font-bold text-slate-900">Advertising</h2>
          <p className="text-sm text-slate-600">
            Reach our engaged community of dog lovers. Let's discuss advertising opportunities.
          </p>
          <a
            href="mailto:inksky11@gmail.com"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            inksky11@gmail.com
            <span>→</span>
          </a>
        </div>

        {/* Business Listings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="text-4xl">🏪</div>
          <h2 className="text-xl font-bold text-slate-900">Add Your Business</h2>
          <p className="text-sm text-slate-600">
            Own a dog-friendly café, hotel, or service? Get your business listed on DogAtlas.
          </p>
          <a
            href="mailto:inksky11@gmail.com"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            inksky11@gmail.com
            <span>→</span>
          </a>
        </div>

        {/* Technical Support */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="text-4xl">🛠️</div>
          <h2 className="text-xl font-bold text-slate-900">Technical Support</h2>
          <p className="text-sm text-slate-600">
            Experiencing technical issues? Found a bug? We're here to help!
          </p>
          <a
            href="mailto:inksky11@gmail.com"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            inksky11@gmail.com
            <span>→</span>
          </a>
        </div>

        {/* Press & Media */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="text-4xl">📰</div>
          <h2 className="text-xl font-bold text-slate-900">Press & Media</h2>
          <p className="text-sm text-slate-600">
            Media inquiries, press kits, or interview requests? Get in touch with our press team.
          </p>
          <a
            href="mailto:press@dogatlas.com"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            press@dogatlas.com
            <span>→</span>
          </a>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl border border-slate-200 p-8 md:p-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Send Us a Message</h2>
            <p className="text-slate-600">
              Fill out the form below and we'll get back to you within 24-48 hours.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Select a topic...</option>
                <option value="general">General Inquiry</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="advertising">Advertising</option>
                <option value="business">Add My Business</option>
                <option value="support">Technical Support</option>
                <option value="press">Press & Media</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="newsletter" className="text-sm text-slate-600">
                Subscribe to our newsletter for dog-friendly travel tips and new city launches
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Send Message 🚀
            </button>
          </form>

          <p className="text-xs text-center text-slate-500">
            By submitting this form, you agree to our{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <details className="bg-white rounded-lg border border-slate-200 p-6 group">
            <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
              How do I add a new place to DogAtlas?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              You can suggest new dog-friendly places by emailing us at{' '}
              <a href="mailto:listings@dogatlas.com" className="text-blue-600 hover:underline">
                listings@dogatlas.com
              </a>
              {' '}with the place name, location, and why it's great for dogs. We review all submissions
              and add verified places to our database.
            </p>
          </details>

          <details className="bg-white rounded-lg border border-slate-200 p-6 group">
            <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
              Do you offer advertising packages?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              Yes! We offer various advertising options including featured listings, banner ads, and
              sponsored city guides. Contact{' '}
              <a href="mailto:ads@dogatlas.com" className="text-blue-600 hover:underline">
                ads@dogatlas.com
              </a>
              {' '}for our media kit and pricing.
            </p>
          </details>

          <details className="bg-white rounded-lg border border-slate-200 p-6 group">
            <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
              Can I request a new city to be added?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              Absolutely! We're constantly expanding to new cities. Send your city suggestions to{' '}
              <a href="mailto:hello@dogatlas.com" className="text-blue-600 hover:underline">
                hello@dogatlas.com
              </a>
              {' '}and let us know why your city deserves to be on DogAtlas. Cities with active dog
              communities are prioritized!
            </p>
          </details>

          <details className="bg-white rounded-lg border border-slate-200 p-6 group">
            <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
              How can I report incorrect information?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              If you notice outdated or incorrect information about a place, please email{' '}
              <a href="mailto:support@dogatlas.com" className="text-blue-600 hover:underline">
                support@dogatlas.com
              </a>
              {' '}with the place name, city, and the correction. We appreciate your help keeping
              DogAtlas accurate!
            </p>
          </details>

          <details className="bg-white rounded-lg border border-slate-200 p-6 group">
            <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
              Do you have a mobile app?
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              Not yet, but it's on our roadmap! For now, our website is fully mobile-responsive and
              works great on all devices. Subscribe to our newsletter for updates on the mobile app launch.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
