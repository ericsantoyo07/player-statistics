import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip
);




function LineChart({ chartData, isSmallDevice }) {

    if (!chartData) return null;

    const charRef = useRef(null);



    const [tooltip, setTooltip] = useState({
        opacity: 0,
        top: 0,
        left: 0,
        date: '',
        value: '',
    }) //initial tooltip state


    function convertTimeToString(time) {
        const date = new Date(time);
        return date.toLocaleDateString();

    }

    const labels = chartData.map((item) => convertTimeToString(item.date));
    const mainData = chartData.map((item) => item.marketValue);

    const pointBorderWidth = isSmallDevice ? 1 : 3;

    const data = {
        labels: labels,
        datasets: [{
            data: mainData,
            backgroundColor: "black",
            borderColor: "#111111",
            pointBorderWidth: pointBorderWidth,
            pointBorderColor: "#00bfa6",
            labelColor: "#00bfa6",
        }]
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: true,
            }

        },

        title: {
            display: true,
            text: 'Average High & Low Temperatures for ',
            fontFace: 'verdana',
            fontSize: 20,
            padding: {
                top: 10,
                bottom: 30
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                }
            },
            y: {
                grid: {
                    display: false,
                }
            }
        }
    };

    return (
        <div
            style={{
                flex: 1,
                width: '100%', height: '100%',
                backgroundColor: '#111111',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                padding: isSmallDevice ? '15px' : '30px',

            }}>
            <Line data={data} options={options} ref={charRef} />

        </div>
    );
}

export default LineChart;
