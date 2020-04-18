import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';



const config = {
	apiKey: "AIzaSyAMv25mIrEPv4FyqZRFQ1fJPwb_Y-u_gCU",
    authDomain: "fireman-bccc5.firebaseapp.com",
    databaseURL: "https://fireman-bccc5.firebaseio.com",
    projectId: "fireman-bccc5",
    storageBucket: "fireman-bccc5.appspot.com",
    messagingSenderId: "960710689909",
    appId: "1:960710689909:web:bd630921580761ab"
}

class Firebase {
	constructor() {
		app.initializeApp(config);
		
		this.auth = app.auth();
    this.db = app.database();

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();

    this.serverValue = app.database.ServerValue;
	}

		// *** Auth API ***

  	doCreateUserWithEmailAndPassword = (email, password) =>
    	this.auth.createUserWithEmailAndPassword(email, password)

  	doSignInWithEmailAndPassword = (email, password) =>
    	this.auth.signInWithEmailAndPassword(email, password)

    doSignInWithGoogle = () => 
      this.auth.signInWithPopup(this.googleProvider)

    doSignInWithFacebook = () =>
      this.auth.signInWithPopup(this.facebookProvider)

  	doSignOut = () => this.auth.signOut()
	
  	doPasswordReset = email => this.auth.sendPasswordResetEmail(email)
	
  	doPasswordUpdate = password =>
    	this.auth.currentUser.updatePassword(password)

    // *** Merge Auth and DB User API ***

    onAuthUserListener = (next, fallback) => 
      this.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            // console.log(authUser)

            //default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {}
            }

            //merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            }

            next(authUser)
          })
        } else {
          fallback()
        }
      })

    // *** User API ***

    user = uid => this.db.ref(`users/${uid}`)

    users = () => this.db.ref('users')

    // *** Message API ***

    message = uid => this.db.ref(`messages/${uid}`)

    messages = () => this.db.ref('messages')
}

export default Firebase