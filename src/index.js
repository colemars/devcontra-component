/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Auth, API } from 'aws-amplify';
import configureAmplify from './amplify';
import Timeline from './timeline';

const DevContra = props => {
  const { email, password, determinedMax, diameter, padding } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const apiName = 'contra';
        const stackPath = '/profile/stackoverflow';
        const gitPath = '/profile/github';
        const twitterPath = '/profile/twitter';
        const [stackOverflow, github, twitter] = await Promise.all([
          API.get(apiName, stackPath),
          API.get(apiName, gitPath),
          API.get(apiName, twitterPath),
        ]);
        return {
          result: { stackOverflow, github, twitter },
        };
      } catch (err) {
        console.log(err);
        return {
          error: err,
        };
      }
    }
    async function InitWithAuth() {
      configureAmplify();
      await Auth.signIn(email, password);
      const { result, error } = await getData();
      if (error) {
        console.log(error);
        return;
      }
      setData(result);
    }
    InitWithAuth();
  }, [email, password]);

  return (
    <>
      {data && (
        <Timeline
          data={data}
          determinedMax={determinedMax}
          diameter={diameter}
          padding={padding}
        />
      )}
    </>
  );
};

DevContra.defaultProps = {
  diameter: 350,
  padding: 0,
  determinedMax: 0,
};

DevContra.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  diameter: PropTypes.number,
  padding: PropTypes.number,
  determinedMax: PropTypes.number,
};

export default DevContra;
