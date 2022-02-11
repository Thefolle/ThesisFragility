/**
 * @returns HTML content of the webview panel as string
 */
function getHTMLcontent(uri, cleanedData) {
    let result = prepareDataAndLayout(cleanedData)

    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chart Report</title>
        <script src="https://cdn.plot.ly/plotly-2.8.3.min.js"></script>
    </head>
    
    <body>
    
        <div id="chart" style="width: fit-content; height: fit-content;"></div>
    
        <script>
            let chart = document.getElementById('chart');

            Plotly.newPlot(chart, ${JSON.stringify(result.data)}, ${JSON.stringify(result.layout)});
        </script>
    </body>
    
    </html>`

    //console.log(html) // debug the interpolated html string

    return html
}

function prepareDataAndLayout(cleanedData) {

    var data = [
        {
            y: cleanedData.map(row => row.message),
            type: 'histogram',
            marker: {
                color: 'violet',
            },
            opacity: 0.60,
            visible: true // default trace shown
        },
        {
            y: cleanedData.map(row => row.testFileName),
            type: 'histogram',
            marker: {
                color: 'violet',
            },
            opacity: 0.60,
            visible: false
        }
    ]

    var layout = {
        bargap: 0.2,
        xaxis: {
            title: "# violations"
        },
        yaxis: {
            title: "Recommendations",
            type: 'category',
            tickmode: 'linear', // show all the categorical values

            /* Determine the horizontal width based on tick lengths and axis title standoff */
            automargin: true,
            standoff: 30
        },
        title: {
            text: 'How are violations distributed in test cases?',
            font: {
                size: 24
            }
        },
        updatemenus: [
            {
                x: -2,
                y: 1.1,
                xanchor: 'left', // coordinates of the dropdown refer to its most left pixel
                yanchor: 'top', // coordinates of the dropdown refer to its most top pixel
                buttons: [
                    {
                        method: 'restyle',
                        args: ['visible', [true, false]],
                        label: 'Group by rule'
                    },
                    {
                        method: 'restyle',
                        args: ['visible', [false, true]],
                        label: 'Group by test file'
                    }
                ]
            }
        ]
    }

    return {data, layout}

}


module.exports = { getHTMLcontent }
