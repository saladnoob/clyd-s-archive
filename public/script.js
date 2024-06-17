import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Register Form Submission
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const email = registerForm.email.value;
  const password = registerForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User registered:', user);
      document.getElementById('registerStatus').textContent = 'User registered successfully!';
    })
    .catch((error) => {
      console.error('Error registering user:', error.message);
      document.getElementById('registerStatus').textContent = `Error: ${error.message}`;
    });
});

// Login Form Submission
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const email = loginForm.loginEmail.value;
  const password = loginForm.loginPassword.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User logged in:', user);
      document.getElementById('loginStatus').textContent = 'User logged in successfully!';
    })
    .catch((error) => {
      console.error('Error logging in:', error.message);
      document.getElementById('loginStatus').textContent = `Error: ${error.message}`;
    });
});

// Sign In with Google Button Click
const googleSignInButton = document.getElementById('googleSignInButton');
googleSignInButton.addEventListener('click', () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log('Google user:', user);
      document.getElementById('loginStatus').textContent = 'Google user signed in successfully!';
    })
    .catch((error) => {
      console.error('Error signing in with Google:', error.message);
      document.getElementById('loginStatus').textContent = `Error: ${error.message}`;
    });
});

// Sign In Anonymously Button Click
const anonymousSignInButton = document.getElementById('anonymousSignInButton');
anonymousSignInButton.addEventListener('click', () => {
  signInAnonymously(auth)
    .then((result) => {
      const user = result.user;
      console.log('Anonymous user:', user);
      document.getElementById('loginStatus').textContent = 'Anonymous user signed in successfully!';
    })
    .catch((error) => {
      console.error('Error signing in anonymously:', error.message);
      document.getElementById('loginStatus').textContent = `Error: ${error.message}`;
    });
});
