const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formbtn=itemForm.querySelector('button');
let isEditMode=false;

// const  items=itemList.querySelectorAll('li'); instead of adding here in global which will be fixed we add in function.

function displayItems() {
  const itemFromStorage = getItemsFromStorage();
  itemFromStorage.forEach((item) => addItemToDOM(item)); //To get items from storage to DOM we need foreach
  checkUI();
}
function onAddItemSubmit(e) {
  e.preventDefault();
  // Validate Input
  const newItem = itemInput.value;
  if (newItem === "") {
    alert("Please add an item");
    return;
  }
  //Check Edit Mode

  if(isEditMode){
const itemToEdit= itemList.querySelector('.edit-mode');
removeItemFromStorage(itemToEdit.textContent);
console.log(itemToEdit);
itemToEdit.classList.remove('edit-mode');
itemToEdit.remove();

}
else{
  if(checkIfItemExists(newItem)){
    alert('That item Already exists');
    return;
  }
}
 

  //Create item DOM element
  addItemToDOM(newItem);

  //Add elements to localStorage
  addItemToStorage(newItem);

  checkUI(); //Now here it doesnt update li items when we check ui becoz if we declare in global scope
  // console.log(li);
  itemInput.value = "";
}

function addItemToDOM(item) {
  //Create list items
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red"); //Create buton function seperately
  li.appendChild(button);

  //Add li to the DOM
  itemList.appendChild(li);
}

function addItemToStorage(item) {
  const itemFromStorage = getItemsFromStorage();
  //Add new item to array
  itemFromStorage.push(item);
  console.log(itemFromStorage);

  //Convert to Json string and set to local storage
  localStorage.setItem("ingrient", JSON.stringify(itemFromStorage));
}

function getItemsFromStorage() {
  let itemFromStorage;
  if (localStorage.getItem("ingrient") === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem("ingrient"));
  }
  return itemFromStorage;
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
  function createIcon(classes) {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
  }
}
function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  }
  else{
   setItemToEdit(e.target);
  }
}

function checkIfItemExists(item){
const itemFromStorage=getItemsFromStorage();
 return itemFromStorage.includes(item);//includes fun give true or false we can write in if statemenet as well but we directly return keywrord to get result

}

function setItemToEdit(item){
isEditMode=true;

itemList.querySelectorAll('li').forEach((i)=>i.classList.remove('edit-mode'));//This is bit confusing

// item.style.color='#ccc'; // Can also create class in css
item.classList.add('edit-mode');
formbtn.innerHTML='<i class= "fa-solid fa-pen"></i> Update Item';
itemInput.value=item.textContent;
formbtn.style.backgroundColor='#228B22';

}
function removeItem(item) {
  //Remove item from DOM
  if (confirm("Are you sure?")) {
    //confirm is function

    item.remove();

    //Remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}
function removeItemFromStorage(item) {
  let itemFromStorage = getItemsFromStorage();
  // console.log(itemFromStorage); This  just fetch
  // To remove we use filter
  itemFromStorage = itemFromStorage.filter((i) => i !== item);

  // Reset to local storage we use setItem
  localStorage.setItem("ingrient", JSON.stringify(itemFromStorage));
}

function clearItems() {
  // itemList.innerHTML=''; //This is one way and below is other way
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  //Clear from local storage
  localStorage.clear("ingrient");
 

  checkUI();
}
function filterItems(e) {
  const items = itemList.querySelectorAll("li");

  const text = e.target.value;
  // console.log(text);
  items.forEach((item) => {
    const itemName = item.textContent.toLowerCase();
    //   console.log(itemName);
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkUI() {
  itemInput.value='';
  const items = itemList.querySelectorAll("li");

  //   console.log(items); //Here items was defined in gllobal scope so it doesnt change so we need to define in function
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
  
  formbtn.innerHTML='<i class="fa-solid fa-plus"></i>Add Item';
  formbtn.style.backgroundColor='#333';

  isEditMode=false;
}

// Initilize app
// instead of having event listeners globally we use init
function init() {
  // Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI(); //checking global scope this will only work if we have hardcoded values or li in html so filter and clear all will not display
}
init(); // now only this function is in global scope
