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
          .map(mapItems)

        resolve({ items });
      });
  }),
};
