export interface PaginationRequest {
    page: number; // หน้าที่ต้องการ (เริ่มจาก 1)
    pageSize: number; // จำนวนรายการต่อหน้า
    sortBy?: string; // ชื่อฟิลด์ที่ต้องการเรียงลำดับ (Optional)
    sortOrder?: "asc" | "desc"; // ทิศทางการเรียงลำดับ (Optional)
    filters?: Record<string, any>; // เงื่อนไขการค้นหา (Optional)
  }
  

  export interface PaginationResponse<T> {
    data: T[]; // ข้อมูลในหน้าปัจจุบัน
    currentPage: number; // หน้าปัจจุบัน
    pageSize: number; // จำนวนรายการต่อหน้า
    totalItems: number; // จำนวนรายการทั้งหมด
    totalPages: number; // จำนวนหน้าทั้งหมด
  }
  