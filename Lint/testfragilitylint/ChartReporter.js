/**
 * @returns HTML content of the webview panel as string
 */
function getHTMLcontent() {
    let result = prepareDataAndLayout()

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

    //console.log(html) debug the interpolated html string

    return html
}

function prepareDataAndLayout() {

    var y = [];
    for (var i = 0; i < 500; i++) {
        y[i] = `Test case ${i % 20}`
    }

    var data = [
        {
            y: y,
            type: 'histogram',
            marker: {
                color: 'violet',
            },
            opacity: 0.60
        }
    ];

    var layout = {
        bargap: 0.2,
        xaxis: {
            title: "# violations"
        },
        yaxis: {
            title: "Test cases",
            type: 'category',
            tickmode: 'linear',

            /* Determine the horizontal width based on tick lengths and axis title standoff */
            automargin: true,
            standoff: 30
        },
        title: 'How are violations distributed in test cases?'
    }

    return {data, layout}

}


module.exports = { getHTMLcontent }
