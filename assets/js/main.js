document.addEventListener("DOMContentLoaded", function () {
    
    // 1. KHỞI TẠO AOS
    AOS.init({ duration: 1000, once: true });

    // 2. LOAD DATA
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            loadWeddingData(data);
            startCountdown(data.weddingDate);
            setupGoogleForm(data.googleForm);
        })
        .catch(error => console.error('Lỗi: Cần chạy trên Server để đọc JSON', error));

    function loadWeddingData(data) {
        document.getElementById('heroGroom').innerText = data.couple.groom.name;
        document.getElementById('heroBride').innerText = data.couple.bride.name;
        const d = new Date(data.weddingDate);
        document.getElementById('heroDate').innerText = `${d.getDate()} Tháng ${d.getMonth() + 1} Năm ${d.getFullYear()}`;

        document.getElementById('groomName').innerText = data.couple.groom.name;
        document.getElementById('groomImg').src = data.couple.groom.image;
        document.getElementById('groomJob').innerHTML = `<i class="fa-solid ${data.couple.groom.jobIcon}"></i> ${data.couple.groom.job}`;
        document.getElementById('groomDesc').innerText = data.couple.groom.desc;

        document.getElementById('brideName').innerText = data.couple.bride.name;
        document.getElementById('brideImg').src = data.couple.bride.image;
        document.getElementById('brideJob').innerHTML = `<i class="fa-solid ${data.couple.bride.jobIcon}"></i> ${data.couple.bride.job}`;
        document.getElementById('brideDesc').innerText = data.couple.bride.desc;

        document.getElementById('groomFather').innerText = data.family.groom.father;
        document.getElementById('groomMother').innerText = data.family.groom.mother;
        document.getElementById('groomAddress').innerText = data.family.groom.address;

        document.getElementById('brideFather').innerText = data.family.bride.father;
        document.getElementById('brideMother').innerText = data.family.bride.mother;
        document.getElementById('brideAddress').innerText = data.family.bride.address;

        // Timeline (Chỉ hiển thị text)
        const timelineContainer = document.getElementById('storyTimeline');
        let storyHTML = '';
        data.story.forEach((item) => {
            const aosEffect = item.side === 'left' ? 'fade-right' : 'fade-left';
            storyHTML += `
                <div class="timeline-item ${item.side}" data-aos="${aosEffect}">
                    <div class="timeline-img"></div>
                    <div class="timeline-content">
                        <div class="story-text">
                            <h3>${item.title}</h3>
                            <span class="date">${item.date}</span>
                            <p>${item.content}</p>
                        </div>
                    </div>
                </div>`;
        });
        timelineContainer.innerHTML = storyHTML;

        // Events
        document.getElementById('eventGroomTitle').innerText = data.events.groom.title;
        document.getElementById('eventGroomImg').src = data.events.groom.image; 
        document.getElementById('eventGroomTime').innerText = data.events.groom.time;
        document.getElementById('eventGroomPlace').innerText = data.events.groom.place;
        document.getElementById('eventGroomAddress').innerText = data.events.groom.address;
        document.getElementById('eventGroomMap').href = data.events.groom.mapLink;

        document.getElementById('eventBrideTitle').innerText = data.events.bride.title;
        document.getElementById('eventBrideImg').src = data.events.bride.image;
        document.getElementById('eventBrideTime').innerText = data.events.bride.time;
        document.getElementById('eventBridePlace').innerText = data.events.bride.place;
        document.getElementById('eventBrideAddress').innerText = data.events.bride.address;
        document.getElementById('eventBrideMap').href = data.events.bride.mapLink;

        // Gallery
        const galleryContainer = document.getElementById('galleryContainer');
        const viewMoreBtn = document.getElementById('viewMoreBtn');
        if (galleryContainer && data.gallery) {
            const totalImages = data.gallery.count;
            const initialCount = data.gallery.initialCount || 6;
            const enableViewMore = data.gallery.enableViewMore !== false; // Mặc định là true
            const imagesPerPage = 6; 
            let currentImageCount = 0;

            // Ẩn nút "Xem thêm hình" nếu enableViewMore = false
            if (!enableViewMore && viewMoreBtn) {
                viewMoreBtn.style.display = 'none';
            }

            // Tối ưu bố cục dựa trên số lượng ảnh
            function optimizeLayout() {
                let columnCount = 3; // Mặc định
                if (totalImages <= 3) {
                    columnCount = 1;
                } else if (totalImages <= 6) {
                    columnCount = 2;
                } else if (totalImages <= 12) {
                    columnCount = 3;
                } else if (totalImages <= 20) {
                    columnCount = 4;
                } else {
                    columnCount = 5;
                }
                
                // Áp dụng responsive
                const width = window.innerWidth;
                if (width <= 768) {
                    columnCount = 1;
                } else if (width <= 1024) {
                    columnCount = Math.min(columnCount, 2);
                }
                
                galleryContainer.style.columnCount = columnCount;
            }

            function loadImages(count) {
                let htmlToAdd = '';
                const start = currentImageCount + 1;
                const end = Math.min(currentImageCount + count, totalImages);
                for (let i = start; i <= end; i++) {
                    const aosAnimation = ['fade-up', 'zoom-in', 'flip-left'][Math.floor(Math.random() * 3)];
                    htmlToAdd += `
                        <div class="gallery-item" data-aos="${aosAnimation}">
                            <img src="${data.gallery.folder}${i}${data.gallery.extension}" alt="Photo ${i}" loading="lazy">
                        </div>`;
                }
                galleryContainer.insertAdjacentHTML('beforeend', htmlToAdd);
                currentImageCount = end;
                
                // Chỉ hiển thị/ẩn nút nếu enableViewMore = true
                if (enableViewMore) {
                    if (currentImageCount >= totalImages) { 
                        if(viewMoreBtn) viewMoreBtn.style.display = 'none'; 
                    } else { 
                        if(viewMoreBtn) viewMoreBtn.style.display = 'inline-block'; 
                    }
                }
                setTimeout(() => { AOS.refresh(); }, 500); 
            }
            
            // Tối ưu layout ban đầu và khi resize
            optimizeLayout();
            window.addEventListener('resize', optimizeLayout);
            
            // Load ảnh ban đầu
            if (enableViewMore) {
                // Nếu bật "Xem thêm", chỉ load số lượng ban đầu
                loadImages(initialCount);
            } else {
                // Nếu tắt "Xem thêm", load tất cả ảnh ngay từ đầu
                loadImages(totalImages);
            }
            
            // Thêm event listener cho nút "Xem thêm" nếu được bật
            if(enableViewMore && viewMoreBtn) { 
                viewMoreBtn.addEventListener('click', () => loadImages(imagesPerPage)); 
            }
        }

        // Bank / Footer
        document.getElementById('bankGroomQr').src = data.couple.groom.bank.qr;
        document.getElementById('bankGroomName').innerText = data.couple.groom.bank.bankName;
        document.getElementById('bankGroomNum').innerText = data.couple.groom.bank.number;
        document.getElementById('bankGroomAcc').innerText = data.couple.groom.bank.accountName;
        document.getElementById('bankBrideQr').src = data.couple.bride.bank.qr;
        document.getElementById('bankBrideName').innerText = data.couple.bride.bank.bankName;
        document.getElementById('bankBrideNum').innerText = data.couple.bride.bank.number;
        document.getElementById('bankBrideAcc').innerText = data.couple.bride.bank.accountName;
        document.getElementById('footerGroom').innerText = data.couple.groom.name;
        document.getElementById('footerBride').innerText = data.couple.bride.name;
        document.getElementById('footerDate').innerText = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    }

    // 3. COUNTDOWN
    function startCountdown(dateString) {
        const weddingDate = new Date(dateString).getTime();
        const countdownInterval = setInterval(function () {
            const now = new Date().getTime();
            const distance = weddingDate - now;
            if (distance < 0) {
                clearInterval(countdownInterval);
                if(document.getElementById("countdown")) document.getElementById("countdown").innerHTML = "<h2>Đám cưới viên mãn! ❤</h2>";
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if(document.getElementById("days")) {
                document.getElementById("days").innerText = days < 10 ? "0" + days : days;
                document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
                document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
                document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
            }
        }, 1000);
    }

    // 4. MUSIC AUTOPLAY
    const musicBtn = document.getElementById("musicBtn");
    const bgMusic = document.getElementById("bgMusic");
    let isPlaying = false;
    if(musicBtn && bgMusic) {
        function playAudio() {
            if (isPlaying) return;
            bgMusic.play().then(() => { isPlaying = true; musicBtn.classList.remove("paused"); }).catch(() => {});
        }
        playAudio();
        document.addEventListener('click', playAudio, { once: true });
        document.addEventListener('touchstart', playAudio, { once: true });
        document.addEventListener('scroll', playAudio, { once: true });
        musicBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (isPlaying) { bgMusic.pause(); musicBtn.classList.add("paused"); isPlaying = false; } 
            else { bgMusic.play(); musicBtn.classList.remove("paused"); isPlaying = true; }
        });
    }

    // 5. OTHER
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    if(hamburger) {
        hamburger.addEventListener("click", () => { hamburger.classList.toggle("active"); navMenu.classList.toggle("active"); });
        document.querySelectorAll(".nav-menu li a").forEach(n => n.addEventListener("click", () => { hamburger.classList.remove("active"); navMenu.classList.remove("active"); }));
    }

    const heartsContainer = document.querySelector('.falling-hearts-container');
    function createHeart() {
        if(!heartsContainer) return;
        const heart = document.createElement('i');
        heart.classList.add('fa-solid', 'fa-heart', 'heart-fall');
        heart.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 15 + 10; 
        heart.style.fontSize = size + 'px';
        const duration = Math.random() * 5 + 3;
        heart.style.animationDuration = duration + 's';
        if (Math.random() > 0.5) { heart.style.color = '#ffccd5'; }
        heartsContainer.appendChild(heart);
        setTimeout(() => { heart.remove(); }, duration * 1000);
    }
    setInterval(createHeart, 400);

    // 6. DONATE TẾ NHỊ
    const btnShowQr = document.getElementById('btnShowQr');
    const donateContent = document.getElementById('donateContent');
    const qrContainer = document.getElementById('qrContainer');
    if (btnShowQr && donateContent && qrContainer) {
        btnShowQr.addEventListener('click', function() {
            donateContent.style.display = 'none';
            qrContainer.classList.remove('hidden');
            if (typeof AOS !== 'undefined') AOS.refresh();
        });
    }

    // 7. SETUP GOOGLE FORM
    function setupGoogleForm(googleFormConfig) {
        if (!googleFormConfig || !googleFormConfig.url) {
            console.warn('Google Form chưa được cấu hình trong data.json');
            return;
        }

        // Kiểm tra entries đã được cấu hình
        const entries = googleFormConfig.entries;
        if (!entries || Object.keys(entries).length === 0) {
            console.error('❌ Chưa có entries trong data.json');
            console.log('📝 Hướng dẫn lấy entry IDs:');
            console.log('   1. Mở Google Form trong trình duyệt');
            console.log('   2. Nhấn F12 > Network tab');
            console.log('   3. Submit form thử nghiệm');
            console.log('   4. Tìm request "formResponse" > Payload/Form Data');
            console.log('   5. Copy các entry IDs và paste vào data.json');
            console.log('   6. Hoặc chạy: createEntryConfig("entry.XXX", "entry.XXX", "entry.XXX", "entry.XXX")');
            return;
        }

        console.log('✅ Sử dụng entries đã cấu hình:', entries);

        const rsvpForm = document.getElementById("rsvpForm");
        if(rsvpForm) {
            rsvpForm.addEventListener("submit", function(e) {
                e.preventDefault();
                const submitBtn = document.getElementById('submitBtn');
                const originalBtnText = submitBtn.innerText;
                submitBtn.innerText = 'Đang gửi...';
                submitBtn.disabled = true;

                const formData = new FormData();
                formData.append(entries.name, document.getElementById('name').value);
                formData.append(entries.phone, document.getElementById('phone').value);
                formData.append(entries.status, document.getElementById('status').value);
                formData.append(entries.message, document.getElementById('message').value);

                fetch(googleFormConfig.url, { method: 'POST', mode: 'no-cors', body: formData })
                .then(() => { alert("Cảm ơn bạn đã gửi lời chúc!"); rsvpForm.reset(); })
                .catch(err => { alert("Có lỗi xảy ra!"); console.error(err); })
                .finally(() => { submitBtn.innerText = originalBtnText; submitBtn.disabled = false; });
            });
        }
    }

    // Helper: Tạo entry config từ các entry IDs (cho người dùng nhập thủ công)
    window.createEntryConfig = function(nameEntry, phoneEntry, statusEntry, messageEntry) {
        const config = {
            entries: {
                name: nameEntry || 'entry.XXXXX',
                phone: phoneEntry || 'entry.XXXXX',
                status: statusEntry || 'entry.XXXXX',
                message: messageEntry || 'entry.XXXXX'
            }
        };
        console.log('📋 Copy config này vào data.json:');
        console.log(JSON.stringify(config, null, 2));
        return config;
    };
});
