const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const store = createStore();
//set up our database

const server = new ApolloServer({
    context: async ({req}) => {
        const auth = req.headers && req.headers.authorization || '';
        const email = Buffer.from(auth, 'base64').toString('ascii');
        if (!isEmail.validate(email)) return { user: null };
        // find a user by their email
        const users = await store.users.findOrCreate({ where: { email } });
        const user = users && users[0] || null;
 console.log({ user: { ...user.dataValues } })  
        return { user: { ...user.dataValues } };        
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store })
    })
});
//Apollo Server will automatically add the launchAPI and userAPI to our resolver's
//context so we can easily call them.


const PORT = 4000
server.listen(PORT, () => {
    console.log(`Server ready at ${PORT}`);
});
