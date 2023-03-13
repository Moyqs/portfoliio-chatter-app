import './styles.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set } from "firebase/database";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBiNmslMB_eXEB6pKguqFQPhvKSgWoH2Uo",
  authDomain: "fir-4-65d63.firebaseapp.com",
  projectId: "fir-4-65d63",
  storageBucket: "fir-4-65d63.appspot.com",
  messagingSenderId: "403402332963",
  appId: "1:403402332963:web:49eb73bf6cf855370b0a96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get username
let userName2 = '';
const getName = function (e) {
  e.preventDefault();
  userName2 = userName.value;
  document.querySelector('.chat-window').style.display = 'block';
  console.log(userName2);
  document.querySelector('#flex1').style.display = 'none';
  let container = document.querySelector(".messages-window");
  container.scrollTop = container.scrollHeight;
}

document.querySelector('#name-btn').addEventListener('click', getName);


async function saveMessage(event) {
  event.preventDefault();
  const text = document.querySelector('.input-bar').value;
  const userName2 = userName.value;

  console.log(userName2);
  let inputField = document.querySelector(".input-bar");
  inputField.value = '';
  // Add a new message entry to the Firebase database.
  try {
    const docRef = await addDoc(collection(db, "msgs"), {
      name: userName2,
      msg: text,
      timestamp: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
}


// Read multiple docs
const queryForDocuments = async function() {
  const recentMessagesQuery = query(
    collection(db, 'msgs'),
    orderBy('timestamp', 'desc'),
    limit(30)
  );

  // const querySnapshot = await getDocs(recentMessagesQuery);
  
  onSnapshot(recentMessagesQuery, (querySnapshot) => {
    const msgScreen = document.querySelector('#messages');
    msgScreen.innerHTML = "";
    let msgArray = querySnapshot.docs.map((e) => e.data());
    let reversedMsgArray = msgArray.reverse();
    
         const welcome = `<li class="${userName == userName2 ? "msg my col-11 col-sm-10 col-md-8": "msg col-11 col-sm-10 col-md-8"}"><span class = "msg-span">
      <p class = "${userName == userName2 ? "name my-name" : "name other-name"}">Chatter App</p>
      <p id = "${userName == userName2 ? "my-msg" : "individual-msg"}">Welcome to Chat! &#129302;</p>
      </span>
    </li>`
      
    msgScreen.innerHTML += welcome;

    reversedMsgArray.forEach((data) => {
      const userName = data.name;
      const textMsg = data.msg;
      console.log(textMsg);

      const msg = `<li class="${userName == userName2 ? "msg my col-11 col-sm-10 col-md-8": "msg col-11 col-sm-10 col-md-8"}"><span class = "msg-span">
    <p class = "${userName == userName2 ? "name my-name" : "name other-name"}">${userName}</p>
    <p id = "${userName == userName2 ? "my-msg" : "individual-msg"}">${textMsg}</p>
    </span>
  </li>`


    msgScreen.innerHTML += msg;

    })
    let container = document.querySelector(".messages-window");
    container.scrollTop = container.scrollHeight;
  })
};


// Clear input field



const msgBtn = document.querySelector(".msg-btn"); //the input form
msgBtn.addEventListener('click', saveMessage);
document.querySelector('#name-btn').addEventListener('click', queryForDocuments);
