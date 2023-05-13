const fs = require('fs')
const { parse } = require('csv-parse')
const brain = require('brain.js')


let rawData = []


/**
 * Methods for scale the data
 */

const scaleUp = (step) => {
    return {
        open: step.open * 138,
        high: step.high * 138,
        low: step.low * 138,
        close: step.close * 138,
    }
}
const scaleDown = (step) => {
    return {
        open: step.open / 138,
        high: step.high / 138,
        low: step.low / 138,
        close: step.close / 138,
    }
}

/* ****** */


/**
 * Creating stream to read the csv file
 */

fs.createReadStream('./AAPL.csv')

    /**
     * Options to read csv file
     */

    .pipe(parse({ delimiter: ",", from_line: 500, to_line: 1500 }))

    /**
     * Reading the file
     */

    .on('data', (row) => {

        rawData.push({
            date: row[0],
            open: row[1],
            high: row[2],
            low: row[3],
            close: row[4],
            adj: row[5],
            volume: row[6]
        })
    })

    /**
     * If error
     */

    .on("error", (error) => {
        console.log(error)
    })

    /**
     * reading is completed
     */

    .on("end", () => {

        /**
         * Scaling the data
         */

        const scaledData = rawData.map(scaleDown)

        const trainingData = []

        /**
         * dividing the data in small chunks(of 5)
         */

        for (let i = 5; i < scaledData.length; i += 5) {
            trainingData.push(scaledData.slice(i - 5, i))
        }

        const net = new brain.recurrent.LSTMTimeStep({
            inputSize: 4,
            hiddenLayers: [8, 8],
            outputSize: 4
        })


        net.train(trainingData, {
            learningRate: 0.05,
            errorThresh: 0.02
        })

        
        /**
         * Prediction
         */


        const prediction = net.forecast(trainingData[0], 1).map(scaleUp)
        console.log(prediction)
    })
