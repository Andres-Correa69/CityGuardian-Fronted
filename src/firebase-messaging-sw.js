importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCuomevMvamgOQBoiLILHjIYMxy8LpcJKs",
  authDomain: "cityguardian-b35a8.firebaseapp.com",
  projectId: "cityguardian-b35a8",
  storageBucket: "cityguardian-b35a8.firebasestorage.app",
  messagingSenderId: "1087115835217",
  appId: "1:1087115835217:web:6bd2c8c238c2c4f1f80570",
  measurementId: "G-VWFQK3Y7G0"
});

const messaging = firebase.messaging();

// Manejo de mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('Mensaje recibido en segundo plano:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-72x72.png',
    badge: '/assets/icons/badge-72x72.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 