// Global Variables
var splash = document.getElementById("splash")
var splash_img = document.getElementById("splash_image")
var main_login_overlay = document.getElementById('login_main_overlay')
var container2 = document.getElementById('login_container2')
var msg_div = document.getElementById('message_div')
var msg_txt = document.getElementById('message_txt')
var main_login_overlay = document.getElementById('login_main_overlay')



function hideSplash() {
  splash_img.classList.add('fade-out')
  function hide() {
    splash.style.display = "none"
    container2.classList.add("slide-in-left")
  }
  setTimeout(hide, 1000)
}


// Window.onload (Main)
window.onload = function() {
  setTimeout(hideSplash, 3000)
}



//  Custom Functions
var isMsgVisible = false
function showMessage(message, success, time) {
  msg_div.classList.add("slide-in-bottom")
  msg_div.style.display = "flex"
  msg_txt.innerHTML = message;
  if (success === "success") {
    msg_txt.style.backgroundColor = "forestgreen";
  } else if (success === "error") {
    msg_txt.style.backgroundColor = "red";
  }
  isMsgVisible = true;

  // Code to hide the message
  function hideMessage(time) {
    msg_div.classList.remove("slide-in-bottom")
    msg_div.classList.add('slide-out-bottom')
    function hideMain() {
      msg_div.style.display = "none";
      msg_div.classList.remove('slide-out-bottom')
      isMsgVisible = false;
    }
    // Animation time: 500, it means it will be hidden after the completion of animation
    setTimeout(hideMain, 500)
  }
  setTimeout(hideMessage, time)
}


function hideLogin() {
  container2.classList.remove("slide-in-left")
  container2.classList.add("slide-out-right")
  function hideMain() {
    main_login_overlay.style.display = "none"
  }
  setTimeout(hideMain, 1000)
}




function login() {
  event.preventDefault();

  var email = document.getElementById('email').value;
  var pass = document.getElementById('pass').value;

  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      var user = userCredential.user;
      var userId = user.uid;

      firebase.database().ref('users/' + userId).on('value', function(snapshot) {
        var name = snapshot.val().Name
        showMessage("Logged in as " + snapshot.val().Name, "success", 5000)
        hideLogin()
      });

    }).catch((error) => {
      console.log(error)
      showMessage("Error: " + error.message, "error", 5000)
      // alert(error.message)
    });
}


var user = firebase.auth().currentUser;
if (user) {
  console.log("User")
} else {
  console.log("No User")
}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var userId = user.uid;
    firebase.database().ref('users/' + userId).once('value', function(snapshot) {

      var name = snapshot.val().Name;
      var dp_url = snapshot.val().DP;
      document.getElementById('my_dp').style.backgroundImage = "url(" + dp_url + ")"
      document.getElementById('name').innerText = name;

      var contacts = snapshot.val().Contacts
      console.log(contacts)
      console.log(typeof (contacts))

      for (let key in contacts) {

        console.log(key);
        var user_uid = key;
        let element = contacts[key];
        // console.log(contacts[key]["groupID"]);
        // or
        console.log(element.groupID)
        var user_grpID = element.groupID;

        var cont_container = document.getElementById('contact_container')

        var contact = document.createElement("div")
        contact.setAttribute("class", "contact")
        contact.setAttribute("uid", user_uid)
        contact.setAttribute("id", "uid_" + user_uid)
        contact.setAttribute("grpid", user_grpID)
        cont_container.appendChild(contact)

        firebase.database().ref('public/' + user_uid).on('value', function(snapshott) {
          var user_dp = snapshott.val().DP
          var user_name = snapshott.val().Name
          console.log(user_dp)
          var dp_contacts = document.createElement("div")
          dp_contacts.setAttribute("class", "dp_contacts")
          dp_contacts.style.backgroundImage = "url(" + user_dp + ")";
          contact.appendChild(dp_contacts)

          var uinfo = document.createElement("div")
          uinfo.setAttribute("class", "uinfo")
          uinfo.setAttribute("id", "id_uinfo_" + user_grpID)
          contact.appendChild(uinfo)

          var contact_name = document.createElement("div")
          contact_name.setAttribute("class", "contact_name")
          contact_name.innerText = user_name;
          uinfo.appendChild(contact_name)

          // return user_name, user_dp
        })




        firebase.database().ref('groups/' + user_grpID + "/chats").on("value", function(snapshottt) {
          var ab = snapshottt.val()

          const outerKeys = Object.keys(ab);
          var date = outerKeys
          console.log("OuterKeys: " + outerKeys)
          const lastOuterKey = outerKeys[outerKeys.length - 1];
          const innerObject = ab[lastOuterKey];
          const innerKeys = Object.keys(innerObject);
          var time = innerKeys
          console.log("InnerKeys: " + innerKeys)

          const lastInnerKey = innerKeys[innerKeys.length - 1];
          const msg = innerObject[lastInnerKey].msg;
          console.log(msg);


          try {
            document.getElementById("lstmsg_" + user_grpID).remove()
          } catch (e) {
            console.log(e)
          }

          var lst_msg = document.createElement("div")
          lst_msg.setAttribute("class", "lstmsg")
          lst_msg.setAttribute("id", "lstmsg_" + user_grpID)
          var uinfo = document.getElementById("id_uinfo_" + user_grpID)
          uinfo.appendChild(lst_msg)

          document.getElementById('lstmsg_' + user_grpID).innerText = msg;

          // var chat_container = document.createElement("div")
          // chat_container.setAttribute("class","chat_container "+date)
          // // chat_container.setAttribute("class",date)
          // chat_container.setAttribute("id","id_"+date)
          // document.getElementById("chats").appendChild(chat_container)
          // var userId = firebase.auth().currentUser.uid;

          // if (userId == uid){
          //   var me = document.createElement("div")
          //   me.setAttribute("class","me "+time)
          //   chat_container.appendChild(me)
          //   var txt = document.createElement("div")
          //   txt.setAttribute("class","txt")
          //   txt.innerText = message
          //   me.appendChild(txt)

          // } else if(userId !== uid){
          //   var other = document.createElement("div")
          //   other.setAttribute("class","other "+time)
          //   chat_container.appendChild(other)
          //   var txt = document.createElement("div")
          //   txt.setAttribute("class","txt")
          //   txt.innerText = message;
          //   other.appendChild(txt)

          // }

          // console.log(ab)
        })



        contact.onclick = function() {
          let img = contact.firstChild.style.backgroundImage;
          document.getElementById("activeID_DP").style.backgroundImage = img;
          console.log(img)
          var name = document.getElementById("id_uinfo_" + user_grpID).firstChild.innerText;
          document.getElementById("activeUname").innerText = name;
          document.getElementById('right_div').style.display = "flex";

          if (window.innerWidth <= 600) {
            var left_div = document.getElementById("left_div")
            var right_div = document.getElementById("right_div")
            left_div.style.width = 0;
            left_div.style.display = "none";

            right_div.style.display = "flex";
            right_div.style.width = "100%";
          }
          var name = document.getElementById("activeUname").innerText;
          firebase.database().ref('users/' + userId).update({
            activeChat: name,
            activeChatID: user_uid,
            activeGrpID: user_grpID
          });

          document.getElementById("chats").innerHTML = ""

          firebase.database().ref("groups/" + user_grpID + "/chats").once('value', function(snapshot) {
            let a = snapshot.val()
            for (var date in a) {
              for (var time in a[date]) {
                var message = a[date][time].msg;
                var uid = a[date][time].uid;

                var chat_container = document.getElementById("id_" + date)
                if (!chat_container) {
                  chat_container = document.createElement("div")
                  chat_container.setAttribute("class", "chat_container " + date)
                  chat_container.setAttribute("id", "id_" + date)
                  document.getElementById("chats").appendChild(chat_container)
                }


                // var chat_container = document.createElement("div")
                // chat_container.setAttribute("class","chat_container "+date)
                // // chat_container.setAttribute("class",date)
                // chat_container.setAttribute("id","id_"+date)
                // document.getElementById("chats").appendChild(chat_container)
                var userId = firebase.auth().currentUser.uid;

                if (userId == uid) {
                  var me = document.createElement("div")
                  me.setAttribute("class", "me " + time)
                  me.setAttribute("id", "myid_" + time)
                  chat_container.appendChild(me)
                  var txt = document.createElement("div")
                  txt.setAttribute("class", "txt")
                  txt.innerText = message
                  me.appendChild(txt)

                  var time_span = document.createElement("span")
                  time_span.setAttribute("class", "my_time_span")
                  time_span.innerText = time;
                  me.innerHTML += "<br><br>"
                  me.append(time_span)

                } else if (userId !== uid) {
                  var other = document.createElement("div")
                  other.setAttribute("class", "other " + time)
                  other.setAttribute("id", "otherid_" + time)

                  chat_container.appendChild(other)
                  var txt = document.createElement("div")
                  txt.setAttribute("class", "txt")
                  txt.innerText = message;
                  other.appendChild(txt)

                  var time_span = document.createElement("span")
                  time_span.setAttribute("class", "other_time_span")
                  time_span.innerText = time;
                  other.innerHTML += "<br><br>"
                  other.append(time_span)

                }
                scrollDown()
                // console.log(message,uid, time, date);
              }
            }
            // console.log(a)
          })

        }




      }


      showMessage("Logged in as " + snapshot.val().Name, "success", 5000)
      hideLogin()
    });

  } else {
    console.log("No user!")
  }
})


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var userId = firebase.auth().currentUser.uid;
    // var name = document.getElementById("activeUname").innerText;
    firebase.database().ref('users/' + userId).update({
      activeChat: "",
      activeChatID: "",
      activeGrpID: ""
    });
    checkNewMessages()
  }
})




function sendMessage(message, grpid) {

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  console.log(currentDate);

  const d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();

  if (h.toString().length == 1) {
    h = "0" + h
    // h = parseInt(h)
  }
  if (m.toString().length == 1) {
    m = "0" + m
  }
  if (s.toString().length == 1) {
    s = "0" + s
  }

  let currentTime = `${h}:${m}:${s}`

  var userId = firebase.auth().currentUser.uid

  try {
    document.getElementById('lstmsg_' + grpid).innerText = message;
  } catch (e) {
    var lst_msg = document.createElement("div")
    lst_msg.setAttribute("class", "lstmsg")
    lst_msg.setAttribute("id", "lstmsg_" + grpid)
    var uinfo = document.getElementById("id_uinfo_" + grpid)
    uinfo.appendChild(lst_msg)

    document.getElementById('lstmsg_' + grpid).innerText = message;
  }

  scrollDown()


  firebase.database().ref("groups/" + grpid + "/chats/" + currentDate + "/" + currentTime).update({
    msg: message,
    uid: userId
  })

}



document.getElementById("send_btn").onclick = function() {
  var txt = document.getElementById("msg_txt").value;
  let checked_txt = txt.replace(/^\s+|\s+$/gm, '');
  var userId = firebase.auth().currentUser.uid;

  if (checked_txt.length !== 0) {
    firebase.database().ref("users/" + userId).once("value", function(snapshot) {
      let grpid = snapshot.val().activeGrpID;

      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${day}-${month}-${year}`;
      console.log(currentDate);



      const d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      var s = d.getSeconds();

      if (h.toString().length == 1) {
        h = "0" + h
        // h = parseInt(h)
      }
      if (m.toString().length == 1) {
        m = "0" + m
      }
      if (s.toString().length == 1) {
        s = "0" + s
      }

      let currentTime = `${h}:${m}:${s}`

      document.getElementById("msg_txt").value = "";

      checkNewMessages()

      sendMessage(txt, grpid)

    })
  } else {
    showMessage("Enter Something to Send!", "error", 2000)
  }
}






function checkNewMessages() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  var userId = firebase.auth().currentUser.uid;

  firebase.database().ref("users/" + userId).on("value", function(snapshot) {
    let abc = snapshot.val()
    var grpid = abc.activeGrpID

    var ref = firebase.database().ref("groups/" + grpid + "/chats/" + currentDate).limitToLast(1)
    ref.on("child_added", function(snapshott) {
      let a = snapshott.val()
      console.log(a.msg)

      var message = a.msg
      var uid = a.uid
      var time = snapshott.key

      console.log(message, uid, time)

      var userId = firebase.auth().currentUser.uid;

      var chat_container = document.getElementById("id_" + currentDate)
      if (!chat_container) {
        chat_container = document.createElement("div")
        chat_container.setAttribute("class", "chat_container " + currentDate)
        chat_container.setAttribute("id", "id_" + currentDate)
        document.getElementById("chats").appendChild(chat_container)
      }

      if (userId == uid) {
        var msg_div = document.getElementById("myid_" + time)
        if (!msg_div) {
          var me = document.createElement("div")
          me.setAttribute("class", "me " + time)
          me.setAttribute("id", "myid_" + time)
          chat_container.appendChild(me)
          var txt = document.createElement("div")
          txt.setAttribute("class", "txt")
          txt.innerText = message
          me.appendChild(txt)

          var time_span = document.createElement("span")
          time_span.setAttribute("class", "my_time_span")
          time_span.innerText = time;
          me.innerHTML += "<br><br>"
          me.append(time_span)
        }


      } else if (userId !== uid) {
        var other_msg = document.getElementById("otherid_" + time)
        if (!other_msg) {
          var other = document.createElement("div")
          other.setAttribute("class", "other " + time)
          other.setAttribute("id", "otherid_" + time)
          chat_container.appendChild(other)
          var txt = document.createElement("div")
          txt.setAttribute("class", "txt")
          txt.innerText = message;
          other.appendChild(txt)

          var time_span = document.createElement("span")
          time_span.setAttribute("class", "other_time_span")
          time_span.innerText = time;
          other.innerHTML += "<br><br>"
          other.append(time_span)

        }
      }


      console.log(message);

      console.log(a)
    })


  })


}

try {
  checkNewMessages()
} catch (e) {
  console.log(e)
}


document.getElementById("msg_txt").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    document.getElementById("send_btn").click()
  }
})


function scrollDown() {
  var a = document.getElementById("chats")
  a.scrollTop = a.scrollHeight;
}




var callStatus = document.getElementById("callStatus");



document.getElementById('vc_btn').onclick = function(){
  var vc_window = window.open("https://call.ayush1221.repl.co/","toolbar=no,menubar=no,scrollbars=no,status=no,titlebar=no,scrollbars=no,resizable=no");
  var callTime = 0
  function checkWindow(){
    if (vc_window.closed === false){
      console.log("On Call")
      callTime += 1;
      // callStatusToggle()
      callStatusShow()
      callStatus.innerText = "On Call "+callTime;
      callStatus.onclick = function(){
        console.log("Clicked!")
        vc_window.focus()
      }
    } else {
      console.log("Call Ended")
      clearInterval(checkInterval)
      callStatusHide()
      
      console.log("Call Time: "+callTime+" sec");
      callStatus.innerText = "Call Ended "+callTime;
      
    }
  }
  var checkInterval = setInterval(checkWindow, 1000)
  // checkWindow()
}

function callStatusShow(){
  document.getElementById("callStatus").style.display = "flex"
  document.getElementById("func_btns").style.display = "none"
}

function callStatusHide(){
  document.getElementById("callStatus").style.display = "none"
  document.getElementById("func_btns").style.display = "flex"
}
