import fs from 'fs'
import { parse } from 'csv-parse'
import brain from 'brain.js'


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
            date: row[0],open: row[1],high: row[2],low: row[3],close: row[4],adj: row[5],volume: row[6]
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


        const prediction = net.forecast(trainingData[0], 7).map(scaleUp)

        // console.log(prediction)
        console.dir(rawData,{'maxArrayLength':null})
    })

    const data = [

        {
            date: '02-07-2015',
            open: '31.6075',
            high: '31.672501',
            low: '31.442499',
            close: '31.610001',
            adj: '28.64146',
            volume: '108844000'
          },
          {
            date: '06-07-2015',
            open: '31.235001',
            high: '31.557501',
            low: '31.2125',
            close: '31.5',
            adj: '28.541788',
            volume: '112241600'
          },
          {
            date: '07-07-2015',
            open: '31.4725',
            high: '31.5375',
            low: '30.942499',
            close: '31.422501',
            adj: '28.471567',
            volume: '187787200'
          },
          {
            date: '08-07-2015',
            open: '31.120001',
            high: '31.16',
            low: '30.635',
            close: '30.6425',
            adj: '27.764818',
            volume: '243046400'
          },
          {
            date: '09-07-2015',
            open: '30.9625',
            high: '31.014999',
            low: '29.805',
            close: '30.0175',
            adj: '27.198515',
            volume: '314380000'
          },
          {
            date: '10-07-2015',
            open: '30.485001',
            high: '30.9625',
            low: '30.3025',
            close: '30.82',
            adj: '27.92565',
            volume: '245418000'
          },
          {
            date: '13-07-2015',
            open: '31.2575',
            high: '31.440001',
            low: '31.08',
            close: '31.415001',
            adj: '28.464771',
            volume: '165762000'
          },
          {
            date: '14-07-2015',
            open: '31.51',
            high: '31.592501',
            low: '31.26',
            close: '31.4025',
            adj: '28.453444',
            volume: '127072400'
          },
          {
            date: '15-07-2015',
            open: '31.43',
            high: '31.7875',
            low: '31.395',
            close: '31.705',
            adj: '28.72753',
            volume: '134596800'
          },
          {
            date: '16-07-2015',
            open: '31.934999',
            high: '32.142502',
            low: '31.8375',
            close: '32.127499',
            adj: '29.110357',
            volume: '144889600'
          },
          {
            date: '17-07-2015',
            open: '32.27',
            high: '32.404999',
            low: '32.077499',
            close: '32.404999',
            adj: '29.361801',
            volume: '184658800'
          },
          {
            date: '20-07-2015',
            open: '32.7425',
            high: '33.2425',
            low: '32.674999',
            close: '33.017502',
            adj: '29.916784',
            volume: '235600800'
          },
          {
            date: '21-07-2015',
            open: '33.212502',
            high: '33.23',
            low: '32.580002',
            close: '32.6875',
            adj: '29.617773',
            volume: '307025600'
          },
          {
            date: '22-07-2015',
            open: '30.497499',
            high: '31.375',
            low: '30.497499',
            close: '31.305',
            adj: '28.365103',
            volume: '461802400'
          },
          {
            date: '23-07-2015',
            open: '31.549999',
            high: '31.772499',
            low: '31.264999',
            close: '31.290001',
            adj: '28.351505',
            volume: '203998000'
          },
          {
            date: '24-07-2015',
            open: '31.33',
            high: '31.434999',
            low: '30.975',
            close: '31.125',
            adj: '28.202007',
            volume: '168649200'
          },
          {
            date: '27-07-2015',
            open: '30.772499',
            high: '30.9025',
            low: '30.530001',
            close: '30.692499',
            adj: '27.810118',
            volume: '177822000'
          },
          {
            date: '28-07-2015',
            open: '30.844999',
            high: '30.977501',
            low: '30.637501',
            close: '30.844999',
            adj: '27.948298',
            volume: '134472400'
          },
          {
            date: '29-07-2015',
            open: '30.7875',
            high: '30.875',
            low: '30.567499',
            close: '30.747499',
            adj: '27.859961',
            volume: '148046800'
          },
          {
            date: '30-07-2015',
            open: '30.58',
            high: '30.6425',
            low: '30.4275',
            close: '30.592501',
            adj: '27.719513',
            volume: '134513200'
          },
          {
            date: '31-07-2015',
            open: '30.65',
            high: '30.66',
            low: '30.227501',
            close: '30.325001',
            adj: '27.477139',
            volume: '171540000'
          },
          {
            date: '03-08-2015',
            open: '30.375',
            high: '30.6425',
            low: '29.379999',
            close: '29.610001',
            adj: '26.829281',
            volume: '279904000'
          },
          {
            date: '04-08-2015',
            open: '29.355',
            high: '29.424999',
            low: '28.3125',
            close: '28.66',
            adj: '25.968496',
            volume: '496554400'
          },
          {
            date: '05-08-2015',
            open: '28.237499',
            high: '29.360001',
            low: '28.025',
            close: '28.85',
            adj: '26.140656',
            volume: '397250400'
          },
          {
            date: '06-08-2015',
            open: '28.9925',
            high: '29.125',
            low: '28.530001',
            close: '28.782499',
            adj: '26.197538',
            volume: '211612000'
          },
          {
            date: '07-08-2015',
            open: '28.645',
            high: '29.0625',
            low: '28.625',
            close: '28.879999',
            adj: '26.286291',
            volume: '154681600'
          },
          {
            date: '10-08-2015',
            open: '29.1325',
            high: '29.997499',
            low: '29.1325',
            close: '29.93',
            adj: '27.241985',
            volume: '219806400'
          },
          {
            date: '11-08-2015',
            open: '29.452499',
            high: '29.545',
            low: '28.3325',
            close: '28.372499',
            adj: '25.824364',
            volume: '388331200'
          },
          {
            date: '12-08-2015',
            open: '28.1325',
            high: '28.855',
            low: '27.407499',
            close: '28.809999',
            adj: '26.222574',
            volume: '404870000'
          },
          {
            date: '13-08-2015',
            open: '29.01',
            high: '29.1',
            low: '28.635',
            close: '28.7875',
            adj: '26.202089',
            volume: '194143200'
          },
          {
            date: '14-08-2015',
            open: '28.58',
            high: '29.077499',
            low: '28.502501',
            close: '28.99',
            adj: '26.386406',
            volume: '171718000'
          },
          {
            date: '17-08-2015',
            open: '29.01',
            high: '29.4125',
            low: '28.875',
            close: '29.290001',
            adj: '26.659468',
            volume: '163538800'
          },
          {
            date: '18-08-2015',
            open: '29.1075',
            high: '29.360001',
            low: '29.002501',
            close: '29.125',
            adj: '26.509283',
            volume: '138242800'
          },
          {
            date: '19-08-2015',
            open: '29.025',
            high: '29.129999',
            low: '28.67',
            close: '28.752501',
            adj: '26.17024',
            volume: '193146000'
          },
          {
            date: '20-08-2015',
            open: '28.52',
            high: '28.5875',
            low: '27.907499',
            close: '28.1625',
            adj: '25.633221',
            volume: '274006400'
          },
          {
            date: '21-08-2015',
            open: '27.6075',
            high: '27.975',
            low: '26.4125',
            close: '26.440001',
            adj: '24.065426',
            volume: '513102000'
          },
          {
            date: '24-08-2015',
            open: '23.717501',
            high: '27.200001',
            low: '23',
            close: '25.780001',
            adj: '23.464701',
            volume: '648825200'
          },
          {
            date: '25-08-2015',
            open: '27.7775',
            high: '27.7775',
            low: '25.875',
            close: '25.934999',
            adj: '23.605774',
            volume: '414406400'
          },
          {
            date: '26-08-2015',
            open: '26.772499',
            high: '27.4725',
            low: '26.262501',
            close: '27.422501',
            adj: '24.959682',
            volume: '387098400'
          },
          {
            date: '27-08-2015',
            open: '28.057501',
            high: '28.309999',
            low: '27.504999',
            close: '28.23',
            adj: '25.694662',
            volume: '338464400'
          },
          {
            date: '28-08-2015',
            open: '28.0425',
            high: '28.327499',
            low: '27.885',
            close: '28.3225',
            adj: '25.778854',
            volume: '212657600'
          },
          {
            date: '31-08-2015',
            open: '28.0075',
            high: '28.6325',
            low: '28',
            close: '28.190001',
            adj: '25.658253',
            volume: '224917200'
          },
          {
            date: '01-09-2015',
            open: '27.5375',
            high: '27.969999',
            low: '26.84',
            close: '26.93',
            adj: '24.511414',
            volume: '307383600'
          },
          {
            date: '02-09-2015',
            open: '27.557501',
            high: '28.084999',
            low: '27.282499',
            close: '28.084999',
            adj: '25.562685',
            volume: '247555200'
          },
          {
            date: '03-09-2015',
            open: '28.122499',
            high: '28.195',
            low: '27.51',
            close: '27.592501',
            adj: '25.114418',
            volume: '212935600'
          },
          {
            date: '04-09-2015',
            open: '27.2425',
            high: '27.612499',
            low: '27.127501',
            close: '27.317499',
            adj: '24.864115',
            volume: '199985200'
          },
          {
            date: '08-09-2015',
            open: '27.9375',
            high: '28.139999',
            low: '27.58',
            close: '28.077499',
            adj: '25.555855',
            volume: '219374400'
          },
          {
            date: '09-09-2015',
            open: '28.440001',
            high: '28.504999',
            low: '27.442499',
            close: '27.5375',
            adj: '25.064358',
            volume: '340043200'
          },
          {
            date: '10-09-2015',
            open: '27.567499',
            high: '28.32',
            low: '27.475',
            close: '28.1425',
            adj: '25.615021',
            volume: '251571200'
          },
          {
            date: '11-09-2015',
            open: '27.9475',
            high: '28.5525',
            low: '27.940001',
            close: '28.5525',
            adj: '25.988195',
            volume: '199662000'
          },
          {
            date: '14-09-2015',
            open: '29.145',
            high: '29.2225',
            low: '28.715',
            close: '28.827499',
            adj: '26.238497',
            volume: '233453600'
          },
          {
            date: '15-09-2015',
            open: '28.9825',
            high: '29.1325',
            low: '28.605',
            close: '29.07',
            adj: '26.459225',
            volume: '173364800'
          },
          {
            date: '16-09-2015',
            open: '29.0625',
            high: '29.135',
            low: '28.860001',
            close: '29.102501',
            adj: '26.488804',
            volume: '148694000'
          },
          {
            date: '17-09-2015',
            open: '28.915001',
            high: '29.122499',
            low: '28.43',
            close: '28.48',
            adj: '25.922211',
            volume: '256450400'
          },
          {
            date: '18-09-2015',
            open: '28.0525',
            high: '28.575001',
            low: '27.967501',
            close: '28.362499',
            adj: '25.815258',
            volume: '297141200'
          },
          {
            date: '21-09-2015',
            open: '28.4175',
            high: '28.842501',
            low: '28.415001',
            close: '28.8025',
            adj: '26.215746',
            volume: '200888000'
          },
          {
            date: '22-09-2015',
            open: '28.344999',
            high: '28.545',
            low: '28.129999',
            close: '28.35',
            adj: '25.803885',
            volume: '201384800'
          },
          {
            date: '23-09-2015',
            open: '28.407499',
            high: '28.68',
            low: '28.325001',
            close: '28.58',
            adj: '26.013231',
            volume: '143026800'
          },
          {
            date: '24-09-2015',
            open: '28.3125',
            high: '28.875',
            low: '28.092501',
            close: '28.75',
            adj: '26.167959',
            volume: '200878000'
          },
          {
            date: '25-09-2015',
            open: '29.110001',
            high: '29.172501',
            low: '28.504999',
            close: '28.6775',
            adj: '26.101974',
            volume: '224607600'
          },
          {
            date: '28-09-2015',
            open: '28.4625',
            high: '28.6425',
            low: '28.110001',
            close: '28.110001',
            adj: '25.58544',
            volume: '208436000'
          },
          {
            date: '29-09-2015',
            open: '28.2075',
            high: '28.377501',
            low: '26.965',
            close: '27.264999',
            adj: '24.816328',
            volume: '293461600'
          },
          {
            date: '30-09-2015',
            open: '27.5425',
            high: '27.885',
            low: '27.182501',
            close: '27.575001',
            adj: '25.098488',
            volume: '265892000'
          },
          {
            date: '01-10-2015',
            open: '27.2675',
            high: '27.405001',
            low: '26.827499',
            close: '27.395',
            adj: '24.934645',
            volume: '255716400'
          },
          {
            date: '02-10-2015',
            open: '27.002501',
            high: '27.752501',
            low: '26.887501',
            close: '27.594999',
            adj: '25.116692',
            volume: '232079200'
          },
          {
            date: '05-10-2015',
            open: '27.469999',
            high: '27.842501',
            low: '27.2675',
            close: '27.695',
            adj: '25.207714',
            volume: '208258800'
          },
          {
            date: '06-10-2015',
            open: '27.657499',
            high: '27.934999',
            low: '27.442499',
            close: '27.827499',
            adj: '25.32831',
            volume: '192787200'
          },
          {
            date: '07-10-2015',
            open: '27.934999',
            high: '27.942499',
            low: '27.352501',
            close: '27.695',
            adj: '25.207714',
            volume: '187062400'
          },
          {
            date: '08-10-2015',
            open: '27.547501',
            high: '27.547501',
            low: '27.0525',
            close: '27.375',
            adj: '24.916447',
            volume: '247918400'
          },
          {
            date: '09-10-2015',
            open: '27.5',
            high: '28.07',
            low: '27.372499',
            close: '28.030001',
            adj: '25.512623',
            volume: '211064400'
          },
          {
            date: '12-10-2015',
            open: '28.182501',
            high: '28.1875',
            low: '27.860001',
            close: '27.9',
            adj: '25.394297',
            volume: '121868800'
          },
          {
            date: '13-10-2015',
            open: '27.705',
            high: '28.112499',
            low: '27.67',
            close: '27.9475',
            adj: '25.437532',
            volume: '132197200'
          },
          {
            date: '14-10-2015',
            open: '27.8225',
            high: '27.879999',
            low: '27.389999',
            close: '27.5525',
            adj: '25.078011',
            volume: '177849600'
          },
          {
            date: '15-10-2015',
            open: '27.7325',
            high: '28.025',
            low: '27.622499',
            close: '27.965',
            adj: '25.453461',
            volume: '150694000'
          },
          {
            date: '16-10-2015',
            open: '27.945',
            high: '28',
            low: '27.6325',
            close: '27.76',
            adj: '25.266869',
            volume: '156930400'
          },
          {
            date: '19-10-2015',
            open: '27.700001',
            high: '27.9375',
            low: '27.5275',
            close: '27.932501',
            adj: '25.423882',
            volume: '119036800'
          },
          {
            date: '20-10-2015',
            open: '27.834999',
            high: '28.5425',
            low: '27.705',
            close: '28.442499',
            adj: '25.888075',
            volume: '195871200'
          },
          {
            date: '21-10-2015',
            open: '28.5',
            high: '28.895',
            low: '28.424999',
            close: '28.440001',
            adj: '25.885801',
            volume: '167180800'
          },
          {
            date: '22-10-2015',
            open: '28.5825',
            high: '28.875',
            low: '28.525',
            close: '28.875',
            adj: '26.281734',
            volume: '166616400'
          },
          {
            date: '23-10-2015',
            open: '29.174999',
            high: '29.807501',
            low: '29.0825',
            close: '29.77',
            adj: '27.096355',
            volume: '237467600'
          },
          {
            date: '26-10-2015',
            open: '29.52',
            high: '29.532499',
            low: '28.73',
            close: '28.82',
            adj: '26.231676',
            volume: '265335200'
          },
          {
            date: '27-10-2015',
            open: '28.85',
            high: '29.135',
            low: '28.497499',
            close: '28.637501',
            adj: '26.065569',
            volume: '279537600'
          },
          {
            date: '28-10-2015',
            open: '29.2325',
            high: '29.825001',
            low: '29.014999',
            close: '29.817499',
            adj: '27.139587',
            volume: '342205600'
          },
          {
            date: '29-10-2015',
            open: '29.674999',
            high: '30.172501',
            low: '29.567499',
            close: '30.1325',
            adj: '27.4263',
            volume: '204909200'
          },
          {
            date: '30-10-2015',
            open: '30.247499',
            high: '30.305',
            low: '29.862499',
            close: '29.875',
            adj: '27.191923',
            volume: '197461200'
          },
          {
            date: '02-11-2015',
            open: '30.200001',
            high: '30.34',
            low: '29.9025',
            close: '30.295',
            adj: '27.574203',
            volume: '128813200'
          },
          {
            date: '03-11-2015',
            open: '30.1975',
            high: '30.872499',
            low: '30.174999',
            close: '30.6425',
            adj: '27.890493',
            volume: '182076000'
          },
          {
            date: '04-11-2015',
            open: '30.782499',
            high: '30.955',
            low: '30.405001',
            close: '30.5',
            adj: '27.760796',
            volume: '179544400'
          },
          {
            date: '05-11-2015',
            open: '30.4625',
            high: '30.672501',
            low: '30.045',
            close: '30.23',
            adj: '27.632816',
            volume: '158210800'
          },
          {
            date: '06-11-2015',
            open: '30.2775',
            high: '30.452499',
            low: '30.155001',
            close: '30.264999',
            adj: '27.664818',
            volume: '132169200'
          },
          {
            date: '09-11-2015',
            open: '30.24',
            high: '30.452499',
            low: '30.012501',
            close: '30.1425',
            adj: '27.552839',
            volume: '135485600'
          },
          {
            date: '10-11-2015',
            open: '29.225',
            high: '29.5175',
            low: '29.014999',
            close: '29.192499',
            adj: '26.68445',
            volume: '236511600'
          },
          {
            date: '11-11-2015',
            open: '29.092501',
            high: '29.355',
            low: '28.8025',
            close: '29.0275',
            adj: '26.533628',
            volume: '180872000'
          },
          {
            date: '12-11-2015',
            open: '29.065001',
            high: '29.205',
            low: '28.9125',
            close: '28.93',
            adj: '26.444506',
            volume: '130102400'
          },
          {
            date: '13-11-2015',
            open: '28.799999',
            high: '28.8925',
            low: '28.067499',
            close: '28.084999',
            adj: '25.672106',
            volume: '183249600'
          },
          {
            date: '16-11-2015',
            open: '27.844999',
            high: '28.559999',
            low: '27.75',
            close: '28.545',
            adj: '26.092587',
            volume: '152426800'
          },
          {
            date: '17-11-2015',
            open: '28.73',
            high: '28.762501',
            low: '28.33',
            close: '28.422501',
            adj: '25.98061',
            volume: '110467600'
          },
          {
            date: '18-11-2015',
            open: '28.940001',
            high: '29.372499',
            low: '28.875',
            close: '29.3225',
            adj: '26.803286',
            volume: '186698800'
          },
          {
            date: '19-11-2015',
            open: '29.41',
            high: '29.9375',
            low: '29.190001',
            close: '29.695',
            adj: '27.143784',
            volume: '173183200'
          },
          {
            date: '20-11-2015',
            open: '29.799999',
            high: '29.98',
            low: '29.7125',
            close: '29.825001',
            adj: '27.262615',
            volume: '137148400'
          },
          {
            date: '23-11-2015',
            open: '29.817499',
            high: '29.932501',
            low: '29.334999',
            close: '29.4375',
            adj: '26.908407',
            volume: '129930000'
          },
          {
            date: '24-11-2015',
            open: '29.3325',
            high: '29.8375',
            low: '29.280001',
            close: '29.719999',
            adj: '27.166637',
            volume: '171212800'
          },
          {
            date: '25-11-2015',
            open: '29.8025',
            high: '29.807501',
            low: '29.48',
            close: '29.5075',
            adj: '26.972399',
            volume: '85553200'
          },
          {
            date: '27-11-2015',
            open: '29.5725',
            high: '29.602501',
            low: '29.4',
            close: '29.452499',
            adj: '26.922119',
            volume: '52185600'
          },
          {
            date: '30-11-2015',
            open: '29.497499',
            high: '29.852501',
            low: '29.4375',
            close: '29.575001',
            adj: '27.034094',
            volume: '156721200'
          },
          {
            date: '01-12-2015',
            open: '29.6875',
            high: '29.702499',
            low: '29.215',
            close: '29.334999',
            adj: '26.814714',
            volume: '139409600'
          },
          {
            date: '02-12-2015',
            open: '29.334999',
            high: '29.5275',
            low: '29.02',
            close: '29.07',
            adj: '26.572481',
            volume: '133546400'
          },
          {
            date: '03-12-2015',
            open: '29.137501',
            high: '29.1975',
            low: '28.555',
            close: '28.799999',
            adj: '26.325678',
            volume: '166278000'
          },
          {
            date: '04-12-2015',
            open: '28.8225',
            high: '29.8125',
            low: '28.7775',
            close: '29.7575',
            adj: '27.200911',
            volume: '231108000'
          },
          {
            date: '07-12-2015',
            open: '29.745001',
            high: '29.965',
            low: '29.452499',
            close: '29.57',
            adj: '27.02952',
            volume: '128336800'
          },
          {
            date: '08-12-2015',
            open: '29.379999',
            high: '29.65',
            low: '29.215',
            close: '29.557501',
            adj: '27.018099',
            volume: '137238000'
          },
          {
            date: '09-12-2015',
            open: '29.41',
            high: '29.422501',
            low: '28.77',
            close: '28.905001',
            adj: '26.421658',
            volume: '185445600'
          },
          {
            date: '10-12-2015',
            open: '29.01',
            high: '29.235001',
            low: '28.877501',
            close: '29.0425',
            adj: '26.54734',
            volume: '116850800'
          },
          {
            date: '11-12-2015',
            open: '28.797501',
            high: '28.8475',
            low: '28.2125',
            close: '28.295',
            adj: '25.864061',
            volume: '187544800'
          },
          {
            date: '14-12-2015',
            open: '28.045',
            high: '28.17',
            low: '27.4475',
            close: '28.120001',
            adj: '25.7041',
            volume: '257274800'
          },
          {
            date: '15-12-2015',
            open: '27.985001',
            high: '28.200001',
            low: '27.5875',
            close: '27.622499',
            adj: '25.24934',
            volume: '213292400'
          }
        ]


        // console.log(data.length)