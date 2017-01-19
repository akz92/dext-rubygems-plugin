const got = require('got');

// default API endpoint
const ENDPOINT = 'https://rubygems.org/api/v1/search.json';

const makeRequest = (options) => {
  const opts = Object.assign({}, { json: true }, options);
  const prom = got(ENDPOINT, opts);

  return new Promise((resolve) => {
    prom.then(res => resolve(res.body));
  });
};

const mapItems = item => Object.assign({}, {
  title: item.name,
  subtitle: item.info,
  arg: item.project_uri,
  text: {
    copy: `gem install ${item.name}`
  },
  icon: {
    path: './icon.png'
  },
  mods: {
    cmd: {
      arg: item.homepage_uri,
      subtitle: 'View project homepage.'
    },
    alt: {
      arg: item.source_code_uri,
      subtitle: 'View project source code.'
    }
  }
});

module.exports = {
  keyword: 'gem',
  action: 'openurl',
  helper: {
    title: 'Search ruby gems.',
    subtitle: 'Example: gem rails',
    icon: {
      path: './icon.png'
    }
  },
  query: q => new Promise((resolve) => {
    const opts = {
      query: {
        query: q
      }
    };

    makeRequest(opts)
      .then((body) => {
        const items = body
          .slice(0, 20)
          .map(mapItems)

        resolve({ items });
      });
  }),
};
