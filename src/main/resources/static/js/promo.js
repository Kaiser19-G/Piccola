// File: js/promo-modal.js

document.addEventListener('DOMContentLoaded', function() {
    const promoModalElement = document.getElementById('promoModal');
    if (!promoModalElement) return;

    // Lógica para mostrar el modal solo una vez por sesión
    if (!sessionStorage.getItem('promoModalShown')) {
        const promoModal = new bootstrap.Modal(promoModalElement);
        // Retrasamos un poco la aparición para que no sea tan brusco
        setTimeout(() => {
            promoModal.show();
        }, 1500); // 1.5 segundos
        
        sessionStorage.setItem('promoModalShown', 'true');
    }
    
    // Detener videos cuando se cierra el modal
    promoModalElement.addEventListener('hidden.bs.modal', function () {
        const iframes = promoModalElement.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const originalSrc = iframe.src;
            // Al reasignar el src, se detiene el video
            iframe.src = '';
            iframe.src = originalSrc;
        });
    });
});