const SITE = 'https://www.arvamethod.com'

/**
 * Drop an MP4/WebM of the original hero footage in /public/videos and set its
 * path here (e.g. '/videos/hero.mp4'). While empty, the hero uses a still image.
 */
export const HERO_VIDEO = ''
export const HERO_POSTER = '/images/body-session.webp'

export const nav = [
  { label: 'Home', href: `${SITE}/`, image: '/images/body-session.webp' },
  { label: 'About', href: `${SITE}/about`, image: '/images/arrabella-chair.webp' },
  { label: 'Path Coaching', href: `${SITE}/path-coaching`, image: '/images/path.webp' },
  { label: 'Bodywork', href: `${SITE}/bodywork`, image: '/images/bodywork.webp' },
  { label: 'Blog & Recipes', href: `${SITE}/blog`, image: '/images/coffee-light.webp' },
  { label: 'Contact', href: `${SITE}/contact`, image: '/images/arrabella-sofa.webp' },
]

export const links = {
  quiz: `${SITE}/living-archetype-quiz`,
  active: `${SITE}/active`,
  path: `${SITE}/path-coaching`,
  bodywork: `${SITE}/bodywork`,
  body: `${SITE}/bodywork#arvamethod-body`,
  about: `${SITE}/about`,
  privacy: `${SITE}/privacy-policy`,
}

export const contact = {
  address: ['664 W Hubbard St. Suite 200', 'Chicago, IL 60642'],
  phone: '312.519.2888',
  phoneHref: 'tel:+13125192888',
  email: 'info@arvamethod.com',
}

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/arvamethod/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@ARVAmethod' },
  { label: 'Threads', href: 'https://www.threads.com/@arvamethod' },
  { label: 'Pinterest', href: 'https://pinterest.com/arvamethod/' },
]

export const disciplines = [
  'Somatic Inquiry',
  'Clinical Bodywork',
  'Breathwork',
  'Movement',
  'Lymphatic Therapy',
  'Fascial Work',
]

export const philosophy = {
  title: 'The Body and Mind Are Not Separate Systems.',
  body: [
    'Treating the body and the mind as separate is why so many people feel exhausted and fragmented when they try to make lasting change. Stress, anxiety, and depression live in the body. Chronic aches, digestive disruption, and persistent physical symptoms are expressions of this reality.',
    'When the body and inner life are understood together, the patterns driving your health, your habits, and your sense of self finally become visible. And workable. That is the foundation of ARVAmethod.',
  ],
}

export const work = {
  title: 'The Work Itself',
  lead: 'Everything begins with where you actually are — not where you think you should be.',
  body: 'Through dialogue, somatic inquiry, and practical frameworks, we identify the patterns keeping you from ease and begin the process of integration.',
  pull: 'Physical release and psychological repatterning inform each other in real time.',
  closing:
    'Every entry point into ARVAmethod is designed to help you understand and settle the nervous system, and restore harmony between the body and inner life — so that what you want and need no longer pushes against how you are living your life.',
  pillars: ['Dialogue', 'Somatic inquiry', 'Practical frameworks'],
}

export const begin = {
  title: 'How to Begin',
  intro:
    'There are a few different ways to enter the ARVAmethod ecosystem — each one designed to bring the body, mind, and life into greater alignment. Whatever feels right for you right now is the right place to begin.',
  paths: [
    {
      title: 'The Living Archetype Quiz',
      tag: 'Start here for free',
      text: 'The quiz reveals the hidden patterns shaping how you approach health, stress, and self-care — then offers a practical guide for beginning to affect holistic change in your own life.',
      image: '/images/quiz.webp',
      href: `${SITE}/living-archetype-quiz`,
      cta: 'Take the quiz',
    },
    {
      title: 'ARVAmethod ACTIVE',
      tag: 'A different kind of support',
      text: 'A personalized virtual program for building sustainable habits, movement, and lifestyle foundations — grounded in the ARVAmethod philosophy and designed to fit how you actually live.',
      image: '/images/active.webp',
      href: `${SITE}/active`,
      cta: 'Explore ACTIVE',
    },
    {
      title: 'ARVAmethod PATH Coaching',
      tag: 'By application only',
      text: 'PATH is a long-term coaching relationship that works at the deepest level of the ARVAmethod — body, inner life, and daily existence brought into full alignment.',
      image: '/images/path.webp',
      href: `${SITE}/path-coaching`,
      cta: 'Apply for PATH',
    },
    {
      title: 'Bodywork',
      tag: 'Chicago Studio',
      text: 'Clinical hands-on treatment rooted in 20 years of expertise. Medical and Sports massage, lymphatic therapy, and fascial work brought into dialogue with the whole person.',
      image: '/images/bodywork.webp',
      href: `${SITE}/bodywork`,
      cta: 'Book bodywork',
    },
  ],
}

export const signature = {
  eyebrow: 'Introducing',
  title: 'The ARVAmethod Body',
  body: 'The ARVAmethod Body brings everything into one immersive session — structured so that each phase deepens the one before it. You leave in a fundamentally different place than where you started and receive a follow-up with resources and insights to take into your daily life.',
  duration: '2.5',
  phases: ['Somatic Inquiry', 'Movement', 'Clinical Bodywork', 'Lymphatic Drainage', 'Breathwork'],
}

export const testimonials = [
  {
    headline: 'My experience working with Arrabella has been nothing short of amazing.',
    quote:
      'Working with Arrabella has been life-changing. I went from waking up with a negative mindset to starting each day with clarity and positivity. Through her coaching, I’ve learned to give myself grace, overcome past triggers, and embrace new opportunities with confidence.',
    name: 'Jarad Gains',
    role: 'Fitness Professional & Former Collegiate Athlete',
    image: '/images/t-jarad.webp',
  },
  {
    headline: 'Working with Arrabella has allowed me to prioritize my health and wellness.',
    quote:
      'Arrabella has been an invaluable part of my health journey for many years. As a busy dentist running my own practice, it’s been difficult to prioritize my wellness, but she has always adapted her approach to fit my needs and worked seamlessly with my other healthcare providers.',
    name: 'Dr. Marisa Gracias',
    role: 'Doctor of Dentistry & Wellness Enthusiast',
    image: '/images/t-marisa.webp',
  },
  {
    headline: 'I’ve gained control, strength, and confidence with Arrabella.',
    quote:
      'Through my journey with Arrabella, I’ve experienced transformative growth in my physical, emotional, and mental well-being. Her holistic approach has deepened my connection to my inner self. Each session offers new insights, empowering me to live a healthier, more confident life.',
    name: 'Andrea Mandel',
    role: 'Photographer & Cyclist',
    image: '/images/t-andrea.webp',
  },
  {
    headline: 'Arrabella has helped me make sustainable changes in many areas of my lifestyle.',
    quote:
      'The ARVAmethod has transformed my approach to health and fitness. I’ve elevated my training both inside and outside the gym. Her approach meets you where you are, making real, lasting improvements achievable.',
    name: 'Kevin Gladwell',
    role: 'Business Development Specialist, Hunting & Fishing Enthusiast',
    image: '/images/t-kevin.webp',
  },
  {
    headline: 'It truly changed me in ways I didn’t expect.',
    quote:
      'I initially started coaching with Arrabella for digestive support but discovered something far deeper. She helped me understand how my stress, habits, and body were all interconnected. I didn’t just improve my digestion — I gained clarity, resilience, and a stronger relationship with myself.',
    name: 'Sarah K',
    role: 'Yogini, seeker, mother, sister, friend',
    image: '/images/t-sarah.webp',
  },
  {
    headline: 'I learned how to find my center, and that changed everything.',
    quote:
      'I first came to Arrabella through massage therapy for pain management and was surprised by how naturally her work expanded into deeper coaching. This work isn’t about simple optimization — it’s about gaining clarity, freedom, and the sense that life can be lived with more ease and intention.',
    name: 'Frank Farrelly',
    role: 'Stylist, Former Spin Coach, Full-time Dad',
    image: '/images/t-frank.webp',
  },
]

export const manifesto = {
  sub: 'It is about seeing what’s real, what isn’t, and what you have been avoiding while trying to make it all work.',
  quote:
    'I teach one thing above everything else — how to listen to your body with enough clarity that you stop second-guessing what you already know.',
  author: 'Arrabella Schippers',
}

export const socialImages = Array.from({ length: 8 }, (_, i) => `/images/social-${i + 1}.webp`)
