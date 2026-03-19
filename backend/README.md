# Backend - Task Management API

Dự án này là hệ thống quản lý Task (Công việc) và User (Người dùng) được xây dựng bằng Spring Boot.

## 1. Cấu trúc file hiện tại của folder

```text
backend/
├── .mvn/                # Maven wrapper configuration
├── src/
│   ├── main/
│   │   ├── java/com/example/backend/
│   │   │   ├── BackendApplication.java  # File chạy chính của ứng dụng
│   │   │   ├── common/                  # Các lớp tiện ích và hằng số chung
│   │   │   ├── config/                  # Cấu hình hệ thống (CORS, Security...)
│   │   │   ├── controller/              # Nhận và xử lý HTTP requests (API Endpoints)
│   │   │   ├── dto/                     # Data Transfer Objects (Request/Response)
│   │   │   ├── entity/                  # Định nghĩa các bảng database (User, Task)
│   │   │   ├── exception/               # Xử lý lỗi tập trung (Global Exception Handler)
│   │   │   ├── mapper/                  # Chuyển đổi giữa Entity và DTO
│   │   │   ├── repository/              # Giao tiếp với Database qua Spring Data JPA
│   │   │   ├── scheduler/               # Các tác vụ chạy ngầm định kỳ
│   │   │   ├── service/                 # Chứa Business Logic của ứng dụng
│   │   │   └── specification/           # Hỗ trợ truy vấn dữ liệu động phức tạp
│   │   └── resources/
│   │       └── application.properties    # Cấu hình chính của Spring Boot
│   └── test/                             # Unit tests và Integration tests
├── .env                                  # File cấu hình biến môi trường
├── mvnw                                  # Script chạy Maven trên Linux/macOS
├── mvnw.cmd                              # Script chạy Maven trên Windows
├── pom.xml                               # File quản lý dependencies (Maven)
├── start.bat                             # Script chạy nhanh ứng dụng trên Windows
└── README.md
```

## 2. Cách chạy dự án

### Yêu cầu hệ thống
*   **Java SDK 21** trở lên.
*   **PostgreSQL** đang chạy.
*   **Maven** (đã tích hợp sẵn qua `mvnw`).

### Các bước thực hiện
1.  **Cài đặt dependencies**:
    ```bash
    ./mvnw clean install
    ```
2.  **Chạy ứng dụng**:
    *   Sử dụng lệnh Maven:
        ```bash
        ./mvnw spring-boot:run
        ```
    *   Hoặc chạy file script trên Windows:
        ```cmd
        start.bat
        ```
3.  **Truy cập API**: Mặc định chạy tại `http://localhost:8080/api/v1` (tùy cấu hình port).

## 3. Tổng quan về app

Hệ thống cung cấp các API RESTful để quản lý vòng đời của các công việc và thông tin người dùng.

*   **Công nghệ sử dụng**:
    *   **Backend Framework**: Spring Boot 4.0.3 (với Java 21).
    *   **Database**: PostgreSQL.
    *   **ORM**: Spring Data JPA (Hibernate).
    *   **Tiện ích**: Lombok (giảm boilerplate code), Dotenv (quản lý biến môi trường).
*   **Tính năng chính**:
    *   Quản lý danh sách người dùng.
    *   Quản lý danh sách công việc (Task).
    *   Chi tiết công việc và trạng thái.
    *   Hỗ trợ tìm kiếm và lọc dữ liệu nâng cao qua `Specification`.
