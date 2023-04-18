require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const connection = require('./DB/db')
const socket = require('socket.io')

const userRoutes = require('./routes/UserRoutes/userRoutes')
const adminRoutes = require('./routes/AdminRoutes/adminRoutes')
const donorRoutes = require('./routes/UserRoutes/donorRoutes')
const receiverRoutes = require('./routes/UserRoutes/receiverRoutes')
const bloodRoutes = require('./routes/AdminRoutes/bloodRoutes')
const stripeRoutes = require('./routes/UserRoutes/stripeRoute')
const chatRoutes = require('./routes/UserRoutes/chatRouter');

const app = express();

//database connection
connection()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/user', userRoutes);
app.use('/admin', adminRoutes)
app.use('/donor', donorRoutes)
app.use('/receiver', receiverRoutes)
app.use('/blood', bloodRoutes)
app.use('/stripe', stripeRoutes)
app.use('/chat', chatRoutes)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const server = app.listen(5000, () =>
  console.log(`Server started on ${5000}`)
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
module.exports = app;
