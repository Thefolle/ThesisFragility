/**
 * @returns HTML content of the webview panel as string
 */
function getHTMLcontent(resourceName, cleanedData) {
    let result = prepareDataAndLayout(resourceName, cleanedData)

    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chart Report</title>
        <script src="https://cdn.plot.ly/plotly-2.9.0.min.js"></script>
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

function prepareDataAndLayout(resourceName, cleanedData) {

    /* Group data by category, each one with its occurrence */

    let messages = cleanedData.map(row => row.message)
    let occurrencesByRule = groupBy(messages)
    occurrencesByRule.sort((occurrence1, occurrence2) => occurrence1.count - occurrence2.count)

    let testFileNames = cleanedData.map(row => row.testFileName)
    let occurrencesByTestFileName = groupBy(testFileNames)
    occurrencesByTestFileName.sort((occurrence1, occurrence2) => occurrence1.count - occurrence2.count)

    var data = [
        {
            name: 'Violations',
            x: occurrencesByRule.map(occurrence => occurrence.count),
            y: occurrencesByRule.map(occurrence => `${occurrence.name.slice(0, 30)}...`),
            type: 'bar', // an histogram would fit better the target of showing data, but its sorting capabilities are buggy
            marker: {
                color: 'violet',
            },
            opacity: 0.60,
            orientation: 'h',

            visible: true // default trace shown
        },
        {
            name: 'Test files',
            x: occurrencesByTestFileName.map(occurrence => occurrence.count),
            y: occurrencesByTestFileName.map(occurrence => occurrence.name),
            type: 'bar', // an histogram would fit better the target of showing data, but its sorting capabilities are buggy
            orientation: 'h',

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
            title: "# violations",
            rangemode: 'tozero',
            linewidth: 1,
            showgrid: true,
            tickformat: ',d' // useful to mitigate the bug of floating-point labels when the maximum value of the xaxis is 1. This is an inconvenient of using a bar chart rather than an histogram
        },
        yaxis: {
            type: 'category',
            //tickmode: 'linear', // show all the categorical values, but labels overlap when they are too much

            /* Rather than allowing labels to overflow on the left,
            * move the y axis rightwards by reducing the chart width and increasing the labels space width */
            //automargin: true
            //standoff: 30
        },
        title: {
            text: `<b>How are violations distributed in ${resourceName}?</b>`,
            font: {
                size: 24
            }
        },
        width: 900,
        height: 500,

        // define the dropdown
        updatemenus: [
            {
                x: -0.5,
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

function groupBy(data) {
    let sortedMessages = data.sort()

    let occurrences = []

    sortedMessages.forEach(message => {
        if (occurrences.length == 0) {
            occurrences.push({ name: message, count: 1 })
            return
        }

        if (message == occurrences[occurrences.length - 1].name) {
            occurrences[occurrences.length - 1].count++
        } else {
            occurrences.push({ name: message, count: 1 })
        }
    })

    return occurrences
}


module.exports = { getHTMLcontent }
