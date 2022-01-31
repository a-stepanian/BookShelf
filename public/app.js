// Expand window when you click on the first link in the navbar
const button1 = document.querySelectorAll('li')[0];
const red = document.querySelectorAll('.collapsedWindow')[0];
button1.addEventListener('click', () => {
    red.classList.toggle('scrollbar');
});
button1.addEventListener('click', darkRedClick);

// Expand window when you click on the second link in the navbar
const button2 = document.querySelectorAll('li')[1];
const green = document.querySelectorAll('.collapsedWindow')[1];
button2.addEventListener('click', () => {
    green.classList.toggle('scrollbar');
});
button2.addEventListener('click', darkGreenClick);

// Expand window when you click on the third link in the navbar
const button3 = document.querySelectorAll('li')[2];
const blue = document.querySelectorAll('.collapsedWindow')[2];
button3.addEventListener('click', () => {
    blue.classList.toggle('scrollbar');
});
button3.addEventListener('click', darkBlueClick);




function darkRedClick(event) {
    red.classList.toggle('redClass');
    red.classList.toggle('expandedDark');
 }
function darkGreenClick(event) {
    green.classList.toggle('greenClass');
    green.classList.toggle('expandedDark');
 }
function darkBlueClick(event) {
    blue.classList.toggle('blueClass');
    blue.classList.toggle('expandedDark');
 }