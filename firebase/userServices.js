import { db } from "./clientApp";

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const userCollectionRef = collection(db, "users");
class UserDataService {
  addUser = (newUser) => {
    return addDoc(userCollectionRef, newUser);
  };

  updateUser = (id, updatedUser) => {
    const bookDoc = doc(db, "users", id);
    return updateDoc(bookDoc, updatedUser);
  };

  deleteUser = (id) => {
    const bookDoc = doc(db, "users", id);
    return deleteDoc(bookDoc);
  };

  getAllUsers = () => {
    return getDocs(userCollectionRef);
  };

//   getBook = (id) => {
//     const bookDoc = doc(db, "users", id);
//     return getDoc(bookDoc);
//   };
}

export default new UserDataService();
