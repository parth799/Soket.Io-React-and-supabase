/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from "../service/supabase";

const useAuth = () => {
  // Sign in function
  const signIn = async (email: string, password: string): Promise<any> => {
    try {
      console.log("Attempting sign in with:", email, password);

      const response = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (response.error) {
        console.error("Sign In Error:", response.error.message);
        throw response.error;
      }

      console.log("Sign In Successful:", response);
      return response;
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, username: string): Promise<any> => {
    try {
      console.log("Attempting sign up with:", email, password, username);

      const response = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (response.error) {
        console.error("Sign Up Error:", response.error.message);
        throw response.error;
      }

      const userId = response.data.user?.id;

      if (userId) {
        const { error } = await supabaseClient.from("user").insert({
          id: userId,
          username,
          email,
          created_at: new Date(),
        });

        if (error) {
          console.error("Error saving user details:", error.message);
          throw error;
        }
      }

      console.log("Sign Up Successful:", response);
      return response;
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  };

  // Retrieve the logged-in user's data
  const getLoginUser = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) {
        console.error("Session Error:", sessionError.message);
        throw sessionError;
      }

      // const session = sessionData.session;
      // if (!session) {
      //   console.error("No active session found");
      //   throw new Error("No active session found");
      // }

      const { data: userData, error: userError } = await supabaseClient.auth.getUser();

      if (userError) {
        console.error("Get User Error:", userError.message);
        throw userError;
      }

      const userId = userData.user?.id;

      if (!userId) {
        console.error("No User ID found in authentication response");
        return null;
      }

      const { data, error } = await supabaseClient
        .from("user")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error.message);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching single user:", error);
      throw error;
    }
  };

  // Retrieve all users' data
  const getAllUsers = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) {
        console.error("Session Error:", sessionError.message);
        throw sessionError;
      }

      const session = sessionData.session;
      if (!session) {
        console.error("No active session found");
        throw new Error("No active session found");
      }

      const { data, error } = await supabaseClient.from("user").select("*");

      if (error) {
        console.error("Error fetching user details:", error.message);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  };

  return {
    signUp,
    signIn,
    getLoginUser,
    getAllUsers,
  };
};

export default useAuth;
