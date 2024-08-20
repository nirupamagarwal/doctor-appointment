import swaggerAutogen from 'swagger-autogen';

const swaggerAutogenInstance = swaggerAutogen();


//swagger api changes were done
const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'localhost:8000'
  };
  
  const outputFile = './swagger-output.json';
  const routes = ['./routes/userRoute.js', './routes/doctorRoute.js','./routes/operatorRoute.js',
    './routes/vendorRoute.js'];
  
  /* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
  root file where the route starts, such as index.js, app.js, routes.js, etc ... */
  
  swaggerAutogen(outputFile, routes, doc);
  