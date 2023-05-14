import brain from 'brain.js'
import { score } from 'clementreiffers-linear-regression'
import { parse } from 'csv-parse'
import fs from 'fs'



let RAW_DATA = [];
let STEPS;
let SET = 500;
let DAYS = 22;
let TOTAL_DATA;
let CHUNK_SIZE = 30;
let rSquares = []



const net = new brain.recurrent.LSTMTimeStep({
    inputSize: 1, outputSize: 1, hiddenLayers: [10, 10]
})



fs.createReadStream('./AAPL.csv').pipe(parse({ delimiter: ',', from_line: 2 }))




    /**
     *    READING DATA
     * *********************
     */




    .on('data', (row) => {

        // storing data in a Array named RAW_DATA

        RAW_DATA.push({
            close: row[4]
        })
    })



    /**
     *       ERROR
     * ***********************
     */
    .on('error', (err) => {
        console.log(err)
    })





    /**
     *     READING OF CSV FILE COMPLETED
     * ****************************************
     */


    .on('end', () => {

        TOTAL_DATA = RAW_DATA.length
        STEPS = CALCULATE_STEPS(SET, DAYS, TOTAL_DATA)

        let iterated_data = 0;

        for (let step = 0; step < STEPS; step++) {

            //DATA SET 
            const DATA_SET = RAW_DATA.slice(iterated_data, iterated_data + SET)
            iterated_data += SET;

            //NORMALIZING The DATA SET
            const NORMALIZED_DATA = DATA_SET.map(scaleDOWN)

            //Training
            TRAINING(NORMALIZED_DATA)

            //ACTUAL DATA
            const ACTUAL_DATA = RAW_DATA.slice(iterated_data, iterated_data + DAYS)
            iterated_data += DAYS;
            
            //NORMALIZING ACTUAL DATA
            const NORMALIZED_ACTUAL_DATA = ACTUAL_DATA.map(scaleDOWN)

            //FORCASTING
            const PREDICTED = FORECAST(NORMALIZED_ACTUAL_DATA, DAYS)


            //CLOSE VALUES
            const ACTUAL_CLOSE_VALUES = ACTUAL_DATA.map(i => i.close)
            const PREDICTED_CLOSE_VALUES = PREDICTED.map(i => i.close)

            //R Square
            const rSquare = score(ACTUAL_CLOSE_VALUES, PREDICTED_CLOSE_VALUES)

            console.log(rSquare)

            //PUSHING rSquare to rSquares
            rSquares.push(rSquare)


        }

        console.log(rSquares)


    })


const CALCULATE_STEPS = (set, days, totalDataSet) => {

    /**
     *           totalDataSet
     * STEP  =  ----------------
     *           set  +  days
     */

    return Math.floor(totalDataSet / (set + days))
}


const TRAINING = (DATA) => {

    const CHUNKED_DATA = []

    for (let cSize = CHUNK_SIZE; cSize <= DATA.length; cSize += CHUNK_SIZE) {
        CHUNKED_DATA.push(DATA.slice(cSize - CHUNK_SIZE, cSize))
    }

    net.train(CHUNKED_DATA, {
        learningRate: 0.05,
        errorThresh: 0.02
    })

}

const FORECAST = (ACTUAL_DATA, DAYS) => {
    const predicted = net.forecast(ACTUAL_DATA, DAYS).map(scaleUP)
    return predicted
}


const scaleUP = (data) => {
    return {
        close: data.close * 138
    }
}


const scaleDOWN = (data) => {
    return {
        close: data.close / 138
    }
}