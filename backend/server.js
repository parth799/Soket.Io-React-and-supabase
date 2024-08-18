import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

const supabaseUrl = 'https://zqnwwqdempjogmvjrxyu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxbnd3cWRlbXBqb2dtdmpyeHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyMjUyODQsImV4cCI6MjAzODgwMTI4NH0.-sae6dPYJmqXp_Hy4WHevnfso3-pny4IfkzMdiHJ8ZE';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);

  socket.on('joinRoom', ({ userId, recipientId }) => {
    if (!userId || !recipientId) {
      console.error('joinRoom: userId or recipientId is missing');
      return;
    }
    const room = userId === recipientId ? `self_${userId}` : [userId, recipientId].sort().join('_');
    socket.join(room);
    // console.log(`User ${userId} joined room ${recipientId}`);
  });

  socket.on('sendMessage', async (messageData) => {
    const { senderId, recipientId, message } = messageData;
    // console.log('Sending message:', senderId, recipientId, message);
    if (!senderId || !recipientId) {
      console.error('sendMessage: senderId or recipientId is missing');
      return;
    }
    // console.log("sendMessage event received:", senderId, recipientId, message);

    const { error } = await supabase
      .from('groupchats')
      .insert([{ sender_id: senderId, recipient_id: recipientId, message }]);
          
    if (error) {
      console.error('Error adding new message:', error);
      return;
    }

    const { data, err } = await supabase
    .from('groupchats')
    .select('*')
    .or(`and(sender_id.eq.${senderId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${senderId})`)
    .order('created_at', { ascending: true });
    // console.log('Message inserted into DB:', data);

    if (err) {
      console.error('Error retraiwing new message:', error);
      return;
    }
    const room = senderId === recipientId ? `self_${senderId}` : [senderId, recipientId].sort().join('_');
    io.to(room).emit('receiveMessage', data[data.length -1]);
    // console.log(`Message sent from ${senderId} to ${recipientId}: ${message}`);
  });


  socket.on('getMessages', async ({ senderId, recipientId }) => {
    if (!senderId || !recipientId) {
      console.error('getMessages: senderId or recipientId is missing');
      return;
    }
    // console.log(`Fetching messages between ${senderId} and ${recipientId}`);
    const { data, error } = await supabase
      .from('groupchats')
      .select('*')
      .or(`and(sender_id.eq.${senderId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${senderId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error retrieving messages:', error);
      return;
    }
    // console.log('Messages fetched:', data);
    
    socket.emit('messages', data);
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('serve in on 3000');
});
