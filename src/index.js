/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';
import configureAmplify from './amplify';
import Timeline from './timeline';

const DevContra = props => {
  const { profileKey, determinedMax, diameter, padding } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const apiName = 'contra';
        const stackPath = `/profile/stackoverflow/${profileKey}`;
        const gitPath = `/profile/github/${profileKey}`;
        const twitterPath = `/profile/twitter/${profileKey}`;
        const [stackOverflow, github, twitter] = await Promise.all([
          API.get(apiName, stackPath),
          API.get(apiName, gitPath),
          API.get(apiName, twitterPath),
        ]);
        return {
          result: { stackOverflow, github, twitter },
        };
      } catch (err) {
        return {
          error: err,
        };
      }
    }
    async function init() {
      configureAmplify();
      console.log('here', API);
      const { result, error } = await getData(profileKey);
      if (error) {
        console.log(error.response.data);
        return;
      }
      setData(result);
    }
    init();
  }, []);

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
  profileKey: PropTypes.string.isRequired,
  diameter: PropTypes.number,
  padding: PropTypes.number,
  determinedMax: PropTypes.number,
};

export default DevContra;
