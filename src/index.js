import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Auth, API } from 'aws-amplify';
import configureAmplify from './amplify';

const DevContra = props => {
  const { email, password } = props;
  useEffect(() => {
    async function getAuth() {
      try {
        configureAmplify();
        const apiName = 'contra';
        const path = '/profile/stackoverflow';
        await Auth.signIn(email, password);
        const stackOverflow = await API.get(apiName, path);
        console.log(stackOverflow);
      } catch (err) {
        console.log(err);
      }
    }
    getAuth();
  }, [email, password]);
  console.log(email, password);
  return (
    <div
      style={{
        width: 100,
        height: 100,
        backgroundColor: 'blue',
      }}
    >
      Hello World
    </div>
  );
};

DevContra.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default DevContra;
