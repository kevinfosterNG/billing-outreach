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
      scales: {
        y: {
            ticks: {
                // Include a dollar sign in the ticks
                callback: function(value, index, ticks) {
                    return '$' + value;
                }
            }
        }
      }
    };

      const labels = props.messages.map((l) => l.message_type).filter(onlyUnique);
      console.log(labels);
      const payments = [];
      //group and add paid_amt values for all like message_types
      props.messages.reduce(function(res, value) {
          if (!res[value.message_type]) {
            res[value.message_type] = { message_type: value.message_type, paid_amt: 0 };
            payments.push(res[value.message_type])
          }
          res[value.message_type].paid_amt += value.paid_amt;
          return res;
        }, {});

      const data = {
        labels,
        datasets: [
            {
              label: 'Total Payments',
              data: payments.map((p) => p.paid_amt),
              backgroundColor: '#349D47',
            },
            // {
            //   label: 'April 29, 2023',
            //   data: payment_data_2,
            //   //backgroundColor: 'rgba(255, 159, 64, 0.2)',
            // },
            // {
            //   label: 'April 30, 2023',
            //   data: payment_data_2,
            //   //backgroundColor: 'rgba(255, 205, 86, 0.2)',
            // },
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
