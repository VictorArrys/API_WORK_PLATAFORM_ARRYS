// Starter API
require('dotenv').config();
const app = require('./src/server');

app.listen(app.get('port'), () => {
    console.log(`Server running on ${require('./src/utils/serverUrl')(app)}`);
    console.log('Staring API server in port:', app.get('port'));
    console.log(` | Mode API --> ${process.env.NODE_ENV}`);
});