// Appointment, Shop, Checkout, Success pages
export const appointmentCopy = {
  en: {
    eyebrow: 'PRIVATE CONSULTATION',
    title1: 'Book with',
    titleEm: 'confidence.',
    steps: ['Service', 'Date & time', 'Your details', 'Review'],
    step: 'STEP',
    helpTitle: 'What can we help with?',
    helpBody: 'Select the reason for your visit.',
    timeTitle: 'Choose a time',
    subhead: 'Preferred chamber',
    detailsTitle: 'Tell us about yourself',
    details: [
      { label: 'Full name', ph: 'Your name' },
      { label: 'Phone number', ph: '+880' },
      { label: 'Email address', ph: 'you@example.com' },
      { label: 'Date of birth', ph: 'DD/MM/YYYY' },
      {
        label: 'What would you like the doctor to know?',
        ph: 'A short note (optional)',
        textarea: true,
      },
    ],
    reviewTitle: 'Review your request',
    review: ['Service', 'Appointment', 'Chamber', 'Date & time'],
    reviewNote: 'We’ll confirm by phone within 1 working day.',
    confirmBtn: 'Confirm appointment',
    success: {
      title: 'Appointment request received.',
      body: 'Our team will confirm by phone within 1 working day.',
    },
    services: ['PRP Therapy', 'Psoriasis Treatment', 'Vitiligo Treatment', 'IBS & Gut Health'],
    apptSummary: 'Appointment summary',
    orderSummary: 'Order summary',
  },
  bn: {
    eyebrow: 'ব্যক্তিগত কনসালটেশন',
    title1: 'আত্মবিশ্বাসের সাথে',
    titleEm: 'বুক করুন।',
    steps: ['সেবা', 'তারিখ ও সময়', 'আপনার তথ্য', 'পর্যালোচনা'],
    step: 'ধাপ',
    helpTitle: 'আমরা কীভাবে সাহায্য করতে পারি?',
    helpBody: 'আপনার ভিজিটের কারণ নির্বাচন করুন।',
    timeTitle: 'একটি সময় বেছে নিন',
    subhead: 'পছন্দের চেম্বার',
    detailsTitle: 'আপনার সম্পর্কে জানান',
    details: [
      { label: 'পুরো নাম', ph: 'আপনার নাম' },
      { label: 'ফোন নম্বর', ph: '+৮৮০' },
      { label: 'ইমেইল ঠিকানা', ph: 'you@example.com' },
      { label: 'জন্ম তারিখ', ph: 'দিন/মাস/বছর' },
      { label: 'ডাক্তারকে কী জানাতে চান?', ph: 'একটি ছোট নোট (ঐচ্ছিক)', textarea: true },
    ],
    reviewTitle: 'আপনার অনুরোধ পর্যালোচনা করুন',
    review: ['সেবা', 'অ্যাপয়েন্টমেন্ট', 'চেম্বার', 'তারিখ ও সময়'],
    reviewNote: 'আমরা ১ কর্মদিবসের মধ্যে ফোনে নিশ্চিত করব।',
    confirmBtn: 'অ্যাপয়েন্টমেন্ট নিশ্চিত করুন',
    success: {
      title: 'অ্যাপয়েন্টমেন্ট অনুরোধ গৃহীত হয়েছে।',
      body: 'আমাদের দল ১ কর্মদিবসের মধ্যে ফোনে নিশ্চিত করবে।',
    },
    services: ['PRP থেরাপি', 'সোরিয়াসিস চিকিৎসা', 'শ্বেতী চিকিৎসা', 'আইবিএস ও অন্ত্রের স্বাস্থ্য'],
    apptSummary: 'অ্যাপয়েন্টমেন্ট সারাংশ',
    orderSummary: 'অর্ডার সারাংশ',
  },
} as const;

export const shopCopy = {
  en: {
    eyebrow: 'CLINIC SHOP',
    title1: 'Wellness,',
    titleEm: 'curated.',
    lead: 'Doctor-recommended essentials for your everyday health.',
    bag: 'Bag',
    items: 'items',
    tabs: ['All products', 'Skin care', 'Gut health', 'Vitamins'],
    showing: 'Showing',
    products: 'products',
    search: 'Search products',
    wishlistAria: 'Add to wishlist',
    addBtn: 'Add',
    doctorPick: 'DOCTOR PICK',
    ratingLine: '4.9',
    ratingSub: '· 42 patient reviews',
    bagHeading: 'YOUR BAG',
    emptyBag: 'Your bag is empty.',
    shopNow: 'Browse products',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    total: 'Total',
    checkout: 'Checkout',
    productsList: [
      {
        name: 'Daily Balance Probiotic',
        cat: 'Digestive wellness',
        price: '$28',
        photo: 'photo-1559757175-0eb30cd8c063',
      },
      {
        name: 'Calm Skin Barrier Cream',
        cat: 'Sensitive skin care',
        price: '$24',
        photo: 'photo-1579684385127-1ef15d508118',
      },
      {
        name: 'Essential Vitamin D3',
        cat: 'Daily wellness',
        price: '$18',
        photo: 'photo-1584982751601-97dcc096659c',
      },
      {
        name: 'Gut Reset Tea Blend',
        cat: 'Digestive wellness',
        price: '$16',
        photo: 'photo-1544787219-7f47ccb76574',
      },
    ],
  },
  bn: {
    eyebrow: 'ক্লিনিক শপ',
    title1: 'ওয়েলনেস,',
    titleEm: 'সাজানো।',
    lead: 'ডাক্তার-সুপারিশকৃত প্রতিদিনের স্বাস্থ্যের প্রয়োজনীয় জিনিস।',
    bag: 'ব্যাগ',
    items: 'টি আইটেম',
    tabs: ['সকল পণ্য', 'ত্বকের যত্ন', 'অন্ত্রের স্বাস্থ্য', 'ভিটামিন'],
    showing: 'দেখানো হচ্ছে',
    products: 'টি পণ্য',
    search: 'পণ্য অনুসন্ধান',
    wishlistAria: 'উইশলিস্টে যোগ করুন',
    addBtn: 'যোগ করুন',
    doctorPick: 'ডাক্তারের পছন্দ',
    ratingLine: '৪.৯',
    ratingSub: '· ৪২টি রোগীর রিভিউ',
    bagHeading: 'আপনার ব্যাগ',
    emptyBag: 'আপনার ব্যাগ খালি।',
    shopNow: 'পণ্য দেখুন',
    subtotal: 'সাবটোটাল',
    delivery: 'ডেলিভারি',
    total: 'মোট',
    checkout: 'চেকআউট',
    productsList: [
      {
        name: 'ডেইলি ব্যালেন্স প্রোবায়োটিক',
        cat: 'হজম সংক্রান্ত ওয়েলনেস',
        price: '৳ ২,৮০০',
        photo: 'photo-1559757175-0eb30cd8c063',
      },
      {
        name: 'ক্যালম স্কিন ব্যারিয়ার ক্রিম',
        cat: 'সংবেদনশীল ত্বকের যত্ন',
        price: '৳ ২,৪০০',
        photo: 'photo-1579684385127-1ef15d508118',
      },
      {
        name: 'এসেনশিয়াল ভিটামিন ডি৩',
        cat: 'দৈনিক ওয়েলনেস',
        price: '৳ ১,৮০০',
        photo: 'photo-1584982751601-97dcc096659c',
      },
      {
        name: 'গাট রিসেট টি ব্লেন্ড',
        cat: 'হজম সংক্রান্ত ওয়েলনেস',
        price: '৳ ১,৬০০',
        photo: 'photo-1544787219-7f47ccb76574',
      },
    ],
  },
} as const;

export const checkoutCopy = {
  en: {
    eyebrow: 'SECURE CHECKOUT',
    title1: 'Almost',
    titleEm: 'there.',
    deliveryHeading: 'Delivery details',
    deliveryFields: [
      { label: 'Full name', ph: 'Your name' },
      { label: 'Phone number', ph: '+880' },
      { label: 'Email address', ph: 'you@example.com' },
      { label: 'City / area', ph: 'City' },
      { label: 'Delivery address', ph: 'Address', textarea: true },
    ],
    paymentHeading: 'Payment method',
    paymentOptions: ['Cash on delivery', 'Mobile wallet', 'Card payment'],
    summary: ['Daily Balance Probiotic', 'Delivery fee', 'Total'],
    placeBtn: 'Place order',
  },
  bn: {
    eyebrow: 'নিরাপদ চেকআউট',
    title1: 'প্রায়',
    titleEm: 'শেষ।',
    deliveryHeading: 'ডেলিভারি তথ্য',
    deliveryFields: [
      { label: 'পুরো নাম', ph: 'আপনার নাম' },
      { label: 'ফোন নম্বর', ph: '+৮৮০' },
      { label: 'ইমেইল ঠিকানা', ph: 'you@example.com' },
      { label: 'শহর / এলাকা', ph: 'শহর' },
      { label: 'ডেলিভারি ঠিকানা', ph: 'ঠিকানা', textarea: true },
    ],
    paymentHeading: 'পেমেন্ট পদ্ধতি',
    paymentOptions: ['ক্যাশ অন ডেলিভারি', 'মোবাইল ওয়ালেট', 'কার্ড পেমেন্ট'],
    summary: ['ডেইলি ব্যালেন্স প্রোবায়োটিক', 'ডেলিভারি ফি', 'মোট'],
    placeBtn: 'অর্ডার দিন',
  },
} as const;

export const successCopy = {
  en: {
    eyebrow: 'ORDER CONFIRMED',
    title1: 'Thank you for',
    titleEm: 'trusting us.',
    body: 'Your order #DRI-2048 is confirmed. We’ll contact you before delivery.',
    btn: 'Continue shopping',
  },
  bn: {
    eyebrow: 'অর্ডার নিশ্চিত',
    title1: 'আমাদের উপর',
    titleEm: 'আস্থা রাখার জন্য ধন্যবাদ।',
    body: 'আপনার অর্ডার #DRI-2048 নিশ্চিত হয়েছে। ডেলিভারির আগে আমরা আপনার সাথে যোগাযোগ করব।',
    btn: 'কেনাকাটা চালিয়ে যান',
  },
} as const;

export const reviewsCopy = {
  en: {
    eyebrow: 'PATIENT EXPERIENCES',
    title1: 'Loved by the people we',
    titleEm: 'care for.',
    rating: '4.9',
    based: 'Based on 128 verified reviews',
    list: [
      {
        quote:
          '“I finally felt listened to. The plan was simple, personal and actually fit my routine.”',
        name: 'Amara Mensah',
        role: 'Verified patient',
      },
      {
        quote:
          '“The clinic team made every step feel calm. My skin has improved and my confidence is back.”',
        name: 'Nadia Owusu',
        role: 'Verified patient',
      },
      {
        quote:
          '“Clear explanations, no pressure, and thoughtful follow-up. I recommend Dr. Ibrahim wholeheartedly.”',
        name: 'Kwame Asante',
        role: 'Verified patient',
      },
    ],
    rateLine: 'Rate your experience',
  },
  bn: {
    eyebrow: 'রোগীর অভিজ্ঞতা',
    title1: 'যাদের আমরা যত্ন করি',
    titleEm: 'তারা আমাদের ভালোবাসেন।',
    rating: '৪.৯',
    based: '১২৮টি যাচাইকৃত রিভিউের ভিত্তিতে',
    list: [
      {
        quote:
          '“অবশেষে আমি শোনা অনুভব করলাম। পরিকল্পনাটি ছিল সহজ, ব্যক্তিগত এবং আমার রুটিনের সাথে মানানসই।”',
        name: 'আমারা মেনসাহ',
        role: 'যাচাইকৃত রোগী',
      },
      {
        quote:
          '“ক্লিনিকের টিম প্রতিটি ধাপকে শান্ত করে তুলেছে। আমার ত্বকের উন্নতি হয়েছে এবং আত্মবিশ্বাস ফিরে এসেছে।”',
        name: 'নাদিয়া ওউসু',
        role: 'যাচাইকৃত রোগী',
      },
      {
        quote:
          '“স্পষ্ট ব্যাখ্যা, কোনো চাপ নেই, এবং চিন্তাশীল ফলো-আপ। আমি ডাঃ ইব্রাহিমকে আন্তরিকভাবে সুপারিশ করি।”',
        name: 'কোয়ামে আসান্তে',
        role: 'যাচাইকৃত রোগী',
      },
    ],
    rateLine: 'আপনার অভিজ্ঞতা রেট করুন',
  },
} as const;
