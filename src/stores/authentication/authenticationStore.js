import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(true)

  // Initialize the auth state
  const initialize = async () => {
    try {
      // Get initial session
      const {
        data: { session: initialSession },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      // Set initial state
      session.value = initialSession
      user.value = initialSession?.user ?? null
      loading.value = false

      // Debug log
      if (user.value) {
        console.log('Current user ID:', user.value.id)
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null
      })
    } catch (error) {
      console.error('Error initializing auth:', error.message)
      loading.value = false
    }
  }

  // Sign up a new user
  const signUp = async (email, password, profileData) => {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error

      // If sign up successful, create the profile and set user role
      if (data?.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            ...profileData,
          },
        ])
        if (profileError) throw profileError

        // Set default user role
        const { error: roleError } = await supabase.from('user_roles').insert([
          {
            user_id: data.user.id,
            role: 'user',
          },
        ])
        if (roleError) throw roleError
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error during sign up:', error)
      return { data: null, error }
    }
  }

  // Sign in a user
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign out the current user
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Get the current user
  const getCurrentUser = () => user.value

  // Get the current session
  const getSession = () => session.value

  // Check if the current user has admin role
  const hasAdminRole = async () => {
    if (!user.value) return false

    try {
      // First check if the user_roles table exists and has our user
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.value.id)
        .eq('role', 'admin')
        .maybeSingle()

      if (error) {
        console.error('Error checking admin role:', error)
        return false
      }

      return !!data // Return true if we found a matching admin role
    } catch (error) {
      console.error('Error checking admin role:', error)
      return false
    }
  }

  return {
    user,
    session,
    loading,
    initialize,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    getSession,
    hasAdminRole,
  }
})
