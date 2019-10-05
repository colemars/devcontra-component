const dev = {
  stage: 'dev',
  apiGateway: {
    REGION: 'us-west-2',
    URL: 'https://contra-api.colemars.dev/dev',
  },
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_9AJfFSR7r',
    APP_CLIENT_ID: '43h28i8vqvvbkppuq91uvfqqne',
    IDENTITY_POOL_ID: 'us-west-2:84077fe0-b370-4268-99a5-0945eca5cfa6',
  },
};

const prod = {
  stage: 'prod',
  apiGateway: {
    REGION: 'us-west-2',
    URL: 'https://contra-api.colemars.dev/prod',
  },
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_Rym6GAUMG',
    APP_CLIENT_ID: '6b88c9q4vqrl64t7bq99f73abu',
    IDENTITY_POOL_ID: 'us-west-2:310191c5-8c8e-4817-8894-834e8cec57db',
  },
};

// Default to prod if not set
const config = process.env.STAGE === 'dev' ? dev : prod;

export default {
  // Add common config values here
  placeholder: {},
  ...config,
};
