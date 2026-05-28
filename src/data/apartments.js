export const apartments = [
  {
    id: 'marlstone',
    name: 'The Marlstone',
    address: '5540 Spring Garden Rd',
    neighbourhood: 'Spring Garden',
    rating: 5.0,
    reviewCount: 1,
    tags: [],
    summary: null,
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'park-victoria',
    name: 'Park Victoria',
    address: '1496 Carlton St',
    neighbourhood: 'South End',
    rating: 4.5,
    reviewCount: 2,
    tags: ['Well maintained', 'Quiet', 'Expensive'],
    summary: 'Residents praise upkeep and quiet halls, but flag premium pricing.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'le-marchant-towers',
    name: 'Le Marchant Towers',
    address: '1585 Le Marchant St',
    neighbourhood: 'West End',
    rating: 3.7,
    reviewCount: 3,
    tags: ['Good location', 'Parking limited', 'Aging building'],
    summary: 'Great location near campus offsets dated interiors and tight parking.',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fenwick-tower',
    name: 'Fenwick Tower',
    address: '5599 Fenwick St',
    neighbourhood: 'Downtown',
    rating: 3.3,
    reviewCount: 3,
    tags: ['Elevator issues', 'Great views', 'Security concerns'],
    summary: 'Stunning views from upper floors, undercut by elevator and security gripes.',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'southpoint',
    name: 'Southpoint Apartments',
    address: '1050 South Park St',
    neighbourhood: 'South End',
    rating: 2.5,
    reviewCount: 4,
    tags: [],
    summary: null,
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80',
  },
]

export function getNeighbourhoods() {
  return Array.from(new Set(apartments.map((a) => a.neighbourhood))).sort()
}

export function totalReviews() {
  return apartments.reduce((sum, a) => sum + a.reviewCount, 0)
}
