
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
    'me figuring out how to setup my homelab.',
},


  about: {
  title: 'About Me',
  body: [
    'I write C++, Python, and a lil TypeScript. I like my code ' +
      'object oriented and my project scope a little too big. ' +
      'Whatever subfield grabs me that month is where I go, right ' +
      'now that\'s:',
    [
      'a raytracer for this site',
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
    placeholder: 'Lost signal :(',
  },

  projects: {
    eyebrow: '[active work]',
    title: 'Latest Projects',
    demoLabel: 'raytracer, coming to a site near you!',
    list: [
      {
        name: 'TypeScript raytracer',
        desc: 'A port of "Ray Tracing in One Weekend" from C++ to TypeScript, written to learn the language. Headed for the demo box above.',
        status: 'Almost done!',
      },
      {
        name: 'M.I.R.A.',
        desc: 'A private AI assistant that runs fully locally. It sets reminders, answers questions, and controls apps on your machine through a system of tools it can call on its own.',
        status: 'In progress...',
      },
      {
      name: 'Distributed Minecraft chunk generation',
      desc:
        'Dreaming of better performance on cheaper servers, ' +
        'the idea is to hand chunk generation off to the ' +
        'players on the server. Since everything generates from the same ' +
        'seed, chunks are fully reproducible, so the server can verify ' +
        'untrusted work by regenerating random samples and comparing hashes.',
      status: 'Up next.',
      },
    ],
  },

  yapping: {
    eyebrow: '[off topic]',
    title: 'Loose Pages',
    body: 'Movie reviews with a rating out of ten and a few bits of praise or critics, random thoughts, ' +
  'and project breakdowns that go further than the cards above, ' +
  'including the parts that broke.',
    linkText: 'Reviews, once the database exists →',
  },

  footer: {
    quip: 'Brought to you by GCP, and soon an office PC in my closet!',
    copyright: '© 2026 Justin Blackwood',
  },
};
