const routes = require('next-routes')();

// redirect any /campaign/:address to instead render
// the /campaign/show address. this overrides the
// default next js routing system
routes
  .add('/campaign/new', '/campaign/new')
  .add('/campaign/:address', '/campaign/show')
  .add('/campaign/:address/requests', '/campaign/requests/index')
  .add('/campaign/:address/requests/new', '/campaign/requests/new');

module.exports = routes;