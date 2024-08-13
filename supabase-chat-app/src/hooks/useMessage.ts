// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import { supabaseClient } from "../service/supabase";

// export type MESSAGE = {
//   id: string;
//   message: string;
//   sender_id: string;
//   recipient_id: string;
//   created_at: string;
// };

// const useMessage = (userId: string, recipientId: string) => {
//   const [messages, setMessages] = useState<MESSAGE[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const channel = supabaseClient
//       .channel('public:groupchats')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'groupchats',
//           filter: `sender_id=eq.${userId},recipient_id=eq.${recipientId}`,
//         },
//         handleInsert
//       )
//       .subscribe();

//     return () => {
//       channel.unsubscribe();
//     };
//   }, [userId, recipientId]);

//   useEffect(() => {
//     setLoading(true);
//     supabaseClient
//       .from("groupchats")
//       .select()
//       .or(`and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`)
//       .order("created_at", { ascending: true }) // Fetch all messages in ascending order
//       .then((data) => {
//         setLoading(false);
//         if (!data.error && data.data) {
//           setMessages(data.data);
//         }
//       });
//   }, [userId, recipientId]);

//   const handleInsert = (payload: { new: MESSAGE }) => {
//     const newMessage = payload.new;
//     if (
//       (newMessage.sender_id === userId && newMessage.recipient_id === recipientId) ||
//       (newMessage.sender_id === recipientId && newMessage.recipient_id === userId)
//     ) {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     }
//   };

//   const addNewMessage = async (senderId: string, recipientId: string, message: any) => {
//     const { data, error } = await supabaseClient
//       .from("groupchats")
//       .insert([{ sender_id: senderId, recipient_id: recipientId, message }]);

//     if (error) {
//       console.error("Error adding new message:", error);
//     }
  
//     return { data, error };
//   };

//   const getMessage = async (senderId: string, recipientId: string) => {
//     const { data, error } = await supabaseClient
//       .from('groupchats')
//       .select('*')
//       .or(`and(sender_id.eq.${senderId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${senderId})`)
//       .order('created_at', { ascending: true });

//     if (error) throw new Error(error.message);
//     return data;
//   };

//   return {
//     loading,
//     messages,
//     addNewMessage,
//     getMessage,
//   };
// };

// export default useMessage;
