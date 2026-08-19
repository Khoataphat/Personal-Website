export const blogsData = [
  {
    id: "git-github-mastery-guide",
    title: "Hướng Dẫn Thực Chiến Git & GitHub Cho Kỹ Sư Phần Mềm",
    slug: "git-github-mastery-guide",
    date: "2024-11-15",
    readTime: "5 min read",
    category: "DevOps & Tooling",
    tags: ["Git", "GitHub", "Version Control", "Workflow"],
    excerpt: "Nắm vững quy trình quản lý phiên bản chuyên nghiệp, các lệnh cốt lõi và chiến lược phân nhánh an toàn khi làm việc nhóm.",
    content: `
### 1. Tổng quan về Hệ thống Quản lý Phiên bản
Git là công cụ quản trị mã nguồn phân tán (Distributed Version Control System) tiêu chuẩn cho mọi dự án hiện đại. Nắm vững Git giúp bạn tự tin tái cấu trúc code, thử nghiệm các tính năng mới mà không lo mất mát dữ liệu.

### 2. Các Lệnh Cốt Lõi Cần Thuần Thục:
- \`git init\`: Khởi tạo kho lưu trữ mới trong thư mục dự án.
- \`git clone [URL]\`: Sao chép kho mã nguồn từ máy chủ từ xa về máy cục bộ.
- \`git add .\`: Đưa toàn bộ các file đã chỉnh sửa vào Staging Area.
- \`git commit -m "feat: mô tả theo chuẩn Conventional Commits"\`: Ghi lại snapshot lịch sử thay đổi.
- \`git push origin [branch-name]\`: Đẩy commit lên remote repository.
- \`git pull --rebase origin [branch-name]\`: Cập nhật mã nguồn mới nhất từ đồng nghiệp và làm mịn cây commit.

### 3. Kinh Nghiệm Thực Tế Khi Cộng Tác:
1. **Chia nhánh tính năng rõ ràng (Feature Branching):** Tuyệt đối không commit trực tiếp lên nhánh \`main\` hay \`production\`.
2. **Commit nhỏ và có ý nghĩa:** Mỗi commit chỉ nên giải quyết trọn vẹn một vấn đề duy nhất.
3. **Sử dụng \`.gitignore\` chuẩn xác:** Tránh đẩy các file sinh tự động như \`node_modules/\`, \`.env\`, \`dist/\`, hay file build nhị phân lên GitHub.
    `
  },
  {
    id: "modern-web-foundations-html-css-js",
    title: "Bộ Ba Nền Tảng: Giải Mã HTML, CSS & JavaScript Trong Kỷ Nguyên Web Hiện Đại",
    slug: "modern-web-foundations-html-css-js",
    date: "2024-10-20",
    readTime: "6 min read",
    category: "Frontend Architecture",
    tags: ["HTML5", "CSS3", "JavaScript", "Architecture"],
    excerpt: "Hiểu sâu sắc vai trò của cấu trúc semantic, tầng styling hiện đại và động cơ JavaScript trong việc xây dựng sản phẩm số chất lượng cao.",
    content: `
### 1. Phân Tách Trách Nhiệm (Separation of Concerns)
Một trang web hoàn chỉnh là sự phối hợp nhịp nhàng giữa 3 lớp công nghệ:

- **HTML5 (Khung xương & Ngữ nghĩa):** Định nghĩa cấu trúc tài liệu rõ ràng (\`<header>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<footer>\`) giúp các công cụ tìm kiếm (SEO) và trình đọc màn hình hiểu đúng dữ liệu.
- **CSS3 (Diện mạo & Cảm xúc):** Tạo phong cách hình ảnh, hệ thống biến CSS Custom Properties, layout linh hoạt với Flexbox/Grid và hiệu ứng chuyển động mượt mà hỗ trợ phần cứng (GPU accelerated transforms).
- **JavaScript (Tư duy & Động lực):** Xử lý luồng dữ liệu, bắt các sự kiện người dùng (User Events), kết nối API và điều khiển vòng đời giao diện động.

### 2. Từ Vanilla Đến Framework Hiện Đại:
Nền tảng HTML/CSS/JS thuần vững chắc là bước đệm quan trọng nhất trước khi bước vào các hệ sinh thái như React, Next.js hay GSAP. Việc hiểu sâu DOM API và CSS Box Model giúp bạn dễ dàng gỡ lỗi giao diện phức tạp và tối ưu trải nghiệm người dùng tối đa.
    `
  },
  {
    id: "event-driven-architecture-js",
    title: "Lập Trình Hướng Sự Kiện (Event-Driven) và Cơ Chế Hoạt Động Của Event Loop",
    slug: "event-driven-architecture-js",
    date: "2024-09-08",
    readTime: "7 min read",
    category: "Computer Science",
    tags: ["JavaScript", "Event Loop", "Asynchronous", "Architecture"],
    excerpt: "Khám phá cách JavaScript xử lý hàng ngàn tác vụ bất đồng bộ hiệu quả với Call Stack, Task Queue và Microtask Queue.",
    content: `
### 1. Triết Lý Của Mô Hình Hướng Sự Kiện
Thay vì thực thi mã lệnh theo luồng tuần tự nghiêm ngặt khiến chương trình bị tắc nghẽn (blocking) khi chờ đợi I/O hoặc network, JavaScript sử dụng mô hình Event-Driven kết hợp non-blocking I/O.

### 2. Bộ Não Event Loop:
Event Loop liên tục theo dõi:
1. **Call Stack:** Nơi các hàm đang thực thi được xếp chồng và lấy ra theo cơ chế LIFO.
2. **Microtask Queue (Promises, queueMicrotask):** Có độ ưu tiên cao nhất, được thực thi ngay khi Call Stack trống trước khi render khung hình tiếp theo.
3. **Macrotask Queue (setTimeout, setInterval, I/O events):** Chờ lượt sau Microtask Queue.

### 3. Ứng Dụng Trong Hệ Thống Thời Gian Thực:
Tư duy hướng sự kiện không chỉ tồn tại trên trình duyệt mà còn là nền tảng cốt lõi của **Node.js** và các giao thức IoT như **MQTT**, nơi các thiết bị phát tín hiệu (Publish) và lắng nghe (Subscribe) các topic một cách độc lập và tức thì.
    `
  },
  {
    id: "clean-code-solid-principles-oop",
    title: "Nghệ Thuật Clean Code & 5 Nguyên Lý SOLID Trong Lập Trình Java OOP",
    slug: "clean-code-solid-principles-oop",
    date: "2024-08-14",
    readTime: "8 min read",
    category: "Backend & OOP",
    tags: ["Java", "OOP", "SOLID", "Clean Code", "Design Patterns"],
    excerpt: "Áp dụng các nguyên lý SOLID và tư duy thiết kế hướng đối tượng để xây dựng hệ thống phần mềm mở rộng dễ dàng, chống gãy vỡ.",
    content: `
### 1. Tầm Quan Trọng Của Thiết Kế Chuẩn
Viết code chạy được là bước đầu tiên, nhưng viết code để đồng đội và chính mình 6 tháng sau vẫn hiểu và bảo trì được mới là thước đo của một kỹ sư thực thụ.

### 2. 5 Trụ Cột SOLID:
- **S - Single Responsibility Principle (SRP):** Một lớp chỉ nên có một lý do duy nhất để thay đổi.
- **O - Open/Closed Principle (OCP):** Mở rộng cho tính năng mới, nhưng đóng cho việc sửa đổi mã nguồn đã chạy ổn định (thông qua Interface và Đa hình).
- **L - Liskov Substitution Principle (LSP):** Các lớp con phải có khả năng thay thế hoàn toàn cho lớp cha mà không làm sai lệch tính đúng đắn của chương trình.
- **I - Interface Segregation Principle (ISP):** Thà tạo nhiều interface nhỏ chuyên biệt còn hơn một interface khổng lồ bắt client phải implement những hàm không cần thiết.
- **D - Dependency Inversion Principle (DIP):** Các module cấp cao không nên phụ thuộc trực tiếp vào module cấp thấp; cả hai nên phụ thuộc vào abstractions (Interface/Abstract Class).

### 3. Áp Dụng Thực Chiến:
Kết hợp SOLID cùng các Design Pattern kinh điển như Factory, Strategy và Singleton giúp tách biệt rõ ràng giữa Business Logic và Data Access Layer (DAO/Repository), chuẩn bị sẵn sàng cho kiến trúc Spring Boot Microservices.
    `
  }
];
