const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  "import { User, signInWithPopup, signInWithRedirect, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, getIdToken } from 'firebase/auth';",
  "import { User, signInWithPopup, signInWithRedirect, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut as firebaseSignOut, onAuthStateChanged, getIdToken } from 'firebase/auth';"
);

code = code.replace(
  "  signInWithEmail: (email: string, pass: string) => Promise<void>;\n  signUpWithEmail: (email: string, pass: string) => Promise<void>;",
  "  sendEmailLink: (email: string) => Promise<void>;\n  signInWithEmail: (email: string, link: string) => Promise<void>;"
);

code = code.replace(
  "  const signInWithEmail = async (email: string, pass: string) => {\n    setError(null);\n    try {\n      await signInWithEmailAndPassword(auth, email, pass);\n    } catch (err: any) {\n      setError(err.message || 'Failed to sign in with email.');\n    }\n  };\n\n  const signUpWithEmail = async (email: string, pass: string) => {\n    setError(null);\n    try {\n      await createUserWithEmailAndPassword(auth, email, pass);\n    } catch (err: any) {\n      setError(err.message || 'Failed to sign up with email.');\n    }\n  };",
  "  const sendEmailLink = async (email: string) => {\n    setError(null);\n    try {\n      const actionCodeSettings = {\n        url: window.location.href,\n        handleCodeInApp: true,\n      };\n      await sendSignInLinkToEmail(auth, email, actionCodeSettings);\n      window.localStorage.setItem('emailForSignIn', email);\n    } catch (err: any) {\n      setError(err.message || 'Failed to send email link.');\n    }\n  };\n\n  const signInWithEmail = async (email: string, link: string) => {\n    setError(null);\n    try {\n      await signInWithEmailLink(auth, email, link);\n      window.localStorage.removeItem('emailForSignIn');\n    } catch (err: any) {\n      setError(err.message || 'Failed to sign in with email link.');\n    }\n  };"
);

code = code.replace(
  "signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, getToken, clearError, setError",
  "signInWithGoogle, sendEmailLink, signInWithEmail, signOut, getToken, clearError, setError"
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);

let loginCode = fs.readFileSync('src/components/Login.tsx', 'utf8');

loginCode = loginCode.replace(
  "import { motion } from 'motion/react';\nimport { BookOpen, Loader2, Mail } from 'lucide-react';\n\nexport default function Login() {",
  "import { motion } from 'motion/react';\nimport { BookOpen, Loader2, Mail } from 'lucide-react';\nimport { isSignInWithEmailLink } from 'firebase/auth';\nimport { auth } from '../firebase/config';\n\nexport default function Login() {"
);

loginCode = loginCode.replace(
  "const { signInWithGoogle, signInWithEmail, signUpWithEmail, error, clearError, setError } = useAuth();",
  "const { signInWithGoogle, sendEmailLink, signInWithEmail, error, clearError, setError } = useAuth();"
);

loginCode = loginCode.replace(
  "  const [password, setPassword] = useState('');\n  const [isSignUp, setIsSignUp] = useState(false);\n\n  useEffect(() => {\n    clearError();\n  }, [clearError]);",
  "  const [emailSent, setEmailSent] = useState(false);\n\n  useEffect(() => {\n    clearError();\n    // Check if the user is redirected via email link\n    if (isSignInWithEmailLink(auth, window.location.href)) {\n      let emailForSignIn = window.localStorage.getItem('emailForSignIn');\n      if (!emailForSignIn) {\n        // User opened the link on a different device or browser\n        emailForSignIn = window.prompt('Please provide your email for confirmation');\n      }\n      if (emailForSignIn) {\n        setEmailLoading(true);\n        signInWithEmail(emailForSignIn, window.location.href)\n          .catch((err: any) => setError(err.message))\n          .finally(() => setEmailLoading(false));\n      }\n    }\n  }, [clearError, signInWithEmail, setError]);"
);

loginCode = loginCode.replace(
  "  const handleEmailAuth = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!email || !password) return;\n    clearError();\n    setEmailLoading(true);\n    try {\n      if (isSignUp) {\n        await signUpWithEmail(email, password);\n      } else {\n        await signInWithEmail(email, password);\n      }\n    } catch (err: any) {\n      if (err.code === undefined) {\n        setError(err.message || 'An unexpected error occurred.');\n      }\n    } finally {\n      setEmailLoading(false);\n    }\n  };",
  "  const handleEmailSignIn = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!email) return;\n    clearError();\n    setEmailLoading(true);\n    try {\n      await sendEmailLink(email);\n      setEmailSent(true);\n    } catch (err: any) {\n      if (err.code === undefined) {\n        setError(err.message || 'An unexpected error occurred sending email link.');\n      }\n    } finally {\n      setEmailLoading(false);\n    }\n  };"
);

loginCode = loginCode.replace(
  "{false ? (",
  "{emailSent ? ("
);

loginCode = loginCode.replace(
  "            <form onSubmit={handleEmailAuth} className=\"flex flex-col gap-3\">\n              <input\n                type=\"email\"\n                placeholder=\"Email address\"\n                value={email}\n                onChange={(e) => setEmail(e.target.value)}\n                required\n                className=\"w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50\"\n              />\n              <input\n                type=\"password\"\n                placeholder=\"Password\"\n                value={password}\n                onChange={(e) => setPassword(e.target.value)}\n                required\n                className=\"w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50\"\n              />\n              <button \n                type=\"submit\"\n                disabled={googleLoading || emailLoading || !email || !password}\n                className=\"w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50\"\n              >\n                {emailLoading ? (\n                  <Loader2 className=\"animate-spin\" size={20} />\n                ) : (\n                  <Mail className=\"w-5 h-5\" />\n                )}\n                {isSignUp ? 'Sign Up' : 'Sign In'}\n              </button>\n              <div className=\"text-center mt-2\">\n                <button \n                  type=\"button\"\n                  onClick={() => setIsSignUp(!isSignUp)}\n                  className=\"text-sm text-blue-600 hover:underline\"\n                >\n                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}\n                </button>\n              </div>\n            </form>",
  "            <form onSubmit={handleEmailSignIn} className=\"flex flex-col gap-3\">\n              <input\n                type=\"email\"\n                placeholder=\"Email address\"\n                value={email}\n                onChange={(e) => setEmail(e.target.value)}\n                required\n                className=\"w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50\"\n              />\n              <button \n                type=\"submit\"\n                disabled={googleLoading || emailLoading || !email}\n                className=\"w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50\"\n              >\n                {emailLoading ? (\n                  <Loader2 className=\"animate-spin\" size={20} />\n                ) : (\n                  <Mail className=\"w-5 h-5\" />\n                )}\n                Continue with Email Link\n              </button>\n            </form>"
);

fs.writeFileSync('src/components/Login.tsx', loginCode);
