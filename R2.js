import brain from 'brain.js'
import fs from 'fs';
import { parse } from 'csv-parse'
import { score } from 'clementreiffers-linear-regression'


const read_From_Line_No = 2

let All_Close_data = []
let Data = []
let Scaled_Data = []
let trainingData = []
let all_R2 = []
let NumberOfDataSet = 500 // first data set taken
const days = 22


/**
 * For testing purpose
 * if totalNumberOfDataSet have a value then the program calculate r2 for it
 * if totalNumberOfDataSet haven't a value then program calculate r2 for all data Set present
 * totalNumberOfDataSet always must greater than NumberOfDataSet
 */

let totalNumberOfDataSet  // total data set



fs.createReadStream('./AAPL.csv')
    .pipe(parse({
        delimiter: ",", from_line: read_From_Line_No
    }))
    .on('data', (row) => {
        /**
         * Reading Data
         */

        All_Close_data.push({ close: row[4] })
    })
    .on('error', (error) => console.log(error))
    .on('end', () => {

        /**
         * After Finish Reading csv file
         */

        const net = new brain.recurrent.LSTMTimeStep({
            inputSize: 1, hiddenLayers: [8, 8], outputSize: 1
        })


        /**
         * Storing 500 datas in Data
        */

        for (let i = 0; i < NumberOfDataSet; i++) {
            Data.push(All_Close_data[i])
        }


        /**
         * Scaling Data
        */

        Scaled_Data = Data.map(scaleDown)

        /**
         * Spliting scaled_data into chunks
        */

        for (let i = 5; i <= Scaled_Data.length; i += 5) {
            trainingData.push(Scaled_Data.slice(i - 5, i))
        }


        /**
         *           LOOP FOR CALCULATE ALL R2
         * ***********************************************
         */

        while (NumberOfDataSet <= (totalNumberOfDataSet ? totalNumberOfDataSet : All_Close_data.length - days)) {


            /**
             *      TRAINING
             * *******************
             */

            net.train(trainingData, {
                learningRate: 0.05,
                errorThresh: 0.02
            })


            /**
             *        FORECASTING
             * ******************************
             */

            const predicated_close = net.forecast(trainingData[1], days).map(scaleUp)


            const predicted = array(predicated_close) // getting only array of number

            /**
             *       NEXT DATA
             * *********************
             *        500+days
             */


            let next_Data = []

            for (let i = NumberOfDataSet; i < NumberOfDataSet + days; i++) { // itration times = number of days
                next_Data.push(All_Close_data[i])
                Scaled_Data.push(scaleDown(All_Close_data[i])) // scaling new data and pushing to scaled_data
            }

            for (let i = NumberOfDataSet + 5; i <= NumberOfDataSet + days; i += 5) {
                trainingData.push(Scaled_Data.slice(i - 5, i))
            }

            const next_actual_data = array(next_Data) // getting only array of number


            /**
             *         CALCULATING R2 Score
             * ******************************
             */


            let R2 = score(predicted, next_actual_data)
            R2 = R2 === NaN ? 0 : R2

            all_R2.push(R2)


            /**
             * Incrementing numberOfDataSet by days
             */

            NumberOfDataSet += days;

            console.log(R2)


        }

        console.log(all_R2)
        console.log(all_R2.length)
    })

const scaleDown = (step) => {
    return {
        close: step.close / 138
    }
}
const scaleUp = (step) => {
    return {
        close: step.close * 138
    }
}

const array = (arr) => {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        newArr.push(parseFloat(arr[i].close))
    }

    return newArr
}