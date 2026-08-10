# Task Phân mảnh Tài liệu

## Mục đích

* Chia một tài liệu lớn thành nhiều tài liệu nhỏ hơn dựa trên các section cấp 2
* Tạo cấu trúc thư mục để tổ chức các tài liệu đã được phân mảnh
* Duy trì toàn vẹn toàn bộ nội dung, bao gồm code block, sơ đồ và định dạng markdown

## Phương pháp chính: Tự động với markdown-tree

[[LLM: Trước tiên, kiểm tra xem `markdownExploder` có được đặt thành `true` trong `{root}/core-config.yaml` hay không. Nếu có, hãy thử chạy command: `md-tree explode {input file} {output path}`.

Nếu command thực thi thành công, thông báo cho người dùng rằng tài liệu đã được phân mảnh thành công và DỪNG - không tiếp tục thực hiện thêm.

Nếu command thất bại (đặc biệt khi có lỗi cho biết command không được tìm thấy hoặc không khả dụng), thông báo cho người dùng: "Thiết lập markdownExploder đã được bật nhưng command md-tree không khả dụng. Vui lòng thực hiện một trong các cách sau:

1. Cài đặt @kayvan/markdown-tree-parser trên toàn hệ thống bằng: `npm install -g @kayvan/markdown-tree-parser`
2. Hoặc đặt markdownExploder thành false trong {root}/core-config.yaml

**QUAN TRỌNG: DỪNG TẠI ĐÂY - không tiếp tục phân mảnh thủ công cho đến khi một trong các hành động trên được thực hiện.**"

Nếu `markdownExploder` được đặt thành `false`, thông báo cho người dùng: "Thiết lập markdownExploder hiện đang là false. Để có hiệu suất và độ tin cậy tốt hơn, bạn nên:

1. Đặt markdownExploder thành true trong `{root}/core-config.yaml`
2. Cài đặt @kayvan/markdown-tree-parser trên toàn hệ thống bằng: `npm install -g @kayvan/markdown-tree-parser`

Bây giờ tôi sẽ tiếp tục quá trình phân mảnh thủ công."

Sau đó chỉ tiếp tục với phương pháp thủ công bên dưới NẾU `markdownExploder` là false.]]

### Cài đặt và Sử dụng

1. **Cài đặt trên toàn hệ thống**:

   ```bash
   npm install -g @kayvan/markdown-tree-parser
   ```

2. **Sử dụng command explode**:

   ```bash
   # Đối với PRD
   md-tree explode docs/prd.md docs/prd

   # Đối với Architecture
   md-tree explode docs/architecture.md docs/architecture

   # Đối với bất kỳ tài liệu nào
   md-tree explode [source-document] [destination-folder]
   ```

3. **Nó thực hiện những gì**:

   * Tự động chia tài liệu theo các section cấp 2
   * Tạo các file có tên phù hợp
   * Điều chỉnh cấp độ heading một cách phù hợp
   * Xử lý tất cả các trường hợp đặc biệt với code block và markdown đặc biệt

Nếu người dùng đã cài đặt `@kayvan/markdown-tree-parser`, hãy sử dụng nó và bỏ qua quy trình thủ công bên dưới.

---

## Phương pháp thủ công (nếu @kayvan/markdown-tree-parser không khả dụng hoặc người dùng yêu cầu phương pháp thủ công)

### Hướng dẫn Task

1. Xác định Tài liệu và Vị trí đích

* Xác định tài liệu cần phân mảnh (đường dẫn do người dùng cung cấp)
* Tạo một thư mục mới bên dưới `docs/` với cùng tên với tài liệu (không có phần mở rộng)
* Ví dụ: `docs/prd.md` → tạo thư mục `docs/prd/`

2. Phân tích cú pháp và Trích xuất các Section

QUY TẮC PHÂN MẢNH QUAN TRỌNG:

1. Đọc toàn bộ nội dung tài liệu
2. Xác định tất cả các section cấp 2 (heading `##`)
3. Với mỗi section cấp 2:

   * Trích xuất heading của section và TOÀN BỘ nội dung cho đến section cấp 2 tiếp theo
   * Bao gồm tất cả subsection, code block, sơ đồ, danh sách, bảng, v.v.
   * Cực kỳ cẩn thận với:

     * Fenced code block (```) - đảm bảo bạn lấy toàn bộ block, bao gồm cả backtick đóng, và lưu ý các `##` gây hiểu nhầm nhưng thực tế là một phần của ví dụ nằm trong fenced section
     * Sơ đồ Mermaid - bảo toàn cú pháp sơ đồ hoàn chỉnh
     * Các thành phần markdown lồng nhau
     * Nội dung nhiều dòng có thể chứa `##` bên trong code block

QUAN TRỌNG: Sử dụng phương pháp phân tích cú pháp phù hợp để hiểu context của markdown. Một `##` nằm bên trong code block KHÔNG phải là section header.]]

### 3. Tạo các File Riêng lẻ

Đối với mỗi section đã được trích xuất:

1. **Tạo tên file**: Chuyển heading của section thành dạng lowercase-dash-case

   * Loại bỏ các ký tự đặc biệt
   * Thay khoảng trắng bằng dấu gạch ngang
   * Ví dụ: "## Tech Stack" → `tech-stack.md`

2. **Điều chỉnh cấp độ heading**:

   * Heading cấp 2 trở thành heading cấp 1 (`#` thay cho `##`) trong tài liệu mới đã được phân mảnh
   * Tất cả các cấp subsection giảm đi 1:

   ```txt
     - ### → ##
     - #### → ###
     - ##### → ####
     - etc.
   ```

3. **Ghi nội dung**: Lưu nội dung đã được điều chỉnh vào file mới

### 4. Tạo File Index

Tạo file `index.md` trong thư mục đã được phân mảnh, trong đó:

1. Chứa heading cấp 1 ban đầu và mọi nội dung nằm trước section cấp 2 đầu tiên
2. Liệt kê tất cả các file đã được phân mảnh kèm link:

```markdown
# Tiêu đề Tài liệu Gốc

[Nội dung giới thiệu ban đầu nếu có]

## Các Section

- [Tên Section 1](./section-name-1.md)
- [Tên Section 2](./section-name-2.md)
- [Tên Section 3](./section-name-3.md)
  ...
```

### 5. Bảo toàn Nội dung Đặc biệt

1. **Code block**: Phải lấy đầy đủ block, bao gồm:

   ```language
   content
   ```

2. **Sơ đồ Mermaid**: Bảo toàn cú pháp hoàn chỉnh:

   ```mermaid
   graph TD
   ...
   ```

3. **Bảng**: Duy trì định dạng bảng markdown chính xác

4. **Danh sách**: Bảo toàn indentation và cấu trúc lồng nhau

5. **Inline code**: Bảo toàn backtick

6. **Link và reference**: Giữ nguyên toàn bộ markdown link

7. **Template markup**: Nếu tài liệu chứa `{{placeholders}}`, bảo toàn chính xác

### 6. Xác thực

Sau khi phân mảnh:

1. Xác minh tất cả section đã được trích xuất
2. Kiểm tra không có nội dung nào bị mất
3. Đảm bảo cấp độ heading đã được điều chỉnh chính xác
4. Xác nhận tất cả file đã được tạo thành công

### 7. Báo cáo Kết quả

Cung cấp bản tóm tắt:

```text
Tài liệu đã được phân mảnh thành công:
- Nguồn: [đường dẫn tài liệu gốc]
- Đích: docs/[folder-name]/
- Các file đã tạo: [count]
- Các section:
  - section-name-1.md: "Tiêu đề Section 1"
  - section-name-2.md: "Tiêu đề Section 2"
  ...
```

## Ghi chú Quan trọng

* Không bao giờ sửa đổi nội dung thực tế, chỉ điều chỉnh cấp độ heading
* Bảo toàn TẤT CẢ định dạng, bao gồm whitespace khi whitespace có ý nghĩa
* Xử lý các trường hợp đặc biệt như section có code block chứa các ký hiệu `##`
* Đảm bảo quá trình phân mảnh có thể đảo ngược (có thể tái tạo tài liệu gốc từ các shard)
