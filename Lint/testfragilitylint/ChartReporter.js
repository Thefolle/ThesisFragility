/**
 * @returns HTML content of the webview panel as string
 */
function getHTMLcontent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
        <script src="https://cdn.plot.ly/plotly-2.8.3.min.js"></script>
    </head>
    <body>

    <div id="chart" style="width:600px;height:250px;"></div>

    <script>
        chart = document.getElementById('chart');

        var y = [];
        for (var i = 0; i < 500; i++) {
            y[i] = Math.random();
        }

        var data = [
            {
                y: y,
                type: 'histogram',
                marker: {
                    color: 'pink',
                },
            }
        ];
        Plotly.newPlot(chart, data);


    </script>
    </body>
    </html>`
}


module.exports = { getHTMLcontent }
