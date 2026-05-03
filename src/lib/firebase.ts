/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCg9GsLyniKQnUKrnrD1AV5b0ikhZ7icHk",
  authDomain: "miu-miu-coffee.firebaseapp.com",
  projectId: "miu-miu-coffee",
  storageBucket: "miu-miu-coffee.firebasestorage.app",
  messagingSenderId: "1040307042360",
  appId: "1:1040307042360:web:12efc5bb2e504d607e4ecd",
  databaseURL: "https://miu-miu-coffee-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
