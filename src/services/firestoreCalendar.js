import {errorCatch} from './firestoreUser'
import { db } from '../lib/firebase.prod.js';
import {v4} from "uuid";


function formatDate(date) {
  var formatDate = date.split('-')
  var restFormatDate = formatDate.splice(1,1)
  restFormatDate.push(...formatDate)
  formatDate = restFormatDate.join('/')
  return new Date(formatDate)
}

export function AddCalendarDate(calendar,currentUser,checkSuccess,checkError,) {

  var batch = db.batch();

  const numberOfData = 500
  const metadata =  {id:calendar.id,name:calendar.name,photoURL:calendar.photoURL,onlyPast:false}
  const objArrayCalendar = Object.keys(calendar);

  const DATA = {}
  var COUNT = 1
  objArrayCalendar.map((item,index)=>{
    if (calendar[item]?.time && !DATA[`${Math.ceil((COUNT)/numberOfData)}page`]) {
      DATA[`${Math.ceil((COUNT)/numberOfData)}page`] = {[item]:calendar[item],...metadata}
      COUNT = COUNT + Object.keys(calendar[item].time).length
    } else if (calendar[item]?.time &&  DATA[`${Math.ceil((COUNT)/numberOfData)}page`]) {
      DATA[`${Math.ceil((COUNT)/numberOfData)}page`][item] = calendar[item]
      const newCount = COUNT + Object.keys(calendar[item].time).length
      if (Math.ceil((COUNT)/numberOfData) != Math.ceil((newCount)/numberOfData) && formatDate(item)<(new Date((new Date()).setHours(0,0,0,0)))) {
        DATA[`${Math.ceil((COUNT)/numberOfData)}page`] = {...DATA[`${Math.ceil((COUNT)/numberOfData)}page`],onlyPast:true}
      }

      COUNT = newCount
    }
  })
  console.log('DATA',DATA)
  //   checkSuccess()
  // const uid = v4()

  Object.keys(DATA).map((item)=>{
    var calendarRef = db.collection("calendar").doc(`${item}${currentUser.uid}`) //currentUser.uid
    batch.set(calendarRef,{...DATA[item]})
  })

  calendar.docId.map((item)=>{
    // console.log('DATA[item]',item,DATA[item.replace(currentUser.uid,'')])
    if (!DATA[item.replace(currentUser.uid,'')]) {
      var calendarRef = db.collection("calendar").doc(`${item}`) //currentUser.uid
      batch.delete(calendarRef)
    }
  })

  batch.commit().then(() => {
    checkSuccess()
  }).catch((error) => {
    checkError(errorCatch(error))
  });

}

export function GetCalendarDate(user,checkSuccess,checkError) {

  const calendarRef = db.collection('calendar');
  calendarRef.where('id', '==', user.uid).get().then(function (querySnapshot) { //.where('onlyPast', '==', false)
    let response = {docId:[]};
    querySnapshot.forEach(function (doc) {
      const DATA = doc.data()
      response = {...response,...DATA,docId:[...response.docId,doc.id]}
    });
    checkSuccess(response,user);
  }).catch((error) => {
    checkError(errorCatch(error));
  });
}

export function SeeIfUserExists(
  email,
  checkSuccess,
  checkError,
) {
  const usersRef = db.collection('users');

  usersRef
    .where('email', '==', email)
    .get()
    .then(function (querySnapshot) {
      let response = [false, false];
      querySnapshot.forEach(function (doc) {
        const companyId =
          doc.data() && doc.data()?.company && doc.data().company?.id
            ? doc.data().company.id
            : false;
        if (doc.id !== email) response = [doc.id, companyId];
      });
      checkSuccess(response);
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}

export function GetAllUsersCompany(
  access,
  checkSuccess,
  checkError,
) {
  const usersRef = db.collection('users');

  usersRef
    .where('access', '==', access)
    .get()
    .then(function (querySnapshot) {
      const response = [];
      querySnapshot.forEach(function (doc) {
        const docx = doc.data();
        if (docx?.creation) {
          docx.end = docx.creation.end;
          docx.creation = docx.creation.start;
        }
        response.push(docx);
      });
      checkSuccess(response);
    })
    .catch((error) => {
      checkError(errorCatch(error));
    });
}
