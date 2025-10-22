// Hàm load và inject menu
function loadMenu() {
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            const menu = document.getElementById('character-menu');
            if (!menu) {
                console.error('Menu placeholder không tồn tại');
                return;
            }
            menu.innerHTML = data; // Inject nội dung menu.html
            console.log('Menu injected successfully');

            menu.classList.remove('-translate-x-full'); // Mở menu nếu ẩn

            highlightCurrentItem(); // Highlight item hiện tại
            addCloseButtonListener(); // Thêm listener cho close button
            addClickListeners(); // Thêm listener lưu scroll trước click link
            restoreScrollPosition(); // Khôi phục vị trí scroll (với retry nếu cần)
        })
        .catch(error => console.error('Lỗi load menu:', error));
}

// Highlight item dựa trên trang hiện tại
function highlightCurrentItem() {
    const currentPage = window.location.pathname.split('/').pop(); // "ToLam.html"
    const items = document.querySelectorAll('.character-item');
    items.forEach(item => {
        const link = item.parentElement.href.split('/').pop();
        if (link === currentPage) {
            item.classList.add('bg-white/20', 'border-2', 'border-blue-400');
            item.classList.remove('opacity-60');
            item.querySelector('p').classList.add('font-bold');
            console.log('Highlighted item:', item.id);
        } else {
            item.classList.remove('bg-white/20', 'border-2', 'border-blue-400');
            item.classList.add('opacity-60');
            item.querySelector('p').classList.remove('font-bold');
        }
    });
}

// Thêm listener cho close button (nếu tồn tại)
function addCloseButtonListener() {
    const closeMenuBtn = document.getElementById('close-menu-btn');
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            document.getElementById('character-menu').classList.add('-translate-x-full');
            console.log('Menu closed');
        });
    } else {
        console.warn('Close button không tồn tại');
    }

    // Tương tự cho detail-panel nếu cần
    const closePanelBtn = document.getElementById('close-panel-btn');
    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', () => {
            const detailPanel = document.getElementById('detail-panel');
            detailPanel.classList.add('hidden');
            detailPanel.classList.remove('flex');
        });
    }
}

// Thêm listener để lưu scroll trước click link
function addClickListeners() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) {
        console.error('Menu container không tồn tại');
        return;
    }
    const links = menuContainer.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            sessionStorage.setItem('menuScrollPosition', menuContainer.scrollTop);
            console.log('Lưu vị trí scroll:', menuContainer.scrollTop);
        });
    });
}

// Khôi phục vị trí scroll (với retry nếu container chưa ready)
function restoreScrollPosition() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) {
        console.error('Menu container không tồn tại');
        return;
    }

    const savedPosition = sessionStorage.getItem('menuScrollPosition');
    if (savedPosition !== null) {
        const restore = () => {
            if (menuContainer.clientHeight === 0) {
                setTimeout(restore, 200); // Retry sau 200ms nếu chưa render
                console.log('Retry restore scroll: Container chưa ready');
                return;
            }
            menuContainer.scrollTo({
                top: parseInt(savedPosition, 10),
                behavior: 'smooth'
            });
            console.log('Khôi phục vị trí scroll:', savedPosition);
        };
        setTimeout(restore, 500); // Delay ban đầu để chờ render
    } else {
        // Nếu không có saved, fallback scroll đến item hiện tại
        scrollToCurrentItem();
    }
}

// Scroll đến item hiện tại (fallback từ script cũ)
function scrollToCurrentItem() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const currentItemId = 'item-' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
    const selectedItem = document.getElementById(currentItemId);

    const menuContainer = document.getElementById('menu-container');
    if (selectedItem) {
        const scrollTo = () => {
            if (menuContainer.clientHeight === 0) {
                setTimeout(scrollTo, 200);
                console.log('Retry scroll to item: Container chưa ready');
                return;
            }
            const itemOffset = selectedItem.offsetTop;
            const itemHeight = selectedItem.clientHeight;
            const containerHeight = menuContainer.clientHeight;
            const scrollPosition = itemOffset - (containerHeight / 2) + (itemHeight / 2);

            menuContainer.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
            console.log('Scrolled to current item position:', scrollPosition);
        };
        setTimeout(scrollTo, 500);
    } else {
        console.error('Không tìm thấy item hiện tại:', currentItemId);
    }
}

// Load menu khi trang sẵn sàng
window.addEventListener('DOMContentLoaded', loadMenu);