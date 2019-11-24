const faunadb = require('faunadb');
const chalk = require('chalk');
const q = faunadb.query;

const insideNetlifyBuildContext = () => 
    process.env.DEPLOY_PRIME_URL !== undefined ? true : false;

const createTable = (client, name) =>
    client.query(
        q.Create(
            q.Ref('classes'),
            { name }
        )
    );

const createIndex = (client, tableName, indexName) =>
    client.query(
        q.Create(
            q.Ref('indexes'),
            {
                name: indexName,
                source: q.Ref(`classes/${tableName}`),
            }
        )
    );

const createDatabase = (faunaDbSecret) => {
    console.log('Creating the database schema');
    const client = new faunadb.Client({ secret: faunaDbSecret });
    
    return createTable(client, 'todos')
        .then(() => createIndex(client, 'todos', 'all_todos'))
        .catch(error => {
            if (error.requestResults.statusCode === 400 && error.message === 'instance not unique') {
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

    const faunaDbSecret = process.env.FAUNADB_SERVER_SECRET;
    if (!faunaDbSecret) {
        console.log(chalk.yellow('Required FAUNADB_SERVER_SECRET not defined.'));
        console.log(`Make sure you have created your Fauna database with "${chalk.underline('netlify addons:create fauna')}"`);
        console.log('THen run "npm run bootstrap" to setup the fauna database schema');
        
        if (isNetlifyBuildContext) {
            process.exit(1); 
        }
        return;

    } 
    
    return createDatabase(faunaDbSecret)
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
            process.exit(1);
        });
}