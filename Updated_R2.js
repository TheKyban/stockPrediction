import brain from 'brain.js'
import { score } from 'clementreiffers-linear-regression'
import { parse } from 'csv-parse'
import fs from 'fs'
import scaler from 'minmaxscaler'



let RAW_DATA = [];
let STEPS;
let DAYS = 22;
let TOTAL_DATA;
let CHUNK_SIZE = 500;
let lenOfSmallArr = 50;
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

        const MAIN = () => {

            for (let step = 0; step < STEPS; step++) {

                //DATA SET 
                const DATA_SET = RAW_DATA.slice(iterated_data, iterated_data + CHUNK_SIZE)
                iterated_data += DAYS;


                //Training
                TRAINING(DATA_SET)
                // console.log("trained")

                //ACTUAL DATA
                const ACTUAL_DATA = RAW_DATA.slice(iterated_data + CHUNK_SIZE, iterated_data + CHUNK_SIZE + DAYS)

                //NORMALIZING ACTUAL DATA
                const NORMALIZED_ACTUAL_DATA = scaleDOWN(ACTUAL_DATA)

                //FORCASTING
                const PREDICTED_DATA = FORECAST(NORMALIZED_ACTUAL_DATA, DAYS)


                const rSquare = rSQUARE(ACTUAL_DATA, PREDICTED_DATA)

                console.log(rSquare)

                //PUSHING rSquare to rSquares
                rSquares.push(rSquare)


            }
        }

        MAIN()
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
    const NORMALIZED_DATA = scaleDOWN(DATA)

    const arrOfData = []

    for (let i = lenOfSmallArr; i <= NORMALIZED_DATA.length; i += lenOfSmallArr) {
        arrOfData.push(NORMALIZED_DATA.slice(i - lenOfSmallArr, i))
    }

    net.train(arrOfData, {
        learningRate: 0.05,
        errorThresh: 0.02
    })

    console.log("trained")
}

const FORECAST = (ACTUAL_DATA, DAYS) => {
    const predicted = net.forecast(ACTUAL_DATA, DAYS)
    return scaleUP(predicted)
}

const rSQUARE = (ACTUAL_DATA, PREDICTED_DATA) => {
    //CLOSE VALUES
    const ACTUAL_CLOSE_VALUES = ACTUAL_DATA.map(i => i.close)
    const PREDICTED_CLOSE_VALUES = PREDICTED_DATA.map(i => i.close)

    //R Square
    const rSquare = score(ACTUAL_CLOSE_VALUES, PREDICTED_CLOSE_VALUES)
    return rSquare.toFixed(3)
}

const scaleUP = (data) => {
    let ClOSES_VALUES = []
    for (let i = 0; i < data.length; i++) {
        ClOSES_VALUES.push(data[i].close)
    }
    const scaledValue = inverse_transform(ClOSES_VALUES)
    return scaledValue.map(i => ({ close: i }))
}


const scaleDOWN = (data) => {
    let ClOSES_VALUES = []
    for (let i = 0; i < data.length; i++) {
        ClOSES_VALUES.push(data[i].close)
    }
    const scaledValue = scaler.transform(ClOSES_VALUES)
    return scaledValue.map(i => ({ close: i }))
}


/**
 *  iteration set(500) days(30)
 *  1st       0-500     501-530
 *  2nd       22-522     522-552
 *  3nd       44-544     544-574
 */


// Steps=math.floor((totaldataset-chunksize)/days)

// normalized_closes = (stock_closes - min_close) / (max_close - min_close)

/**
 * newMaxA = 1
 * newMinA = 0
 *
 *                      (stock_closes - min_close)
 * normalized_closes =  --------------------------- x (newMaxA - newMinA) + newMinA
 *                        (max_close - min_close)
 */

// use scaler.transform for scaleDOWN and scaler.inverse_transform for scaleUP