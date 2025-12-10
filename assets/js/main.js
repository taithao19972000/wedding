document.addEventListener("DOMContentLoaded", function () {
    
    /* =======================================
     * 1. KHỞI TẠO THƯ VIỆN AOS (Hiệu ứng cuộn)
     * ======================================= */
    AOS.init({
        duration: 1000, // Thời gian chạy hiệu ứng (ms)
        once: true,     // Chỉ chạy 1 lần khi cuộn xuống
        offset: 100     // Bắt đầu chạy khi cách mép dưới 100px
    });

    /* =======================================
     * 2. XỬ LÝ ĐẾM NGƯỢC (COUNTDOWN)
     * ======================================= */
    // CẤU HÌNH NGÀY CƯỚI Ở ĐÂY: (Năm, Tháng - 1, Ngày, Giờ, Phút)
    // Lưu ý: Tháng trong JS bắt đầu từ 0 (Tháng 1 là 0, Tháng 11 là 10)
    const weddingDate = new Date(2025, 10, 20, 11, 0, 0).getTime();

    const countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        // Tính toán thời gian
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Hiển thị ra HTML
        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

        // Nếu đã qua ngày cưới
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "<h2 style='color:#d48888'>Đám cưới đã diễn ra viên mãn! ❤</h2>";
        }
    }, 1000);

    /* =======================================
     * 3. XỬ LÝ NHẠC NỀN (MUSIC PLAYER)
     * ======================================= */
    const musicBtn = document.getElementById("musicBtn");
    const bgMusic = document.getElementById("bgMusic");
    const musicIcon = musicBtn.querySelector("i");
    let isPlaying = false;

    // Mặc định trình duyệt chặn tự phát nhạc, cần user tương tác
    musicBtn.addEventListener("click", function () {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.add("paused"); // Dừng xoay
            musicIcon.classList.remove("fa-compact-disc");
            musicIcon.classList.add("fa-music");
        } else {
            bgMusic.play();
            musicBtn.classList.remove("paused"); // Bắt đầu xoay
            musicIcon.classList.remove("fa-music");
            musicIcon.classList.add("fa-compact-disc");
        }
        isPlaying = !isPlaying;
    });

    /* =======================================
     * 4. MENU MOBILE (HAMBURGER)
     * ======================================= */
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active"); // Hiệu ứng xoay icon (nếu muốn thêm CSS)
        navMenu.classList.toggle("active");   // Hiện/Ẩn menu
    });

    // Đóng menu khi click vào link
    document.querySelectorAll(".nav-menu li a").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    /* =======================================
     * 5. XỬ LÝ FORM RSVP
     * ======================================= */
    const rsvpForm = document.getElementById("rsvpForm");
    
    rsvpForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Ngăn load lại trang

        // Lấy dữ liệu (Demo)
        const name = document.getElementById("name").value;
        const status = document.getElementById("status").value;
        
        // Ở đây bạn có thể tích hợp Google Sheets hoặc EmailJS để lưu dữ liệu thật
        // Đây là code giả lập thành công:
        alert(`Cảm ơn ${name} đã xác nhận: ${status === 'yes' ? 'Tham dự' : 'Không thể tham dự'}. Chúng mình đã nhận được thông tin!`);
        
        rsvpForm.reset(); // Xóa trắng form
    });
});
