import Express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
import mongoose from "mongoose";
import helmet from "helmet";
import session from "express-session";
import path from "path";
import dotenv from "dotenv";
import connectMongoDBSession from "connect-mongodb-session";
const MongoDBStore = connectMongoDBSession(session);
import userRouter from './routes/userRoute.js';
import vendorRouter from './routes/vendorRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import operatorRouter from './routes/operatorRoute.js';
import { fileURLToPath } from "url";
import WebSocket, { WebSocketServer } from 'ws';  // Import WebSocket and WebSocketServer
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' assert { type: 'json' };






dotenv.config()
const app = Express()


const clients = new Map();

// WebSocket server setup
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws, req) => {
  const userId = req.url.split('=')[1]; 
  console.log("Connected to WebSocket");

  if (userId) {
    clients.set(userId, ws);
    console.log(`User ${userId} connected`);

    ws.on('message', (message) => {
      console.log(`Received message from user ${userId}: ${message}`);
    });

    ws.on('close', () => {
      clients.delete(userId);
      console.log(`User ${userId} disconnected`);
    });
  }
});

export const sendMessage = (userId, message) => {
  const client = clients.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
    console.log(`Sent message to user ${userId}:`, message);
  } else {
    console.log(`User ${userId} is not connected or WebSocket is not open`);
  }
};

// Example message


// const server = app.listen(process.env.PORT || 8000, async () => {
//   await connectDB();
//   console.log(`Server is running on port ${server.address().port}`);
// });




/* using cors for enabling cross-origin requests */
app.use(cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

//swagger api
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-PASSKEY, X-CLIENTID, Accept, Authorization, token, uat-token");
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else if (req.method == 'DELETE' || req.method == 'HEAD') {
        res.send(404);
    } else {
        next();
    }
});



const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("Error occurred during MongoDB connection:", error.message);
      process.exit(1); // Exit process with failure
    }
  };

let sess = {
    name: 'mpid', secret: 'jjkhMSJK32$@#sslkSessionMg@S8944iaskjd75161',
    resave: true, saveUninitialized: false, rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 12, httpOnly: true, ephemeral: true, secure: false, path: '/' },
  
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy 
    sess.cookie.secure = true // serve secure cookies 
    sess.proxy = true
}

app.use(session(sess)) //4 hr max age //secure: true

app.disable('x-powered-by')
app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));

app.use(function (req, res, next) {
    res.setHeader('charset', 'utf-8')
    res.setHeader('X-XSS-Protection', '1;mode=block');
    res.setHeader('Cache-Control', 'no-cache,no-store,max-age=0,must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    res.setHeader('X-FRAME-OPTIONS', 'SAMEORIGIN')
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');//enforce https
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader(
        'Content-Security-Policy',
        "font-src 'self' 'unsafe-inline' *.cloudflare.com *.cashfree.com fonts.googleapis.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.cloudflare.com fonts.googleapis.com; "
        // "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
    );
    req.session.touch();
    next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('trust proxy', true);
app.use(bodyParser({ limit: '50mb' }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Express.static(path.join(__dirname, 'public')));


app.use("/api/user", userRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/operator", operatorRouter);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });


  let startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT || 8000;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });
};

startServer();