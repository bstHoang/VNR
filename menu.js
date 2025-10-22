// Hàm inject menu
function loadMenu() {
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-placeholder').innerHTML = data;
            highlightCurrentItem(); // Highlight sau khi inject
            restoreScrollPosition(); // Khôi phục vị trí scroll
            addClickListeners(); // Thêm listener để lưu scroll trước khi chuyển trang
        })
        .catch(error => console.error('Lỗi load menu:', error));
}

// Highlight item dựa trên trang hiện tại (so sánh href với window.location.pathname)
function highlightCurrentItem() {
    const currentPage = window.location.pathname.split('/').pop(); // Lấy tên file hiện tại, ví dụ "TrinhDinhCuu.html"
    const items = document.querySelectorAll('.character-item');
    items.forEach(item => {
        const link = item.parentElement.href.split('/').pop();
        if (link === currentPage) {
            item.classList.add('bg-white/20', 'border-2', 'border-blue-400');
            item.classList.remove('opacity-60');
            item.querySelector('p').classList.add('font-bold');
        } else {
            item.classList.remove('bg-white/20', 'border-2', 'border-blue-400');
            item.classList.add('opacity-60');
            item.querySelector('p').classList.remove('font-bold');
        }
    });
}

// Lưu vị trí scroll trước khi chuyển trang
function addClickListeners() {
    const menuContainer = document.getElementById('menu-container');
    const links = menuContainer.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            sessionStorage.setItem('menuScrollPosition', menuContainer.scrollTop);
        });
    });
}

// Khôi phục vị trí scroll từ storage
function restoreScrollPosition() {
    const menuContainer = document.getElementById('menu-container');
    const savedPosition = sessionStorage.getItem('menuScrollPosition');
    if (savedPosition !== null) {
        menuContainer.scrollTop = parseInt(savedPosition, 10);
        // Xóa sau khi khôi phục để tránh giữ mãi (tùy ý)
        // sessionStorage.removeItem('menuScrollPosition');
    }
}

// Load menu khi trang sẵn sàng
window.addEventListener('DOMContentLoaded', loadMenu);