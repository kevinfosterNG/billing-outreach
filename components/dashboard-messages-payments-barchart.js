'use client';
import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '@/styles/chart.css'

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

const DashboardMessagesPaymentsBarChart = (props) => {
    const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'bottom',
        },
        title: {
        display: true,
        text: 'Payment Totals Received by Message Type',
        },
      },
    };

      const labels = props.messages.map((l) => l.message_type).filter(onlyUnique);
      //const clicked_data = props.messages.filter(click => click.isClicked === true).map((l) => l.cnt);
      //const unclicked_data = props.messages.filter(click => click.isClicked === false).map((l) => l.cnt);

      const payment_data_1 = [ 3211.29, 2882.77, 475.94, 850.38, 933.37, 827.46];
      const payment_data_2 = [0,0,0,0,0,0,];

      const data = {
        labels,
        datasets: [
            {
              label: 'April 28, 2023',
              data: payment_data_1,
              backgroundColor: '#349D47',
            },
            {
              label: 'April 29, 2023',
              data: payment_data_2,
              //backgroundColor: 'rgba(255, 159, 64, 0.2)',
            },
            {
              label: 'April 30, 2023',
              data: payment_data_2,
              //backgroundColor: 'rgba(255, 205, 86, 0.2)',
            },
          ],
      };

          // backgroundColor: [
          //   'rgba(255, 99, 132, 0.2)',
          //   'rgba(255, 159, 64, 0.2)',
          //   'rgba(255, 205, 86, 0.2)',
          //   'rgba(75, 192, 192, 0.2)',
          //   'rgba(54, 162, 235, 0.2)',
          //   'rgba(153, 102, 255, 0.2)',
          //   'rgba(201, 203, 207, 0.2)',
          // ],


    return (
      <div className='chart'>
        <Bar options={options} data={data} />
        </div>
  )
}

//reduce the array to only include unique items
function onlyUnique(value, index, array) {
return array.indexOf(value) === index;
}

export default DashboardMessagesPaymentsBarChart
