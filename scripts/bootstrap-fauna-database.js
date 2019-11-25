const faunadb = require('faunadb');
const chalk = require('chalk');
const q = faunadb.query;

const getFaunaConfig = () => {
    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').config();
    }

    return {
        secretKey: process.env.FAUNADB_SERVER_SECRET,
    };
};

const insideNetlifyBuildContext = () => 
    process.env.DEPLOY_PRIME_URL !== undefined ? true : false;

const createCollection = (client, name) =>
    client.query(
        q.Create(
            q.Ref('classes'),
            { name }
        )
    );

const createCollectionIndex = (client, collectionName, indexName) =>
    client.query(
        q.Create(
            q.Ref('indexes'),
            {
                name: indexName,
                source: q.Ref(`classes/${collectionName}`),
            }
        )
    );

const createDatabase = (faunaDbSecret) => {
    console.log('Creating the database schema');
    const client = new faunadb.Client({ secret: faunaDbSecret });
    
    return createCollection(client, 'todos')
        .then(() => createCollectionIndex(client, 'todos', 'all_todos'))
        .catch(error => {
            if (error.requestResult.statusCode === 400 && error.message === 'instance not unique') {
                // Database already exists
                console.log('Fauna already setup, you\'re good to go');
                console.log(`Claim your fauna database with "${chalk.underline('netlify addons:auth fauna')}"`);
                throw error;
            }
        });
};

const main = () => {
    const isNetlifyBuildContext = insideNetlifyBuildContext();

    console.log(chalk.cyan('Creating FaunaDB Database...'));

    const faunaDbConfig = getFaunaConfig();
    if (!faunaDbConfig.secretKey) {
        console.log(chalk.yellow('Required FAUNADB_SERVER_SECRET not defined.'));
        console.log(`Make sure you have created your Fauna database with "${chalk.underline('netlify addons:create fauna')}"`);
        console.log('THen run "npm run bootstrap" to setup the fauna database schema');
        
        if (isNetlifyBuildContext) {
            process.exit(1); 
        }
        return;

    } 
    
    return createDatabase(faunaDbConfig.secretKey)
        .then(() => {
            console.log(chalk.green('Fauna Database schema has been created'));
            console.log(`Claim your fauna database with "${chalk.underline('netlify addons:auth fauna')}"`);
        });
};


if (require.main === module) {
    main()
        .then(() => {
            console.log('Done');
            process.exit(0);
        })
        .catch(e => {
            console.error(chalk.red(`Error: ${e.message}`));
            console.error(chalk.red(JSON.stringify(e)));
            process.exit(1);
        });
}