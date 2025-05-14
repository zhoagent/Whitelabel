```
<implementation_plan>
{{# Implementation Plan

## Project Setup & Foundational Verification

- **Step 0.1[X:COMPLETED]: Verify & Update Core Dependencies**
    
    - **Task**: Ensure all specified core dependencies are present in package.json and at the correct versions (React Native 0.79, Expo 53, Expo Router ~5.0, NativeWind v4, Supabase JS v2, Zustand v4, TanStack Query v5, react-native-purchases v7). Add react-native-url-polyfill. Verify "type": "module" is set. Ensure babel-plugin-react-compiler is present.
        
    - **Files**:
        
        - package.json: "Update/verify versions for expo, react-native, expo-router, nativewind, @supabase/supabase-js, zustand, @tanstack/react-query, react-native-purchases. Add react-native-url-polyfill. Verify babel-plugin-react-compiler."
            
    - **Step Dependencies**: None
        
    - **User Instructions**: "Run pnpm install after modifying package.json." "Review app.json to ensure experiments.reactCompiler is true."
        
- **Step 0.2: Refine Folder Structure & Relocate Files**
    
    - **Task**: Implement the target folder structure. Move existing i18n files and UI primitives to their new locations. Create new placeholder directories.
        
    - **Files**:
        
        - src/i18n/getLocale.tsx -> src/lib/i18n/getLocale.tsx
            
        - src/setup.tsx (fbtee setup) -> src/lib/i18n/setup.tsx
            
        - translations/ja_JP.json -> src/locales/ja_JP.json
            
        - src/ui/BottomSheetModal.tsx -> src/components/core/BottomSheetModal.tsx (or src/components/ui/BottomSheetModal.tsx)
            
        - src/ui/Text.tsx -> src/components/core/Text.tsx (or src/components/ui/Text.tsx)
            
        - src/ui/colors.ts -> src/styles/theme.ts
            
        - src/lib/cx.tsx: Keep or replace with NativeWind's clsx or similar if preferred. For now, keep and update imports.
            
        - Create: src/assets/fonts/, src/assets/icons/, src/components/layout/, src/components/specific/, src/constants/, src/features/, src/hooks/queries/, src/lib/polyfills.ts, src/navigation/ (if complex types needed), src/services/, src/store/, src/types/
            
        - Update imports in: src/app/(app)/(tabs)/_layout.tsx, src/app/(app)/(tabs)/index.tsx, src/app/(app)/_layout.tsx, src/app/_layout.tsx, src/app/login.tsx, src/app/+not-found.tsx, src/lib/i18n/setup.tsx (for ja_JP.json path), tailwind.config.ts (for colors.ts path).
            
    - **Step Dependencies**: 0.1
        
    - **User Instructions**: "Manually move files and create directories as listed. Update all import paths in affected files. This will cause temporary errors until paths are fixed." "Delete old src/ui/, src/i18n/, translations/ directories after moving content."
        
- **Step 0.3: Implement Polyfills & Early Imports**
    
    - **Task**: Create src/lib/polyfills.ts and import react-native-url-polyfill/auto. Import this polyfill file at the very beginning of src/app/_layout.tsx.
        
    - **Files**:
        
        - src/lib/polyfills.ts: "Add import 'react-native-url-polyfill/auto';"
            
        - src/app/_layout.tsx: "Add import '@/lib/polyfills'; as the first import (after global.css and src/lib/i18n/setup.tsx if those are there)."
            
    - **Step Dependencies**: 0.1, 0.2
        
    - **User Instructions**: "Ensure the polyfill import is executed before any Supabase client initialization or usage."
        
- **Step 0.4: Environment Variable Setup & Type-Safe Access**
    
    - **Task**: Create .env.example with placeholders for EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY. Create a type definition for environment variables and a small utility to access them type-safely, ensuring they are loaded.
        
    - **Files**:
        
        - .env.example: "Add EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here\nEXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here"
            
        - .gitignore: "Ensure .env is listed." (Already present as .env.local)
            
        - src/types/env.d.ts (or similar, ensure it's picked up by TS):
            
            ```
            declare namespace NodeJS {
              interface ProcessEnv {
                EXPO_PUBLIC_SUPABASE_URL: string;
                EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
                EXPO_PUBLIC_REVENUECAT_APPLE_KEY?: string; // Optional for now
                EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY?: string; // Optional for now
              }
            }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/lib/env.ts (or src/config/env.ts):
            
            ```
            // Basic example, can be more robust with validation (e.g. Zod)
            const getEnvVariable = (key: keyof NodeJS.ProcessEnv): string => {
              const value = process.env[key];
              if (!value) {
                throw new Error(`Environment variable ${key} is not set.`);
              }
              return value;
            };
            
            export const SUPABASE_URL = getEnvVariable('EXPO_PUBLIC_SUPABASE_URL');
            export const SUPABASE_ANON_KEY = getEnvVariable('EXPO_PUBLIC_SUPABASE_ANON_KEY');
            // Add others as they come
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
    - **Step Dependencies**: 0.2
        
    - **User Instructions**: "Create a .env file locally by copying .env.example and fill in your actual Supabase dev project credentials. These are public, so EXPO_PUBLIC_ prefix is correct. For EAS Build, these will be set as secrets."
        

## Supabase Integration & TanStack Query

- **Step 1.1: Supabase Client Initialization**
    
    - **Task**: Create the Supabase client instance in src/lib/supabaseClient.ts using environment variables and AsyncStorage for session persistence. Generate initial Supabase types.
        
    - **Files**:
        
        - src/lib/supabaseClient.ts: "Implement Supabase client creation as per spec section 6.1, using SUPABASE_URL and SUPABASE_ANON_KEY from src/lib/env.ts. Import Database from @/types/supabase (will be created next)."
            
        - src/types/supabase.ts: "Placeholder file initially."
            
    - **Step Dependencies**: 0.3, 0.4
        
    - **User Instructions**:
        
        - "Install Supabase CLI: pnpm global add supabase (or brew install supabase/tap/supabase)."
            
        - "Log in to Supabase CLI: supabase login."
            
        - "Initialize Supabase locally: supabase init (creates supabase/ folder)."
            
        - "Link to your remote Supabase project: supabase link --project-ref <your-project-ref>."
            
        - "Generate types: supabase gen types typescript --project-id <your-project-ref> --schema public > src/types/supabase.ts. Commit src/types/supabase.ts."
            
        - "If you don't have a Supabase project, create one at supabase.com."
            
- **Step 1.2: TanStack Query Client Setup**
    
    - **Task**: Create and configure the TanStack Query QueryClient. Wrap the root application with QueryClientProvider.
        
    - **Files**:
        
        - src/lib/queryClient.ts: "Implement queryClient instance as per spec section 5.2.1."
            
        - src/app/_layout.tsx: "Import QueryClientProvider and queryClient. Wrap the main Slot or View with <QueryClientProvider client={queryClient}>."
            
    - **Step Dependencies**: 0.2
        
    - **User Instructions**: "Ensure QueryClientProvider is high enough in the component tree to cover all screens needing data fetching."
        
- **Step 1.3: Basic Supabase Table & RLS (Profiles Table)**
    
    - **Task**: Create a profiles table migration in Supabase with basic RLS policies for user self-management.
        
    - **Files**:
        
        - supabase/migrations/YYYYMMDDHHMMSS_create_profiles_table.sql:
            
            ```
            CREATE TABLE public.profiles (
                id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                username TEXT UNIQUE,
                avatar_url TEXT,
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                -- Add other profile fields as needed, e.g., full_name
                full_name TEXT
            );
            
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Users can view their own profile."
                ON public.profiles FOR SELECT
                USING (auth.uid() = id);
            
            CREATE POLICY "Users can insert their own profile."
                ON public.profiles FOR INSERT
                WITH CHECK (auth.uid() = id);
            
            CREATE POLICY "Users can update their own profile."
                ON public.profiles FOR UPDATE
                USING (auth.uid() = id);
            
            -- Optional: Allow public read for username and avatar, adjust columns as needed
            -- CREATE POLICY "Public can read usernames and avatars."
            --     ON public.profiles FOR SELECT
            --     USING (true); -- Be careful with this, restrict columns in queries if used.
            
            -- Function to auto-create profile on new user signup
            CREATE OR REPLACE FUNCTION public.handle_new_user()
            RETURNS TRIGGER AS $$
            BEGIN
              INSERT INTO public.profiles (id, username) -- Add more default fields if necessary
              VALUES (new.id, new.email); -- Or generate a unique username
              RETURN new;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
            
            -- Trigger to call the function on new user creation
            CREATE TRIGGER on_auth_user_created
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).SQL
            
    - **Step Dependencies**: 1.1
        
    - **User Instructions**:
        
        - "Run supabase db push (for local dev) or apply migrations to your hosted Supabase instance."
            
        - "After migration, re-run supabase gen types typescript --project-id <your-project-ref> --schema public > src/types/supabase.ts to update types."
            

## Authentication (Supabase Auth & Zustand)

- **Step 2.1: Zustand authStore Setup**
    
    - **Task**: Create the authStore using Zustand to manage user session, authentication status, and essential user profile data. This will start replacing useViewerContext.
        
    - **Files**:
        
        - src/store/authStore.ts: "Implement useAuthStore as per spec section 5.1.1 (initial version: user, session, isLoading, setUserAndSession, clearAuth, setLoading)."
            
    - **Step Dependencies**: 1.1
        
    - **User Instructions**: "This store will be populated by Supabase auth events."
        
- **Step 2.2: Supabase Auth State Listener & Router Integration**
    
    - **Task**: Implement the Supabase onAuthStateChange listener in src/app/_layout.tsx (or a dedicated AuthProvider component). This listener will update authStore and handle initial redirects based on auth state. Refactor the auth guard in src/app/(app)/_layout.tsx to use authStore.
        
    - **Files**:
        
        - src/app/_layout.tsx: "Add AuthStateSyncer component as outlined in spec section 9.2, which uses supabase.auth.onAuthStateChange and supabase.auth.getSession to update useAuthStore. Call setUserAndSession from the store."
            
        - src/app/(app)/_layout.tsx: "Modify the auth guard. Instead of useViewerContext, import useAuthStore. Check session and isLoading from authStore to decide whether to render app content or redirect to /login (or /(auth)/login)."
            
        - src/user/useViewerContext.tsx: "Remove auth-related state (viewerContext, setViewerContext, user, isAuthenticated, login, logout stubs) and their direct usage in consuming components for now. Keep locale logic temporarily."
            
    - **Step Dependencies**: 0.2, 1.1, 2.1
        
    - **User Instructions**: "The app should now react to Supabase auth state changes. Test by manually signing up/in via Supabase Studio and see if redirects work (login screen won't be functional yet for user input)."
        
- **Step 2.3: Basic Email/Password Sign-Up Screen & Logic**
    
    - **Task**: Create a functional Sign-Up screen using Supabase Auth for email/password. Create authService.ts.
        
    - **Files**:
        
        - src/app/(auth)/signup.tsx: (New file or adapt if a placeholder exists)
            
            ```
            // src/app/(auth)/signup.tsx
            import { useState } from 'react';
            import { View, Alert } from 'react-native';
            import { useRouter } from 'expo-router';
            import { Button } from '@/components/core/Button'; // Assuming Button exists
            import { Input } from '@/components/core/Input'; // Assuming Input exists
            import { Text } from '@/components/core/Text'; // Assuming Text exists
            import { useAuthStore } from '@/store/authStore';
            import { signUpWithEmail } from '@/services/authService'; // To be created
            import { fbt } from 'fbtee';
            
            export default function SignUpScreen() {
              const [email, setEmail] = useState('');
              const [password, setPassword] = useState('');
              const router = useRouter();
              const { setLoading, user } = useAuthStore(); // Use user to redirect if already logged in
            
              if (user) router.replace('/(app)/'); // Or your main app screen
            
              const handleSignUp = async () => {
                setLoading(true);
                const { error } = await signUpWithEmail({ email, password });
                setLoading(false);
                if (error) {
                  Alert.alert(String(fbt("Sign Up Error", "Sign up error title")), error.message);
                } else {
                  Alert.alert(String(fbt("Sign Up Success", "Sign up success title")), String(fbt("Please check your email to verify your account.", "Sign up success message")));
                  // router.replace('/(auth)/login'); // Or to a "check email" screen
                }
              };
            
              return (
                <View className="flex-1 justify-center p-4 gap-4">
                  <Text className="text-2xl font-bold text-center mb-4"><fbt desc="Sign up screen title">Create Account</fbt></Text>
                  <Input placeholder={String(fbt("Email", "Email placeholder"))} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                  <Input placeholder={String(fbt("Password", "Password placeholder"))} value={password} onChangeText={setPassword} secureTextEntry />
                  <Button title={String(fbt("Sign Up", "Sign up button text"))} onPress={handleSignUp} />
                  <Button title={String(fbt("Already have an account? Log In", "Login redirect button"))} onPress={() => router.push('/(auth)/login')} variant="ghost" />
                </View>
              );
            }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/app/(auth)/_layout.tsx: (New file)
            
            ```
            // src/app/(auth)/_layout.tsx
            import { Stack, useRouter, useSegments } from 'expo-router';
            import { useAuthStore } from '@/store/authStore';
            import { useEffect } from 'react';
            
            export default function AuthLayout() {
              const { session } = useAuthStore();
              const router = useRouter();
              const segments = useSegments();
            
              useEffect(() => {
                if (session && segments[0] === '(auth)') {
                  router.replace('/(app)/'); // Redirect if user is logged in and tries to access auth pages
                }
              }, [session, segments, router]);
            
              return <Stack screenOptions={{ headerShown: false }} />;
            }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/services/authService.ts:
            
            ```
            import { supabase } from '@/lib/supabaseClient';
            import { SignUpWithPasswordCredentials, SignInWithPasswordCredentials, AuthError } from '@supabase/supabase-js';
            
            export const signUpWithEmail = async (credentials: SignUpWithPasswordCredentials) => {
              const { data, error } = await supabase.auth.signUp(credentials);
              return { user: data.user, session: data.session, error };
            };
            // Add signInWithEmail, signOut etc. later
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/components/core/Input.tsx (Basic placeholder):
            
            ```
            import { TextInput, TextInputProps, View } from 'react-native';
            import { styled } from 'nativewind';
            import { Text } from './Text';
            
            const StyledTextInput = styled(TextInput);
            
            export interface InputProps extends TextInputProps {
              label?: string;
              error?: string;
              // className prop is implicitly available for the container
              inputClassName?: string; // For the TextInput itself
            }
            
            export const Input = ({ label, error, className, inputClassName, ...props }: InputProps) => {
              return (
                <View className={`mb-4 ${className || ''}`}>
                  {label && <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>}
                  <StyledTextInput
                    className={`border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700 text-black dark:text-white ${error ? 'border-red-500' : ''} ${inputClassName || ''}`}
                    placeholderTextColor="grey"
                    {...props}
                  />
                  {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
                </View>
              );
            };
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/components/core/Button.tsx (Basic placeholder, similar to spec section 7.2 but simplified for now):
            
            ```
            import { Pressable, PressableProps } from 'react-native';
            import { Text } from './Text';
            import { styled } from 'nativewind';
            
            const StyledPressable = styled(Pressable);
            
            interface ButtonProps extends PressableProps {
              title: string;
              variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
              // className for Pressable, textClassName for Text
              textClassName?: string;
            }
            export const Button = ({ title, className, textClassName, variant = 'primary', ...props }: ButtonProps) => {
              // Basic styling, can be expanded
              const baseStyle = "py-3 px-5 rounded-lg items-center justify-center";
              const variantStyles = {
                primary: "bg-purple-600", // Use actual theme colors later
                secondary: "bg-pink-500",
                ghost: "",
                outline: "border border-purple-600",
              };
              const textVariantStyles = {
                primary: "text-white font-semibold",
                secondary: "text-white font-semibold",
                ghost: "text-purple-600 font-semibold",
                outline: "text-purple-600 font-semibold",
              };
              return (
                <StyledPressable className={`${baseStyle} ${variantStyles[variant]} ${props.disabled ? 'opacity-50' : ''} ${className || ''}`} {...props}>
                  <Text className={`${textVariantStyles[variant]} ${textClassName || ''}`}>{title}</Text>
                </StyledPressable>
              );
            };
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
    - **Step Dependencies**: 1.1, 2.1, 2.2
        
    - **User Instructions**: "You'll need basic Input and Button components. Create placeholders if they don't exist. Enable Email/Password Auth provider in your Supabase project settings (Authentication -> Providers). Turn off 'Confirm email' for easier testing initially, or handle the email confirmation flow."
        
- **Step 2.4: Email/Password Login Screen & Logic**
    
    - **Task**: Adapt existing src/app/login.tsx to use Supabase Auth for email/password login and authStore. Rename it to src/app/(auth)/login.tsx.
        
    - **Files**:
        
        - src/app/login.tsx -> src/app/(auth)/login.tsx (rename and modify)
            
            ```
            // src/app/(auth)/login.tsx
            import { useState } from 'react';
            import { View, Alert } from 'react-native';
            import { useRouter } from 'expo-router';
            import { Button } from '@/components/core/Button';
            import { Input } from '@/components/core/Input';
            import { Text } from '@/components/core/Text';
            import { useAuthStore } from '@/store/authStore';
            import { signInWithEmail } from '@/services/authService'; // To be added
            import { fbt } from 'fbtee';
            
            export default function LoginScreen() {
              const [email, setEmail] = useState('');
              const [password, setPassword] = useState('');
              const router = useRouter();
              const { setLoading, user } = useAuthStore();
            
              if (user) router.replace('/(app)/');
            
              const handleLogin = async () => {
                setLoading(true);
                const { error } = await signInWithEmail({ email, password });
                setLoading(false);
                if (error) {
                  Alert.alert(String(fbt("Login Error", "Login error title")), error.message);
                } else {
                  // Auth listener in _layout.tsx should handle redirect via store update
                  // router.replace('/(app)/');
                }
              };
            
              return (
                <View className="flex-1 justify-center p-4 gap-4">
                  <Text className="text-2xl font-bold text-center mb-4"><fbt desc="Login screen title">Log In</fbt></Text>
                  <Input placeholder={String(fbt("Email", "Email placeholder"))} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                  <Input placeholder={String(fbt("Password", "Password placeholder"))} value={password} onChangeText={setPassword} secureTextEntry />
                  <Button title={String(fbt("Log In", "Log in button text"))} onPress={handleLogin} />
                  <Button title={String(fbt("Need an account? Sign Up", "Sign up redirect button"))} onPress={() => router.push('/(auth)/signup')} variant="ghost" />
                  {/* Add Forgot Password link later */}
                </View>
              );
            }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/services/authService.ts: "Add signInWithEmail function:"
            
            ```
            // ... (keep signUpWithEmail)
            export const signInWithEmail = async (credentials: SignInWithPasswordCredentials) => {
              const { data, error } = await supabase.auth.signInWithPassword(credentials);
              return { user: data.user, session: data.session, error };
            };
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
    - **Step Dependencies**: 2.2, 2.3 (for components)
        
    - **User Instructions**: "Test login with a user created in the previous step (ensure email is confirmed if enabled in Supabase)."
        
- **Step 2.5: Logout Functionality**
    
    - **Task**: Implement logout in authService.ts and call it from authStore and a UI element. Refactor src/app/(app)/(tabs)/two.tsx to use this.
        
    - **Files**:
        
        - src/services/authService.ts: "Add signOut function:"
            
            ```
            // ... (keep other functions)
            export const signOut = async () => {
              const { error } = await supabase.auth.signOut();
              return { error };
            };
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/store/authStore.ts: "Add performSignOut action:"
            
            ```
            // ... (in AuthState interface)
            // performSignOut: () => Promise<void>;
            
            // ... (in create<AuthState>((set, get) => ({ ...
            // performSignOut: async () => {
            //   get().setLoading(true);
            //   const { error } = await signOut(); // from authService
            //   get().setLoading(false);
            //   if (error) {
            //     console.error("Sign out error", error);
            //     // Optionally set an error state in the store
            //   }
            //   // onAuthStateChange will handle clearing user/session and redirect
            // },
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
            Correction from spec thinking: onAuthStateChange handles state update, so direct store update might not be needed from performSignOut beyond loading state.  
            The action should be simpler:
            
            ```
            // ... (in AuthState interface)
            // signOutAction: () => Promise<AuthError | null>;
            
            // ... (in create<AuthState>((set, get) => ({ ...
            // signOutAction: async () => {
            //   set({ isLoading: true });
            //   const { error } = await signOutService(); // renamed from authService.signOut
            //   // onAuthStateChange listener will automatically update session and user to null
            //   // and trigger redirects. setLoading(false) will also happen in onAuthStateChange handler.
            //   // If error, it should be handled/displayed.
            //   if(error) set({ isLoading: false }); // only if error, else let onAuthStateChange handle it.
            //   return error;
            // },
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
            Let's use the initial clearAuth and rely on onAuthStateChange:
            
            ```
            // In authStore.ts
            // Add to interface:
            //   logout: () => Promise<void>;
            // Add to store implementation:
            //   logout: async () => {
            //     set({ isLoading: true });
            //     await signOut(); // from authService
            //     // No need to call clearAuth here, onAuthStateChange will do it.
            //     // If signOut has an error, onAuthStateChange might not fire SIGNED_OUT. Handle error.
            //     // For now, assume it works or error is handled in UI.
            //     // setLoading(false) should ideally be in onAuthStateChange or after potential error.
            //   },
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/app/(app)/(tabs)/two.tsx: "Refactor to use useAuthStore's logout action."
            
            ```
            import { View, Alert } from 'react-native';
            import { Button } from '@/components/core/Button'; // Assuming Button exists
            import { useAuthStore } from '@/store/authStore';
            import { fbt } from 'fbtee';
            
            export default function TwoScreen() { // Renamed from Two
              const { logout: performLogout, isLoading } = useAuthStore(state => ({ logout: state.logout, isLoading: state.isLoading })); // Assuming logout action exists in store
            
              const handleLogout = async () => {
                // Example error handling, can be improved
                // const error = await performLogout();
                // if (error) {
                //   Alert.alert(String(fbt("Logout Error", "Logout error title")), error.message);
                // }
                if (performLogout) await performLogout(); // Call the action from the store
              };
            
              return (
                <View className="flex-1 items-center justify-center p-4">
                  <Button title={String(fbt("Log Out", "Logout button text"))} onPress={handleLogout} disabled={isLoading} />
                </View>
              );
            }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - Update src/store/authStore.ts logout action logic:
            
            ```
            // In authStore.ts
            // interface AuthState { ... logout: () => Promise<void>; }
            // create<AuthState>((set) => ({
            //  ...
            //  logout: async () => {
            //    set({ isLoading: true });
            //    const { error } = await signOut(); // from @/services/authService
            //    if (error) {
            //      console.error('Logout failed:', error.message);
            //      Alert.alert('Logout Failed', error.message); // Simple alert for now
            //      set({ isLoading: false });
            //    }
            //    // onAuthStateChange will handle setting user/session to null and redirecting
            //    // isLoading will be set to false by onAuthStateChange when session is null
            //  },
            // }));
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
    - **Step Dependencies**: 2.1, 2.2 (for authService.signOut)
        
    - **User Instructions**: "Test logout. User should be redirected to the login screen."
        
- **Step 2.6: Secure Store for Supabase Session**
    
    - **Task**: Explicitly configure expo-secure-store for Supabase if not default or if more control is needed (Supabase JS client uses AsyncStorage by default, which is generally fine for refresh tokens on mobile). For this template, we'll rely on Supabase's default AsyncStorage usage as it's secure enough for non-exportable refresh tokens on mobile. However, we will ensure expo-secure-store is installed for other potential uses.
        
    - **Files**:
        
        - package.json: "Ensure expo-secure-store is listed as a dependency (already requested in project description)."
            
        - app.json: "Ensure expo-secure-store plugin is added if it has one (usually not needed for basic usage)."
            
    - **Step Dependencies**: 0.1
        
    - **User Instructions**: "expo-secure-store is available for storing other sensitive client-side data if needed. Supabase's default AsyncStorage for tokens is acceptable for this template's scope on mobile."
        

## NativeWind Styling & Core UI Components

- **Step 3.1: Enhance Theme Configuration (tailwind.config.ts & theme.ts)**
    
    - **Task**: Expand src/styles/theme.ts with more semantic colors (primary, secondary, accent, background, text, error, warning, success) and integrate them fully into tailwind.config.ts using CSS variables for dynamic theming (light/dark).
        
    - **Files**:
        
        - src/styles/theme.ts (formerly src/ui/colors.ts): "Define a more comprehensive color palette as per spec section 7.1 (e.g., primary, secondary, background, text as CSS variable placeholders like var(--color-background))."
            
        - tailwind.config.ts: "Update the plugin to define light and dark mode CSS variables for background and text. Map semantic color names in theme.colors to these CSS variables. Refer to spec section 7.1 and 7.2 (Theming) for CSS variable setup."
            
            ```
            // tailwind.config.ts (snippet for plugin)
            // ...
            plugins: [
              ({ addBase }) => {
                const lightVars = {
                  '--color-background': appColors.neutral[100], // Example: light grey
                  '--color-text': appColors.neutral[900],      // Example: dark text
                  '--color-primary': appColors.primary,
                  // ... other semantic vars for light
                };
                const darkVars = {
                  '--color-background': appColors.neutral[900], // Example: dark grey
                  '--color-text': appColors.neutral[100],      // Example: light text
                  '--color-primary': appColors.primary, // Could also have dark variant: appColors.primaryDark
                  // ... other semantic vars for dark
                };
                addBase({
                  ':root': lightVars,
                  '.dark': darkVars, // This class will be toggled on the root view
                });
              },
            ],
            theme: {
              extend: { // Or replace `colors` if not extending Tailwind's default
                colors: {
                  ...themeColors, // themeColors from spec 7.1, mapping to var(--color-...)
                  background: 'var(--color-background)',
                  text: 'var(--color-text)',
                  primary: 'var(--color-primary)',
                  // ... other semantic colors mapped to CSS variables
                },
                fontFamily: { // Example from spec
                  sans: ['Inter-Regular', 'sans-serif'],
                  heading: ['Inter-Bold', 'sans-serif'],
                },
              },
            },
            // ...
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).JavaScript
            
        - global.css: Ensure it sets a base text color if not handled by Text.tsx default. E.g. body { @apply text-text; } (if targeting web also, or a root view style). For NativeWind, this is typically handled by components.
            
    - **Step Dependencies**: 0.2
        
    - **User Instructions**: "Define your primary color palette in src/styles/theme.ts. Ensure custom fonts (e.g., Inter) are added to src/assets/fonts/ and loaded via expo-font in src/app/_layout.tsx if not already. Update tailwind.config.ts fontFamily."
        

- **Step 3.3: Refine Core UI Components (Text, Button, Input)**
    
    - **Task**: Enhance Text.tsx, Button.tsx, Input.tsx in src/components/core/ to be fully NativeWind-styled, themeable (respecting light/dark mode automatically via CSS vars), and accept variants.
        
    - **Files**:
        
        - src/components/core/Text.tsx: "Update to use styled(RNText, 'text-text') as a base and allow variants as per spec section 7.2."
            
        - src/components/core/Button.tsx: "Implement robust variants (primary, secondary, outline, ghost) using theme colors. Ensure disabled and loading states are styled. Refer to spec section 7.2."
            
        - src/components/core/Input.tsx: "Ensure styling adapts to theme (background, text, border colors). Add error state styling. Refer to spec section 2.3 (signup form) for an idea of structure."
            
    - **Step Dependencies**: 2.3 (initial Button/Input), 3.1, 3.2
        
    - **User Instructions**: "Replace any direct react-native Text/TextInput/Button usage with these custom components throughout existing screens like login/signup to test theming."
        
- **Step 3.4: Create Icon.tsx Component with react-native-svg**
    
    - **Task**: Develop a reusable Icon component that renders SVGs imported as React components, allowing them to be styled (color, size) via props and NativeWind classes.
        
    - **Files**:
        
        - src/components/core/Icon.tsx: "Implement as per spec section 7.1 (Iconography), including type for icon names. Add a couple of placeholder SVGs in src/assets/icons/ (e.g., home.svg, settings.svg)."
            
        - app-env.d.ts: "Verify SVG module declaration is present (it is in existing code)."
            
        - metro.config.cjs: "Verify SVG transformer setup (it is in existing code)."
            
        - src/assets/icons/home.svg (Example): <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            
        - src/assets/icons/settings.svg (Example): <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2 3.46c.13-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
            
    - **Step Dependencies**: 3.1
        
    - **User Instructions**: "Test the Icon component by using it in a screen. Ensure currentColor prop in SVGs allows NativeWind text color utilities to work."
        
- **Step 3.5: Implement Custom Tab Bar with NativeWind & SVG Icons**
    
    - **Task**: Replace the default Expo Router tab bar with a custom component styled with NativeWind and using the new Icon.tsx component.
        
    - **Files**:
        
        - src/components/layout/CustomTabBar.tsx: "Implement as per spec section 8.3 (Custom Tab Bar). Define tab routes, labels, and corresponding icon names from your Icon.tsx."
            
        - src/app/(app)/(tabs)/_layout.tsx: "Import CustomTabBar and pass it to the tabBar prop of <Tabs>. Remove AntDesign icon usage and hardcoded colors. Use Icon component and NativeWind classes for active/inactive states."
            
    - **Step Dependencies**: 3.4, (Expo Router setup is existing)
        
    - **User Instructions**: "Ensure tab navigation still works and the custom tab bar is styled correctly according to the current theme (light/dark)."
        

## Monetization Core (RevenueCat & Supabase)

- **Step 4.1: Install react-native-purchases & Basic SDK Configuration**
    
    - **Task**: Add react-native-purchases to the project and initialize it with placeholder API keys. Set up environment variables for RevenueCat keys.
        
    - **Files**:
        
        - package.json: "Ensure react-native-purchases is added (already requested)."
            
        - src/lib/env.ts: "Add REVENUECAT_APPLE_KEY and REVENUECAT_GOOGLE_KEY (initially optional, can be empty strings)."
            
        - .env.example: "Add EXPO_PUBLIC_REVENUECAT_APPLE_KEY= and EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY=."
            
        - src/lib/revenueCat.ts: "Create this file. Implement initRevenueCat function as per spec section 11.3. Call Purchases.configure(). Add basic getOfferings, purchasePackage, restorePurchases stubs."
            
        - src/app/_layout.tsx: "Import and call initRevenueCat() once, e.g., within a useEffect."
            
    - **Step Dependencies**: 0.1, 0.4
        
    - **User Instructions**: "Run pnpm install. Create RevenueCat API keys (Apple & Google) in your RevenueCat dashboard and add them to your local .env file and as EAS Secrets (EXPO_PUBLIC_REVENUECAT_APPLE_KEY, EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY)."
        
- **Step 4.2: Supabase Edge Function for RevenueCat Webhook**
    
    - **Task**: Create the Supabase Edge Function (revenuecat-webhook) to handle incoming webhooks from RevenueCat for server-side receipt validation and entitlement updates. Create a subscriptions table.
        
    - **Files**:
        
        - supabase/functions/revenuecat-webhook/index.ts: "Implement the Edge Function logic as per spec section 11.5. Include signature verification, parsing, Supabase admin client, and basic logic to update a subscriptions table or user metadata. Use Zod for payload validation (optional for first pass)."
            
        - supabase/migrations/YYYYMMDDHHMMSS_create_subscriptions_table.sql:
            
            ```
            CREATE TABLE public.subscriptions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                revenuecat_customer_id TEXT, -- Store RevenueCat's app_user_id if different or their internal ID
                product_id TEXT NOT NULL, -- RevenueCat product identifier
                entitlement_id TEXT, -- RevenueCat entitlement identifier
                status TEXT NOT NULL, -- e.g., 'active', 'trialing', 'expired', 'cancelled'
                current_period_start TIMESTAMPTZ,
                current_period_end TIMESTAMPTZ,
                cancel_at_period_end BOOLEAN DEFAULT FALSE,
                cancelled_at TIMESTAMPTZ,
                trial_start TIMESTAMPTZ,
                trial_end TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
            ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
            -- RLS: Users can view their own subscriptions. Admins/service role can manage.
            CREATE POLICY "Users can view their own subscriptions"
                ON public.subscriptions FOR SELECT
                USING (auth.uid() = user_id);
            -- Allow service_role (used by Edge Function) to manage all subscriptions
            -- This is implicitly handled by using service_role key in the Edge Function.
            -- For direct RLS using roles (if you set custom claims for admins):
            -- CREATE POLICY "Admins can manage all subscriptions"
            --     ON public.subscriptions FOR ALL
            --     USING (is_claims_admin()); -- Assuming is_claims_admin() checks JWT role
            
            -- Create a unique index to prevent duplicate active subscriptions for the same product by a user
            CREATE UNIQUE INDEX unique_active_subscription_per_user_product ON public.subscriptions (user_id, product_id) WHERE status IN ('active', 'trialing');
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).SQL
            
        - supabase/config.toml (ensure Edge Function runtime vars are considered):
            
            ```
            [functions.revenuecat-webhook]
            env_vars = ["REVENUECAT_WEBHOOK_SECRET", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_URL"] # These need to be set in project settings
            verify_jwt = false # Webhook is verified by signature, not JWT
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).Toml
            
    - **Step Dependencies**: 1.1, 4.1
        
    - **User Instructions**:
        
        - "Run supabase db push to apply the migration."
            
        - "Set REVENUECAT_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_URL as environment variables in your Supabase project's Edge Function settings (Dashboard -> Edge Functions -> your-function -> Settings -> Add new secret)."
            
        - "Deploy the function: supabase functions deploy revenuecat-webhook --no-verify-jwt."
            
        - "Get the function URL and configure it in your RevenueCat dashboard (Project Settings -> Webhooks)."
            
        - "Test the webhook using RevenueCat's test event feature or by making a sandbox purchase."
            
- **Step 4.3: Fetching & Displaying Offerings (Basic Paywall Screen)**
    
    - **Task**: Create a basic paywall screen that fetches offerings using react-native-purchases and TanStack Query.
        
    - **Files**:
        
        - src/features/monetization/screens/PaywallScreen.tsx (New file):
            
            ```
            import { View, ActivityIndicator, Alert } from 'react-native';
            import { Text } from '@/components/core/Text';
            import { Button } from '@/components/core/Button';
            import { useQuery } from '@tanstack/react-query';
            import { getOfferings, purchasePackage } from '@/lib/revenueCat'; // Assuming purchasePackage is updated
            import { PurchasesOffering, PurchasesPackage, PurchasesStoreProduct } from 'react-native-purchases';
            import { fbt } from 'fbtee';
            import { useAuthStore } from '@/store/authStore';
            import Purchases from 'react-native-purchases'; // For logIn
            
            export default function PaywallScreen() {
              const { user } = useAuthStore();
              const { data: offerings, isLoading, error } = useQuery({
                queryKey: ['revenueCatOfferings'],
                queryFn: async () => {
                  const offeringsData = await Purchases.getOfferings();
                  if (offeringsData.current && offeringsData.current.availablePackages.length > 0) {
                      return offeringsData.current; // Return the whole current offering
                  }
                  return null;
                }
              });
            
              const handlePurchase = async (pkg: PurchasesPackage) => {
                if (!user) {
                  Alert.alert(String(fbt("Error", "Error title")), String(fbt("You must be logged in to make a purchase.", "Login required for purchase message")));
                  return;
                }
                try {
                  await Purchases.logIn(user.id); // Associate purchase with Supabase user ID
                  const { customerInfo } = await Purchases.purchasePackage(pkg);
                  // Check customerInfo for active entitlements
                  if (customerInfo.entitlements.active['your_premium_entitlement_id']) { // Replace with actual ID
                    Alert.alert(String(fbt("Success!", "Success title")), String(fbt("Purchase successful! Premium features unlocked.", "Purchase success message")));
                    // Potentially update Zustand store or re-fetch user profile to reflect new status
                    // The webhook is the source of truth for DB updates.
                  }
                } catch (e: any) {
                  if (!e.userCancelled) {
                    Alert.alert(String(fbt("Purchase Error", "Purchase error title")), e.message);
                  }
                }
              };
            
              if (isLoading) return <ActivityIndicator className="flex-1 justify-center items-center" />;
              if (error) return <Text><fbt desc="Error loading offers">Error loading offers:</fbt> {error.message}</Text>;
              if (!offerings || offerings.availablePackages.length === 0) return <Text><fbt desc="No products message">No products available at the moment.</fbt></Text>;
            
              return (
                <View className="flex-1 p-4 items-center">
                  <Text className="text-2xl font-bold mb-6"><fbt desc="Paywall title">Unlock Premium</fbt></Text>
                  {offerings.availablePackages.map((pkg) => (
                    <Button
                      key={pkg.identifier}
                      title={`${pkg.product.title} - ${pkg.product.priceString}`}
                      onPress={() => handlePurchase(pkg)}
                      className="mb-4 w-full"
                    />
                  ))}
                  <Button title={String(fbt("Restore Purchases", "Restore purchases button"))} onPress={async () => await Purchases.restorePurchases()} variant="outline" className="mt-4 w-full"/>
                </View>
              );
            }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/app/(app)/premium.tsx (Route to access the paywall):
            
            ```
            import PaywallScreen from '@/features/monetization/screens/PaywallScreen';
            export default PaywallScreen;
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/lib/revenueCat.ts: "Update purchasePackage to potentially take PurchasesPackage."
            
    - **Step Dependencies**: 1.2, 4.1, 2.1 (for user ID)
        
    - **User Instructions**:
        
        - "Define products and an offering in your RevenueCat dashboard."
            
        - "Define an entitlement (e.g., your_premium_entitlement_id) in RevenueCat and associate it with your products."
            
        - "Test fetching offerings and displaying them. Sandbox purchase flow can be tested if configured."
            
        - "Make sure to log in the RevenueCat SDK with the Supabase user.id using Purchases.logIn(userId) before making a purchase, and Purchases.logOut() on user sign out. This ID will be event.app_user_id in webhooks."
            
- **Step 4.4: Linking Entitlements to Supabase User Roles/Metadata & Zustand**
    
    - **Task**: Modify authStore to include premium status. The revenuecat-webhook Edge Function should update a field in profiles table (e.g., is_premium: boolean or active_entitlements: TEXT[]) or auth.users.app_metadata. Fetch this status via a TanStack Query hook for the user profile.
        
    - **Files**:
        
        - supabase/functions/revenuecat-webhook/index.ts: "Enhance to update profiles.is_premium = true or profiles.active_entitlements array when a relevant entitlement is active, and false/remove when it expires/cancels. Or update auth.users app_metadata using supabaseAdmin.auth.admin.updateUserById()."
            
        - src/types/supabase.ts: "If adding is_premium to profiles table, add it to the type definition after regenerating types (or manually if simple)."
            
        - supabase/migrations/YYYYMMDDHHMMSS_add_premium_to_profiles.sql (if not using app_metadata):
            
            ```
            ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
            ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_entitlements TEXT[]; -- Alternative to is_premium
            -- RLS policies on other tables can now check profiles.is_premium
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).SQL
            
        - src/store/authStore.ts: "Add isPremium: boolean (or entitlements: string[]) to state. Add action setPremiumStatus(status: boolean)."
            
        - src/hooks/queries/useUserProfile.ts (New or adapt if a basic one exists):
            
            ```
            import { useQuery, useQueryClient } from '@tanstack/react-query';
            import { supabase } from '@/lib/supabaseClient';
            import { useAuthStore } from '@/store/authStore';
            import { PostgrestError } from '@supabase/supabase-js';
            import { Profile } from '@/types/supabase'; // Assuming Profile type from generated types
            
            export const USER_PROFILE_QUERY_KEY = (userId?: string) => ['userProfile', userId];
            
            const fetchUserProfile = async (userId: string) => {
              const { data, error } = await supabase
                .from('profiles')
                .select('*, user_roles(role)') // Example if you have a user_roles table
                .eq('id', userId)
                .single();
              if (error) throw error;
              return data as Profile; // Cast to your specific Profile type from supabase.ts
            };
            
            export const useUserProfile = ()      => {
              const userId = useAuthStore((state) => state.user?.id);
              const setPremiumStatus = useAuthStore((state) => state.setPremiumStatus); // Assuming this action exists
              const queryClient = useQueryClient();
            
              return useQuery<Profile, PostgrestError, Profile, ReturnType<typeof USER_PROFILE_QUERY_KEY>>({
                queryKey: USER_PROFILE_QUERY_KEY(userId),
                queryFn: () => {
                  if (!userId) throw new Error('User not authenticated');
                  return fetchUserProfile(userId);
                },
                enabled: !!userId,
                onSuccess: (data) => {
                  // Update Zustand store with premium status from profile
                  // This depends on how you store premium status (e.g., data.is_premium, data.user_roles)
                  // Example: setPremiumStatus(data.is_premium || false);
                  // Or check data.active_entitlements
                },
              });
            };
            
            // Hook to get current premium status easily
            export const useIsPremium = () => {
              return useAuthStore((state) => state.isPremium);
            }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/app/(app)/_layout.tsx (or where AuthStateSyncer is): "When user signs in or session is refreshed, invalidate userProfile query to get latest entitlements."
            
            ```
            // Inside onAuthStateChange or getSession success:
            // if (currentSession) {
            //   queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY(currentSession.user.id) });
            // }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
    - **Step Dependencies**: 1.3, 2.1, 4.2, 4.3
        
    - **User Instructions**:
        
        - "Apply the migration for profiles table if you added new columns. Regenerate Supabase types."
            
        - "Update your Edge Function to correctly set is_premium or active_entitlements."
            
        - "Test the full flow: Purchase -> Webhook -> Supabase DB update -> App re-fetches profile -> Zustand store reflects premium status -> UI conditionally renders premium features (to be built next)."
            
        - "To update auth.users.app_metadata from Edge Function, use supabase.auth.admin.updateUserById(userId, { app_metadata: { ...new_metadata } }). This requires SERVICE_ROLE_KEY."
            

## Core Features & UI Polish

- **Step 5.1: Settings Screen Module (src/features/settings)**
    
    - **Task**: Create a basic settings screen allowing theme switching and logout. This will use settingsStore and authStore.
        
    - **Files**:
        
        - src/features/settings/screens/SettingsScreen.tsx:
            
            ```
            import { View } from 'react-native';
            import { Text } from '@/components/core/Text';
            import { Button } from '@/components/core/Button';
            import { useSettingsStore } from '@/store/settingsStore';
            import { useAuthStore } from '@/store/authStore';
            import { fbt } from 'fbtee';
            import { useRouter } // For navigating to legal pages, etc.
            
            export default function SettingsScreen() {
              const { theme, setTheme } = useSettingsStore();
              const { logout: performLogout } = useAuthStore(); // Assuming logout action in authStore
              // const router = useRouter();
            
              const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
                setTheme(newTheme);
              };
            
              return (
                <View className="flex-1 p-4 gap-y-4">
                  <Text className="text-xl font-bold"><fbt desc="Settings screen title">Settings</fbt></Text>
            
                  <View>
                    <Text className="mb-2 font-semibold"><fbt desc="Theme settings title">Theme</fbt></Text>
                    <Button title={String(fbt("Light", "Light theme button"))} onPress={() => handleThemeChange('light')} variant={theme === 'light' ? 'primary' : 'outline'} className="mb-2"/>
                    <Button title={String(fbt("Dark", "Dark theme button"))} onPress={() => handleThemeChange('dark')} variant={theme === 'dark' ? 'primary' : 'outline'} className="mb-2"/>
                    <Button title={String(fbt("System", "System theme button"))} onPress={() => handleThemeChange('system')} variant={theme === 'system' ? 'primary' : 'outline'}/>
                  </View>
            
                  {/* Add Language Picker later using fbtee's getLocales and setClientLocale */}
                  {/* Add Legal Links (Privacy Policy, ToS) later */}
            
                  <Button title={String(fbt("Log Out", "Logout button on settings page"))} onPress={async () => await performLogout()} variant="secondary" className="mt-auto"/>
                </View>
              );
            }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/app/(app)/settings.tsx (Route file):
            
            ```
            import SettingsScreen from '@/features/settings/screens/SettingsScreen';
            export default SettingsScreen;
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/app/(app)/(tabs)/_layout.tsx: "Add 'Settings' tab if desired, or access it from another part of the UI (e.g. profile screen or header icon)."  
            Example: (If adding to tabs)
            
            ```
            // In src/app/(app)/(tabs)/_layout.tsx's Tabs.Screen list for 'two':
            // name="settings" options={{ title: String(fbs('Settings', 'Settings tab title')), tabBarIcon: ({ focused }) => <Icon name="settings" ... /> }} />
            // Ensure 'settings.tsx' exists at src/app/(app)/(tabs)/settings.tsx or adjust name/path for where SettingsScreen is routed.
            // For this plan, we assume a separate stack screen, not a tab.
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
            The current src/app/(app)/(tabs)/two.tsx can be the placeholder for the settings screen.  
            Rename src/app/(app)/(tabs)/two.tsx to src/app/(app)/(tabs)/settings.tsx and update its content to be the SettingsScreen above.  
            Update src/app/(app)/(tabs)/_layout.tsx's Tabs.Screen name from "two" to "settings" and update title/icon.
            
    - **Step Dependencies**: 2.5 (logout), 3.2 (theme switching), 3.5 (for tab icon if made a tab)
        
    - **User Instructions**: "Navigate to the settings screen and test theme switching and logout."
        
- **Step 5.2: User Profile Module (src/features/user-profile)**
    
    - **Task**: Create a screen to display user profile information (fetched via useUserProfile hook) and an option to edit (stub for now).
        
    - **Files**:
        
        - src/features/user-profile/screens/UserProfileScreen.tsx:
            
            ```
            import { View, ActivityIndicator, Alert } from 'react-native';
            import { Text } from '@/components/core/Text';
            import { Button } from '@/components/core/Button';
            import { useUserProfile, useIsPremium } from '@/hooks/queries/useUserProfile'; // Or from a dedicated user profile hook file
            import { fbt } from 'fbtee';
            import { Avatar } from '@/components/core/Avatar'; // To be created
            
            export default function UserProfileScreen() {
              const { data: profile, isLoading, error } = useUserProfile();
              const isPremium = useIsPremium(); // Get premium status from Zustand via hook
            
              if (isLoading) return <ActivityIndicator className="flex-1 justify-center items-center" />;
              if (error) {
                Alert.alert(String(fbt("Error", "Error title")), String(fbt("Could not load profile.", "Profile loading error message")));
                return <Text><fbt desc="Error loading profile">Error loading profile.</fbt></Text>;
              }
              if (!profile) return <Text><fbt desc="Profile not found">Profile not found.</fbt></Text>;
            
              return (
                <View className="flex-1 p-4 items-center gap-y-3">
                  {/* <Avatar source={{ uri: profile.avatar_url }} fallbackText={profile.username?.charAt(0).toUpperCase()} className="w-24 h-24 rounded-full mb-4" /> */}
                  <Text className="text-2xl font-bold">{profile.username || profile.full_name || 'User'}</Text>
                  <Text className="text-gray-600 dark:text-gray-400">{profile.id}</Text> {/* Usually user.email from authStore is shown */}
                  {isPremium && <Text className="text-lg font-semibold text-purple-600 dark:text-purple-400"><fbt desc="Premium user badge">⭐ Premium User ⭐</fbt></Text>}
                  <Button title={String(fbt("Edit Profile", "Edit profile button"))} onPress={() => { /* Navigate to edit screen */ }} className="mt-4" />
                  {/* Link to paywall if not premium */}
                  {!isPremium && <Button title={String(fbt("Go Premium!", "Go premium button"))} onPress={() => { /* Navigate to paywall */ }} variant="primary" className="mt-2"/>}
                </View>
              );
            }
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/components/core/Avatar.tsx (Basic placeholder):
            
            ```
            import { View, Image, ImageSourcePropType } from 'react-native';
            import { Text } from './Text';
            import { styled } from 'nativewind';
            
            const StyledView = styled(View);
            const StyledImage = styled(Image);
            
            interface AvatarProps {
              source?: ImageSourcePropType; // Allow undefined for fallback
              fallbackText?: string;
              size?: number; // e.g., 40 for default
              className?: string; // For the container
            }
            export const Avatar = ({ source, fallbackText, size = 40, className }: AvatarProps) => {
              const containerSizeStyle = `w-${size/4} h-${size/4}`; // Tailwind JIT might need actual pixel values or pre-defined sizes e.g. w-10 h-10
                                                               // For dynamic size, inline style might be better for width/height
              const textFontSize = `text-${size / 8}xl`; // Crude mapping, adjust
              return (
                <StyledView
                  className={`rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center overflow-hidden ${className || ''}`}
                  style={{ width: size, height: size }} // Use inline style for dynamic size
                >
                  {source && source.uri ? (
                    <StyledImage source={source} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <Text className={`font-bold text-white ${textFontSize}`}>{fallbackText?.substring(0,1).toUpperCase() || 'U'}</Text>
                  )}
                </StyledView>
              );
            };
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/app/(app)/profile/index.tsx (Route file):
            
            ```
            import UserProfileScreen from '@/features/user-profile/screens/UserProfileScreen';
            export default UserProfileScreen;
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - Update src/app/(app)/_layout.tsx Stack to include this route, potentially as a modal or regular screen.
            
            ```
            // Inside AppLayout Stack in src/app/(app)/_layout.tsx
            // <Stack.Screen name="profile/index" options={{ title: 'Profile' }} />
            // or as a modal
            // <Stack.Screen name="profile/index" options={{ presentation: 'modal', title: 'Profile' }} />
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
    - **Step Dependencies**: 1.3 (profiles table), 4.4 (useUserProfile hook, isPremium status), 3.3 (Button)
        
    - **User Instructions**: "Users can now view their basic profile. Avatar component is very basic; image uploads and storage integration will come later if needed."
        
- **Step 5.3: Internationalization with fbtee - Locale Switching UI**
    
    - **Task**: Add locale switching UI to the Settings screen, using fbtee's capabilities and persisting choice in settingsStore. Refactor useViewerContext to remove locale logic.
        
    - **Files**:
        
        - src/store/settingsStore.ts: "Add locale: string and setLocale: (locale: string) => void to state and actions. Persist it."
            
        - src/lib/i18n/getLocale.tsx: "Modify getLocale to read from settingsStore as the primary source if set, otherwise fallback to device/default. Modify setClientLocale to also update settingsStore." (This needs careful thought to avoid circular dependencies if settingsStore imports from getLocale for initial state).  
            Alternative: settingsStore initializes locale from getLocale(). setLocale action in settingsStore calls fbtee's setClientLocale and then updates its own state.
            
            ```
            // src/store/settingsStore.ts - conceptual update for locale
            // import getLocaleFb, { setClientLocale as setFbTeeLocale, /* ... other fbtee helpers ... */ } from '@/lib/i18n/getLocale';
            // ...
            // locale: getLocaleFb(), // Initialize from fbtee's current detection
            // setLocale: (newLocale) => {
            //   setFbTeeLocale(newLocale, async (localeToLoad) => { /* your existing loadLocale logic from setup.tsx */ });
            //   set({ locale: newLocale });
            // },
            ```
            
            content_copydownload
            
            Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript
            
        - src/lib/i18n/setup.tsx: "Ensure getLocale hook for fbtee reads from the (now potentially settingsStore-backed) getLocale()."
            
        - src/features/settings/screens/SettingsScreen.tsx: "Add a picker or buttons to select available languages (e.g., 'en_US', 'ja_JP'). On change, call setLocale from settingsStore."
            
        - src/user/useViewerContext.tsx: "Remove locale and setLocale state and logic. This context will be deprecated soon."
            
        - src/app/(app)/_layout.tsx: "Remove key={locale} from <Fragment> as locale changes will trigger re-renders through Zustand state propagation."
            
    - **Step Dependencies**: 3.2 (settingsStore), 5.1 (SettingsScreen base) (fbtee is existing)
        
    - **User Instructions**: "Test switching locales. The UI should re-render with translated strings from src/locales/."
        

## Testing & Build Preparations

- **Step 6.1: Enhance Vitest Setup & Write Basic Unit Tests**
    
    - **Task**: Configure Vitest for mocking (e.g., Supabase client, AsyncStorage). Write unit tests for a core component (e.g., Button.tsx) and a Zustand store (e.g., settingsStore).
        
    - **Files**:
        
        - vitest.config.js: "Review and ensure it's adequate. Add setup file via setupFiles option if needed for global mocks."
            
        - src/tests/setup.ts (New, if using setupFiles): "Basic mocks for AsyncStorage, expo-secure-store. jest.mock('@react-native-async-storage/async-storage');"
            
        - src/components/core/__tests__/Button.test.tsx: "Write tests for rendering, press events, variants as per spec section 14.1."
            
        - src/store/__tests__/settingsStore.test.tsx: "Test actions and state changes for settingsStore (theme, locale)."
            
        - src/tests/App.test.tsx: "Remove or update this placeholder."
            
    - **Step Dependencies**: 3.3, 3.2
        
    - **User Instructions**: "Run pnpm test to execute tests. Install @testing-library/react-native if not already a dev dependency (it's usually included with Vitest setup for RN)."
        
- **Step 6.2: EAS Build Configuration for Secrets & Profiles**
    
    - **Task**: Configure eas.json build profiles (development, preview, production) to include environment variables for Supabase URL/Anon Key and RevenueCat keys as EAS Secrets.
        
    - **Files**:
        
        - eas.json: "Update profiles to include env block for EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_REVENUECAT_APPLE_KEY, EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY mapping to EAS Secret names, as per spec section 3.5."
            
    - **Step Dependencies**: 0.4, 4.1
        
    - **User Instructions**: "Set up corresponding secrets in your EAS project settings on expo.dev (e.g., MY_APP_SUPABASE_URL, MY_APP_REVENUECAT_APPLE_KEY)."
        
- **Step 6.3: Documentation - README & Basic Usage Guides**
    
    - **Task**: Update the main README.md for NovaKit: setup, overview, how to start a new project. Document usage for core modules (auth, theming, data fetching patterns).
        
    - **Files**:
        
        - README.md: "Expand with NovaKit specific information, tech stack choices, setup instructions (including Supabase setup, env vars, RevenueCat setup). Explain how to use the template."
            
        - docs/ (New folder)
            
        - docs/01-getting-started.md: "Detailed setup steps."
            
        - docs/02-authentication.md: "How Supabase Auth is integrated, authStore usage."
            
        - docs/03-theming.md: "How to customize theme via tailwind.config.ts and src/styles/theme.ts."
            
        - docs/04-data-fetching.md: "Patterns for using TanStack Query with Supabase services."
            
    - **Step Dependencies**: All previous steps.
        
    - **User Instructions**: "Write clear, concise documentation. This is crucial for a template."
        

This plan covers the major requirements from the project request and technical specification, building upon the provided starter code. Subsequent steps would involve adding more features (Push Notifications, Analytics, Feature Flags), advanced RLS, more complex UI components, Edge Function examples, and more comprehensive testing and documentation. The "Monetization Readiness" module would be a natural extension after these core pieces are in place.}}
</implementation_plan>
