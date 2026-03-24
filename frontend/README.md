# Frontend - Task Management UI

Giao diện người dùng cho hệ thống quản lý Task, được phát triển bằng Angular.

## 1. Cấu trúc file hiện tại của folder

```text
frontend/
├── .angular/            # Angular build cache
├── public/              # Các tài nguyên tĩnh (images, icons, robots.txt...)
├── src/
│   ├── app/
│   │   ├── core/        # Các services core, interceptors, guards (Singleton)
│   │   ├── pages/       # Các components trang chính (task-list, user-list...)
│   │   ├── shared/      # Các components, pipes, directives dùng chung (Navbar...)
│   │   ├── app.config.ts # Cấu hình Angular Providers (Routing, SSR, Animation...)
│   │   ├── app.routes.ts # Cấu hình định tuyến (Routing) của ứng dụng
│   │   ├── app.ts        # Component gốc của ứng dụng
│   │   ├── app.html      # Template HTML gốc
│   │   └── app.css       # Style CSS toàn cục mức ứng dụng
│   ├── assets/          # (Nếu có) Chứa các file tĩnh dùng trong code
│   ├── index.html       # File HTML chính
│   └── main.ts          # Điểm khởi đầu (Entry point) của ứng dụng
├── angular.json         # Cấu hình Angular CLI (build, test, serve...)
├── package.json         # Quản lý libraries và scripts (npm)
├── tsconfig.json        # Cấu hình TypeScript
├── vercel.json          # Cấu hình deploy lên nền tảng Vercel
└── README.md
```

## 2. Cách chạy dự án

### Yêu cầu hệ thống
* **Node.js**: Phiên bản 20.x hoặc mới hơn.
* **npm**: Phiên bản 10.x hoặc mới hơn.
* **Angular CLI**: Đã cài đặt global hoặc dùng qua `npx`.

### Các bước thực hiện
1.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```
2.  **Chạy môi trường phát triển**:
    ```bash
    npm start
    ```
    Hoặc:
    ```bash
    ng serve
    ```
3.  **Truy cập ứng dụng**: Mở trình duyệt và truy cập `http://localhost:4200/`. Ứng dụng sẽ tự động tải lại khi bạn thay đổi code.

4.  **Build sản phẩm**:
    ```bash
    npm run build
    ```
    Dữ liệu sẽ được lưu trong thư mục `dist/`.

## 3. Tổng quan về app

Ứng dụng cung cấp trải nghiệm hiện đại và mượt mà để người dùng quản lý công việc hàng ngày.

*   **Công nghệ sử dụng**:
    *   **Frontend Framework**: Angular 21 (Latest).
    *   **Styling**: Tailwind CSS (PostCSS) cho giao diện nhanh và linh hoạt.
    *   **State Management**: RxJS cho xử lý dữ liệu bất đồng bộ.
    *   **Deployment**: Hỗ trợ SSR (Server-Side Rendering) và tối ưu hóa cho Vercel.
*   **Tính năng chính**:
    *   **Danh sách công việc**: Hiển thị tất cả task, lọc theo trạng thái.
    *   **Chi tiết công việc**: Xem thông tin chi tiết và chỉnh sửa task.
    *   **Danh sách người dùng**: Quản lý thông tin người dùng trong hệ thống.
    *   **Giao diện đáp ứng**: Hoạt động tốt trên cả máy tính và thiết bị di động.
