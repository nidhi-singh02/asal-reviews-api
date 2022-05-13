'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

var invoke = async function (channelID, chaincode, functionName, functionArgs) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'rest-generate-user', 'connection-org1.json');

        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser1');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();

        await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelID);

        // Get the contract from the network.
        const contract = network.getContract(chaincode,);

        // Submit the specified transaction.
        let response;
        console.log("functionArgs", functionArgs)
  
        if (functionName == "CreateReview") {
            response = await contract.submitTransaction(functionName, functionArgs.reviewID, functionArgs.product, functionArgs.content, functionArgs.userID, functionArgs.serviceprovider,
                functionArgs.rating,functionArgs.createdBy, functionArgs.cts, functionArgs.uts);

        } else
            response = await contract.submitTransaction(functionName, functionArgs);

        console.log("response", response)
        console.log('Transaction has been submitted', response);

        // Disconnect from the gateway.
        await gateway.disconnect();

        return response 
        //.toString()

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error
    }
}

module.exports = {
    invoke: invoke

}