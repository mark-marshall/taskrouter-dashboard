# TaskRouter Dashboard POC
This repo contains a skeleton React client that shows worker availability and queue time stats using the TaskRouter v1.x SDK. It assumes the availability of a backend service that returns capability tokens for accessing the workspace object (https://www.twilio.com/docs/taskrouter/js-sdk/workspace). An example serverless implementation ready to be deployed with Twilio Functions can be found here: https://github.com/mark-marshall/taskrouter-token-serverless.

![Image of Direct Message flow](https://images-8630.twil.io/Screenshot%202021-08-23%20at%2016.35.50.png)

## Instructions
1. Install dependencies
```
yarn install
```
2. Add the tokenUrl (for your token issuing service) and workerSid (for which the token will be issued against) in the getToken() function of App.js:

```
  const getToken = async () => {
    const tokenUrl = '';
    const workerSid = '';
    const resWS = await axios.post(tokenUrl, {
      workerSid,
    });
    const token = resWS.data;
    return token;
  };
```

3. Run the client. You should see stats refresh every 3 seconds (the poll rate can be defined in the startInterval() function).
```
yarn start
```
