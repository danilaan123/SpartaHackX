document.addEventListener('DOMContentLoaded', function() {
    const aboutRadio = document.getElementById('about');
    const aboutLabel = document.querySelector('label.about');
    
    aboutLabel.addEventListener('click', function(e) {
        e.preventDefault();
        aboutRadio.checked = true;
        // Give the animation time to play before navigating
        setTimeout(() => {
            window.location.href = "builder-interface-ts.html";
        }, 600); // 600ms matches your CSS transition time
    });
});