import brain from 'brain.js'
import { score } from 'clementreiffers-linear-regression'
import { parse } from 'csv-parse'
import fs from 'fs'



let RAW_DATA = [];
let STEPS;
let DAYS = 30;
let TOTAL_DATA;
let CHUNK_SIZE = 500;
let lenOfSmallArr = 30;
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
        STEPS = CALCULATE_STEPS(CHUNK_SIZE, DAYS, TOTAL_DATA)

        let iterated_data = 0;

        for (let step = 0; step < STEPS; step++) {

            //DATA SET 
            const DATA_SET = RAW_DATA.slice(iterated_data, iterated_data + CHUNK_SIZE)
            iterated_data += DAYS;


            //Training
            TRAINING(DATA_SET)

            //ACTUAL DATA
            const ACTUAL_DATA = RAW_DATA.slice(iterated_data + CHUNK_SIZE, iterated_data + CHUNK_SIZE + DAYS)

            //NORMALIZING ACTUAL DATA
            const NORMALIZED_ACTUAL_DATA = ACTUAL_DATA.map(scaleDOWN)

            //FORCASTING
            const PREDICTED_DATA = FORECAST(NORMALIZED_ACTUAL_DATA, DAYS)


            const rSquare = rSQUARE(ACTUAL_DATA, PREDICTED_DATA)

            console.log(rSquare)

            //PUSHING rSquare to rSquares
            rSquares.push(rSquare)


        }

        console.log(rSquares)


    })


const CALCULATE_STEPS = (chunk, days, totalDataSet) => {

    /**
     *           totalDataSet - chunk
     * STEP  =  ------------------------
     *                    days
     */

    return Math.floor((totalDataSet - chunk) / days)
}


const TRAINING = (DATA) => {
    //NORMALIZING The DATA SET
    const NORMALIZED_DATA = DATA.map(scaleDOWN)

    const arrOfData = []

    for (let i = lenOfSmallArr; i <= NORMALIZED_DATA.length; i += lenOfSmallArr) {
        arrOfData.push(NORMALIZED_DATA.slice(i - lenOfSmallArr, i))
    }

    net.train(arrOfData, {
        learningRate: 0.05,
        errorThresh: 0.02
    })

}

const FORECAST = (ACTUAL_DATA, DAYS) => {
    const predicted = net.forecast(ACTUAL_DATA, DAYS).map(scaleUP)
    return predicted
}

const rSQUARE = (ACTUAL_DATA, PREDICTED_DATA) => {
    //CLOSE VALUES
    const ACTUAL_CLOSE_VALUES = ACTUAL_DATA.map(i => i.close)
    const PREDICTED_CLOSE_VALUES = PREDICTED_DATA.map(i => i.close)

    //R Square
    const rSquare = score(ACTUAL_CLOSE_VALUES, PREDICTED_CLOSE_VALUES)
    return rSquare
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


/**
 *  iteration set(500) days(30)
 *  1st       0-500     501-530
 *  2nd       22-522     522-552
 *  3nd       44-544     544-574
 */


// Steps=math.floor((totaldataset-chunksize)/days)