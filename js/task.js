/* GLOBAL VARIABLES */

var container = document.getElementById('listContainer');

var lists = [];

var cards = [];

/* LIST FUNCTIONS */

function addList() {

 var title = document.getElementById('title').value;
 document.getElementById("title").value = "";
 createListDisplay(title);
 savelists();
 return false;
}

function savelists() {

 var t = [];
 if (localStorage && lists[0] != undefined) {
  t = [];
  for (var i in lists) {
   var p = lists[i];
   t.push({
    t: p.t,
    id: p.id
   });

  }
  console.log(t);
  localStorage["lists"] = JSON.stringify(t);
 }
}

function savecards() {

 var t = [];
 if (localStorage && cards[0] != undefined) {
  t = [];
  for (var i in cards) {
   var p = cards[i];
   t.push({
    c: p.c,
    n: p.n,
    id: p.id
   });

  }
  console.log(t);
  localStorage["cards"] = JSON.stringify(t);
 }
}


function loadlists() {

 if (localStorage) {

  if (localStorage["lists"] != undefined) {

   var t = JSON.parse(localStorage["lists"]);
   console.log("Load lists: " + t);
   for (var i in t) {
    var p = t[i];

    createListDisplay(p.t);
   }
  }
 }
}

function loadcards() {


 if (localStorage) {

  if (localStorage["cards"] != undefined) {


   var t = JSON.parse(localStorage["cards"]);
   console.log("Load cards: " + t);
   for (var i in t) {
    var p = t[i];
    console.log("lists: " + p.n);
    createCardDisplay(p.c, p.n);
   }
  }
 }
}


function deleteList(id) {
 //console.log(lists[id].d);
 container.removeChild(lists[id].d);
 lists[id] = lists[lists.length - 1];
 lists.pop();

 for (var i in lists) {
  lists[i].id = i;
  lists[i].a.id = i;
 }
 savelists();
}

function createListDisplay(title) {


 var d = document.createElement('div');

 d.id = "list-" + lists.length;

 var id = lists.length;

 lists.push({
  d: d,
  t: title,
  id: id
 });
 var p = lists[lists.length - 1];

 d.className = "span3 well list";

 var a = document.createElement('a');
 a.id = id;
 a.className = "close";
 a.innerHTML = "x";
 a.onclick = function() {

  deleteList(this.id)
 }
 d.setAttribute('ondrop', 'drop(event)');
 d.setAttribute('ondragover', 'allowDrop(event)');
 d.appendChild(a);
 p.a = a;

 var h = document.createElement('h2');
 h.className = "list_head";
 h.innerHTML = title;
 d.appendChild(h);
 p.h = h;

 var t = document.createElement('div');
 t.className = "card_box";


 var c = document.createElement('div');
 c.setAttribute('id', 'cards-' + id);
 /*c.setAttribute('ondrop', 'drop(event)');
 c.setAttribute('ondragover', 'allowDrop(event)');*/
 t.appendChild(c);


 var cont = document.createElement('div');
 cont.innerHTML = '<form onsubmit="return addCard(' + id + ')"><textarea class="span3" rows="3" cols="200" name="' + id + '_card_content" id="' + id + '_card_content" placeholder="Your task description" ></textarea><input type="hidden" id="card_no" name="card_no" value="' + id + '"><button type="submit" class="btn btn-info">Add Task</button></form>';
 t.appendChild(cont);
 d.appendChild(t);
 //p.cont = cont;
 container.appendChild(d);
}

/* CARD FUNCTIONS */

function addCard(no) {

 var c = document.getElementById(no + '_card_content').value;
 document.getElementById(no + '_card_content').value = "";

 //console.log("In add: " + c);
 createCardDisplay(c, no);

 savecards();

 return false;
}

function createCardDisplay(content, no) {

 var d = document.createElement('div');
 //var no = document.getElementById('card_no').value;
 //console.log(no);
 var l = document.getElementById('cards-' + no);

 d.id = "card-" + cards.length;
 d.className = "card_item";
 var id = cards.length;
 d.setAttribute('draggable', true);
 d.setAttribute('ondragstart', 'drag(event)');

 cards.push({
  d: d,
  c: content,
  n: no,
  id: id
 });
 var p = cards[cards.length - 1];

 var a = document.createElement('a');
 a.id = id;
 a.className = "close";
 a.innerHTML = "x";
 a.onclick = function() {

  deleteCard(this.id, no)
 }

 d.appendChild(a);
 p.a = a;

 var e = document.createElement('a');
 e.id = 'e' + id;
 e.className = "close";
 e.innerHTML = "e";
 e.tabIndex = id;
 e.onclick = function() {
  document.getElementById('p' + id).setAttribute('contenteditable', true);
  document.getElementById('p' + id).focus();
 }

 d.appendChild(e);
 p.e = e;


 var h = document.createElement('p');
 h.innerHTML = content;
 h.id = 'p' + id;
 //h.setAttribute('id’,h.id);
 h.setAttribute('contenteditable', false);
 h.addEventListener('keypress', function(event) {
  //console.log('keypress');
  if (event.which === 13) {
   //console.log('entered');
   document.getElementById('p' + id).setAttribute('contenteditable', false);
   this.blur();
   event.preventDefault();
   updateCard(id);

  }
 });
 d.appendChild(h);
 p.h = h;
 l.appendChild(d);
}

function deleteCard(id, no) {

 var l = document.getElementById('cards-' + no);
 console.log(cards[id].d);
 l.removeChild(cards[id].d);

 cards[id] = cards[cards.length - 1];
 cards.pop();

 for (var i in cards) {
  cards[i].id = i;
  cards[i].a.id = i;
 }
 savecards();
}

function updateCard(id) {

 var listCards = JSON.parse(localStorage.cards);
 for (var i = 0; i < listCards.length; i++) {
  if (id === listCards[i].id) { //look for match with name
   listCards[i].c = document.getElementById('p' + id).innerHTML;
   break; //exit loop since you found the person
  }
 }
 localStorage.setItem("cards", JSON.stringify(listCards));


}

loadlists();
loadcards();

/* Drag and Drop */

function allowDrop(ev) {
 ev.preventDefault();
}

function drag(ev) {
 //alert('target id'+ev.target.id);
 ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev) {
 ev.preventDefault();
 var data = ev.dataTransfer.getData("Text");
 var targetList = ev.target.parentNode.parentNode.id;
 var target1List = ev.target.parentNode.id;
 if (targetList.includes("cards") || targetList.includes("list")) {
  ev.target.parentNode.parentNode.append(document.getElementById(data));

 } else if (target1List.includes("cards") || target1List.includes("list")) {
  ev.target.parentNode.append(document.getElementById(data));
 } else alert('Please position the item correctly');



}

/* Custom */

function toggleDiv(b) {
 console.log(b);
 if (b == 1) {
  document.getElementById("new_list").style.display = "block";
  document.getElementById("new_list_button").style.display = "none";
 } else {
  document.getElementById("new_list_button").style.display = "block";
  document.getElementById("new_list").style.display = "none";
 }
}

function toggleDivs(showDiv, hideDiv) {
 document.getElementById(showDiv).style.display = "block";
 document.getElementById(hideDiv).style.display = "none";
}
