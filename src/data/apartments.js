export const apartments = [
  {
    id: 'marlstone',
    name: 'The Marlstone',
    address: '5540 Spring Garden Rd',
    neighbourhood: 'Spring Garden',
    tags: [],
    summary: null,
    description: 'Boutique low-rise off Spring Garden Road, walking distance to shops and parks.',
    landlord: 'Marlstone Holdings',
    units: 32,
    yearBuilt: 2018,
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'park-victoria',
    name: 'Park Victoria',
    address: '1496 Carlton St',
    neighbourhood: 'South End',
    tags: ['Well maintained', 'Quiet', 'Expensive'],
    summary: 'Residents praise upkeep and quiet halls, but flag premium pricing.',
    description: 'Mid-rise in the South End with on-site management and underground parking.',
    landlord: 'Templeton Properties',
    units: 110,
    yearBuilt: 1992,
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'le-marchant-towers',
    name: 'Le Marchant Towers',
    address: '1585 Le Marchant St',
    neighbourhood: 'West End',
    tags: ['Good location', 'Parking limited', 'Aging building'],
    summary:
      'Tenants consistently praise the location and proximity to Quinpool Road shops. Parking availability is a recurring complaint, with multiple reviewers mentioning waitlists exceeding six months. The building shows its age in hallway carpeting and elevator reliability, but unit interiors have been progressively updated. Maintenance response times average two to three days for non-urgent requests.',
    description: 'High-rise tower in a quiet residential neighbourhood.',
    landlord: 'Killam Properties',
    units: 88,
    yearBuilt: 1975,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fenwick-tower',
    name: 'Fenwick Tower',
    address: '5599 Fenwick St',
    neighbourhood: 'Downtown',
    tags: ['Elevator issues', 'Great views', 'Security concerns'],
    summary: 'Stunning views from upper floors, undercut by elevator and security gripes.',
    description: 'Iconic downtown high-rise with panoramic harbour views.',
    landlord: 'Templeton Properties',
    units: 220,
    yearBuilt: 1971,
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'southpoint',
    name: 'Southpoint Apartments',
    address: '1050 South Park St',
    neighbourhood: 'South End',
    tags: [],
    summary: null,
    description: 'Family-friendly low-rise across from the Public Gardens.',
    landlord: 'Southpoint Realty',
    units: 64,
    yearBuilt: 1988,
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80',
  },
]

export function getApartment(id) {
  return apartments.find((a) => a.id === id) || null
}

export function getNeighbourhoods() {
  return Array.from(new Set(apartments.map((a) => a.neighbourhood))).sort()
}
