document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('puzzle-container');
    const winMessage = document.getElementById('win-message');
    
    // Trạng thái 'đã giải' (0-7 là các ô, 8 là ô trống)
    const solvedState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    // Trạng thái hiện tại của trò chơi, ban đầu là đã giải
    let currentState = [...solvedState];
    let emptyIndex = 8; // Ô trống ban đầu ở vị trí cuối cùng

    /**
     * Hàm vẽ lại các ô cờ lên màn hình dựa vào 'currentState'
     */
    function render() {
        container.innerHTML = ''; // Xóa bảng
        winMessage.style.display = 'none'; // Ẩn thông báo thắng

        currentState.forEach((tileValue, index) => {
            const tile = document.createElement('div');
            
            if (tileValue === 8) {
                // Đây là ô trống
                tile.classList.add('empty-tile');
            } else {
                // Đây là ô có ảnh
                tile.classList.add('puzzle-tile');
                // tileValue là 0-7, nhưng class của ta là tile-1 đến tile-8
                tile.classList.add(`tile-${tileValue + 1}`); 
                
                // Thêm sự kiện click
                tile.addEventListener('click', () => onTileClick(index));
            }
            container.appendChild(tile);
        });

        checkWin(); // Kiểm tra thắng sau mỗi lần vẽ lại
    }

    /**
     * Hàm được gọi khi người dùng nhấp vào một ô
     * @param {number} clickedIndex - Vị trí ô vừa được nhấp (0-8)
     */
    function onTileClick(clickedIndex) {
        // Kiểm tra xem ô được nhấp có "kề" với ô trống không
        if (isAdjacent(clickedIndex, emptyIndex)) {
            // Nếu kề, hoán đổi vị trí của chúng
            swapTiles(clickedIndex, emptyIndex);
            // Cập nhật vị trí mới của ô trống
            emptyIndex = clickedIndex;
            // Vẽ lại bảng
            render();
        }
    }

    /**
     * Hoán đổi 2 ô trong mảng trạng thái
     */
    function swapTiles(index1, index2) {
        [currentState[index1], currentState[index2]] = [currentState[index2], currentState[index1]];
    }

    /**
     * Kiểm tra xem 2 ô có kề nhau không (không tính đường chéo)
     * @param {number} index1 
     * @param {number} index2 
     */
    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 3);
        const col1 = index1 % 3;
        const row2 = Math.floor(index2 / 3);
        const col2 = index2 % 3;

        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);

        // Kề nhau khi: chung 1 hàng và cách 1 cột, 
        // HOẶC chung 1 cột và cách 1 hàng
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    /**
     * Kiểm tra điều kiện chiến thắng
     */
    function checkWin() {
        for (let i = 0; i < solvedState.length; i++) {
            if (currentState[i] !== solvedState[i]) {
                return; // Chưa thắng
            }
        }
        // Nếu vòng lặp kết thúc mà không 'return', nghĩa là đã thắng
        winMessage.style.display = 'block';
    }

    /**
     * Xáo trộn các ô
     * Chúng ta thực hiện 100 di chuyển ngẫu nhiên hợp lệ từ trạng thái đã giải
     * để đảm bảo rằng câu đố luôn có thể giải được.
     */
    function shuffle() {
        for (let i = 0; i < 100; i++) {
            const neighbors = getValidNeighbors(emptyIndex);
            const randomNeighborIndex = Math.floor(Math.random() * neighbors.length);
            const moveIndex = neighbors[randomNeighborIndex];
            
            swapTiles(emptyIndex, moveIndex);
            emptyIndex = moveIndex; // Cập nhật vị trí ô trống
        }
    }

    /**
     * Tìm các ô "hàng xóm" hợp lệ của ô trống để di chuyển
     */
    function getValidNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / 3);
        const col = index % 3;

        if (row > 0) neighbors.push(index - 3); // Ô trên
        if (row < 2) neighbors.push(index + 3); // Ô dưới
        if (col > 0) neighbors.push(index - 1); // Ô trái
        if (col < 2) neighbors.push(index + 1); // Ô phải
        
        return neighbors;
    }

    // --- Khởi chạy trò chơi ---
    shuffle(); // Xáo trộn
    render();  // Và vẽ ra màn hình lần đầu
});