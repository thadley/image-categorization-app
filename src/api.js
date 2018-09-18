const { ApiMarketClient } = require('@apimarket/apimarket')
const config = require("./apimarket_config.json");

const run = async () => {
    try {
        //Config to apimarketClient and connect to ORE blockchain
        let apimarketClient = new ApiMarketClient(config);
        await apimarketClient.connect()

        //specify the api to call using it's unique name registered on the ORE blockchain
        const apiName = "cloud.hadron.imageRecognize"

        //call api - passing in the data it needs
        const params = {
            "imageurl":"https://storage.googleapis.com/partner-aikon.appspot.com/partner-hadron-transferLearning-v1-deepspace.jpg"
            }
        const response = await apimarketClient.fetch(apiName, params)
        console.log(JSON.stringify(response, null, 2))

    }
    catch(error) {
        console.error(error)
    }
}

run()
