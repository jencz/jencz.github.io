const leftPanelOuter = document.getElementById('left-outer-div');
const leftPanel = document.getElementById('left-panel');
const rightPanelOuter = document.getElementById('right-outer-div');
const rightPanel = document.getElementById('right-panel');
const rightPanelBack = document.getElementById('right-panel-back');
const middlePanel = document.getElementById('middle-panel');
const middlePanelOuter = document.getElementById('middle-outer-div');
const middlePanelBack = document.getElementById('middle-panel-back');
const leftPanelBack = document.getElementById('left-panel-back');
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;

leftPanelOuter.addEventListener('mouseenter', () => middlePanel.classList.add('rotate-left'));
leftPanelOuter.addEventListener('mouseleave', () => middlePanel.classList.remove('rotate-left'));

rightPanelOuter.addEventListener('mouseenter', () => middlePanel.classList.add('rotate-right'));
rightPanelOuter.addEventListener('mouseleave', () => middlePanel.classList.remove('rotate-right'));

leftPanelOuter.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'a') {
        return;
    }
    counter1++;
    if (counter1 % 2 === 1) {
        leftPanel.classList.add('hide');
        leftPanelBack.classList.add('show');
    }
    else {
        leftPanel.classList.remove('hide');
        leftPanelBack.classList.remove('show');
    }
});

middlePanelOuter.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'a') {
        return;
    }

    counter2++;
    if (counter2 % 2 === 1) {
        middlePanel.classList.add('hide');
        middlePanelBack.classList.add('show');
    } else {
        middlePanel.classList.remove('hide');
        middlePanelBack.classList.remove('show');
    }
});

rightPanelOuter.addEventListener('click', () => {
    counter3++;
    if (counter3 % 2 === 1) {
        rightPanel.classList.add('hide');
        rightPanelBack.classList.add('show');
    }
    else {
        rightPanel.classList.remove('hide');
        rightPanelBack.classList.remove('show');
    }
});

leftPanelOuter.addEventListener('mouseenter', () => middlePanelBack.classList.add('rotate-left'));
leftPanelOuter.addEventListener('mouseleave', () => middlePanelBack.classList.remove('rotate-left'));

rightPanelOuter.addEventListener('mouseenter', () => middlePanelBack.classList.add('rotate-right'));
rightPanelOuter.addEventListener('mouseleave', () => middlePanelBack.classList.remove('rotate-right'));