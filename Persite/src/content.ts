
export const content = {
  header: {
    name: 'Justin Blackwood',
    githubUrl: 'https://github.com/Jexc0de',
    resumeHref: '/Resume.pdf', 
  },

  hero: {
    tagline: '> It\'s got that new site smell! ',
  },

  notice: {
  message: 'That link goes nowhere yet. The database is pending ' +
    'me figuring out how to set up my homelab.',
},


  about: {
  title: 'About Me',
  body: [
    'I use C++, Python, and sometimes TypeScript. I like my code ' +
      'object oriented and my project scope a little too big. ' +
      'Whatever subfield grabs me that month is where I go, right ' +
      'now that\'s:',
    [
      'a homelab for self hosting',
      'a homemade local AI assistant',
      'a tile map editor in C++, with a handmade UI framework',
    ],
    'I love movies, and will always take a recommendation. I write ' +
      'poetry, plus essays when something gets stuck in my head. ' +
      'This fall I\'m launching a competitive Pokémon club built ' +
      'around a draft league. And I always make time for what ' +
      'matters most: my cat, Bismuth.',
  ],
},

  spotify: {
      title: 'From My Spotify: Now Playing',
      titleIdle: 'From My Spotify: Last Played',
      titleUnknown: 'From My Spotify',
      placeholder: 'Lost signal :(',
      loading: 'Getting signal...',
  },

  projects: {
    eyebrow: '[active work]',
    title: 'Latest Projects',
    demoLabel: 'raytracer, coming to a site near you!',
    list: [
      {
        name: 'TypeScript raytracer',
        desc: 'A port of "Ray Tracing in One Weekend" from C++ to TypeScript. I wrote it to learn the language and get a taste of graphics programming. '+
        'If you look closely you can see the picture getting less grainy as time goes on. That\'s so it doesn\'t initially look like dial-up internet. ' +
        'I\'ll explain how it gets better and the whole process in a write-up coming soon. ',
        status: 'DONE!',
      },
      {
        name: 'M.I.R.A.',
        desc: 'A private AI assistant that runs fully locally. It sets reminders, answers questions, and controls apps on your machine through a system of tools it can call on its own.',
        status: 'In progress...',
      },
      {
      name: 'Distributed Minecraft chunk generation',
      desc:
        'The idea is to hand chunk generation off to the ' +
        'players on the server. Since everything generates from the same seed it stays consistent. ' +
        'More details later. ',
      status: 'Up next.',
      },
    ],
  },

  yapping: {
    eyebrow: '[off topic]',
    title: 'Loose Pages',
    body: 'Movie reviews with a rating out of ten and a few bits of praise or criticism, random thoughts, ' +
  'and project breakdowns that go further than the projects card, ' +
  'including the parts that broke.',
    linkText: 'Reviews, once the database exists →',
  },

  footer: {
    quip: 'Brought to you by GCP, and soon an office PC in my closet!',
    copyright: '© 2026 Justin Blackwood',
  },
};
