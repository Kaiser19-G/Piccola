// File: src/main/resources/static/js/menu-filter.js
// VERSIÓN 100% FRONTEND

document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return; // Salir si no estamos en la página del menú

    const productItems = productGrid.querySelectorAll('.product-item');
    const filtersContainer = document.getElementById('menu-filters');

    // === INICIO DE LA LÓGICA DE DEDUCCIÓN DE CATEGORÍAS ===
    const categoriesMap = {
        'Acompañamientos': ['papas', 'aros'],
        'Bebidas': ['gaseosa', 'limonada', 'agua', 'cerveza'],
        'Especiales': ['doble', 'veggie', 'bacon', 'deluxe'],
        // 'Clásicas' será la categoría por defecto para las hamburguesas que no sean especiales.
    };

    function getCategoryByName(name) {
        name = name.toLowerCase();
        for (const category in categoriesMap) {
            for (const keyword of categoriesMap[category]) {
                if (name.includes(keyword)) {
                    return category;
                }
            }
        }
        // Si contiene la palabra 'hamburguesa' o no coincide con nada, es una clásica
        if(name.includes('hamburguesa') || name.includes('burger') || name.includes('piccola') || name.includes('pollo')) {
             return 'Clásicas';
        }
        return 'Otros'; // Categoría por defecto si no coincide con nada
    }
    // === FIN DE LA LÓGICA DE DEDUCCIÓN ===

    // 1. Asignar 'data-category' y obtener categorías únicas
    const categories = new Set();
    productItems.forEach(item => {
        const productName = item.querySelector('.product-name').textContent;
        const category = getCategoryByName(productName);
        item.dataset.category = category; // Asignamos el atributo dinámicamente
        categories.add(category);
    });

    // 2. Crear los botones de filtro dinámicamente
    // Define el orden deseado de las categorías
    const orderedCategories = ['Clásicas', 'Especiales', 'Acompañamientos', 'Bebidas', 'Otros'].filter(c => categories.has(c));
    
    // Botón "Todos"
    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.textContent = 'Todos';
    allButton.dataset.filter = 'all';
    filtersContainer.appendChild(allButton);
    
    // Botones para cada categoría, en orden
    orderedCategories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = category;
        button.dataset.filter = category;
        filtersContainer.appendChild(button);
    });

    // 3. Añadir el Event Listener a los botones y la lógica de filtrado (idéntico a antes)
    const filterButtons = filtersContainer.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filtersContainer.querySelector('.active').classList.remove('active');
            this.classList.add('active');
            const filter = this.dataset.filter;
            
            productItems.forEach(item => {
                item.classList.add('hide'); // Inicia la animación de ocultar
                setTimeout(() => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => item.classList.remove('hide'), 10);
                    } else {
                        item.style.display = 'none';
                    }
                }, 400);
            });
        });
    });
});