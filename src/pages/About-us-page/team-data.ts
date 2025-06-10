type TeamMember = {
  name: string;
  role: string;
  position: string;
  description: string;
  github: string;
  photo: string;
};

const teamData: TeamMember[] = [
  {
    name: 'Viktoriia Petukhova',
    role: 'Student',
    position: 'Some text',
    description: 'Description',
    github: 'https://github.com/viktoriiapet',
    photo: 'https://picsum.photos/200/300',
  },
  {
    name: 'Vladislav Murylev',
    role: 'Student',
    position: 'Some text',
    description: 'Description',
    github: 'https://github.com/vlad-m28',
    photo: 'https://picsum.photos/200/300',
  },
  {
    name: 'Michael Elsky',
    role: 'Student',
    position: 'Some text',
    description: 'Description',
    github: 'https://github.com/bob',
    photo: 'https://picsum.photos/200/300',
  },
];

export default teamData;
