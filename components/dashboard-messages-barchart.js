'use client';
import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

const DashboardBarMessages = (props) => {
    const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'bottom',
        },
        title: {
        display: true,
        text: 'Messages Clicked by Type',
        },
      },
    };

      const labels = props.messages.map((l) => l.message_type).filter(onlyUnique);
      const clicked_data = props.messages.filter(click => click.isClicked === true).map((l) => l.cnt);
      const unclicked_data = props.messages.filter(click => click.isClicked === false).map((l) => l.cnt);

      const data = {
        labels,
        datasets: [
            {
              label: 'Clicked',
              data: clicked_data,
              backgroundColor: '#acbca4',
            },
            {
              label: 'Not Clicked',
              data: unclicked_data,
              backgroundColor: '#d4a4ac',
            },
          ],
      };

    return (
        <Bar options={options} data={data} />
  )
}

//reduce the array to only include unique items
function onlyUnique(value, index, array) {
return array.indexOf(value) === index;
}

export default DashboardBarMessages
