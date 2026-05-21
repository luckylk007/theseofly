export interface CompanyPagePayload {
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled" | "private" | "pending_preview";
  is_programmatic: boolean;
  content_type: "page" | "post";
  post_type: "page" | "post" | "blog" | "news" | "newsletter" | "case-study";
  category: string;
  content: {
    sections: Array<{
      heading?: string;
      text: string;
    }>;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const companyPagesPayload: CompanyPagePayload[] = [
  {
    title: 'About Us',
    slug: 'about-us',
    status: 'published',
    is_programmatic: false,
    content_type: 'page',
    post_type: 'page',
    category: 'Company',
    content: {
      sections: [
        {
          heading: 'Our Vision & Core Identity',
          text: `<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-10">
  <div>
    <p class="text-xl text-slate-600 leading-relaxed">
      At <strong>Theseofly</strong>, we are rewriting the playbook for modern digital growth. We specialize in AI-driven <strong>Programmatic SEO</strong> that enables companies to scale search visibility exponentially, dominating search engine result pages across thousands of high-intent keywords.
    </p>
    <p class="text-lg text-slate-600 mt-6">
      Our mission is simple: to help ambitious brands build high-performance search engines of their own, bypassing traditional slow on-page methods to establish ultimate domain authority in record time.
    </p>
  </div>
  <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] opacity-10 mix-blend-overlay"></div>
    <h3 class="text-2xl font-black mb-4">Empowering Search Excellence</h3>
    <p class="text-blue-100 mb-6">Our platform automates the creation of high-fidelity local and vertical landing pages, fully optimized for both humans and search algorithms.</p>
    <div class="flex gap-4">
      <div class="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold border border-white/20">10x Speed</div>
      <div class="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold border border-white/20">AI Optimized</div>
    </div>
  </div>
</div>`
        },
        {
          heading: 'Our Core Pillars',
          text: `<div class="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
  <div class="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
    <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-6">📊</div>
    <h4 class="text-xl font-bold text-slate-900 mb-3">Data-First Strategy</h4>
    <p class="text-slate-600 text-sm leading-relaxed">We perform ultra-deep semantic research to identify every single high-intent search variation in your industry.</p>
  </div>
  <div class="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
    <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-6">🤖</div>
    <h4 class="text-xl font-bold text-slate-900 mb-3">AI Page Architecture</h4>
    <p class="text-slate-600 text-sm leading-relaxed">Advanced language generation models create hyper-personalized, contextually precise, and engaging local landing pages.</p>
  </div>
  <div class="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
    <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-6">⚡</div>
    <h4 class="text-xl font-bold text-slate-900 mb-3">Hyper-Scale Engine</h4>
    <p class="text-slate-600 text-sm leading-relaxed">Publish and manage tens of thousands of dynamic, search-optimized pages with zero manual effort and absolute speed.</p>
  </div>
</div>`
        }
      ]
    },
    seo: {
      title: 'About Us | Theseofly Programmatic SEO Platform',
      description: 'Learn how Theseofly empowers brands to scale search dominance using AI-driven programmatic SEO, high-performance landing pages, and advanced analytics.'
    }
  },
  {
    title: 'Contact Us',
    slug: 'contact-us',
    status: 'published',
    is_programmatic: false,
    content_type: 'page',
    post_type: 'page',
    category: 'Company',
    content: {
      sections: [
        {
          heading: 'Get in Touch with our Growth Specialists',
          text: `<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 my-10">
  <div class="space-y-8">
    <p class="text-xl text-slate-600 leading-relaxed">
      Have a question about programmatic SEO or ready to scale your organic lead generation to the stratosphere? Get in touch with our specialist squad. We're here to engineer your growth.
    </p>
    <div class="space-y-6 pt-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">📧</div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</p>
          <p class="text-lg font-black text-slate-880">growth@theseofly.com</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">📞</div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Support</p>
          <p class="text-lg font-black text-slate-800">+1 (888) 555-0199</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">📍</div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Global HQ</p>
          <p class="text-lg font-black text-slate-800">100 Pine Street, San Francisco, CA 94111</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
    <h3 class="text-2xl font-black text-slate-900 mb-6">Send Us a Message</h3>
    <form class="space-y-6" onsubmit="event.preventDefault(); alert('Message sent successfully!');">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">First Name</label>
          <input type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" placeholder="John" required />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Last Name</label>
          <input type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" placeholder="Doe" required />
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
        <input type="email" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" placeholder="john@example.com" required />
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</label>
        <textarea class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm h-32" placeholder="Tell us about your organic growth objectives..." required></textarea>
      </div>
      <button type="submit" class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 cursor-pointer">
        Submit Consultation Request
      </button>
    </form>
  </div>
</div>`
        }
      ]
    },
    seo: {
      title: 'Contact Us | Get a Free consultation | Theseofly',
      description: 'Have questions about programmatic SEO or want to scale your search traffic? Contact Theseofly today for a free consultation and customized growth plan.'
    }
  },
  {
    title: 'Pricing Plans',
    slug: 'plans',
    status: 'published',
    is_programmatic: false,
    content_type: 'page',
    post_type: 'page',
    category: 'Product',
    content: {
      sections: [
        {
          heading: 'Simple, Transparent pricing tailored for Scale',
          text: `<p class="text-xl text-slate-600 leading-relaxed text-center max-w-2xl mx-auto my-10">
  Choose the perfect organic growth package to scale your business. From early-stage startup landing hubs to massive multi-region enterprise search dominance, we have a plan built for your speed.
</p>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 items-stretch">
  <!-- Starter Plan -->
  <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div>
      <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wider uppercase">Startup</span>
      <h3 class="text-3xl font-black text-slate-900 mt-4">$499<span class="text-sm font-normal text-slate-400">/mo</span></h3>
      <p class="text-slate-500 text-xs mt-2">Perfect for growing local brands.</p>
      <div class="h-px bg-slate-100 my-6"></div>
      <ul class="space-y-4">
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Up to 500 Dynamic Pages</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ 1 Targeted Region</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Standard SEO Meta Gen</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Schema.org Integration</li>
      </ul>
    </div>
    <button class="mt-8 w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer">Get Started</button>
  </div>
  <!-- Growth Plan (Featured) -->
  <div class="bg-white p-8 rounded-[2.5rem] border-2 border-blue-600 shadow-lg flex flex-col justify-between relative overflow-hidden transform scale-105">
    <div class="absolute top-0 right-0 bg-blue-600 text-white px-6 py-1.5 rounded-bl-3xl text-xs font-black uppercase tracking-wider">Most Popular</div>
    <div>
      <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase">Scale</span>
      <h3 class="text-3xl font-black text-slate-900 mt-4">$1,299<span class="text-sm font-normal text-slate-400">/mo</span></h3>
      <p class="text-slate-500 text-xs mt-2">Engineered for market leaders.</p>
      <div class="h-px bg-slate-100 my-6"></div>
      <ul class="space-y-4">
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Up to 5,000 Dynamic Pages</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Unlimited Regions</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Advanced AI Page Layouts</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Real-Time Internal Linking</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Dedicated Account Engineer</li>
      </ul>
    </div>
    <button class="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-200 cursor-pointer">Start Dominating</button>
  </div>
  <!-- Enterprise Plan -->
  <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div>
      <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wider uppercase">Enterprise</span>
      <h3 class="text-3xl font-black text-slate-900 mt-4">$3,499<span class="text-sm font-normal text-slate-400">/mo</span></h3>
      <p class="text-slate-500 text-xs mt-2">For multi-national corporations.</p>
      <div class="h-px bg-slate-100 my-6"></div>
      <ul class="space-y-4">
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ 50,000+ Dynamic Pages</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Multi-Domain Setup</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ Custom LLM Fine-Tuning</li>
        <li class="flex items-center gap-3 text-sm text-slate-600">✅ 24/7 Priority SLA Support</li>
      </ul>
    </div>
    <button class="mt-8 w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer">Contact Enterprise</button>
  </div>
</div>`
        }
      ]
    },
    seo: {
      title: 'Premium SEO Pricing Plans & Growth Packages | Theseofly',
      description: 'View our transparent pricing packages tailored for businesses of all sizes. From startups to enterprises, scale your SEO programmatically with Theseofly.'
    }
  },
  {
    title: 'Our Services',
    slug: 'services',
    status: 'published',
    is_programmatic: false,
    content_type: 'page',
    post_type: 'page',
    category: 'Product',
    content: {
      sections: [
        {
          heading: 'End-to-End Dynamic SEO Solutions',
          text: `<p class="text-xl text-slate-600 leading-relaxed text-center max-w-2xl mx-auto my-10">
  We offer a comprehensive selection of AI-accelerated search engine optimization models designed to capture search intent at scale, boost keyword visibility, and skyrocket conversions.
</p>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
  <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">🔍</div>
    <h3 class="text-xl font-bold text-slate-900 mb-3">Programmatic SEO</h3>
    <p class="text-slate-600 text-sm leading-relaxed mb-4">Deploy bulk, highly localized or categorized keyword landing pages automatically optimized for structural excellence.</p>
  </div>
  <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">📝</div>
    <h3 class="text-xl font-bold text-slate-900 mb-3">AI Content Strategy</h3>
    <p class="text-slate-600 text-sm leading-relaxed mb-4">Generate high-intent articles and structured copy that resonate with both your target users and major web spiders.</p>
  </div>
  <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">⛓️</div>
    <h3 class="text-xl font-bold text-slate-900 mb-3">Smart Internal Linking</h3>
    <p class="text-slate-600 text-sm leading-relaxed mb-4">Intelligently route link equity throughout your site index, creating dynamic regional and vertical link clusters.</p>
  </div>
  <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">⚡</div>
    <h3 class="text-xl font-bold text-slate-900 mb-3">Technical SEO Audit</h3>
    <p class="text-slate-600 text-sm leading-relaxed mb-4">Maximize core web vitals, indexation speeds, schema markup integrity, XML sitemaps, and crawlabity.</p>
  </div>
  <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">📈</div>
    <h3 class="text-xl font-bold text-slate-900 mb-3">Live Reporting Hub</h3>
    <p class="text-slate-600 text-sm leading-relaxed mb-4">Track dynamic metric pipelines, total indexation rates, real-time lead submissions, and organic traffic growth.</p>
  </div>
  <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center items-center text-center bg-gradient-to-tr from-blue-50 to-white">
    <h3 class="text-xl font-black text-slate-900 mb-2">Need a Custom Setup?</h3>
    <p class="text-slate-500 text-xs max-w-xs mb-6">Our search engineers will build a bespoke programmatic SEO pipeline specifically for your business database.</p>
    <button class="px-6 py-3 bg-[#155dfc] text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-md cursor-pointer">Get in Touch</button>
  </div>
</div>`
        }
      ]
    },
    seo: {
      title: 'Enterprise SEO & Digital Marketing Services | Theseofly',
      description: 'Explore our comprehensive suite of SEO and digital marketing services, including programmatic SEO, content marketing, link building, and performance tracking.'
    }
  },
  {
    title: 'Countries We Serve',
    slug: 'countries',
    status: 'published',
    is_programmatic: false,
    content_type: 'page',
    post_type: 'page',
    category: 'Locations',
    content: {
      sections: [
        {
          heading: 'Multi-Region & Global Coverage',
          text: `<p class="text-xl text-slate-600 leading-relaxed text-center max-w-2xl mx-auto my-10">
  We build comprehensive search footprints across multiple international countries and counties, connecting you to millions of localized high-intent consumers.
</p>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
  <div class="p-6 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:border-blue-100 transition-all cursor-pointer">
    <span class="text-3xl">🇺🇸</span>
    <div>
      <h4 class="font-black text-slate-800">United States</h4>
      <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">50 States Active</p>
    </div>
  </div>
  <div class="p-6 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:border-blue-100 transition-all cursor-pointer">
    <span class="text-3xl">🇬🇧</span>
    <div>
      <h4 class="font-black text-slate-800">United Kingdom</h4>
      <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">30+ Counties Active</p>
    </div>
  </div>
  <div class="p-6 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:border-blue-100 transition-all cursor-pointer">
    <span class="text-3xl">🇨🇦</span>
    <div>
      <h4 class="font-black text-slate-800">Canada</h4>
      <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">10 Provinces Active</p>
    </div>
  </div>
  <div class="p-6 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:border-blue-100 transition-all cursor-pointer">
    <span class="text-3xl">🇦🇺</span>
    <div>
      <h4 class="font-black text-slate-800">Australia</h4>
      <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">8 Territories Active</p>
    </div>
  </div>
</div>`
        }
      ]
    },
    seo: {
      title: 'Global SEO Coverage - Countries & Counties We Serve',
      description: 'Browse our international and regional SEO hubs. Learn how we scale local search presence and deliver targeted organic growth across multiple regions.'
    }
  },
  {
    title: 'Cities We Serve',
    slug: 'cities',
    status: 'published',
    is_programmatic: false,
    content_type: 'page',
    post_type: 'page',
    category: 'Locations',
    content: {
      sections: [
        {
          heading: 'Localized Search Footprint across Key Cities',
          text: `<p class="text-xl text-slate-600 leading-relaxed text-center max-w-2xl mx-auto my-10">
  Explore our targeted local search hubs. We provide hyper-localized search positioning, Google Business optimization, and localized search query scaling in top metropolitan centers.
</p>
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-12">
  <div class="p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/50 hover:border-blue-200 rounded-2xl text-center font-bold transition-all cursor-pointer">New York</div>
  <div class="p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/50 hover:border-blue-200 rounded-2xl text-center font-bold transition-all cursor-pointer">San Antonio</div>
  <div class="p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/50 hover:border-blue-200 rounded-2xl text-center font-bold transition-all cursor-pointer">Chicago</div>
  <div class="p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/50 hover:border-blue-200 rounded-2xl text-center font-bold transition-all cursor-pointer">Miami</div>
  <div class="p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/50 hover:border-blue-200 rounded-2xl text-center font-bold transition-all cursor-pointer">Los Angeles</div>
  <div class="p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/50 hover:border-blue-200 rounded-2xl text-center font-bold transition-all cursor-pointer">London</div>
</div>`
        }
      ]
    },
    seo: {
      title: 'Local SEO Service Locations - Cities We Serve | Theseofly',
      description: 'Explore our local city SEO pages. We provide high-intent local search optimization, map ranking, and localized content strategies in top cities.'
    }
  },
  {
    title: 'Industries We Empower',
    slug: 'industries',
    status: 'published',
    is_programmatic: false,
    content_type: 'page',
    post_type: 'page',
    category: 'Solutions',
    content: {
      sections: [
        {
          heading: 'Search Engine Authority for every Vertical',
          text: `<p class="text-xl text-slate-600 leading-relaxed text-center max-w-2xl mx-auto my-10">
  We build custom-tailored search structures suited for specific database architectures, legal compliance frameworks, healthcare standards, and high-performance SaaS funnels.
</p>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
  <div class="p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all shadow-sm">
    <span class="text-3xl">💻</span>
    <h3 class="text-lg font-bold text-slate-800 mt-4 mb-2">SaaS & Software</h3>
    <p class="text-slate-500 text-xs leading-relaxed">Scale keyword coverage across thousands of feature variations, system integrations, and competitor alternative terms.</p>
  </div>
  <div class="p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all shadow-sm">
    <span class="text-3xl">🛒</span>
    <h3 class="text-lg font-bold text-slate-800 mt-4 mb-2">E-Commerce</h3>
    <p class="text-slate-500 text-xs leading-relaxed">Instantly populate dynamic search landing pages for every product category, discount variation, and size configuration.</p>
  </div>
  <div class="p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all shadow-sm">
    <span class="text-3xl">🏠</span>
    <h3 class="text-lg font-bold text-slate-800 mt-4 mb-2">Real Estate</h3>
    <p class="text-slate-500 text-xs leading-relaxed">Dominate neighborhood and property type searches with dynamic listings pages optimized automatically for local queries.</p>
  </div>
  <div class="p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all shadow-sm">
    <span class="text-3xl">🏥</span>
    <h3 class="text-lg font-bold text-slate-800 mt-4 mb-2">Healthcare</h3>
    <p class="text-slate-500 text-xs leading-relaxed">Deploy secure, informational, localized treatment and clinic finder portals adhering fully to medical authority guidelines.</p>
  </div>
</div>`
        }
      ]
    },
    seo: {
      title: 'Industry-Specific Programmatic SEO Solutions | Theseofly',
      description: 'Custom-tailored programmatic SEO solutions for diverse verticals: SaaS, E-commerce, Real Estate, Healthcare, Legal Services, and more.'
    }
  },
  {
    title: 'SEO Insights Blog',
    slug: 'blog',
    status: 'published',
    is_programmatic: false,
    content_type: 'page',
    post_type: 'blog',
    category: 'Insights',
    content: {
      sections: [
        {
          heading: 'Expert Growth Guides, Strategies & Updates',
          text: `<p class="text-xl text-slate-600 leading-relaxed text-center max-w-2xl mx-auto my-10">
  Follow the brightest minds in search marketing. Read practical tutorials, AI scaling advice, advanced internal linking guidelines, and breakdown case studies.
</p>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 my-12">
  <!-- Featured Post -->
  <div class="lg:col-span-3 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2 hover:shadow-md transition-shadow">
    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex flex-col justify-between text-white relative">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] opacity-10 mix-blend-overlay"></div>
      <span class="bg-white/15 px-3 py-1 rounded-full text-xs font-bold w-fit uppercase tracking-widest border border-white/20">Featured Guide</span>
      <div>
        <h2 class="text-3xl font-black tracking-tight leading-tight mt-6 mb-4">Programmatic SEO in 2026: The Comprehensive Scale Blueprint</h2>
        <p class="text-blue-100 text-sm leading-relaxed line-clamp-2">Learn how modern SEO architectures leverage generative models and multi-region routing parameters to scale from 0 to 1 million monthly organic clicks in record time.</p>
      </div>
      <div class="flex items-center gap-3 mt-8">
        <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">AS</div>
        <div>
          <p class="text-xs font-black">Alex Stone</p>
          <p class="text-[10px] text-blue-200">Director of Growth • 8 min read</p>
        </div>
      </div>
    </div>
    <div class="p-12 flex flex-col justify-center space-y-6">
      <span class="text-blue-600 text-xs font-bold uppercase tracking-wider">Algorithm Updates</span>
      <h3 class="text-2xl font-black text-slate-900 leading-snug">Google's Latest AI Overviews Update: What Programmatic SEOs Must Do</h3>
      <p class="text-slate-600 text-sm">An in-depth structural review of how Google’s core layouts prioritize contextual and entity-based landing pages over raw programmatic list entries.</p>
      <button class="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors w-fit border border-slate-200/50 cursor-pointer">Read Full Article</button>
    </div>
  </div>
</div>`
        }
      ]
    },
    seo: {
      title: 'Our Blog - Latest SEO Insights, Guides & Trends | Theseofly',
      description: 'Stay up-to-date with the latest strategies in programmatic SEO, content marketing, Google algorithm updates, and digital growth tactics from our experts.'
    }
  }
];
