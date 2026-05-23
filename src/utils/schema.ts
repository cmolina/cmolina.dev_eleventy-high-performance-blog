export const SITE_URL = 'https://cmolina.dev';
export const personId = `${SITE_URL}/#person`;
export const personRef = { '@id': personId };

export function buildPersonSchema(image: string | object) {
  return {
    '@type': 'Person',
    '@id': personId,
    name: 'Carlos Molina',
    alternateName: 'Carlos Andrés Molina Avendaño',
    url: `${SITE_URL}/`,
    image,
    jobTitle: 'Software Architect',
    description:
      'I help companies and teams deliver software that delights, on time, by bridging the gap between technical architecture and sustainable business goals.',
    sameAs: [
      'https://www.linkedin.com/in/carlosmolinaav/',
      'https://github.com/cmolina',
    ],
    knowsAbout: [
      'Software Architecture',
      'TypeScript',
      'CI/CD Pipelines',
      'Technical Leadership',
      'Accessibility',
      'JavaScript',
      'Software Testing',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Architect',
      occupationLocation: { '@type': 'Country', name: 'Chile' },
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Molina Systems',
      url: 'https://molina.systems',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer enquiries',
      email: 'hola@cmolina.dev',
    },
  };
}

export function buildBreadcrumbs(crumbs: Array<{ name: string; item: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      ...crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 2, ...crumb })),
    ],
  };
}

export function buildGraph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
