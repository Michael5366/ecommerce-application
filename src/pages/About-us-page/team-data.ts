type TeamMember = {
  name: string;
  role: string;
  position: string;
  description: string;
  github: string;
  photo: string;
  quote: string;
  biography: string;
};

const teamData: TeamMember[] = [
  {
    name: 'Viktoriia Petukhova',
    role: 'Frontend Developer',
    position: 'User Profile & Shopping Cart',
    description:
      'Developed the user profile and shopping cart pages, implementing dynamic forms, validation, and API integration for address management, profile editing, and promo code logic. Ensured a responsive and user-friendly interface for all basket-related actions.',
    quote: 'Bringing structure to the shopping experience.',
    biography: '',
    github: 'https://github.com/viktoriiapet',
    photo: 'https://picsum.photos/200/300',
  },
  {
    name: 'Vladislav Murylev',
    role: 'Frontend Developer',
    position: 'Catalog, Filtering & Performance',
    description:
      'Built the product catalog page with search, filtering, sorting, and pagination. Integrated data from the commerce tools API and focused on performance optimizations such as lazy loading and infinite scroll. Worked on UI enhancements and interaction design.',
    quote: 'Where logic meets design.',
    biography: '',
    github: 'https://github.com/vlad-m28',
    photo: 'https://picsum.photos/200/300',
  },
  {
    name: 'Michael Elsky',
    role: 'Frontend Developer',
    position: 'Product Pages & Routing',
    description:
      'Implemented the product detail pages with image sliders, modals, and detailed descriptions. Integrated routing across all pages, ensuring smooth navigation between catalog, product, profile, basket, and about pages, including browser history support.',
    quote: 'Turning flow into function.',
    biography: '',
    github: 'https://github.com/bob',
    photo: 'https://picsum.photos/200/300',
  },
];

export default teamData;
