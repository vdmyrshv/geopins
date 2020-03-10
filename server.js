const {ApolloServer} = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const {findOrCreateUser} = require('./controllers/userControllers');
require('dotenv').config();

mongoose
    .connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => { console.log('DB Connected...')})
    .catch(()=> {console.error(err)});
mongoose.set("useFindAndModify", false);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      let authToken = null;
      let currentUser = null;
      try {
        authToken = req.headers.authorization;
        if (authToken) {
          currentUser = await findOrCreateUser(authToken);
        }
      } catch (err) {
        console.error(`Unable to authenticate user with token ${authToken}`);
      }
      return { currentUser };
    }
  });
  
  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Server listening on ${url}`);
  });
  