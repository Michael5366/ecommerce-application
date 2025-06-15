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
    quote: 'Turning choice into clarity.',
    biography: `
      My name is Viktoriia, and I am 28 years old.
      I live in Barcelona, Spain. I speak Spanish at a B1 level and also know Catalan and English. I really enjoy learning languages and want to keep improving them.
      I have a university degree in Sociology. I was also a student at the Higher School of Economics, where I studied Data Analysis. Later, I discovered my true passion—programming, and I absolutely love it. It inspires me like nothing else. I enjoy how it combines structure, problem-solving, and creativity.
      My first experience with coding was at university. I started with R for data analysis and then explored neural networks in Python. However, I realized that my real interest lies in front-end development. I love how visual and interactive it is—every small detail matters and teaches me something new.
      This course at Rolling Scopes School is my first real experience with front-end development, and it feels like I’ve finally found what truly excites me.
      I’m a very creative person and love making things with my hands—whether it’s sewing clothes, knitting, or decorating cakes. I’m also a professional pastry chef and can make custom-designed cakes, although now programming has become my main focus.
      My goals are to significantly improve my programming skills and to learn Chinese—two challenges I’m very motivated to pursue.
    `,
    github: 'https://github.com/viktoriiapet',
    photo: '/Viktoriia_Petukhova.jpg',
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
    photo: '/Vladislav_Murylev.jpg',
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
    photo: '/Michael_Elsky.jpg',
  },
];

export default teamData;
