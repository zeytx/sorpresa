const noBtn = document.getElementById('noBtn');

noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - noBtn.clientWidth);
    const y = Math.random() * (window.innerHeight - noBtn.clientHeight);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
});
