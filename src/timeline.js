/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import d3 from 'd3-layout-timeline-api';

const Timeline = props => {
  const { determinedMax, diameter, padding, data } = props;
  const now = moment().utc();
  const colorMap = {
    stackoverflow: '#F48024',
    spectrum: '#7B16FF',
    twitter: '#1DA1F2',
    github: '#24292E',
  };

  const dataMap = new Map();
  for (let i = 16; i >= 0; i -= 1) {
    const weekStart = now
      .clone()
      .subtract(i, 'weeks')
      .startOf('week')
      .unix();
    dataMap.set(weekStart, {
      children: [
        { platform: 'stackoverflow', s: 0, e: 0 },
        { platform: 'github', s: 0, e: 0 },
        { platform: 'twitter', s: 0, e: 0 },
        { platform: 'spectrum', s: 0, e: 0 },
      ],
    });
  }

  for (const platform of Object.entries(data)) {
    const value = platform[1];
    value.map(item => {
      const { activityDate, variant } = item;
      const newVal = dataMap.get(activityDate);
      if (!newVal) return item;
      newVal.children.forEach((child, i) => {
        if (child.platform === variant) {
          let highestPrecedingValue = 0;
          for (let x = 0; x <= i; x += 1) {
            const precedingPlatform = newVal.children[i - x] || 0;
            if (precedingPlatform.e > highestPrecedingValue) {
              highestPrecedingValue = precedingPlatform.e;
            }
          }
          child.color = colorMap[variant];
          child.plainDate = moment.unix(activityDate);
          if (highestPrecedingValue > 0 && child.e === 0) {
            child.s = highestPrecedingValue + 1;
            child.e = child.s + 1;
          } else child.e += 1;
        }
      });
      dataMap.set(activityDate, newVal);
      return item;
    });
  }

  const formattedData = [];
  for (const item of dataMap.values()) {
    formattedData.push(item);
  }

  let overallMax = 0;
  formattedData.forEach(item => {
    let localMax = 0;
    item.children.forEach(val => {
      if (val.e > localMax) {
        localMax = val.e;
      }
    });
    if (localMax > overallMax) overallMax = localMax;
  });

  const relativeMax = Math.ceil((overallMax + 1) / 10) * 10;

  const relativeDiameterModifier = 2.45 + padding / 10;

  const timeline = d3.layout
    .timeline()
    .size([1000, diameter / relativeDiameterModifier])
    .bandStart(d => {
      return d.s;
    })
    .bandEnd(d => {
      return d.e;
    })
    .dateFormat(d => {
      return parseInt(d, 10);
    })
    .childAccessor(d => {
      return d.children;
    })
    .padding(2)
    .extent([0, 1000]);

  const domain = determinedMax || relativeMax;
  const addData = () => {
    const arc = d3.svg.arc();
    const timelineBands = timeline(dataMap);
    const angleScale = d3.scale
      .linear()
      // determines how extent scales...
      .domain([0, domain])
      .range([0, 2 * Math.PI]);
    timelineBands.forEach(d => {
      d.startAngle = angleScale(d.start);
      d.endAngle = angleScale(d.end);
      // diameter of the center blank space
      d.y += 30;
    });

    d3.select('div.devcontra')
      .select('svg')
      .selectAll('path')
      .data(timelineBands)
      .enter()
      .append('path')
      .attr('transform', `translate(${diameter / 2},${diameter / 2})`)
      .style('fill-opacity', 0)
      .attr('d', d => {
        return arc.innerRadius(10).outerRadius(d.dy + 10)(d);
      });

    const size = timelineBands.length;

    d3.select('div.devcontra')
      .select('svg')
      .selectAll('path')
      .transition()
      .duration(400)
      .attr('d', d => {
        const { y, dy } = d;
        return arc.innerRadius(y).outerRadius(y + dy)(d);
      })
      .attr('x', d => {
        return d.start;
      })
      .attr('y', d => {
        return d.y;
      })
      .attr('height', d => {
        return d.dy;
      })
      .attr('width', d => {
        return d.end - d.start;
      })
      .style('fill', d => d.color || 'rgba(0,0,0,0)')
      .style('fill-opacity', (d, i) => {
        return Math.max(0.05, 1 - (size - i) * 0.01);
      });
  };

  useEffect(() => {
    addData();
  });

  return (
    <div className="devcontra">
      <svg height={diameter} width={diameter} />
    </div>
  );
};

Timeline.propTypes = {
  diameter: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  determinedMax: PropTypes.number.isRequired,
  data: PropTypes.shape({
    stackOverflow: PropTypes.arrayOf(PropTypes.object),
    github: PropTypes.arrayOf(PropTypes.object),
    twitter: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default Timeline;
