'use client';

import { useEffect } from 'react';
import { seoData, serviceDetailSeo, type PageKey, type SeoData } from '../lib/seo-data';

export type { PageKey };

const DEFAULT_OG_IMAGE = '/logo-256.png';
const BASE_URL = 'https://dribrahimhossain.com';

function updateMeta(tag: string, attributes: Record<string, string>) {
  const selector = 'meta[' + tag + ']';
  const element = document.head.querySelector(selector);
  if (!element) {
    const created = document.createElement('meta');
    const keys = Object.keys(attributes);
    for (let i = 0; i < keys.length; i++) {
      created.setAttribute(keys[i], attributes[keys[i]]);
    }
    document.head.appendChild(created);
  } else {
    const keys = Object.keys(attributes);
    for (let i = 0; i < keys.length; i++) {
      element.setAttribute(keys[i], attributes[keys[i]]);
    }
  }
}

function updateLink(rel: string, href: string) {
  const selector = 'link[rel="' + rel + '"]';
  const element = document.head.querySelector(selector);
  if (!element) {
    const created = document.createElement('link');
    created.setAttribute('rel', rel);
    created.setAttribute('href', href);
    document.head.appendChild(created);
  } else {
    element.setAttribute('href', href);
  }
}

function removeStructuredData() {
  const existing = document.head.querySelectorAll('script[type="application/ld+json"]');
  existing.forEach(function (el) {
    el.remove();
  });
}

function injectStructuredData(data: Record<string, any>) {
  removeStructuredData();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

function getBaseStructuredData(page: PageKey, seo: SeoData) {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': BASE_URL + '/#organization',
    name: 'DR.IBRAHIM HOSSAIN Clinic',
    description: seo.description,
    url: BASE_URL,
    telephone: '+233302904420',
    email: 'hello@dribrahim.clinic',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '12 Independence Avenue',
      addressLocality: 'Accra',
      addressCountry: 'GH',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
    image: seo.ogImage || DEFAULT_OG_IMAGE,
    sameAs: [
      'https://www.facebook.com/dribrahimhossainkhan/',
      'https://www.instagram.com/dribrahimhossain',
      'https://www.youtube.com/@dr.ibrahimhossain',
    ],
    physician: {
      '@type': 'Physician',
      name: 'Dr. Ibrahim Hossain',
      credential: 'M.Sc · Skin & VD Integrative Medicine Consultant',
      specialty: 'Dermatology and Integrative Medicine',
    },
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2000',
      bestRating: '5',
      worstRating: '1',
    },
    areaServed: {
      '@type': 'City',
      name: 'Accra',
    },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': BASE_URL + '/#breadcrumb',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page,
        item: seo.canonical,
      },
    ],
  };

  return {
    '@graph': [organizationData, breadcrumbData],
  };
}

export function SeoUpdater({
  page,
  serviceSlug,
}: {
  page: PageKey;
  serviceSlug?: string;
}) {
  const seo: SeoData =
    page === 'ServiceDetail' && serviceSlug && serviceDetailSeo[serviceSlug]
      ? serviceDetailSeo[serviceSlug]
      : seoData[page] || seoData.Home;

  useEffect(function () {
    document.title = seo.title;

    updateMeta('name=description', { name: 'description', content: seo.description });
    updateMeta('name=keywords', { name: 'keywords', content: seo.keywords.join(', ') });
    updateMeta('property=og:title', { property: 'og:title', content: seo.title });
    updateMeta('property=og:description', { property: 'og:description', content: seo.description });
    updateMeta('property=og:url', { property: 'og:url', content: seo.canonical });
    updateMeta('property=og:image', { property: 'og:image', content: seo.ogImage || DEFAULT_OG_IMAGE });
    updateMeta('property=og:type', { property: 'og:type', content: 'website' });
    updateMeta('name=twitter:title', { name: 'twitter:title', content: seo.title });
    updateMeta('name=twitter:description', { name: 'twitter:description', content: seo.description });
    updateMeta('name=twitter:image', { name: 'twitter:image', content: seo.ogImage || DEFAULT_OG_IMAGE });

    updateLink('canonical', seo.canonical);

    const structuredData = getBaseStructuredData(page, seo);
    injectStructuredData(structuredData);

    return function () {
      removeStructuredData();
    };
  }, [page, serviceSlug, seo]);

  return null;
}
