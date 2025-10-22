// Chạy code khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Tải menu vào trang
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            // Đưa menu HTML vào placeholder
            document.getElementById('menu-container').innerHTML = data;
            
            // Sau khi menu đã được tải, thực hiện 2 việc còn lại
            highlightActiveMenuItem();
            restoreScrollPosition();
            setupScrollListener();
        })
        .catch(error => console.error('Lỗi tải menu:', error));

});

// 2. Hàm xử lý highlight mục đang active
function highlightActiveMenuItem() {
    // Lấy tên file của trang hiện tại (ví dụ: "ToLam.html")
    const currentPage = window.location.pathname.split('/').pop();

    if (!currentPage) return;

    // Tìm thẻ <a> có href khớp với trang hiện tại
    const menuContainer = document.getElementById('menu-container');
    const activeLink = menuContainer.querySelector(`a[href="${currentPage}"]`);

    if (activeLink) {
        // Tìm div và p bên trong
        const activeDiv = activeLink.querySelector('.character-item');
        const activeText = activeLink.querySelector('p');

        if (activeDiv) {
            // Xóa class 'inactive'
            activeDiv.classList.remove('opacity-60', 'hover:opacity-100');
            
            // Thêm class 'active'
            activeDiv.classList.add('bg-white/20', 'border-2', 'border-blue-400');
        }
        
        if (activeText) {
            // Thêm class 'active' cho text
            activeText.classList.add('font-bold');
        }
    }
}

// 3. Hàm xử lý vị trí cuộn
const SCROLL_KEY = 'menuScrollPosition';

// Hàm lưu vị trí cuộn
function setupScrollListener() {
    const scrollArea = document.getElementById('menu-scroll-area');
    if (scrollArea) {
        scrollArea.addEventListener('scroll', function() {
            // Dùng sessionStorage để lưu vị trí (chỉ tồn tại trong tab này)
            sessionStorage.setItem(SCROLL_KEY, scrollArea.scrollTop);
        });
    }
}

// Hàm khôi phục vị trí cuộn
function restoreScrollPosition() {
    const scrollArea = document.getElementById('menu-scroll-area');
    const savedScroll = sessionStorage.getItem(SCROLL_KEY);
    
    if (scrollArea && savedScroll) {
        scrollArea.scrollTop = parseInt(savedScroll, 10);
    }
}