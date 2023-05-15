import brain from 'brain.js'
import { score } from 'clementreiffers-linear-regression'
import { parse } from 'csv-parse'
import fs from 'fs'



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
    return rSquare.toFixed(3)
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

/**
 * 0.003312736115609999
0.01316318759423618
0.004433442485872878
0.0470777144098464
0.32739135350918064
0.1081811891922325
0.14523253077229836
0.005891312154777901
0.003448034409548457
0.0032480680007664665
0.1029135551640582
0.12974514254342548
0.1183140563321649
0.03296000727681088
0.43685418352982297
0.2922912672062635
0.0173552189365945
0.005302118216215565
0.036812173979031554
0.12146245236835276
0.06936762239797732
0.07927407655432073
0.05976169434367947
0.22785303056396677
0.010085006352312981
0.0581842798429878
0.0007574749948210151
0.0541426735745412
0.030680550077848704
0.5546001384612925
0.25166038219260134
0.004626694433094737
0.9157656648214035
0.004998045614340392
0.8804456214856187
0.5339505729647921
0.6264291594459425
0.8819750100235726
0.5204763107323298
0.4895165125677539
0.7758343087677833
0.8480362610724406
0.8511260248418453
0.3525528145359298
0.5478420669641798
0.7037253765583034
0.1683612375235645
0.2829918247504794
0.0013081739692917796
0.22103973638141575
0.53119377618119
0.11162449973216595
0.6843441809371815
0.12785148162072457
0.018073687430781697
0.03508824562336239
0.03805305027849626
0.009789578113573394
0.018344358491814552
0.007607841694928216
 */