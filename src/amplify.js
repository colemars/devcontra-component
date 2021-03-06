import Amplify, { Auth } from 'aws-amplify';
import config from './config';

export default async function configureAmplify() {
  Amplify.configure({
    Auth: {
      mandatorySignIn: false,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    },
    API: {
      endpoints: [
        {
          name: 'contra',
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION,
        },
      ],
    },
  });
  await Auth.currentCredentials();
  console.log(Auth);
}
