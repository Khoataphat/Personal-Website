document.addEventListener('DOMContentLoaded', function() {
    const cvButton = document.querySelector('.btn-downloadcv'); 

    if (cvButton) {
        cvButton.addEventListener('click', function() {
            // Thay đổi tạm thời để kiểm tra, ví dụ chuyển hướng đến Google
            window.location.href = 'https://www.google.com'; 
            // Nếu trang chuyển hướng đến Google, mã JS đã hoạt động.
            // Vấn đề là file 'cv_page.html' của bạn.
        });
    }
});